from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import ReliefRequest


router = APIRouter(
    prefix="/requests",
    tags=["Relief Requests"]
)


# =========================
# REQUEST SCHEMA
# =========================

class RequestCreate(BaseModel):
    location: str
    people_affected: int
    food_required: int
    water_required: int
    medicine_required: int
    urgency: str


# =========================
# PRIORITY CALCULATION
# =========================

def calculate_priority(
    people_affected,
    food_required,
    water_required,
    medicine_required,
    urgency
):

    score = 0

    # Number of affected people
    if people_affected >= 500:
        score += 40
    elif people_affected >= 200:
        score += 30
    elif people_affected >= 50:
        score += 20
    else:
        score += 10

    # Resource requirements
    score += min(food_required / 10, 15)
    score += min(water_required / 10, 15)
    score += min(medicine_required / 5, 15)

    # Urgency
    urgency_scores = {
        "Critical": 30,
        "High": 20,
        "Medium": 10,
        "Low": 5
    }

    score += urgency_scores.get(
        urgency,
        5
    )

    return round(
        min(score, 100),
        2
    )


# =========================
# CREATE REQUEST
# =========================

@router.post("/")
def create_request(
    request: RequestCreate,
    db: Session = Depends(get_db)
):

    priority = calculate_priority(
        request.people_affected,
        request.food_required,
        request.water_required,
        request.medicine_required,
        request.urgency
    )

    new_request = ReliefRequest(

        location=request.location,

        people_affected=
            request.people_affected,

        food_required=
            request.food_required,

        water_required=
            request.water_required,

        medicine_required=
            request.medicine_required,

        urgency=request.urgency,

        priority_score=priority,

        status="Pending"
    )

    db.add(new_request)

    db.commit()

    db.refresh(new_request)

    return {
        "success": True,
        "message": "Relief request created successfully",
        "request": new_request
    }


# =========================
# GET ALL REQUESTS
# =========================

@router.get("/")
def get_requests(
    db: Session = Depends(get_db)
):

    requests = (
        db.query(ReliefRequest)
        .order_by(
            ReliefRequest.priority_score.desc()
        )
        .all()
    )

    return requests


# =========================
# GET SINGLE REQUEST
# =========================

@router.get("/{request_id}")
def get_request(
    request_id: int,
    db: Session = Depends(get_db)
):

    request = (
        db.query(ReliefRequest)
        .filter(
            ReliefRequest.id == request_id
        )
        .first()
    )

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Relief request not found"
        )

    return request


# =========================
# DELETE REQUEST
# =========================

@router.delete("/{request_id}")
def delete_request(
    request_id: int,
    db: Session = Depends(get_db)
):

    request = (
        db.query(ReliefRequest)
        .filter(
            ReliefRequest.id == request_id
        )
        .first()
    )

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Relief request not found"
        )

    db.delete(request)

    db.commit()

    return {
        "success": True,
        "message": "Relief request deleted"
    }