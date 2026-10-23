from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import Resource


router = APIRouter(
    prefix="/resources",
    tags=["Resources"]
)


class ResourceCreate(BaseModel):
    name: str
    category: str
    quantity: int
    location: str


@router.post("/")
def create_resource(
    resource: ResourceCreate,
    db: Session = Depends(get_db)
):

    new_resource = Resource(
        name=resource.name,
        category=resource.category,
        quantity=resource.quantity,
        location=resource.location,
        status="Available"
    )

    db.add(new_resource)
    db.commit()
    db.refresh(new_resource)

    return {
        "success": True,
        "message": "Resource added successfully",
        "resource": new_resource
    }


@router.get("/")
def get_resources(
    db: Session = Depends(get_db)
):

    resources = (
        db.query(Resource)
        .order_by(Resource.id.desc())
        .all()
    )

    return resources


@router.get("/{resource_id}")
def get_resource(
    resource_id: int,
    db: Session = Depends(get_db)
):

    resource = (
        db.query(Resource)
        .filter(Resource.id == resource_id)
        .first()
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found"
        )

    return resource


@router.delete("/{resource_id}")
def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db)
):

    resource = (
        db.query(Resource)
        .filter(Resource.id == resource_id)
        .first()
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found"
        )

    db.delete(resource)
    db.commit()

    return {
        "success": True,
        "message": "Resource deleted successfully"
    }