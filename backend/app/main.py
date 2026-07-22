import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.config import settings
from app.database import create_db_and_tables
from app.routers import auth, order, product, payments, category, address, promo

logger = logging.getLogger(__name__)

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_and_tables()
    yield


app = FastAPI(title="Atelier API", version="1.0.0", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "https://ecom-demo-rho.vercel.app",
        "https://ecom-demo-iota-brown.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(product.router)
app.include_router(order.router)
app.include_router(payments.router)
app.include_router(category.router)
app.include_router(address.router)
app.include_router(promo.router)

app.mount("/api/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.get("/api/health")
async def health_check():
    from fastapi.responses import JSONResponse
    from sqlalchemy import text
    from app.database import async_session_factory
    try:
        async with async_session_factory() as session:
            await session.execute(text('SELECT 1'))
            result = await session.execute(text("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user')"))
            user_table = result.scalar()
            result2 = await session.execute(text("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'order')"))
            order_table = result2.scalar()
            result3 = await session.execute(text("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'address')"))
            address_table = result3.scalar()
        return {"status": "ok", "user_table": user_table, "order_table": order_table, "address_table": address_table}
    except Exception as e:
        return JSONResponse(status_code=500, content={"status": "error", "detail": str(e)})


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    from fastapi.responses import JSONResponse

    if isinstance(exc, HTTPException):
        origin = request.headers.get("origin", "")
        allowed = [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://ecom-demo-rho.vercel.app",
            "https://ecom-demo-iota-brown.vercel.app",
        ]
        headers = {}
        if origin in allowed:
            headers["Access-Control-Allow-Origin"] = origin
            headers["Access-Control-Allow-Credentials"] = "true"
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
            headers=headers,
        )

    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)

    origin = request.headers.get("origin", "")
    allowed = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://ecom-demo-rho.vercel.app",
        "https://ecom-demo-iota-brown.vercel.app",
    ]
    headers = {}
    if origin in allowed:
        headers["Access-Control-Allow-Origin"] = origin
        headers["Access-Control-Allow-Credentials"] = "true"
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers=headers,
    )
