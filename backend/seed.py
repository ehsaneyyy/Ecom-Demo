import asyncio
import json

from sqlmodel import select

from app.auth import hash_password
from app.database import async_session_factory, create_db_and_tables
from app.models import Product, User

PRODUCTS = [
    {"name": "Minimal Leather Bag", "price": 189, "compare_at_price": 220, "tag": "New", "category": "Living", "color": "#2a2218", "description": "Hand-stitched full-grain leather tote with solid brass hardware.", "colors": ["#2a2218", "#5c3d2e", "#1a1a1a"], "stock": 12},
    {"name": "Ceramic Vase Set", "price": 74, "category": "Living", "color": "#1e2228", "description": "Set of three hand-thrown ceramic vases in matte finishes.", "colors": ["#e8e0d4", "#2c2c2c", "#8b7355"], "stock": 18},
    {"name": "Linen Throw Blanket", "price": 129, "compare_at_price": 155, "tag": "Sale", "category": "Bedroom", "color": "#22201a", "description": "Stonewashed Belgian linen in a generous 150x200cm size.", "colors": ["#d4c8b8", "#8c8278", "#f5f0eb"], "stock": 24},
    {"name": "Handmade Candle Trio", "price": 56, "category": "Living", "color": "#1a1e22", "description": "Three soy wax candles in hand-poured concrete vessels.", "stock": 30},
    {"name": "Walnut Desk Organizer", "price": 95, "category": "Office", "color": "#201a18", "tag": "New", "description": "Solid American walnut organizer with precision-cut compartments.", "colors": ["#5c3d2e", "#3d2b1f"], "stock": 8},
    {"name": "Merino Wool Scarf", "price": 68, "category": "Bedroom", "color": "#181a1e", "description": "Extra-fine merino wool scarf in a timeless herringbone weave.", "colors": ["#2c2c2c", "#6b5b4b", "#b8a99a"], "stock": 22},
    {"name": "Stoneware Mug Set", "price": 42, "category": "Kitchen", "color": "#221e1a", "description": "Set of four hand-glazed stoneware mugs.", "colors": ["#e8e0d4", "#4a6741", "#8b6f47"], "stock": 35},
    {"name": "Canvas Tote", "price": 64, "compare_at_price": 78, "tag": "Sale", "category": "Living", "color": "#1a1c20", "description": "Heavy-duty 18oz canvas tote with reinforced leather handles.", "colors": ["#d4c8b8", "#2c2c2c"], "stock": 0},
    {"name": "Oak Cutting Board", "price": 88, "category": "Kitchen", "color": "#1e1a16", "tag": "New", "description": "End-grain white oak cutting board with deep juice groove.", "colors": ["#c8a97e", "#8b7355"], "stock": 15},
    {"name": "Brass Desk Lamp", "price": 156, "category": "Office", "color": "#1a1818", "description": "Adjustable solid brass desk lamp with natural linen shade.", "colors": ["#c8a97e", "#1a1a1a"], "stock": 6},
    {"name": "Woven Basket Set", "price": 78, "category": "Living", "color": "#201c18", "description": "Set of three hand-woven seagrass baskets.", "colors": ["#b8a99a", "#8b7355"], "stock": 20},
    {"name": "Japanese Teapot", "price": 62, "compare_at_price": 75, "tag": "Sale", "category": "Kitchen", "color": "#1a1e1c", "description": "Cast iron tetsubin with enamel interior.", "colors": ["#1a1a1a", "#5c3d2e"], "stock": 10},
    {"name": "Handwoven Throw Pillow", "price": 48, "category": "Living", "color": "#1c1a18", "description": "Handwoven cotton throw pillow with textured diamond pattern.", "colors": ["#e8e0d4", "#4a6741", "#c8a97e"], "stock": 28},
    {"name": "Marble Bookends", "price": 72, "category": "Office", "color": "#1a1c1e", "tag": "New", "description": "Pair of solid Carrara marble bookends with brushed brass accents.", "colors": ["#e8e0d4", "#1a1a1a"], "stock": 9},
    {"name": "Copper Pour-Over Set", "price": 94, "category": "Kitchen", "color": "#1e1816", "description": "Precision copper pour-over coffee dripper with borosilicate glass carafe.", "colors": ["#c85a3e", "#1a1a1a"], "stock": 14},
    {"name": "Velvet Eye Mask", "price": 32, "category": "Bedroom", "color": "#18161a", "description": "Silk-lined velvet sleep mask with adjustable elastic strap.", "colors": ["#2c2c2c", "#5c3d2e", "#8b6f47"], "stock": 40},
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
                stock=p["stock"],
            )
            session.add(product)

        await session.commit()
        print(f"Seeded {len(PRODUCTS)} products and 1 admin user.")


if __name__ == "__main__":
    asyncio.run(seed())
