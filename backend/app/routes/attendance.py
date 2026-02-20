from fastapi import APIRouter
from app.schemas.attendance_schema import AttendanceCreate
from app.services import attendance_service

router = APIRouter()

@router.post("", status_code=201)
async def mark_attendance(data: AttendanceCreate):
    return await attendance_service.mark_attendance(data)

@router.get("/{employee_id}")
async def get_attendance(employee_id: str):
    return await attendance_service.get_attendance_by_employee(employee_id)
