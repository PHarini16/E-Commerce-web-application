from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==================================================
# LOGIN
# ==================================================

@router.post("/login")
def login(
    username: str,
    password: str,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.username == username
    ).first()

    if user is None:

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    if user.password != password:

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "id": user.id,
            "username": user.username,
            "role": user.role
        }
    }


# ==================================================
# CREATE DEMO USERS
# ==================================================

@router.post("/seed-users")
def seed_users(
    db: Session = Depends(get_db)
):

    users = [
        ("admin", "admin123", "Admin"),
        ("ngo", "ngo123", "NGO"),
        ("government", "govt123", "Government"),
        ("donor", "donor123", "Donor"),
        ("supplier", "supplier123", "Supplier")
    ]

    created = 0

    for username, password, role in users:

        existing = db.query(User).filter(
            User.username == username
        ).first()

        if existing is None:

            user = User(
                username=username,
                password=password,
                role=role
            )

            db.add(user)

            created += 1

    db.commit()

    return {
        "message": "Demo users created",
        "created": created
    }