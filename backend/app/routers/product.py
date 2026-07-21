import json
import os
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select as sa_select
from sqlalchemy.orm import selectinload
from sqlmodel import col, select

from app.auth_utils import get_current_user, require_admin
from app.config import settings
from app.database import get_session
from app.models import Product, Review, User
from app.schemas import ProductCreate, ProductResponse, ProductUpdate, ReviewCreate, ReviewResponse

router = APIRouter(prefix="/api/product", tags=["product"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


def product_to_response(product: Product, reviews: list[Review] | None = None) -> ProductResponse:
    colors = json.loads(product.colors) if product.colors else None
    sizes = json.loads(product.sizes) if product.sizes else None
    images = json.loads(product.images) if product.images else []
    avg_rating = None
    review_list = []
    if reviews:
        avg_rating = round(sum(r.rating for r in reviews) / len(reviews), 1) if reviews else None
        review_list = [
            ReviewResponse(
                id=r.id,
                product_id=r.product_id,
                user_name=r.user.name if r.user else "Unknown",
                rating=r.rating,
                text=r.text,
                verified=r.verified,
                created_at=str(r.created_at),
            )
            for r in reviews
        ]
    return ProductResponse(
        id=product.id,
        name=product.name,
        price=product.price,
        compare_at_price=product.compare_at_price,
        tag=product.tag,
        category=product.category,
        description=product.description,
        color=product.color,
        colors=colors,
        sizes=sizes,
        images=images,
        stock=product.stock,
        rating=product.rating if product.rating else avg_rating,
        reviews=review_list,
    )


@router.get("", response_model=list[ProductResponse])
async def list_products(
    category: str | None = None,
    search: str | None = None,
    sort: str = "featured",
    session: AsyncSession = Depends(get_session),
):
    query = select(Product)
    if category and category != "all":
        query = query.where(col(Product.category).ilike(category))
    if search:
        query = query.where(col(Product.name).ilike(f"%{search}%"))

    if sort == "price-low":
        query = query.order_by(Product.price)
    elif sort == "price-high":
        query = query.order_by(Product.price.desc())
    elif sort == "newest":
        query = query.order_by(Product.id.desc())
    else:
        query = query.order_by(Product.id)

    result = await session.execute(query)
    products = result.scalars().all()

    review_query = sa_select(Review).options(selectinload(Review.user))
    review_result = await session.execute(review_query)
    all_reviews = review_result.scalars().unique().all()
    reviews_by_product = {}
    for r in all_reviews:
        reviews_by_product.setdefault(r.product_id, []).append(r)

    return [product_to_response(p, reviews_by_product.get(p.id)) for p in products]


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    review_result = await session.execute(
        sa_select(Review).where(Review.product_id == product_id).options(selectinload(Review.user))
    )
    reviews = review_result.scalars().unique().all()
    return product_to_response(product, reviews)


@router.post("", response_model=ProductResponse)
async def create_product(
    body: ProductCreate,
    session: AsyncSession = Depends(get_session),
    admin: User = Depends(require_admin),
):
    colors_json = json.dumps(body.colors) if body.colors else None
    sizes_json = json.dumps(body.sizes) if body.sizes else None
    images_json = json.dumps(body.images) if body.images else None

    product = Product(
        name=body.name,
        price=body.price,
        compare_at_price=body.compare_at_price,
        tag=body.tag,
        category=body.category,
        description=body.description,
        color=body.color,
        colors=colors_json,
        sizes=sizes_json,
        images=images_json,
        stock=body.stock,
    )
    session.add(product)
    await session.commit()
    await session.refresh(product)
    return product_to_response(product)


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    body: ProductUpdate,
    session: AsyncSession = Depends(get_session),
    admin: User = Depends(require_admin),
):
    result = await session.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = body.model_dump(exclude_unset=True)
    if "colors" in update_data and update_data["colors"] is not None:
        update_data["colors"] = json.dumps(update_data["colors"])
    if "sizes" in update_data and update_data["sizes"] is not None:
        update_data["sizes"] = json.dumps(update_data["sizes"])
    if "images" in update_data and update_data["images"] is not None:
        update_data["images"] = json.dumps(update_data["images"])

    for key, value in update_data.items():
        setattr(product, key, value)

    session.add(product)
    await session.commit()
    await session.refresh(product)
    return product_to_response(product)


@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    session: AsyncSession = Depends(get_session),
    admin: User = Depends(require_admin),
):
    result = await session.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if product.images:
        for img_url in json.loads(product.images):
            if img_url.startswith("/api/uploads/"):
                filename = img_url.split("/api/uploads/")[-1]
                filepath = os.path.join(UPLOAD_DIR, filename)
                if os.path.exists(filepath):
                    os.remove(filepath)

    await session.delete(product)
    await session.commit()
    return {"detail": "Product deleted"}


@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...),
    admin: User = Depends(require_admin),
):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    ext = file.filename.rsplit(".", 1)[-1] if "." in (file.filename or "") else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 5MB)")

    with open(filepath, "wb") as f:
        f.write(content)

    return {"url": f"/api/uploads/{filename}"}


@router.post("/{product_id}/review", response_model=ReviewResponse)
async def create_review(
    product_id: str,
    body: ReviewCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    result = await session.execute(select(Product).where(Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing = await session.execute(
        select(Review).where(Review.product_id == product_id, Review.user_id == current_user.id)
    )
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="You have already reviewed this product")

    review = Review(
        product_id=product_id,
        user_id=current_user.id,
        rating=body.rating,
        text=body.text,
        verified=True,
    )
    session.add(review)
    await session.commit()
    await session.refresh(review)

    return ReviewResponse(
        id=review.id,
        product_id=review.product_id,
        user_name=current_user.name,
        rating=review.rating,
        text=review.text,
        verified=review.verified,
        created_at=str(review.created_at),
    )
