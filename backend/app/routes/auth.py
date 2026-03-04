"""
Auth routes — follows same pattern as your employees.py and attendance.py
POST /api/auth/register  — Create new admin
POST /api/auth/login     — Login and get JWT
GET  /api/auth/me        — Get current admin info
"""

from fastapi import APIRouter, Depends
from app.schemas.auth_schema import AdminRegister, AdminLogin, AdminPublic, TokenResponse
from app.services.auth_service import register_admin, login_admin, get_current_admin

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(data: AdminRegister):
    """Register a new admin. Returns JWT token immediately."""
    return await register_admin(data)


@router.post("/login", response_model=TokenResponse)
async def login(data: AdminLogin):
    """Login with email + password. Returns JWT token."""
    return await login_admin(data)


@router.get("/me", response_model=AdminPublic)
async def get_me(admin=Depends(get_current_admin)):
    """Return currently authenticated admin profile."""
    return admin