from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.auth_utils import get_current_user
from app.database import get_session
from app.models import Address, User
from app.schemas import AddressCreate, AddressResponse, AddressUpdate

router = APIRouter(prefix="/api/address", tags=["address"])


@router.get("", response_model=list[AddressResponse])
async def list_addresses(
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    result = await session.execute(
        select(Address).where(Address.user_id == current_user.id).order_by(Address.is_default.desc())
    )
    addresses = result.scalars().all()
    return [AddressResponse.model_validate(a) for a in addresses]


@router.post("", response_model=AddressResponse)
async def create_address(
    body: AddressCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if body.is_default:
        result = await session.execute(
            select(Address).where(Address.user_id == current_user.id, Address.is_default == True)
        )
        for addr in result.scalars().all():
            addr.is_default = False
            session.add(addr)

    address = Address(
        user_id=current_user.id,
        label=body.label,
        full_name=body.full_name,
        address_line1=body.address_line1,
        address_line2=body.address_line2,
        city=body.city,
        state=body.state,
        zip_code=body.zip_code,
        country=body.country,
        is_default=body.is_default,
    )
    session.add(address)
    await session.commit()
    await session.refresh(address)
    return AddressResponse.model_validate(address)


@router.put("/{address_id}", response_model=AddressResponse)
async def update_address(
    address_id: str,
    body: AddressUpdate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    result = await session.execute(
        select(Address).where(Address.id == address_id, Address.user_id == current_user.id)
    )
    address = result.scalar_one_or_none()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    if body.is_default:
        all_addrs = await session.execute(
            select(Address).where(Address.user_id == current_user.id, Address.is_default == True)
        )
        for addr in all_addrs.scalars().all():
            addr.is_default = False
            session.add(addr)

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(address, field, value)

    session.add(address)
    await session.commit()
    await session.refresh(address)
    return AddressResponse.model_validate(address)


@router.delete("/{address_id}")
async def delete_address(
    address_id: str,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    result = await session.execute(
        select(Address).where(Address.id == address_id, Address.user_id == current_user.id)
    )
    address = result.scalar_one_or_none()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")

    await session.delete(address)
    await session.commit()
    return {"detail": "Address deleted"}
