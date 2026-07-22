import re
from datetime import date

from pydantic import BaseModel, field_validator


class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    phone: str
    admin_key: str | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError("Name must be at least 2 characters")
        if len(v.strip()) > 100:
            raise ValueError("Name must be under 100 characters")
        return v.strip()

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        v = v.strip().lower()
        if not re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", v):
            raise ValueError("Invalid email address")
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if len(v) > 128:
            raise ValueError("Password must be under 128 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain an uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain a lowercase letter")
        if not re.search(r"[0-9]", v):
            raise ValueError("Password must contain a digit")
        return v

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v):
        digits = re.sub(r"\D", "", v)
        if len(digits) < 10:
            raise ValueError("Phone number must be at least 10 digits")
        if len(digits) > 15:
            raise ValueError("Phone number is too long")
        return v.strip()


class UserLogin(BaseModel):
    email: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        return v.strip().lower()


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str | None = None
    is_admin: bool

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class ProductCreate(BaseModel):
    name: str
    price: float
    compare_at_price: float | None = None
    tag: str | None = None
    category: str
    description: str
    color: str = "#1a1a1a"
    colors: list[str] | None = None
    sizes: list[str] | None = None
    images: list[str] | None = None
    stock: int = 0

    @field_validator("price")
    @classmethod
    def validate_price(cls, v):
        if v <= 0:
            raise ValueError("Price must be positive")
        if v > 10000000:
            raise ValueError("Price too high")
        return round(v, 2)

    @field_validator("stock")
    @classmethod
    def validate_stock(cls, v):
        if v < 0:
            raise ValueError("Stock cannot be negative")
        return v

    @field_validator("name")
    @classmethod
    def validate_name(cls, v):
        if len(v.strip()) < 1:
            raise ValueError("Product name is required")
        if len(v.strip()) > 200:
            raise ValueError("Product name must be under 200 characters")
        return v.strip()


class ProductUpdate(BaseModel):
    name: str | None = None
    price: float | None = None
    compare_at_price: float | None = None
    tag: str | None = None
    category: str | None = None
    description: str | None = None
    color: str | None = None
    colors: list[str] | None = None
    sizes: list[str] | None = None
    images: list[str] | None = None
    stock: int | None = None


class ProductResponse(BaseModel):
    id: str
    name: str
    price: float
    compare_at_price: float | None = None
    tag: str | None = None
    category: str
    description: str
    color: str
    colors: list[str] | None = None
    sizes: list[str] | None = None
    images: list[str] = []
    stock: int
    rating: float | None = None
    reviews: list["ReviewResponse"] = []

    model_config = {"from_attributes": True}


class OrderCreate(BaseModel):
    shipping_address: str


class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int


class OrderResponse(BaseModel):
    id: str
    user_id: str
    user_name: str | None = None
    user_email: str | None = None
    user_phone: str | None = None
    total: float
    status: str
    shipping_address: str
    payment_method: str = "razorpay"
    payment_session_id: str | None = None
    promo_code: str | None = None
    discount_amount: float = 0
    subtotal: float = 0
    cgst: float = 0
    sgst: float = 0
    igst: float = 0
    shipping_cost: float = 0
    grand_total: float = 0
    created_at: str
    items: list["OrderItemResponse"] = []

    model_config = {"from_attributes": True}


class OrderItemResponse(BaseModel):
    id: str
    product_name: str
    price: float
    quantity: int

    model_config = {"from_attributes": True}


class ReviewCreate(BaseModel):
    product_id: str
    rating: int
    text: str


class ReviewResponse(BaseModel):
    id: str
    product_id: str
    user_name: str
    rating: int
    text: str
    verified: bool
    created_at: str

    model_config = {"from_attributes": True}


class CategoryCreate(BaseModel):
    name: str
    color: str = "#1a1a1a"
    accent: str = "#ffffff"

    @field_validator("name")
    @classmethod
    def validate_name(cls, v):
        v = v.strip()
        if len(v) < 1:
            raise ValueError("Category name is required")
        if len(v) > 50:
            raise ValueError("Category name must be under 50 characters")
        return v


class CategoryResponse(BaseModel):
    id: str
    name: str
    color: str
    accent: str

    model_config = {"from_attributes": True}


class AddressCreate(BaseModel):
    label: str = "Home"
    full_name: str
    phone: str | None = None
    address_line1: str
    address_line2: str | None = None
    city: str
    state: str
    zip_code: str
    country: str = "India"
    is_default: bool = False


class AddressUpdate(BaseModel):
    label: str | None = None
    full_name: str | None = None
    phone: str | None = None
    address_line1: str | None = None
    address_line2: str | None = None
    city: str | None = None
    state: str | None = None
    zip_code: str | None = None
    country: str | None = None
    is_default: bool | None = None


class AddressResponse(BaseModel):
    id: str
    label: str
    full_name: str
    phone: str | None = None
    address_line1: str
    address_line2: str | None = None
    city: str
    state: str
    zip_code: str
    country: str
    is_default: bool

    model_config = {"from_attributes": True}


class PromoCodeCreate(BaseModel):
    code: str
    discount_type: str
    discount_value: float
    min_order: float = 0
    max_uses: int | None = None
    valid_from: date | None = None
    valid_until: date | None = None

    @field_validator("code")
    @classmethod
    def validate_code(cls, v):
        v = v.strip().upper()
        if len(v) < 2:
            raise ValueError("Code must be at least 2 characters")
        if len(v) > 20:
            raise ValueError("Code must be under 20 characters")
        return v

    @field_validator("discount_type")
    @classmethod
    def validate_discount_type(cls, v):
        if v not in ("percentage", "fixed"):
            raise ValueError("Discount type must be 'percentage' or 'fixed'")
        return v

    @field_validator("discount_value")
    @classmethod
    def validate_discount_value(cls, v):
        if v <= 0:
            raise ValueError("Discount value must be positive")
        return v


class PromoCodeResponse(BaseModel):
    id: str
    code: str
    discount_type: str
    discount_value: float
    min_order: float
    max_uses: int | None = None
    used_count: int
    valid_from: str
    valid_until: str
    active: bool

    model_config = {"from_attributes": True}


class PromoCodeValidateRequest(BaseModel):
    code: str
    subtotal: float


class PromoCodeValidateResponse(BaseModel):
    code: str
    discount_type: str
    discount_value: float
    discount_amount: float
    message: str


class GuestOrderRequest(BaseModel):
    email: str
    name: str
    phone: str | None = None
    shipping_address: str
    items: list[OrderItemCreate]
    promo_code: str | None = None

    @field_validator("email")
    @classmethod
    def validate_email(cls, v):
        v = v.strip().lower()
        if not re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", v):
            raise ValueError("Invalid email address")
        return v
