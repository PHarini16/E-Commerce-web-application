from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import Donation


router = APIRouter(
    prefix="/donations",
    tags=["Donations"]
)


class DonationCreate(BaseModel):
    donor_name: str
    resource_type: str
    quantity: int
    location: str


@router.post("/")
def create_donation(
    donation: DonationCreate,
    db: Session = Depends(get_db)
):

    new_donation = Donation(
        donor_name=donation.donor_name,
        resource_type=donation.resource_type,
        quantity=donation.quantity,
        location=donation.location,
        status="Available"
    )

    db.add(new_donation)
    db.commit()
    db.refresh(new_donation)

    return {
        "success": True,
        "message": "Donation added successfully",
        "donation": new_donation
    }


@router.get("/")
def get_donations(
    db: Session = Depends(get_db)
):

    donations = (
        db.query(Donation)
        .order_by(Donation.id.desc())
        .all()
    )

    return donations


@router.get("/{donation_id}")
def get_donation(
    donation_id: int,
    db: Session = Depends(get_db)
):

    donation = (
        db.query(Donation)
        .filter(Donation.id == donation_id)
        .first()
    )

    if not donation:
        raise HTTPException(
            status_code=404,
            detail="Donation not found"
        )

    return donation


@router.delete("/{donation_id}")
def delete_donation(
    donation_id: int,
    db: Session = Depends(get_db)
):

    donation = (
        db.query(Donation)
        .filter(Donation.id == donation_id)
        .first()
    )

    if not donation:
        raise HTTPException(
            status_code=404,
            detail="Donation not found"
        )

    db.delete(donation)
    db.commit()

    return {
        "success": True,
        "message": "Donation deleted successfully"
    }