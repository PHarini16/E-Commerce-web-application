import {
    useEffect,
    useState
} from "react";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle,
    Polyline
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import {
    MapPin,
    RefreshCw,
    AlertTriangle,
    Package,
    Truck,
    Building2
} from "lucide-react";

const API_URL = "http://127.0.0.1:8000";


// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png"
});


// Different marker icons
const createIcon = (emoji) =>
    L.divIcon({
        className: "custom-map-marker",

        html: `
            <div class="map-marker-icon">
                ${emoji}
            </div>
        `,

        iconSize: [38, 38],
        iconAnchor: [19, 19]
    });


const icons = {
    disaster: createIcon("⚠️"),
    camp: createIcon("⛺"),
    warehouse: createIcon("🏭"),
    supplier: createIcon("🏢"),
    vehicle: createIcon("🚚"),
    request: createIcon("📍")
};


function DisasterMap() {

    const [data, setData] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    async function loadMapData() {

        try {

            setLoading(true);
            setError("");

            const response =
                await fetch(
                    `${API_URL}/map/overview`
                );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result.detail ||
                    "Unable to load map data"
                );
            }

            setData(result);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);
        }
    }


    useEffect(() => {
        loadMapData();
    }, []);


    // Coimbatore center
    const mapCenter = [
        11.0168,
        76.9558
    ];


    if (loading) {

        return (
            <div className="page-container">

                <div className="page-header">

                    <div>
                        <h1>
                            Disaster Operations Map
                        </h1>

                        <p>
                            Loading live disaster
                            operations data...
                        </p>
                    </div>

                </div>

                <div className="loading-state">
                    Loading map...
                </div>

            </div>
        );
    }


    return (

        <div className="page-container disaster-map-page">

            {/* HEADER */}

            <div className="page-header">

                <div>

                    <div className="page-title-row">

                        <MapPin size={28} />

                        <h1>
                            Disaster Operations Map
                        </h1>

                    </div>

                    <p>
                        Real-time visualization of
                        disaster relief operations
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={loadMapData}
                >

                    <RefreshCw size={17} />

                    Refresh Map

                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {/* STATISTICS */}

            <div className="map-statistics">

                <div className="map-stat-card">

                    <AlertTriangle size={22} />

                    <div>

                        <strong>
                            {data?.disaster_zones?.length || 0}
                        </strong>

                        <span>
                            Disaster Zones
                        </span>

                    </div>

                </div>


                <div className="map-stat-card">

                    <Package size={22} />

                    <div>

                        <strong>
                            {data?.requests?.length || 0}
                        </strong>

                        <span>
                            Relief Requests
                        </span>

                    </div>

                </div>


                <div className="map-stat-card">

                    <Truck size={22} />

                    <div>

                        <strong>
                            {data?.vehicles?.length || 0}
                        </strong>

                        <span>
                            Active Vehicles
                        </span>

                    </div>

                </div>


                <div className="map-stat-card">

                    <Building2 size={22} />

                    <div>

                        <strong>
                            {data?.suppliers?.length || 0}
                        </strong>

                        <span>
                            Suppliers
                        </span>

                    </div>

                </div>

            </div>


            {/* MAP */}

            <div className="interactive-map-card">

                <MapContainer
                    center={mapCenter}
                    zoom={10}
                    scrollWheelZoom={true}
                    className="interactive-leaflet-map"
                >

                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />


                    {/* DISASTER ZONES */}

                    {data?.disaster_zones?.map(
                        (zone) => (

                            <Circle
                                key={`zone-${zone.id}`}
                                center={[
                                    zone.latitude,
                                    zone.longitude
                                ]}
                                radius={3000}
                                pathOptions={{
                                    color: "red",
                                    fillColor: "red",
                                    fillOpacity: 0.18
                                }}
                            >

                                <Popup>

                                    <strong>
                                        ⚠️ {zone.name}
                                    </strong>

                                    <br />

                                    Disaster:
                                    {" "}
                                    {zone.disaster_type}

                                    <br />

                                    Severity:
                                    {" "}
                                    {zone.severity}

                                </Popup>

                            </Circle>

                        )
                    )}


                    {/* DISASTER ZONE MARKERS */}

                    {data?.disaster_zones?.map(
                        (zone) => (

                            <Marker
                                key={`zone-marker-${zone.id}`}
                                position={[
                                    zone.latitude,
                                    zone.longitude
                                ]}
                                icon={icons.disaster}
                            >

                                <Popup>

                                    <strong>
                                        {zone.name}
                                    </strong>

                                    <br />

                                    Type:
                                    {" "}
                                    {zone.disaster_type}

                                    <br />

                                    Severity:
                                    {" "}
                                    {zone.severity}

                                </Popup>

                            </Marker>

                        )
                    )}


                    {/* CAMPS */}

                    {data?.camps?.map(
                        (camp) => (

                            <Marker
                                key={`camp-${camp.id}`}
                                position={[
                                    camp.latitude,
                                    camp.longitude
                                ]}
                                icon={icons.camp}
                            >

                                <Popup>

                                    <strong>
                                        ⛺ {camp.name}
                                    </strong>

                                    <br />

                                    Population:
                                    {" "}
                                    {camp.population}

                                </Popup>

                            </Marker>

                        )
                    )}


                    {/* WAREHOUSES */}

                    {data?.warehouses?.map(
                        (warehouse) => (

                            <Marker
                                key={`warehouse-${warehouse.id}`}
                                position={[
                                    warehouse.latitude,
                                    warehouse.longitude
                                ]}
                                icon={icons.warehouse}
                            >

                                <Popup>

                                    <strong>
                                        🏭 {warehouse.name}
                                    </strong>

                                    <br />

                                    Relief warehouse

                                </Popup>

                            </Marker>

                        )
                    )}


                    {/* SUPPLIERS */}

                    {data?.suppliers?.map(
                        (supplier) => (

                            <Marker
                                key={`supplier-${supplier.id}`}
                                position={[
                                    11.0168,
                                    76.9558
                                ]}
                                icon={icons.supplier}
                            >

                                <Popup>

                                    <strong>
                                        🏢 {supplier.name}
                                    </strong>

                                    <br />

                                    Location:
                                    {" "}
                                    {supplier.location}

                                    <br />

                                    Resource:
                                    {" "}
                                    {supplier.resource_type}

                                    <br />

                                    Verification:
                                    {" "}
                                    {supplier.verification_status}

                                </Popup>

                            </Marker>

                        )
                    )}


                    {/* VEHICLES */}

                    {data?.vehicles?.map(
                        (vehicle) => (

                            <Marker
                                key={`vehicle-${vehicle.id}`}
                                position={[
                                    vehicle.latitude,
                                    vehicle.longitude
                                ]}
                                icon={icons.vehicle}
                            >

                                <Popup>

                                    <strong>
                                        🚚 {vehicle.vehicle_number}
                                    </strong>

                                    <br />

                                    Type:
                                    {" "}
                                    {vehicle.vehicle_type}

                                    <br />

                                    Status:
                                    {" "}
                                    {vehicle.status}

                                </Popup>

                            </Marker>

                        )
                    )}


                    {/* RELIEF REQUESTS */}

                    {data?.requests?.map(
                        (request) => (

                            <Marker
                                key={`request-${request.id}`}
                                position={mapCenter}
                                icon={icons.request}
                            >

                                <Popup>

                                    <strong>
                                        📍 Relief Request #{request.id}
                                    </strong>

                                    <br />

                                    Location:
                                    {" "}
                                    {request.location}

                                    <br />

                                    People affected:
                                    {" "}
                                    {request.people_affected}

                                    <br />

                                    Urgency:
                                    {" "}
                                    {request.urgency}

                                    <br />

                                    Priority:
                                    {" "}
                                    {request.priority_score}

                                </Popup>

                            </Marker>

                        )
                    )}


                    {/* DEMO ROUTE */}

                    <Polyline
                        positions={[
                            [11.0168, 76.9558],
                            [11.0500, 76.9800],
                            [11.1000, 77.0000]
                        ]}
                        pathOptions={{
                            color: "#2563eb",
                            weight: 5,
                            dashArray: "10 10"
                        }}
                    />

                </MapContainer>


                {/* LEGEND */}

                <div className="map-legend">

                    <h3>
                        Map Legend
                    </h3>

                    <div>
                        ⚠️ Disaster Zone
                    </div>

                    <div>
                        ⛺ Relief Camp
                    </div>

                    <div>
                        🏭 Warehouse
                    </div>

                    <div>
                        🏢 Supplier
                    </div>

                    <div>
                        🚚 Relief Vehicle
                    </div>

                    <div>
                        📍 Relief Request
                    </div>

                </div>

            </div>

        </div>
    );
}


export default DisasterMap;