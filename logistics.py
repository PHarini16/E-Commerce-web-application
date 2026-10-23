from fastapi import APIRouter
from pydantic import BaseModel
from math import radians, sin, cos, sqrt, atan2

router = APIRouter(
    prefix="/logistics",
    tags=["Logistics"]
)


class RouteRequest(BaseModel):
    origin: str
    destination: str
    origin_latitude: float
    origin_longitude: float
    destination_latitude: float
    destination_longitude: float
    vehicle_type: str = "Relief Truck"
    cargo: str = "Relief Supplies"


def calculate_distance(
    lat1,
    lon1,
    lat2,
    lon2
):
    """
    Calculate approximate distance between
    two GPS coordinates using Haversine formula.
    """

    earth_radius = 6371

    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        sin(dlat / 2) ** 2
        + cos(lat1)
        * cos(lat2)
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(
        sqrt(a),
        sqrt(1 - a)
    )

    return earth_radius * c


@router.post("/generate-route")
def generate_route(
    route: RouteRequest
):

    distance = calculate_distance(
        route.origin_latitude,
        route.origin_longitude,
        route.destination_latitude,
        route.destination_longitude
    )

    # Approximate average speed for a relief vehicle
    average_speed = 40

    estimated_time_hours = (
        distance / average_speed
        if distance > 0
        else 0
    )

    estimated_minutes = round(
        estimated_time_hours * 60
    )

    # Generate logical route stages
    stages = [
        {
            "stage": 1,
            "name": "Dispatch",
            "location": route.origin,
            "status": "Completed"
        },
        {
            "stage": 2,
            "name": "En Route",
            "location": "Relief Corridor",
            "status": "In Progress"
        },
        {
            "stage": 3,
            "name": "Arrival",
            "location": route.destination,
            "status": "Pending"
        },
        {
            "stage": 4,
            "name": "Relief Delivery",
            "location": route.destination,
            "status": "Pending"
        }
    ]

    # Simple logistics recommendation
    if distance <= 25:
        route_priority = "Immediate"
    elif distance <= 100:
        route_priority = "High"
    else:
        route_priority = "Planned"

    return {
        "success": True,
        "route": {
            "origin": route.origin,
            "destination": route.destination,
            "distance_km": round(distance, 2),
            "estimated_time_minutes":
                estimated_minutes,
            "estimated_time":
                f"{estimated_minutes // 60}h "
                f"{estimated_minutes % 60}m",
            "vehicle_type":
                route.vehicle_type,
            "cargo":
                route.cargo,
            "priority":
                route_priority,
            "status":
                "Route Generated",
            "stages":
                stages
        }
    }


@router.get("/status")
def logistics_status():

    return {
        "success": True,
        "service": "Logistics Route Engine",
        "status": "Online",
        "routing_method": "Haversine Distance Engine"
    }