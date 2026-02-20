from datetime import datetime, timezone
from fastapi import HTTPException
from app.database import get_db
from app.schemas.attendance_schema import AttendanceCreate

def serialize_attendance(att: dict) -> dict:
    return {
        "employee_id": att["employee_id"],
        "date": att["date"],
        "status": att["status"],
        "created_at": att["created_at"],
    }

async def mark_attendance(data: AttendanceCreate):
    db = get_db()
    emp = await db.employees.find_one({"employee_id": data.employee_id})
    if not emp:
        raise HTTPException(status_code=404, detail=f"Employee '{data.employee_id}' not found")
    existing = await db.attendance.find_one({"employee_id": data.employee_id, "date": data.date})
    if existing:
        raise HTTPException(status_code=409, detail=f"Attendance already marked for '{data.employee_id}' on {data.date}")
    doc = {**data.model_dump(), "created_at": datetime.now(timezone.utc)}
    await db.attendance.insert_one(doc)
    return serialize_attendance(doc)

async def get_attendance_by_employee(employee_id: str):
    db = get_db()
    emp = await db.employees.find_one({"employee_id": employee_id})
    if not emp:
        raise HTTPException(status_code=404, detail=f"Employee '{employee_id}' not found")
    cursor = db.attendance.find({"employee_id": employee_id}).sort("date", -1)
    return [serialize_attendance(a) async for a in cursor]
