from datetime import datetime, timezone
from fastapi import HTTPException
from app.database import get_db
from app.schemas.employee_schema import EmployeeCreate, EmployeeUpdate

def serialize_employee(emp: dict) -> dict:
    return {
        "employee_id": emp["employee_id"],
        "full_name":   emp["full_name"],
        "email":       emp["email"],
        "department":  emp["department"],
        "created_at":  emp["created_at"],
    }

async def create_employee(data: EmployeeCreate, admin_email: str):
    db = get_db()
    # Check duplicate employee_id within this admin's data only
    existing = await db.employees.find_one({
        "employee_id": data.employee_id,
        "admin_email": admin_email
    })
    if existing:
        raise HTTPException(status_code=409, detail=f"Employee ID '{data.employee_id}' already exists")

    existing_email = await db.employees.find_one({
        "email": data.email,
        "admin_email": admin_email
    })
    if existing_email:
        raise HTTPException(status_code=409, detail=f"Email '{data.email}' already registered")

    doc = {
        **data.model_dump(),
        "admin_email": admin_email,
        "created_at":  datetime.now(timezone.utc)
    }
    await db.employees.insert_one(doc)
    return serialize_employee(doc)

async def get_all_employees(admin_email: str):
    db = get_db()
    cursor = db.employees.find({"admin_email": admin_email}).sort("created_at", -1)
    return [serialize_employee(e) async for e in cursor]

async def update_employee(employee_id: str, data: EmployeeUpdate, admin_email: str):
    db = get_db()
    emp = await db.employees.find_one({
        "employee_id": employee_id,
        "admin_email":  admin_email
    })
    if not emp:
        raise HTTPException(status_code=404, detail=f"Employee '{employee_id}' not found")

    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    if "email" in update_data:
        existing_email = await db.employees.find_one({
            "email":       update_data["email"],
            "admin_email": admin_email,
            "employee_id": {"$ne": employee_id}
        })
        if existing_email:
            raise HTTPException(status_code=409, detail=f"Email '{update_data['email']}' already in use")

    await db.employees.update_one(
        {"employee_id": employee_id, "admin_email": admin_email},
        {"$set": update_data}
    )
    updated = await db.employees.find_one({"employee_id": employee_id, "admin_email": admin_email})
    return serialize_employee(updated)

async def delete_employee(employee_id: str, admin_email: str):
    db = get_db()
    result = await db.employees.delete_one({
        "employee_id": employee_id,
        "admin_email":  admin_email
    })
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Employee '{employee_id}' not found")
    return {"message": f"Employee '{employee_id}' deleted successfully"}