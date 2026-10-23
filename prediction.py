from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import ReliefRequest, Resource


router = APIRouter(
    prefix="/prediction",
    tags=["Shortage Prediction"]
)


@router.get("/shortages")
def predict_shortages(
    db: Session = Depends(get_db)
):

    requests = (
        db.query(ReliefRequest)
        .filter(
            ReliefRequest.status == "Pending"
        )
        .all()
    )

    resources = (
        db.query(Resource)
        .filter(
            Resource.status == "Available"
        )
        .all()
    )


    total_food_demand = sum(
        request.food_required
        for request in requests
    )

    total_water_demand = sum(
        request.water_required
        for request in requests
    )

    total_medicine_demand = sum(
        request.medicine_required
        for request in requests
    )


    total_food_supply = sum(
        resource.quantity
        for resource in resources
        if resource.category.lower() == "food"
    )

    total_water_supply = sum(
        resource.quantity
        for resource in resources
        if resource.category.lower() == "water"
    )

    total_medicine_supply = sum(
        resource.quantity
        for resource in resources
        if resource.category.lower() == "medicine"
    )


    resource_data = [
        {
            "resource": "Food",
            "demand": total_food_demand,
            "supply": total_food_supply
        },
        {
            "resource": "Water",
            "demand": total_water_demand,
            "supply": total_water_supply
        },
        {
            "resource": "Medicine",
            "demand": total_medicine_demand,
            "supply": total_medicine_supply
        }
    ]


    predictions = []


    for item in resource_data:

        demand = item["demand"]
        supply = item["supply"]


        if demand == 0:

            shortage_percentage = 0

        else:

            shortage_percentage = (
                max(demand - supply, 0)
                / demand
            ) * 100


        if shortage_percentage >= 50:

            risk = "Critical"

        elif shortage_percentage >= 25:

            risk = "High"

        elif shortage_percentage > 0:

            risk = "Medium"

        else:

            risk = "Low"


        if demand > supply:

            shortage_quantity = (
                demand - supply
            )

        else:

            shortage_quantity = 0


        predictions.append({

            "resource":
                item["resource"],

            "current_supply":
                supply,

            "current_demand":
                demand,

            "shortage_quantity":
                shortage_quantity,

            "shortage_percentage":
                round(
                    shortage_percentage,
                    2
                ),

            "risk":
                risk

        })


    return {

        "success": True,

        "predictions":
            predictions

    }