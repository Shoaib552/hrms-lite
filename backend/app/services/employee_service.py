from datetime import datetime, timezone
from fastapi import HTTPException
from app.database import get_db
from app.schemas.employee_schema import EmployeeCreate

def serialize_employee(emp: dict) -> dict:
    return {
        "employee_id": emp["employee_id"],
        "full_name": emp["full_name"],
        "email": emp["email"],
        "department": emp["department"],
        "created_at": emp["created_at"],
    }

async def create_employee(data: EmployeeCreate):
    db = get_db()
    existing = await db.employees.find_one({"employee_id": data.employee_id})
    if existing:
        raise HTTPException(status_code=409, detail=f"Employee ID '{data.employee_id}' already exists")
    existing_email = await db.employees.find_one({"email": data.email})
    if existing_email:
        raise HTTPException(status_code=409, detail=f"Email '{data.email}' already registered")
    doc = {**data.model_dump(), "created_at": datetime.now(timezone.utc)}
    await db.employees.insert_one(doc)
    return serialize_employee(doc)

async def get_all_employees():
    db = get_db()
    cursor = db.employees.find({}).sort("created_at", -1)
    return [serialize_employee(e) async for e in cursor]

async def delete_employee(employee_id: str):
    db = get_db()
    result = await db.employees.delete_one({"employee_id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Employee '{employee_id}' not found")
    return {"message": f"Employee '{employee_id}' deleted successfully"}
