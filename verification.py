from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime

from database import get_db


router = APIRouter(
    prefix="/verification",
    tags=["Verification"]
)


class VerificationCreate(BaseModel):
    subject_name: str
    subject_type: str
    document_type: str
    verification_method: str = "Webcam Capture"


class VerificationResult(BaseModel):
    verification_id: str
    result: str
    confidence: float
    message: str


verification_records = []


@router.post("/start")
def start_verification(
    verification: VerificationCreate
):

    verification_id = (
        f"VER-{len(verification_records) + 1:04d}"
    )

    record = {
        "verification_id":
            verification_id,

        "subject_name":
            verification.subject_name,

        "subject_type":
            verification.subject_type,

        "document_type":
            verification.document_type,

        "verification_method":
            verification.verification_method,

        "status":
            "Pending",

        "created_at":
            datetime.now().isoformat()
    }

    verification_records.append(record)

    return {
        "success": True,
        "message":
            "Verification session created",

        "verification":
            record
    }


@router.post("/complete")
def complete_verification(
    result: VerificationResult
):

    record = next(
        (
            item
            for item in verification_records
            if item["verification_id"]
            == result.verification_id
        ),
        None
    )

    if not record:

        raise HTTPException(
            status_code=404,
            detail="Verification session not found"
        )

    record["result"] = result.result

    record["confidence"] = result.confidence

    record["message"] = result.message

    record["status"] = (
        "Verified"
        if result.result == "Verified"
        else "Review Required"
    )

    record["completed_at"] = (
        datetime.now().isoformat()
    )

    return {
        "success": True,
        "message":
            "Verification completed",

        "verification":
            record
    }


@router.get("/")
def get_verifications():

    return {
        "success": True,
        "verifications":
            verification_records
    }


@router.get("/status")
def verification_status():

    verified = sum(
        1
        for item in verification_records
        if item.get("status") == "Verified"
    )

    review = sum(
        1
        for item in verification_records
        if item.get("status")
        == "Review Required"
    )

    pending = sum(
        1
        for item in verification_records
        if item.get("status") == "Pending"
    )

    return {
        "success": True,
        "summary": {
            "total":
                len(verification_records),

            "verified":
                verified,

            "review_required":
                review,

            "pending":
                pending
        }
    }