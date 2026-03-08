from fastapi import APIRouter, Depends
from app.schemas.attendance_schema import AttendanceCreate
from app.services import attendance_service
from app.services.auth_service import get_current_admin

router = APIRouter()

@router.post("", status_code=201)
async def mark_attendance(data: AttendanceCreate, admin=Depends(get_current_admin)):
    return await attendance_service.mark_attendance(data, admin["email"])

@router.get("/{employee_id}")
async def get_attendance(employee_id: str, admin=Depends(get_current_admin)):
    return await attendance_service.get_attendance_by_employee(employee_id, admin["email"])