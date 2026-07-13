import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.auth import get_current_user, require_admin
from app.database import get_session
from app.models import Order, OrderItem, Product, User
from app.schemas import OrderCreate, OrderItemCreate, OrderItemResponse, OrderResponse

router = APIRouter(prefix="/api/order", tags=["order"])


def order_to_response(order: Order) -> OrderResponse:
    return OrderResponse(
        id=order.id,
        total=order.total,
        status=order.status,
        shipping_address=order.shipping_address,
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
    body: OrderCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    cart_key = f"cart_{current_user.id}"
    cart_data_raw = None

    order = Order(
        user_id=current_user.id,
        total=0,
        status="pending",
        shipping_address=body.shipping_address,
    )
    session.add(order)
    await session.flush()

    result = await session.execute(
        select(OrderItem).where(OrderItem.order_id == order.id)
    )

    order.total = sum(item.price * item.quantity for item in order.items)
    session.add(order)
    await session.commit()
    await session.refresh(order)

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

    all_items_result = await session.execute(select(OrderItem))
    all_items = all_items_result.scalars().all()
    items_by_order = {}
    for item in all_items:
        items_by_order.setdefault(item.order_id, []).append(item)

    for order in orders:
        order.items = items_by_order.get(order.id, [])

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

    items_result = await session.execute(
        select(OrderItem).where(OrderItem.order_id == order_id)
    )
    order.items = items_result.scalars().all()

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
