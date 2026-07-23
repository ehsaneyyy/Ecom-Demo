from collections.abc import AsyncGenerator

import logging
import ssl
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlmodel import SQLModel

from app.config import settings

logger = logging.getLogger(__name__)

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

MIGRATIONS = [
    ("user", "phone", 'ALTER TABLE "user" ADD COLUMN IF NOT EXISTS phone TEXT'),
    ("order", "payment_method", "ALTER TABLE \"order\" ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'razorpay'"),
    ("order", "promo_code", 'ALTER TABLE "order" ADD COLUMN IF NOT EXISTS promo_code TEXT'),
    ("order", "discount_amount", 'ALTER TABLE "order" ADD COLUMN IF NOT EXISTS discount_amount REAL DEFAULT 0'),
    ("address", "phone", 'ALTER TABLE "address" ADD COLUMN IF NOT EXISTS phone TEXT'),
]


async def create_db_and_tables():
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
        for table, column, sql in MIGRATIONS:
            try:
                result = await conn.execute(text(f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table}' AND column_name = '{column}'"))
                if not result.fetchone():
                    await conn.execute(text(sql))
                    logger.info(f"Added missing column {table}.{column}")
            except Exception as e:
                logger.warning(f"Migration check failed for {table}.{column}: {e}")


async def get_session() -> AsyncGenerator[AsyncSession]:
    async with async_session_factory() as session:
        try:
            yield session
        finally:
            await session.close()
