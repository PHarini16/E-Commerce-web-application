from database import SessionLocal
from models import Camp, Warehouse, DisasterZone, Vehicle


db = SessionLocal()


# ---------------------------------------------------------
# DISASTER ZONES
# ---------------------------------------------------------

disaster_zones = [
    DisasterZone(
        name="Coimbatore Flood Zone",
        disaster_type="Flood",
        severity="Critical",
        latitude=11.0168,
        longitude=76.9558
    ),

    DisasterZone(
        name="Mettupalayam Flood Zone",
        disaster_type="Flood",
        severity="High",
        latitude=11.3000,
        longitude=76.9400
    ),

    DisasterZone(
        name="Pollachi Emergency Zone",
        disaster_type="Storm",
        severity="Medium",
        latitude=10.6580,
        longitude=77.0080
    )
]


# ---------------------------------------------------------
# RELIEF CAMPS
# ---------------------------------------------------------

camps = [
    Camp(
        name="Coimbatore Central Relief Camp",
        latitude=11.0200,
        longitude=76.9700,
        population=350
    ),

    Camp(
        name="Mettupalayam Relief Camp",
        latitude=11.3050,
        longitude=76.9500,
        population=220
    ),

    Camp(
        name="Pollachi Relief Camp",
        latitude=10.6650,
        longitude=77.0150,
        population=180
    )
]


# ---------------------------------------------------------
# WAREHOUSES
# ---------------------------------------------------------

warehouses = [
    Warehouse(
        name="Coimbatore Main Relief Warehouse",
        latitude=11.0350,
        longitude=76.9700
    ),

    Warehouse(
        name="Mettupalayam Emergency Warehouse",
        latitude=11.3100,
        longitude=76.9450
    )
]


# ---------------------------------------------------------
# VEHICLES
# ---------------------------------------------------------

vehicles = [
    Vehicle(
        vehicle_number="TN-38-DR-101",
        vehicle_type="Relief Truck",
        status="En Route",
        latitude=11.0350,
        longitude=76.9700
    ),

    Vehicle(
        vehicle_number="TN-38-DR-102",
        vehicle_type="Water Tanker",
        status="En Route",
        latitude=11.0600,
        longitude=76.9800
    ),

    Vehicle(
        vehicle_number="TN-38-DR-103",
        vehicle_type="Medical Van",
        status="Available",
        latitude=11.0100,
        longitude=76.9500
    )
]


# ---------------------------------------------------------
# INSERT DATA
# ---------------------------------------------------------

db.add_all(disaster_zones)
db.add_all(camps)
db.add_all(warehouses)
db.add_all(vehicles)

db.commit()

db.close()


print("====================================")
print(" Disaster Map Data Seeded")
print("====================================")
print("3 Disaster Zones")
print("3 Relief Camps")
print("2 Warehouses")
print("3 Vehicles")
print("====================================")