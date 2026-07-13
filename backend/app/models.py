import uuid
from datetime import date

from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "user"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str = Field(index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    is_admin: bool = Field(default=False)
    created_at: date = Field(default_factory=date.today)

    orders: list["Order"] = Relationship(back_populates="user")
    reviews: list["Review"] = Relationship(back_populates="user")


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
