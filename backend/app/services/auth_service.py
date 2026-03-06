"""
Auth service — follows the same pattern as your
employee_service.py and attendance_service.py.
Contains all business logic: hashing, JWT, DB operations.
"""

import os
from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.database import get_db

# ── Bcrypt for password hashing ────────────────────────────────
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ── JWT config from your existing .env ────────────────────────
SECRET_KEY                  = os.getenv("SECRET_KEY", "change-this-secret")
ALGORITHM                   = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# ── HTTP Bearer extractor ──────────────────────────────────────
security = HTTPBearer()


def hash_password(plain: str) -> str:
    """Hash a plain text password using bcrypt."""
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """Verify plain password against its bcrypt hash."""
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict) -> str:
    """Create a signed JWT token with expiry."""
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    """Decode JWT — returns payload dict or None if invalid/expired."""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None


async def register_admin(data) -> dict:
    """
    Create a new admin account.
    Raises 409 if email already exists.
    """
    db = get_db()

    # Check duplicate email
    existing = await db["admins"].find_one({"email": data.email.lower().strip()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists."
        )

    # Build document
    doc = {
        "full_name":     data.full_name.strip(),
        "email":         data.email.lower().strip(),
        "password_hash": hash_password(data.password),
        "created_at":    datetime.utcnow(),
    }
    result   = await db["admins"].insert_one(doc)
    admin_id = str(result.inserted_id)
    token    = create_access_token({"sub": doc["email"], "id": admin_id})

    return {
        "access_token": token,
        "token_type":   "bearer",
        "admin": {
            "id":         admin_id,
            "full_name":  doc["full_name"],
            "email":      doc["email"],
            "created_at": doc["created_at"],
        }
    }


async def login_admin(data) -> dict:
    """
    Verify credentials and return JWT.
    Raises 401 for wrong email or password.
    """
    db    = get_db()
    admin = await db["admins"].find_one({"email": data.email.lower().strip()})

    # Same error for wrong email OR wrong password (security best practice)
    if not admin or not verify_password(data.password, admin["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    token = create_access_token({"sub": admin["email"], "id": str(admin["_id"])})

    return {
        "access_token": token,
        "token_type":   "bearer",
        "admin": {
            "id":         str(admin["_id"]),
            "full_name":  admin["full_name"],
            "email":      admin["email"],
            "created_at": admin["created_at"],
        }
    }


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    FastAPI dependency — use this in any protected route.
    Decodes JWT from Authorization: Bearer <token> header.

    Usage:
        @router.get("/protected")
        async def route(admin = Depends(get_current_admin)):
            ...
    """
    payload = decode_token(credentials.credentials)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    db = get_db()
    admin = await db["admins"].find_one({"email": payload.get("sub")})

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin account not found."
        )

    return {
        "id":         str(admin["_id"]),
        "full_name":  admin["full_name"],
        "email":      admin["email"],
        "created_at": admin["created_at"],
    }