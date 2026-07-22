from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.auth_utils import require_admin
from app.database import get_session
from app.models import PromoCode
from app.schemas import PromoCodeCreate, PromoCodeResponse, PromoCodeValidateRequest, PromoCodeValidateResponse

router = APIRouter(prefix="/api/promo", tags=["promo"])


@router.post("", response_model=PromoCodeResponse)
async def create_promo_code(
    body: PromoCodeCreate,
    session: AsyncSession = Depends(get_session),
    admin: PromoCode = Depends(require_admin),
):
    existing = await session.execute(select(PromoCode).where(PromoCode.code == body.code))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Promo code already exists")

    today = date.today()
    promo = PromoCode(
        code=body.code,
        discount_type=body.discount_type,
        discount_value=body.discount_value,
        min_order=body.min_order,
        max_uses=body.max_uses,
        valid_from=body.valid_from or today,
        valid_until=body.valid_until or date(2027, 12, 31),
    )
    session.add(promo)
    await session.commit()
    await session.refresh(promo)

    return PromoCodeResponse(
        id=promo.id,
        code=promo.code,
        discount_type=promo.discount_type,
        discount_value=promo.discount_value,
        min_order=promo.min_order,
        max_uses=promo.max_uses,
        used_count=promo.used_count,
        valid_from=str(promo.valid_from),
        valid_until=str(promo.valid_until),
        active=promo.active,
    )


@router.get("", response_model=list[PromoCodeResponse])
async def list_promo_codes(
    session: AsyncSession = Depends(get_session),
    admin: PromoCode = Depends(require_admin),
):
    result = await session.execute(select(PromoCode).order_by(PromoCode.id.desc()))
    promos = result.scalars().all()
    return [
        PromoCodeResponse(
            id=p.id,
            code=p.code,
            discount_type=p.discount_type,
            discount_value=p.discount_value,
            min_order=p.min_order,
            max_uses=p.max_uses,
            used_count=p.used_count,
            valid_from=str(p.valid_from),
            valid_until=str(p.valid_until),
            active=p.active,
        )
        for p in promos
    ]


@router.delete("/{promo_id}")
async def delete_promo_code(
    promo_id: str,
    session: AsyncSession = Depends(get_session),
    admin: PromoCode = Depends(require_admin),
):
    result = await session.execute(select(PromoCode).where(PromoCode.id == promo_id))
    promo = result.scalar_one_or_none()
    if not promo:
        raise HTTPException(status_code=404, detail="Promo code not found")
    await session.delete(promo)
    await session.commit()
    return {"detail": "Promo code deleted"}


@router.post("/validate", response_model=PromoCodeValidateResponse)
async def validate_promo_code(
    body: PromoCodeValidateRequest,
    session: AsyncSession = Depends(get_session),
):
    result = await session.execute(
        select(PromoCode).where(PromoCode.code == body.code.upper())
    )
    promo = result.scalar_one_or_none()

    if not promo or not promo.active:
        raise HTTPException(status_code=400, detail="Invalid promo code")

    today = date.today()
    if today < promo.valid_from or today > promo.valid_until:
        raise HTTPException(status_code=400, detail="This promo code has expired")

    if promo.max_uses and promo.used_count >= promo.max_uses:
        raise HTTPException(status_code=400, detail="This promo code has reached its usage limit")

    if body.subtotal < promo.min_order:
        raise HTTPException(
            status_code=400,
            detail=f"Minimum order of ₹{promo.min_order:.0f} required for this code",
        )

    if promo.discount_type == "percentage":
        discount_amount = round(body.subtotal * promo.discount_value / 100, 2)
    else:
        discount_amount = min(promo.discount_value, body.subtotal)

    return PromoCodeValidateResponse(
        code=promo.code,
        discount_type=promo.discount_type,
        discount_value=promo.discount_value,
        discount_amount=discount_amount,
        message=f"₹{discount_amount:.2f} discount applied",
    )
