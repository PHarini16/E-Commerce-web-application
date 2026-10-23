from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import ReliefRequest, Donation


router = APIRouter(
    prefix="/allocation",
    tags=["AI Allocation"]
)


def calculate_match_score(
    request,
    donation
):

    score = 0


    # Location matching
    if (
        request.location.strip().lower()
        ==
        donation.location.strip().lower()
    ):
        score += 30


    # Resource matching
    request_resources = []

    if request.food_required > 0:
        request_resources.append("Food")

    if request.water_required > 0:
        request_resources.append("Water")

    if request.medicine_required > 0:
        request_resources.append("Medicine")


    if donation.resource_type in request_resources:
        score += 30


    # Urgency
    urgency_scores = {
        "Critical": 25,
        "High": 20,
        "Medium": 10,
        "Low": 5
    }

    score += urgency_scores.get(
        request.urgency,
        5
    )


    # Quantity
    if donation.quantity >= 500:
        score += 15

    elif donation.quantity >= 200:
        score += 10

    elif donation.quantity >= 50:
        score += 5


    return min(score, 100)


@router.get("/recommendations")
def get_recommendations(
    db: Session = Depends(get_db)
):

    requests = (
        db.query(ReliefRequest)
        .filter(
            ReliefRequest.status == "Pending"
        )
        .all()
    )

    donations = (
        db.query(Donation)
        .filter(
            Donation.status == "Available"
        )
        .all()
    )


    recommendations = []


    for request in requests:

        matches = []


        for donation in donations:

            score = calculate_match_score(
                request,
                donation
            )

            if score >= 40:

                matches.append({
                    "donation_id":
                        donation.id,

                    "donor_name":
                        donation.donor_name,

                    "resource_type":
                        donation.resource_type,

                    "quantity":
                        donation.quantity,

                    "location":
                        donation.location,

                    "match_score":
                        score
                })


        matches.sort(
            key=lambda x:
                x["match_score"],
            reverse=True
        )


        recommendations.append({

            "request_id":
                request.id,

            "request_location":
                request.location,

            "people_affected":
                request.people_affected,

            "urgency":
                request.urgency,

            "priority_score":
                request.priority_score,

            "recommended_donations":
                matches[:5]

        })


    return {
        "success": True,
        "recommendations":
            recommendations
    }