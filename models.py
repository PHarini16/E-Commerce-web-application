from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime
)

from datetime import datetime

from database import Base


# ==================================================
# USERS
# ==================================================

class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    password = Column(
        String,
        nullable=False
    )

    role = Column(
        String,
        nullable=False
    )


# ==================================================
# RELIEF REQUESTS
# ==================================================

class ReliefRequest(Base):

    __tablename__ = "relief_requests"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    location = Column(
        String,
        nullable=False
    )

    people_affected = Column(
        Integer,
        nullable=False
    )

    food_required = Column(
        Float,
        default=0
    )

    water_required = Column(
        Float,
        default=0
    )

    medicine_required = Column(
        Float,
        default=0
    )

    urgency = Column(
        String,
        default="Medium"
    )

    priority_score = Column(
        Float,
        default=0
    )

    status = Column(
        String,
        default="Pending"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# ==================================================
# RESOURCES
# ==================================================

class Resource(Base):

    __tablename__ = "resources"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    category = Column(
        String,
        nullable=False
    )

    quantity = Column(
        Float,
        nullable=False
    )

    location = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default="Available"
    )


# ==================================================
# DONATIONS
# ==================================================

class Donation(Base):

    __tablename__ = "donations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    donor_name = Column(
        String,
        nullable=False
    )

    resource_type = Column(
        String,
        nullable=False
    )

    quantity = Column(
        Float,
        nullable=False
    )

    location = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default="Available"
    )


# ==================================================
# SUPPLIERS
# ==================================================

class Supplier(Base):

    __tablename__ = "suppliers"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    location = Column(
        String,
        nullable=False
    )

    resource_type = Column(
        String,
        nullable=False
    )

    verification_status = Column(
        String,
        default="Pending"
    )


# ==================================================
# DELIVERIES
# ==================================================

class Delivery(Base):

    __tablename__ = "deliveries"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    origin = Column(
        String,
        nullable=False
    )

    destination = Column(
        String,
        nullable=False
    )

    vehicle = Column(
        String,
        nullable=False
    )

    cargo = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default="Preparing"
    )

    progress = Column(
        Float,
        default=0
    )


# ==================================================
# VEHICLES
# ==================================================

class Vehicle(Base):

    __tablename__ = "vehicles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    vehicle_number = Column(
        String,
        unique=True,
        nullable=False
    )

    vehicle_type = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default="Available"
    )

    latitude = Column(
        Float,
        default=11.0168
    )

    longitude = Column(
        Float,
        default=76.9558
    )


# ==================================================
# CAMPS
# ==================================================

class Camp(Base):

    __tablename__ = "camps"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    latitude = Column(
        Float,
        nullable=False
    )

    longitude = Column(
        Float,
        nullable=False
    )

    population = Column(
        Integer,
        default=0
    )


# ==================================================
# WAREHOUSES
# ==================================================

class Warehouse(Base):

    __tablename__ = "warehouses"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    latitude = Column(
        Float,
        nullable=False
    )

    longitude = Column(
        Float,
        nullable=False
    )


# ==================================================
# DISASTER ZONES
# ==================================================

class DisasterZone(Base):

    __tablename__ = "disaster_zones"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    disaster_type = Column(
        String,
        nullable=False
    )

    severity = Column(
        String,
        nullable=False
    )

    latitude = Column(
        Float,
        nullable=False
    )

    longitude = Column(
        Float,
        nullable=False
    )