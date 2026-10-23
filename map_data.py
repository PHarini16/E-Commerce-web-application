from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import (
    ReliefRequest,
    Supplier,
    Vehicle,
    Camp,
    Warehouse,
    DisasterZone
)

router = APIRouter(
    prefix="/map",
    tags=["Disaster Map"]
)


@router.get("/overview")
def get_map_overview(
    db: Session = Depends(get_db)
):

    requests = db.query(ReliefRequest).all()
    suppliers = db.query(Supplier).all()
    vehicles = db.query(Vehicle).all()
    camps = db.query(Camp).all()
    warehouses = db.query(Warehouse).all()
    disaster_zones = db.query(DisasterZone).all()

    return {
        "success": True,

        "requests": [
            {
                "id": request.id,
                "location": request.location,
                "people_affected": request.people_affected,
                "urgency": request.urgency,
                "priority_score": request.priority_score,
                "status": request.status
            }
            for request in requests
        ],

        "suppliers": [
            {
                "id": supplier.id,
                "name": supplier.name,
                "location": supplier.location,
                "resource_type": supplier.resource_type,
                "verification_status":
                    supplier.verification_status
            }
            for supplier in suppliers
        ],

        "vehicles": [
            {
                "id": vehicle.id,
                "vehicle_number": vehicle.vehicle_number,
                "vehicle_type": vehicle.vehicle_type,
                "status": vehicle.status,
                "latitude": vehicle.latitude,
                "longitude": vehicle.longitude
            }
            for vehicle in vehicles
        ],

        "camps": [
            {
                "id": camp.id,
                "name": camp.name,
                "latitude": camp.latitude,
                "longitude": camp.longitude,
                "population": camp.population
            }
            for camp in camps
        ],

        "warehouses": [
            {
                "id": warehouse.id,
                "name": warehouse.name,
                "latitude": warehouse.latitude,
                "longitude": warehouse.longitude
            }
            for warehouse in warehouses
        ],

        "disaster_zones": [
            {
                "id": zone.id,
                "name": zone.name,
                "disaster_type": zone.disaster_type,
                "severity": zone.severity,
                "latitude": zone.latitude,
                "longitude": zone.longitude
            }
            for zone in disaster_zones
        ]
    }
