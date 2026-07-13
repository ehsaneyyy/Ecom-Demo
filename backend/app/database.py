from collections.abc import AsyncGenerator

import ssl
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlmodel import SQLModel

from app.config import settings

ssl_context = ssl.create_default_context()

engine = create_async_engine(
    settings.async_database_url,
    pool_size=5,
    max_overflow=10,
    pool_recycle=300,
    pool_pre_ping=True,
    connect_args={"ssl": ssl_context},
)

async_session_factory = async_sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)


async def get_session() -> AsyncGenerator[AsyncSession]:
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()
