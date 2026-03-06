"""
Pydantic schemas for authentication requests and responses.
Follows the same pattern as your existing employee_schema.py and attendance_schema.py
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class AdminRegister(BaseModel):
    """Request body for POST /api/auth/register"""
    full_name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)


class AdminLogin(BaseModel):
    """Request body for POST /api/auth/login"""
    email: EmailStr
    password: str


class AdminPublic(BaseModel):
    """
    Safe admin data returned to the client.
    Never exposes password_hash.
    """
    id: str
    full_name: str
    email: str
    created_at: datetime


class TokenResponse(BaseModel):
    """Response returned after successful login or register."""
    access_token: str
    token_type: str = "bearer"
    admin: AdminPublic