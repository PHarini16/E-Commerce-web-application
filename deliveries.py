from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import Delivery, ReliefRequest, Donation


router = APIRouter(
    prefix="/deliveries",
    tags=["Deliveries"]
)


class DeliveryCreate(BaseModel):
    origin: str
    destination: str
    vehicle: str
    cargo: str


class DeliveryFromAllocation(BaseModel):
    request_id: int
    donation_id: int
    vehicle: str = "TN-38-DR-101"


class DeliveryStatusUpdate(BaseModel):
    status: str


VALID_STATUSES = [
    "Requested",
    "Allocated",
    "Packed",
    "Dispatched",
    "In Transit",
    "Arrived",
    "Delivered"
]


PROGRESS_MAP = {
    "Requested": 0,
    "Allocated": 15,
    "Packed": 30,
    "Dispatched": 50,
    "In Transit": 70,
    "Arrived": 90,
    "Delivered": 100
}


# ============================================================
# CREATE NORMAL DELIVERY
# ============================================================

@router.post("/")
def create_delivery(
    delivery: DeliveryCreate,
    db: Session = Depends(get_db)
):

    new_delivery = Delivery(
        origin=delivery.origin,
        destination=delivery.destination,
        vehicle=delivery.vehicle,
        cargo=delivery.cargo,
        status="Requested",
        progress=0
    )

    db.add(new_delivery)
    db.commit()
    db.refresh(new_delivery)

    return {
        "success": True,
        "message": "Delivery created successfully",
        "delivery": new_delivery
    }


# ============================================================
# CREATE DELIVERY FROM AI ALLOCATION
# ============================================================

@router.post("/from-allocation")
def create_delivery_from_allocation(
    allocation: DeliveryFromAllocation,
    db: Session = Depends(get_db)
):

    # --------------------------------------------------------
    # Find relief request
    # --------------------------------------------------------

    request = (
        db.query(ReliefRequest)
        .filter(
            ReliefRequest.id == allocation.request_id
        )
        .first()
    )

    if not request:
        raise HTTPException(
            status_code=404,
            detail="Relief request not found"
        )


    # --------------------------------------------------------
    # Find donation
    # --------------------------------------------------------

    donation = (
        db.query(Donation)
        .filter(
            Donation.id == allocation.donation_id
        )
        .first()
    )

    if not donation:
        raise HTTPException(
            status_code=404,
            detail="Donation not found"
        )


    # --------------------------------------------------------
    # Check donation availability
    # --------------------------------------------------------

    if donation.status != "Available":

        raise HTTPException(
            status_code=400,
            detail=(
                "Donation is not available. "
                f"Current status: {donation.status}"
            )
        )


    # --------------------------------------------------------
    # Build cargo description
    # --------------------------------------------------------

    cargo = (
        f"{donation.resource_type} "
        f"({donation.quantity} units)"
    )


    # --------------------------------------------------------
    # Create delivery
    # --------------------------------------------------------

    new_delivery = Delivery(
        origin=donation.location,
        destination=request.location,
        vehicle=allocation.vehicle,
        cargo=cargo,
        status="Allocated",
        progress=15
    )

    db.add(new_delivery)


    # --------------------------------------------------------
    # Update request status
    # --------------------------------------------------------

    request.status = "Allocated"


    # --------------------------------------------------------
    # Update donation status
    # --------------------------------------------------------

    donation.status = "Allocated"


    db.commit()
    db.refresh(new_delivery)


    return {
        "success": True,

        "message":
            "AI allocation successfully converted into delivery",

        "allocation": {
            "request_id":
                request.id,

            "donation_id":
                donation.id,

            "request_location":
                request.location,

            "donation_location":
                donation.location,

            "resource_type":
                donation.resource_type,

            "quantity":
                donation.quantity
        },

        "delivery": new_delivery
    }


# ============================================================
# DELIVERY SUMMARY
# ============================================================

@router.get("/status/summary")
def delivery_summary(
    db: Session = Depends(get_db)
):

    deliveries = (
        db.query(Delivery)
        .all()
    )

    summary = {
        "total": len(deliveries),
        "requested": 0,
        "allocated": 0,
        "packed": 0,
        "dispatched": 0,
        "in_transit": 0,
        "arrived": 0,
        "delivered": 0
    }


    for delivery in deliveries:

        status = delivery.status.lower()

        key = status.replace(
            " ",
            "_"
        )

        if key in summary:
            summary[key] += 1


    return {
        "success": True,
        "summary": summary
    }


# ============================================================
# GET ALL DELIVERIES
# ============================================================

@router.get("/")
def get_deliveries(
    db: Session = Depends(get_db)
):

    deliveries = (
        db.query(Delivery)
        .order_by(Delivery.id.desc())
        .all()
    )

    return deliveries


# ============================================================
# GET SINGLE DELIVERY
# ============================================================

@router.get("/{delivery_id}")
def get_delivery(
    delivery_id: int,
    db: Session = Depends(get_db)
):

    delivery = (
        db.query(Delivery)
        .filter(
            Delivery.id == delivery_id
        )
        .first()
    )

    if not delivery:
        raise HTTPException(
            status_code=404,
            detail="Delivery not found"
        )

    return delivery


# ============================================================
# UPDATE DELIVERY STATUS
# ============================================================

@router.put("/{delivery_id}/status")
def update_delivery_status(
    delivery_id: int,
    update: DeliveryStatusUpdate,
    db: Session = Depends(get_db)
):

    delivery = (
        db.query(Delivery)
        .filter(
            Delivery.id == delivery_id
        )
        .first()
    )

    if not delivery:
        raise HTTPException(
            status_code=404,
            detail="Delivery not found"
        )


    if update.status not in VALID_STATUSES:

        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid status. Choose from: "
                + ", ".join(VALID_STATUSES)
            )
        )


    delivery.status = update.status

    delivery.progress = PROGRESS_MAP[
        update.status
    ]


    db.commit()
    db.refresh(delivery)


    return {
        "success": True,
        "message": "Delivery status updated",
        "delivery": delivery
    }


# ============================================================
# DELETE DELIVERY
# ============================================================

@router.delete("/{delivery_id}")
def delete_delivery(
    delivery_id: int,
    db: Session = Depends(get_db)
):

    delivery = (
        db.query(Delivery)
        .filter(
            Delivery.id == delivery_id
        )
        .first()
    )

    if not delivery:
        raise HTTPException(
            status_code=404,
            detail="Delivery not found"
        )


    db.delete(delivery)
    db.commit()


    return {
        "success": True,
        "message": "Delivery deleted successfully"
    }