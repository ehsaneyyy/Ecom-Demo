import asyncio
import json

from sqlalchemy import delete as sa_delete
from sqlmodel import select

from app.auth_utils import hash_password
from app.database import async_session_factory, create_db_and_tables
from app.models import OrderItem, Order, Product, Review, User

PRODUCTS = [
    {"name": "Minimal Leather Bag", "price": 15900, "compare_at_price": 18700, "tag": "New", "category": "Living", "color": "#2a2218", "description": "Hand-stitched full-grain leather tote with solid brass hardware.", "colors": ["#2a2218", "#5c3d2e", "#1a1a1a"], "images": ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1590874103328-eac38ef682ca?w=800&h=800&fit=crop"], "stock": 12},
    {"name": "Ceramic Vase Set", "price": 6200, "category": "Living", "color": "#1e2228", "description": "Set of three hand-thrown ceramic vases in matte finishes.", "colors": ["#e8e0d4", "#2c2c2c", "#8b7355"], "images": ["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&h=800&fit=crop"], "stock": 18},
    {"name": "Linen Throw Blanket", "price": 10800, "compare_at_price": 13200, "tag": "Sale", "category": "Bedroom", "color": "#22201a", "description": "Stonewashed Belgian linen in a generous 150x200cm size.", "colors": ["#d4c8b8", "#8c8278", "#f5f0eb"], "images": ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=800&fit=crop"], "stock": 24},
    {"name": "Handmade Candle Trio", "price": 4700, "category": "Living", "color": "#1a1e22", "description": "Three soy wax candles in hand-poured concrete vessels.", "images": ["https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=800&h=800&fit=crop"], "stock": 30},
    {"name": "Walnut Desk Organizer", "price": 7999, "category": "Office", "color": "#201a18", "tag": "New", "description": "Solid American walnut organizer with precision-cut compartments.", "colors": ["#5c3d2e", "#3d2b1f"], "images": ["https://images.unsplash.com/photo-1589582528488-3e9c1b1e7e8a?w=800&h=800&fit=crop"], "stock": 8},
    {"name": "Merino Wool Scarf", "price": 5700, "category": "Bedroom", "color": "#181a1e", "description": "Extra-fine merino wool scarf in a timeless herringbone weave.", "colors": ["#2c2c2c", "#6b5b4b", "#b8a99a"], "images": ["https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&h=800&fit=crop"], "stock": 22},
    {"name": "Stoneware Mug Set", "price": 3500, "category": "Kitchen", "color": "#221e1a", "description": "Set of four hand-glazed stoneware mugs.", "colors": ["#e8e0d4", "#4a6741", "#8b6f47"], "images": ["https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=800&fit=crop"], "stock": 35},
    {"name": "Canvas Tote", "price": 5399, "compare_at_price": 6600, "tag": "Sale", "category": "Living", "color": "#1a1c20", "description": "Heavy-duty 18oz canvas tote with reinforced leather handles.", "colors": ["#d4c8b8", "#2c2c2c"], "images": ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&h=800&fit=crop"], "stock": 0},
    {"name": "Oak Cutting Board", "price": 7400, "category": "Kitchen", "color": "#1e1a16", "tag": "New", "description": "End-grain white oak cutting board with deep juice groove.", "colors": ["#c8a97e", "#8b7355"], "images": ["https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&h=800&fit=crop"], "stock": 15},
    {"name": "Brass Desk Lamp", "price": 13100, "category": "Office", "color": "#1a1818", "description": "Adjustable solid brass desk lamp with natural linen shade.", "colors": ["#c8a97e", "#1a1a1a"], "images": ["https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=800&fit=crop"], "stock": 6},
    {"name": "Woven Basket Set", "price": 6500, "category": "Living", "color": "#201c18", "description": "Set of three hand-woven seagrass baskets.", "colors": ["#b8a99a", "#8b7355"], "images": ["https://images.unsplash.com/photo-1631125915902-d8abe32c5e05?w=800&h=800&fit=crop"], "stock": 20},
    {"name": "Japanese Teapot", "price": 5200, "compare_at_price": 6400, "tag": "Sale", "category": "Kitchen", "color": "#1a1e1c", "description": "Cast iron tetsubin with enamel interior.", "colors": ["#1a1a1a", "#5c3d2e"], "images": ["https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=800&h=800&fit=crop"], "stock": 10},
    {"name": "Handwoven Throw Pillow", "price": 4000, "category": "Living", "color": "#1c1a18", "description": "Handwoven cotton throw pillow with textured diamond pattern.", "colors": ["#e8e0d4", "#4a6741", "#c8a97e"], "images": ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=800&fit=crop"], "stock": 28},
    {"name": "Marble Bookends", "price": 6000, "category": "Office", "color": "#1a1c1e", "tag": "New", "description": "Pair of solid Carrara marble bookends with brushed brass accents.", "colors": ["#e8e0d4", "#1a1a1a"], "images": ["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop"], "stock": 9},
    {"name": "Copper Pour-Over Set", "price": 7900, "category": "Kitchen", "color": "#1e1816", "description": "Precision copper pour-over coffee dripper with borosilicate glass carafe.", "colors": ["#c85a3e", "#1a1a1a"], "images": ["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop"], "stock": 14},
    {"name": "Velvet Eye Mask", "price": 2700, "category": "Bedroom", "color": "#18161a", "description": "Silk-lined velvet sleep mask with adjustable elastic strap.", "colors": ["#2c2c2c", "#5c3d2e", "#8b6f47"], "images": ["https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800&h=800&fit=crop"], "stock": 40},
]

ADMIN_USER = {"name": "Admin", "email": "admin@atelier.com", "password": "admin123", "is_admin": True}


async def seed():
    await create_db_and_tables()
    async with async_session_factory() as session:
        result = await session.execute(select(Product))
        if result.scalars().first():
            print("Database already seeded.")
            return

        admin = User(
            name=ADMIN_USER["name"],
            email=ADMIN_USER["email"],
            hashed_password=hash_password(ADMIN_USER["password"]),
            is_admin=True,
        )
        session.add(admin)

        for p in PRODUCTS:
            product = Product(
                name=p["name"],
                price=p["price"],
                compare_at_price=p.get("compare_at_price"),
                tag=p.get("tag"),
                category=p["category"],
                description=p["description"],
                color=p["color"],
                colors=json.dumps(p.get("colors")) if p.get("colors") else None,
                images=json.dumps(p.get("images")) if p.get("images") else None,
                stock=p["stock"],
            )
            session.add(product)

        await session.commit()
        print(f"Seeded {len(PRODUCTS)} products and 1 admin user.")


async def reseed():
    await create_db_and_tables()
    async with async_session_factory() as session:
        await session.execute(sa_delete(Review))
        await session.execute(sa_delete(OrderItem))
        await session.execute(sa_delete(Order))
        result = await session.execute(select(Product))
        existing = result.scalars().all()
        for p in existing:
            await session.delete(p)
        await session.commit()
        print(f"Deleted {len(existing)} existing products and related orders.")

        for p in PRODUCTS:
            product = Product(
                name=p["name"],
                price=p["price"],
                compare_at_price=p.get("compare_at_price"),
                tag=p.get("tag"),
                category=p["category"],
                description=p["description"],
                color=p["color"],
                colors=json.dumps(p.get("colors")) if p.get("colors") else None,
                images=json.dumps(p.get("images")) if p.get("images") else None,
                stock=p["stock"],
            )
            session.add(product)

        await session.commit()
        print(f"Re-seeded {len(PRODUCTS)} products.")


if __name__ == "__main__":
    import sys
    if "--force" in sys.argv:
        asyncio.run(reseed())
    else:
        asyncio.run(seed())
