import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "hrms_lite")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_db():
    db_instance.client = AsyncIOMotorClient(MONGO_URL)
    db_instance.db = db_instance.client[DB_NAME]
    await db_instance.db.employees.create_index("employee_id", unique=True)
    await db_instance.db.employees.create_index("email", unique=True)
    await db_instance.db.attendance.create_index(
        [("employee_id", 1), ("date", 1)], unique=True
    )
    print("Connected to MongoDB")

async def close_db():
    if db_instance.client:
        db_instance.client.close()
        print("Disconnected from MongoDB")

def get_db():
    return db_instance.db
