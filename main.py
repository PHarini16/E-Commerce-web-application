from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.orm import Session

from database import engine, Base, SessionLocal

from auth import router as auth_router
from routes import router as requests_router
from resources import router as resources_router
from donations import router as donations_router
from allocation import router as allocation_router
from prediction import router as prediction_router
from logistics import router as logistics_router
from deliveries import router as deliveries_router
from suppliers import router as suppliers_router
from verification import router as verification_router
from map_data import router as map_router

from models import (
    ReliefRequest,
    Resource,
    Donation,
    Delivery,
    Vehicle,
    Camp,
    Warehouse,
    DisasterZone,
    Supplier
)

import models


# ==================================================
# CREATE DATABASE TABLES
# ==================================================

Base.metadata.create_all(bind=engine)


# ==================================================
# FASTAPI
# ==================================================

app = FastAPI(
    title="Disaster Relief Command Centre",
    description="AI-powered disaster relief management system",
    version="1.0.0"
)


# ==================================================
# CORS
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================================================
# ROUTERS
# ==================================================

app.include_router(auth_router)
app.include_router(requests_router)
app.include_router(resources_router)
app.include_router(donations_router)
app.include_router(allocation_router)
app.include_router(prediction_router)
app.include_router(logistics_router)
app.include_router(deliveries_router)
app.include_router(suppliers_router)
app.include_router(verification_router)
app.include_router(map_router)


# ==================================================
# ROOT
# ==================================================

@app.get("/")
def root():

    return {
        "message":
            "Disaster Relief Command Centre API is running",

        "status":
            "online"
    }


# ==================================================
# HEALTH
# ==================================================

@app.get("/health")
def health():

    return {
        "status":
            "healthy",

        "service":
            "disaster-relief-backend"
    }


# ==================================================
# DATABASE TEST
# ==================================================

@app.get("/database")
def database_test():

    return {
        "database":
            "SQLite",

        "status":
            "connected",

        "message":
            "Database tables created successfully"
    }


# ==================================================
# DASHBOARD
# ==================================================

@app.get("/dashboard")
def dashboard():

    db: Session = SessionLocal()

    try:

        # --------------------------------------------------
        # LOAD DATA
        # --------------------------------------------------

        requests = (
            db.query(ReliefRequest)
            .order_by(
                ReliefRequest.id.desc()
            )
            .all()
        )

        resources = (
            db.query(Resource)
            .all()
        )

        donations = (
            db.query(Donation)
            .all()
        )

        deliveries = (
            db.query(Delivery)
            .order_by(
                Delivery.id.desc()
            )
            .all()
        )

        vehicles = (
            db.query(Vehicle)
            .all()
        )

        camps = (
            db.query(Camp)
            .all()
        )

        warehouses = (
            db.query(Warehouse)
            .all()
        )

        disaster_zones = (
            db.query(DisasterZone)
            .all()
        )

        suppliers = (
            db.query(Supplier)
            .all()
        )


        # --------------------------------------------------
        # REQUEST STATISTICS
        # --------------------------------------------------

        total_requests = len(requests)

        critical_requests = sum(
            1
            for request in requests
            if request.urgency == "Critical"
        )

        high_priority_requests = sum(
            1
            for request in requests
            if request.urgency == "High"
        )

        total_people_affected = sum(
            request.people_affected
            for request in requests
        )

        pending_requests = sum(
            1
            for request in requests
            if request.status == "Pending"
        )

        allocated_requests = sum(
            1
            for request in requests
            if request.status == "Allocated"
        )


        # --------------------------------------------------
        # RESOURCE STATISTICS
        # --------------------------------------------------

        total_resources = len(resources)

        total_resource_quantity = sum(
            resource.quantity
            for resource in resources
        )

        available_resources = sum(
            resource.quantity
            for resource in resources
            if resource.status == "Available"
        )


        # --------------------------------------------------
        # DONATION STATISTICS
        # --------------------------------------------------

        total_donations = len(donations)

        available_donations = sum(
            1
            for donation in donations
            if donation.status == "Available"
        )

        allocated_donations = sum(
            1
            for donation in donations
            if donation.status == "Allocated"
        )


        # --------------------------------------------------
        # DELIVERY STATISTICS
        # --------------------------------------------------

        total_deliveries = len(deliveries)

        active_deliveries = sum(
            1
            for delivery in deliveries
            if delivery.status
            in [
                "Allocated",
                "Packed",
                "Dispatched",
                "In Transit",
                "Arrived"
            ]
        )

        delivered_count = sum(
            1
            for delivery in deliveries
            if delivery.status == "Delivered"
        )

        in_transit_count = sum(
            1
            for delivery in deliveries
            if delivery.status == "In Transit"
        )


        # --------------------------------------------------
        # VEHICLE STATISTICS
        # --------------------------------------------------

        total_vehicles = len(vehicles)

        active_vehicles = sum(
            1
            for vehicle in vehicles
            if vehicle.status
            in [
                "En Route",
                "In Transit",
                "Dispatched"
            ]
        )


        # --------------------------------------------------
        # SUPPLIER STATISTICS
        # --------------------------------------------------

        total_suppliers = len(suppliers)

        verified_suppliers = sum(
            1
            for supplier in suppliers
            if supplier.verification_status
            == "Verified"
        )


        # --------------------------------------------------
        # DISASTER STATISTICS
        # --------------------------------------------------

        total_disaster_zones = len(
            disaster_zones
        )

        critical_zones = sum(
            1
            for zone in disaster_zones
            if zone.severity == "Critical"
        )

        high_zones = sum(
            1
            for zone in disaster_zones
            if zone.severity == "High"
        )


        # --------------------------------------------------
        # RESOURCE BREAKDOWN
        # --------------------------------------------------

        resource_breakdown = {}

        for resource in resources:

            category = resource.category

            if category not in resource_breakdown:

                resource_breakdown[category] = {
                    "quantity": 0,
                    "available": 0
                }

            resource_breakdown[
                category
            ]["quantity"] += resource.quantity

            if resource.status == "Available":

                resource_breakdown[
                    category
                ]["available"] += resource.quantity


        # --------------------------------------------------
        # RECENT REQUESTS
        # --------------------------------------------------

        recent_requests = [

            {
                "id":
                    request.id,

                "location":
                    request.location,

                "people_affected":
                    request.people_affected,

                "urgency":
                    request.urgency,

                "priority_score":
                    request.priority_score,

                "status":
                    request.status
            }

            for request in requests[:5]
        ]


        # --------------------------------------------------
        # ACTIVE DELIVERIES
        # --------------------------------------------------

        active_delivery_data = [

            {
                "id":
                    delivery.id,

                "origin":
                    delivery.origin,

                "destination":
                    delivery.destination,

                "vehicle":
                    delivery.vehicle,

                "cargo":
                    delivery.cargo,

                "status":
                    delivery.status,

                "progress":
                    delivery.progress
            }

            for delivery in deliveries
            if delivery.status != "Delivered"
        ][:5]


        # --------------------------------------------------
        # CRITICAL ALERTS
        # --------------------------------------------------

        alerts = []


        for request in requests:

            if request.urgency == "Critical":

                alerts.append({
                    "type":
                        "Critical Request",

                    "message":
                        (
                            f"{request.people_affected} "
                            f"people affected at "
                            f"{request.location}"
                        ),

                    "priority":
                        request.priority_score
                })


        # --------------------------------------------------
        # DASHBOARD RESPONSE
        # --------------------------------------------------

        return {

            "success":
                True,

            "system_status":
                "Operational",

            "statistics": {

                "requests":
                    total_requests,

                "critical_requests":
                    critical_requests,

                "high_priority_requests":
                    high_priority_requests,

                "pending_requests":
                    pending_requests,

                "allocated_requests":
                    allocated_requests,

                "people_affected":
                    total_people_affected,

                "resources":
                    total_resources,

                "resource_quantity":
                    total_resource_quantity,

                "available_resources":
                    available_resources,

                "donations":
                    total_donations,

                "available_donations":
                    available_donations,

                "allocated_donations":
                    allocated_donations,

                "deliveries":
                    total_deliveries,

                "active_deliveries":
                    active_deliveries,

                "delivered":
                    delivered_count,

                "in_transit":
                    in_transit_count,

                "vehicles":
                    total_vehicles,

                "active_vehicles":
                    active_vehicles,

                "suppliers":
                    total_suppliers,

                "verified_suppliers":
                    verified_suppliers,

                "disaster_zones":
                    total_disaster_zones,

                "critical_zones":
                    critical_zones,

                "high_zones":
                    high_zones,

                "relief_camps":
                    len(camps),

                "warehouses":
                    len(warehouses)
            },

            "resource_breakdown":
                resource_breakdown,

            "recent_requests":
                recent_requests,

            "active_deliveries":
                active_delivery_data,

            "alerts":
                alerts
        }

    finally:

        db.close()