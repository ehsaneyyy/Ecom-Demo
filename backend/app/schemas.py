from pydantic import BaseModel, EmailStr


class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    admin_key: str | None = None


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
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
    stock: int = 0


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
    total: float
    status: str
    shipping_address: str
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
