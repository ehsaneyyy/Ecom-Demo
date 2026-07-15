import json
import logging

import stripe
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.auth_utils import get_current_user
from app.config import settings
from app.database import get_session
from app.models import Order, Product, User
from app.schemas import OrderResponse

router = APIRouter(prefix="/api/payments", tags=["payments"])
logger = logging.getLogger(__name__)

if settings.stripe_secret_key:
    stripe.api_key = settings.stripe_secret_key


class CheckoutSessionRequest(BaseModel):
    shipping_address: str
    items: list[dict]


@router.post("/checkout", response_model=dict)
async def create_checkout_session(
    body: CheckoutSessionRequest,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if not settings.stripe_secret_key:
        raise HTTPException(status_code=503, detail="Stripe not configured")

    if not body.items:
        raise HTTPException(status_code=400, detail="No items provided")

    line_items = []
    product_details = []
    for item in body.items:
        result = await session.execute(select(Product).where(Product.id == item["product_id"]))
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item['product_id']} not found")
        if product.stock < item["quantity"]:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")

        line_items.append({
            "price_data": {
                "currency": "usd",
                "product_data": {
                    "name": product.name,
                    "description": product.description[:200] if product.description else "",
                },
                "unit_amount": int(product.price * 100),
            },
            "quantity": item["quantity"],
        })
        product_details.append({
            "product_id": product.id,
            "name": product.name,
            "price": product.price,
            "quantity": item["quantity"],
        })

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="payment",
            customer_email=current_user.email,
            line_items=line_items,
            metadata={
                "user_id": current_user.id,
                "shipping_address": body.shipping_address,
                "products": json.dumps(product_details),
            },
            success_url=f"{settings.frontend_url}/order-success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.frontend_url}/checkout?cancelled=true",
        )
        return {"sessionId": checkout_session.id, "url": checkout_session.url}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    session: AsyncSession = Depends(get_session),
):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    if not settings.stripe_webhook_secret:
        logger.warning("Stripe webhook secret not configured")
        raise HTTPException(status_code=503, detail="Webhook not configured")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.stripe_webhook_secret
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event["type"] == "checkout.session.completed":
        session_data = event["data"]["object"]
        await handle_checkout_complete(session_data, session)

    return {"detail": "Webhook processed"}


async def handle_checkout_complete(session_data: dict, db_session: AsyncSession):
    user_id = session_data.get("metadata", {}).get("user_id")
    shipping_address = session_data.get("metadata", {}).get("shipping_address")
    products_json = session_data.get("metadata", {}).get("products", "[]")
    payment_session_id = session_data.get("id")

    if not user_id or not shipping_address:
        logger.error("Missing metadata in checkout session")
        return

    products = json.loads(products_json)

    order = Order(
        user_id=user_id,
        total=0,
        status="processing",
        shipping_address=shipping_address,
        payment_session_id=payment_session_id,
    )
    db_session.add(order)
    await db_session.flush()

    total = 0
    for item in products:
        result = await db_session.execute(select(Product).where(Product.id == item["product_id"]))
        product = result.scalar_one_or_none()
        if not product:
            continue

        if product.stock < item["quantity"]:
            logger.warning(f"Stock mismatch for {product.name} at payment time")
            continue

        product.stock -= item["quantity"]
        db_session.add(product)

        from app.models import OrderItem
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            price=product.price,
            quantity=item["quantity"],
        )
        db_session.add(order_item)
        total += product.price * item["quantity"]

    order.total = total
    db_session.add(order)
    await db_session.commit()
    logger.info(f"Order {order.id} created via Stripe webhook, total: ${total:.2f}")
