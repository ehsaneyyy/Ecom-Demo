import asyncio
import hashlib
import hmac
import json
import logging
import uuid
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.auth_utils import get_current_user
from app.config import settings
from app.database import get_session
from app.models import Order, OrderItem, Product, User

router = APIRouter(prefix="/api/payments", tags=["payments"])
logger = logging.getLogger(__name__)


def _ensure_pkg_resources():
    import sys
    import types
    if 'pkg_resources' not in sys.modules:
        stub = types.ModuleType('pkg_resources')
        class _DummyDist:
            def __init__(self, version="0.0.0"):
                self.version = version
        class DistributionNotFound(Exception):
            pass
        stub.get_distribution = lambda name: _DummyDist()
        stub.DistributionNotFound = DistributionNotFound
        sys.modules['pkg_resources'] = stub


def get_razorpay_client():
    if not settings.razorpay_key_id or not settings.razorpay_key_secret:
        return None
    try:
        import razorpay
        return razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))
    except Exception:
        _ensure_pkg_resources()
        try:
            import importlib
            if 'razorpay' in __import__('sys').modules:
                del __import__('sys').modules['razorpay']
            import razorpay
            return razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))
        except Exception as e:
            logger.warning(f"Failed to initialize Razorpay client: {e}")
            return None


class CreateOrderRequest(BaseModel):
    shipping_address: str
    items: list[dict]


class VerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    shipping_address: str
    items: list[dict]


@router.post("/create-order", response_model=dict)
async def create_order(
    body: CreateOrderRequest,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    client = get_razorpay_client()
    if not client:
        raise HTTPException(status_code=503, detail="Razorpay not configured")

    if not body.items:
        raise HTTPException(status_code=400, detail="No items provided")

    total_amount = 0
    product_details = []
    for item in body.items:
        result = await session.execute(select(Product).where(Product.id == item["product_id"]))
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item['product_id']} not found")
        if product.stock < item["quantity"]:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")

        total_amount += int(product.price * 100) * item["quantity"]
        product_details.append({
            "product_id": product.id,
            "name": product.name,
            "price": product.price,
            "quantity": item["quantity"],
        })

    receipt = f"order_{uuid.uuid4().hex[:16]}"

    try:
        razorpay_order = await asyncio.to_thread(client.order.create, {
            "amount": total_amount,
            "currency": "INR",
            "receipt": receipt,
        })
    except Exception as e:
        logger.error(f"Razorpay order creation failed: {e}")
        raise HTTPException(status_code=400, detail=f"Payment gateway error: {str(e)[:200]}")

    return {
        "order_id": razorpay_order["id"],
        "amount": total_amount,
        "currency": "INR",
        "key_id": settings.razorpay_key_id,
    }


@router.post("/verify", response_model=dict)
async def verify_payment(
    body: VerifyRequest,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    client = get_razorpay_client()
    if not client:
        raise HTTPException(status_code=503, detail="Razorpay not configured")

    generated_signature = hmac.new(
        settings.razorpay_key_secret.encode(),
        (body.razorpay_order_id + "|" + body.razorpay_payment_id).encode(),
        hashlib.sha256,
    ).hexdigest()

    if generated_signature != body.razorpay_signature:
        raise HTTPException(status_code=400, detail="Payment verification failed")

    if not body.items:
        raise HTTPException(status_code=400, detail="No items provided")

    order = Order(
        user_id=current_user.id,
        total=0,
        status="processing",
        shipping_address=body.shipping_address,
        payment_session_id=body.razorpay_payment_id,
    )
    session.add(order)
    await session.flush()

    total = 0
    for item in body.items:
        result = await session.execute(select(Product).where(Product.id == item["product_id"]))
        product = result.scalar_one_or_none()
        if not product:
            continue

        if product.stock < item["quantity"]:
            continue

        product.stock -= item["quantity"]
        session.add(product)

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            price=product.price,
            quantity=item["quantity"],
        )
        session.add(order_item)
        total += product.price * item["quantity"]

    order.total = total
    session.add(order)
    await session.commit()
    logger.info(f"Order {order.id} created via Razorpay, total: ${total:.2f}")

    return {"success": True, "order_id": order.id}
