from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.auth_utils import create_access_token, get_current_user, hash_password, require_admin, verify_password
from app.config import settings
from app.database import get_session
from app.models import User
from app.schemas import TokenResponse, UserLogin, UserRegister, UserResponse

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
async def register(body: UserRegister, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(User).where(User.email == body.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    is_admin = False
    if body.admin_key:
        if body.admin_key != settings.admin_secret_key:
            raise HTTPException(status_code=403, detail="Invalid admin key")
        is_admin = True

    user = User(
        name=body.name,
        email=body.email,
        hashed_password=hash_password(body.password),
        is_admin=is_admin,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)

    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=user.id, name=user.name, email=user.email, is_admin=user.is_admin),
    )


@router.post("/login", response_model=TokenResponse)
async def login(body: UserLogin, session: AsyncSession = Depends(get_session)):
    result = await session.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user.id)
    return TokenResponse(
        access_token=token,
        user=UserResponse(id=user.id, name=user.name, email=user.email, is_admin=user.is_admin),
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(id=current_user.id, name=current_user.name, email=current_user.email, is_admin=current_user.is_admin)


@router.get("/users", response_model=list[UserResponse])
async def list_users(
    session: AsyncSession = Depends(get_session),
    admin: User = Depends(require_admin),
):
    result = await session.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    return [UserResponse(id=u.id, name=u.name, email=u.email, is_admin=u.is_admin) for u in users]
