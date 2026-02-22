from fastapi import APIRouter
from app.schemas.employee_schema import EmployeeCreate, EmployeeUpdate
from app.services import employee_service

router = APIRouter()

@router.post("", status_code=201)
async def add_employee(data: EmployeeCreate):
    return await employee_service.create_employee(data)

@router.get("")
async def list_employees():
    return await employee_service.get_all_employees()

@router.put("/{employee_id}")
async def edit_employee(employee_id: str, data: EmployeeUpdate):
    return await employee_service.update_employee(employee_id, data)

@router.delete("/{employee_id}")
async def remove_employee(employee_id: str):
    return await employee_service.delete_employee(employee_id)
