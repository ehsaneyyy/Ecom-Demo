from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import col, select

from app.auth_utils import require_admin
from app.database import get_session
from app.models import Category, User
from app.schemas import CategoryCreate, CategoryResponse

router = APIRouter(prefix="/api/category", tags=["category"])


@router.get("", response_model=list[CategoryResponse])
async def list_categories(session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Category).order_by(col(Category.name)))
    categories = result.scalars().all()
    return [CategoryResponse.model_validate(c) for c in categories]


@router.post("", response_model=CategoryResponse)
async def create_category(
    body: CategoryCreate,
    session: AsyncSession = Depends(get_session),
    admin: User = Depends(require_admin),
):
    result = await session.execute(select(Category).where(col(Category.name).ilike(body.name)))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Category already exists")

    category = Category(name=body.name.strip(), color=body.color, accent=body.accent)
    session.add(category)
    await session.commit()
    await session.refresh(category)
    return CategoryResponse.model_validate(category)


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: str,
    body: CategoryCreate,
    session: AsyncSession = Depends(get_session),
    admin: User = Depends(require_admin),
):
    result = await session.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    category.name = body.name.strip()
    category.color = body.color
    category.accent = body.accent
    session.add(category)
    await session.commit()
    await session.refresh(category)
    return CategoryResponse.model_validate(category)


@router.delete("/{category_id}")
async def delete_category(
    category_id: str,
    session: AsyncSession = Depends(get_session),
    admin: User = Depends(require_admin),
):
    result = await session.execute(select(Category).where(Category.id == category_id))
    category = result.scalar_one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    await session.delete(category)
    await session.commit()
    return {"detail": "Category deleted"}
