import uuid
from datetime import date

from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "user"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str = Field(index=True)
    email: str = Field(unique=True, index=True)
    phone: str | None = None
    hashed_password: str
    is_admin: bool = Field(default=False)
    created_at: date = Field(default_factory=date.today)

    orders: list["Order"] = Relationship(back_populates="user")
    reviews: list["Review"] = Relationship(back_populates="user")
    addresses: list["Address"] = Relationship(back_populates="user")


class Category(SQLModel, table=True):
    __tablename__ = "category"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str = Field(unique=True, index=True)
    color: str = Field(default="#1a1a1a")
    accent: str = Field(default="#ffffff")


class Product(SQLModel, table=True):
    __tablename__ = "product"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str = Field(index=True)
    price: float
    compare_at_price: float | None = None
    tag: str | None = None
    category: str
    description: str
    color: str = "#1a1a1a"
    colors: str | None = None
    sizes: str | None = None
    images: str | None = None
    stock: int = Field(default=0)
    rating: float | None = None

    reviews: list["Review"] = Relationship(back_populates="product")
    order_items: list["OrderItem"] = Relationship(back_populates="product")


class Order(SQLModel, table=True):
    __tablename__ = "order"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    total: float
    status: str = Field(default="pending")
    shipping_address: str
    payment_method: str = Field(default="razorpay")
    payment_session_id: str | None = None
    created_at: date = Field(default_factory=date.today)

    user: User | None = Relationship(back_populates="orders")
    items: list["OrderItem"] = Relationship(back_populates="order")


class OrderItem(SQLModel, table=True):
    __tablename__ = "order_item"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    order_id: str = Field(foreign_key="order.id")
    product_id: str = Field(foreign_key="product.id")
    product_name: str
    price: float
    quantity: int

    order: Order | None = Relationship(back_populates="items")
    product: Product | None = Relationship(back_populates="order_items")


class Review(SQLModel, table=True):
    __tablename__ = "review"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    product_id: str = Field(foreign_key="product.id")
    user_id: str = Field(foreign_key="user.id")
    rating: int = Field(ge=1, le=5)
    text: str
    verified: bool = Field(default=False)
    created_at: date = Field(default_factory=date.today)

    product: Product | None = Relationship(back_populates="reviews")
    user: User | None = Relationship(back_populates="reviews")


class Address(SQLModel, table=True):
    __tablename__ = "address"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    label: str = Field(default="Home")
    full_name: str
    phone: str | None = None
    address_line1: str
    address_line2: str | None = None
    city: str
    state: str
    zip_code: str
    country: str = Field(default="India")
    is_default: bool = Field(default=False)

    user: User | None = Relationship(back_populates="addresses")


class PromoCode(SQLModel, table=True):
    __tablename__ = "promo_code"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    code: str = Field(unique=True, index=True)
    discount_type: str
    discount_value: float
    min_order: float = Field(default=0)
    max_uses: int | None = None
    used_count: int = Field(default=0)
    valid_from: date = Field(default_factory=date.today)
    valid_until: date = Field(default_factory=date.today)
    active: bool = Field(default=True)
