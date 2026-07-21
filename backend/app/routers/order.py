import logging
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.auth_utils import get_current_user, require_admin
from app.database import get_session
from app.models import Order, OrderItem, Product, User
from app.schemas import OrderCreate, OrderItemResponse, OrderResponse

router = APIRouter(prefix="/api/order", tags=["order"])
logger = logging.getLogger(__name__)


class OrderItemInput(BaseModel):
    product_id: str
    quantity: int


class OrderCreateWithItems(BaseModel):
    shipping_address: str
    items: list[OrderItemInput]
    payment_method: str = "razorpay"


STORE_STATE = "Kerala"
GST_RATE = 0.18
SHIPPING_COST = 500
FREE_SHIPPING_THRESHOLD = 10000


def _calc_gst(subtotal: float, shipping_state: str):
    shipping_cost = 0 if subtotal >= FREE_SHIPPING_THRESHOLD else SHIPPING_COST
    taxable = subtotal + shipping_cost
    tax = round(taxable * GST_RATE, 2)
    if shipping_state.strip().lower() == STORE_STATE.lower():
        cgst = round(tax / 2, 2)
        sgst = round(tax / 2, 2)
        igst = 0.0
    else:
        cgst = 0.0
        sgst = 0.0
        igst = tax
    return {
        "subtotal": subtotal,
        "shipping_cost": shipping_cost,
        "cgst": cgst,
        "sgst": sgst,
        "igst": igst,
        "grand_total": round(subtotal + shipping_cost + tax, 2),
    }


def _extract_shipping_state(shipping_address: str) -> str:
    parts = [p.strip() for p in shipping_address.split(",")]
    if len(parts) >= 3:
        state_part = parts[-2]
        tokens = state_part.split()
        if tokens:
            return tokens[0]
    return ""


def order_to_response(order: Order, user: User | None = None) -> OrderResponse:
    shipping_state = _extract_shipping_state(order.shipping_address)
    gst = _calc_gst(order.total, shipping_state)
    return OrderResponse(
        id=order.id,
        user_id=order.user_id,
        user_name=user.name if user else None,
        user_phone=user.phone if user else None,
        total=order.total,
        status=order.status,
        shipping_address=order.shipping_address,
        payment_method=order.payment_method,
        payment_session_id=order.payment_session_id,
        subtotal=gst["subtotal"],
        cgst=gst["cgst"],
        sgst=gst["sgst"],
        igst=gst["igst"],
        shipping_cost=gst["shipping_cost"],
        grand_total=gst["grand_total"],
        created_at=str(order.created_at),
        items=[
            OrderItemResponse(
                id=item.id,
                product_name=item.product_name,
                price=item.price,
                quantity=item.quantity,
            )
            for item in order.items
        ],
    )


@router.post("", response_model=OrderResponse)
async def create_order(
    body: OrderCreateWithItems,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin accounts cannot place orders")
    if not body.items:
        raise HTTPException(status_code=400, detail="Order must have at least one item")
    if body.payment_method not in ("razorpay", "cod"):
        raise HTTPException(status_code=400, detail="Invalid payment method")

    order = Order(
        user_id=current_user.id,
        total=0,
        status="pending",
        shipping_address=body.shipping_address,
        payment_method=body.payment_method,
    )
    session.add(order)
    await session.flush()

    total = 0
    for item_input in body.items:
        result = await session.execute(select(Product).where(Product.id == item_input.product_id))
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item_input.product_id} not found")

        if product.stock < item_input.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")

        product.stock -= item_input.quantity
        session.add(product)

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            price=product.price,
            quantity=item_input.quantity,
        )
        session.add(order_item)
        total += product.price * item_input.quantity

    order.total = total
    session.add(order)
    await session.commit()
    await session.refresh(order, ["items"])

    logger.info(f"Order {order.id} created, total: ${total:.2f}")
    return order_to_response(order, current_user)


@router.get("", response_model=list[OrderResponse])
async def list_orders(
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.is_admin:
        result = await session.execute(select(Order).order_by(Order.id.desc()))
    else:
        result = await session.execute(
            select(Order).where(Order.user_id == current_user.id).order_by(Order.id.desc())
        )
    orders = result.scalars().all()

    user_ids = list({o.user_id for o in orders})
    users_map = {}
    if user_ids:
        user_result = await session.execute(select(User).where(User.id.in_(user_ids)))
        users_map = {u.id: u for u in user_result.scalars().all()}

    for order in orders:
        await session.refresh(order, ["items"])

    return [order_to_response(o, users_map.get(o.user_id)) for o in orders]


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    result = await session.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if not current_user.is_admin and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    await session.refresh(order, ["items"])

    user_result = await session.execute(select(User).where(User.id == order.user_id))
    user = user_result.scalar_one_or_none()

    return order_to_response(order, user)


@router.patch("/{order_id}/status")
async def update_order_status(
    order_id: str,
    status: str,
    session: AsyncSession = Depends(get_session),
    admin: User = Depends(require_admin),
):
    result = await session.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    was_not_cancelled = order.status != "cancelled"
    order.status = status
    session.add(order)

    if status == "cancelled" and was_not_cancelled:
        for item in order.items:
            result = await session.execute(select(Product).where(Product.id == item.product_id))
            product = result.scalar_one_or_none()
            if product:
                product.stock += item.quantity
                session.add(product)

    await session.commit()
    return {"detail": "Order status updated"}


@router.post("/{order_id}/cancel", response_model=OrderResponse)
async def cancel_order(
    order_id: str,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    result = await session.execute(select(Order).where(Order.id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if not current_user.is_admin and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    if order.status not in ("pending", "processing"):
        raise HTTPException(status_code=400, detail="Only pending or processing orders can be cancelled")

    order.status = "cancelled"
    session.add(order)

    for item in order.items:
        result = await session.execute(select(Product).where(Product.id == item.product_id))
        product = result.scalar_one_or_none()
        if product:
            product.stock += item.quantity
            session.add(product)

    await session.commit()
    await session.refresh(order, ["items"])

    user_result = await session.execute(select(User).where(User.id == order.user_id))
    user = user_result.scalar_one_or_none()

    return order_to_response(order, user)


@router.post("/cod", response_model=OrderResponse)
async def create_cod_order(
    body: OrderCreateWithItems,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin accounts cannot place orders")
    if not body.items:
        raise HTTPException(status_code=400, detail="Order must have at least one item")

    order = Order(
        user_id=current_user.id,
        total=0,
        status="pending",
        shipping_address=body.shipping_address,
        payment_method="cod",
    )
    session.add(order)
    await session.flush()

    total = 0
    for item_input in body.items:
        result = await session.execute(select(Product).where(Product.id == item_input.product_id))
        product = result.scalar_one_or_none()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item_input.product_id} not found")

        if product.stock < item_input.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name}")

        product.stock -= item_input.quantity
        session.add(product)

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            price=product.price,
            quantity=item_input.quantity,
        )
        session.add(order_item)
        total += product.price * item_input.quantity

    order.total = total
    session.add(order)
    await session.commit()
    await session.refresh(order, ["items"])

    logger.info(f"COD Order {order.id} created, total: {total}")
    return order_to_response(order, current_user)
