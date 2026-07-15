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


def order_to_response(order: Order) -> OrderResponse:
    return OrderResponse(
        id=order.id,
        user_id=order.user_id,
        total=order.total,
        status=order.status,
        shipping_address=order.shipping_address,
        payment_session_id=order.payment_session_id,
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
    if not body.items:
        raise HTTPException(status_code=400, detail="Order must have at least one item")

    order = Order(
        user_id=current_user.id,
        total=0,
        status="pending",
        shipping_address=body.shipping_address,
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
    return order_to_response(order)


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

    for order in orders:
        await session.refresh(order, ["items"])

    return [order_to_response(o) for o in orders]


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

    return order_to_response(order)


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

    order.status = status
    session.add(order)
    await session.commit()
    return {"detail": "Order status updated"}
