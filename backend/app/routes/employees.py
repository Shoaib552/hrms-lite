from fastapi import APIRouter, Depends
from app.schemas.employee_schema import EmployeeCreate, EmployeeUpdate
from app.services import employee_service
from app.services.auth_service import get_current_admin

router = APIRouter()

@router.post("", status_code=201)
async def add_employee(data: EmployeeCreate, admin=Depends(get_current_admin)):
    return await employee_service.create_employee(data, admin["email"])

@router.get("")
async def list_employees(admin=Depends(get_current_admin)):
    return await employee_service.get_all_employees(admin["email"])

@router.put("/{employee_id}")
async def edit_employee(employee_id: str, data: EmployeeUpdate, admin=Depends(get_current_admin)):
    return await employee_service.update_employee(employee_id, data, admin["email"])

@router.delete("/{employee_id}")
async def remove_employee(employee_id: str, admin=Depends(get_current_admin)):
    return await employee_service.delete_employee(employee_id, admin["email"])