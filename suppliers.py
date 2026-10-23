from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import Supplier

router = APIRouter(
    prefix="/suppliers",
    tags=["Suppliers"]
)


class SupplierCreate(BaseModel):
    name: str
    location: str
    resource_type: str


class SupplierVerification(BaseModel):
    verification_status: str


VALID_STATUSES = [
    "Pending",
    "Verified",
    "Rejected"
]


@router.post("/")
def create_supplier(
    supplier: SupplierCreate,
    db: Session = Depends(get_db)
):

    new_supplier = Supplier(
        name=supplier.name,
        location=supplier.location,
        resource_type=supplier.resource_type,
        verification_status="Pending"
    )

    db.add(new_supplier)
    db.commit()
    db.refresh(new_supplier)

    return {
        "success": True,
        "message": "Supplier registered successfully",
        "supplier": new_supplier
    }


@router.get("/")
def get_suppliers(
    db: Session = Depends(get_db)
):

    suppliers = (
        db.query(Supplier)
        .order_by(Supplier.id.desc())
        .all()
    )

    return suppliers


@router.get("/{supplier_id}")
def get_supplier(
    supplier_id: int,
    db: Session = Depends(get_db)
):

    supplier = (
        db.query(Supplier)
        .filter(
            Supplier.id == supplier_id
        )
        .first()
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    return supplier


@router.put("/{supplier_id}/verify")
def verify_supplier(
    supplier_id: int,
    verification: SupplierVerification,
    db: Session = Depends(get_db)
):

    supplier = (
        db.query(Supplier)
        .filter(
            Supplier.id == supplier_id
        )
        .first()
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    if (
        verification.verification_status
        not in VALID_STATUSES
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid verification status. "
                "Choose Pending, Verified or Rejected."
            )
        )

    supplier.verification_status = (
        verification.verification_status
    )

    db.commit()
    db.refresh(supplier)

    return {
        "success": True,
        "message": "Supplier verification updated",
        "supplier": supplier
    }


@router.delete("/{supplier_id}")
def delete_supplier(
    supplier_id: int,
    db: Session = Depends(get_db)
):

    supplier = (
        db.query(Supplier)
        .filter(
            Supplier.id == supplier_id
        )
        .first()
    )

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    db.delete(supplier)
    db.commit()

    return {
        "success": True,
        "message": "Supplier deleted successfully"
    }


@router.get("/status/summary")
def supplier_summary(
    db: Session = Depends(get_db)
):

    suppliers = (
        db.query(Supplier)
        .all()
    )

    summary = {
        "total": len(suppliers),
        "pending": 0,
        "verified": 0,
        "rejected": 0
    }

    for supplier in suppliers:

        status = (
            supplier.verification_status
            .lower()
        )

        if status == "pending":
            summary["pending"] += 1

        elif status == "verified":
            summary["verified"] += 1

        elif status == "rejected":
            summary["rejected"] += 1

    return {
        "success": True,
        "summary": summary
    }