from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Literal

class AttendanceCreate(BaseModel):
    employee_id: str
    date: str
    status: Literal["Present", "Absent"]

    @field_validator("date")
    @classmethod
    def validate_date(cls, v):
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("Date must be in YYYY-MM-DD format")
        return v

class AttendanceResponse(BaseModel):
    employee_id: str
    date: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
