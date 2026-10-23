import { useState } from "react";

import {
    Route,
    MapPin,
    Truck,
    Package,
    Clock,
    Navigation,
    CheckCircle,
    RefreshCw,
    AlertTriangle
} from "lucide-react";

import { API_URL } from "../services/api";


function Logistics() {

    const [form, setForm] = useState({
        origin: "Coimbatore Warehouse",
        destination: "Coimbatore Relief Camp",
        origin_latitude: 11.0168,
        origin_longitude: 76.9558,
        destination_latitude: 11.0183,
        destination_longitude: 76.9725,
        vehicle_type: "Relief Truck",
        cargo: "Food and Water"
    });

    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    function handleChange(event) {

        const {
            name,
            value
        } = event.target;

        setForm({
            ...form,
            [name]:
                name.includes("latitude") ||
                name.includes("longitude")
                    ? Number(value)
                    : value
        });
    }


    async function generateRoute() {

        try {

            setLoading(true);
            setError("");
            setRoute(null);

            const response = await fetch(
                `${API_URL}/logistics/generate-route`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(form)
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Unable to generate route"
                );
            }

            setRoute(data.route);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);
        }
    }


    return (
        <div className="page">

            <div className="page-header">

                <div>

                    <h1>
                        Logistics Command
                    </h1>

                    <p>
                        Plan and optimize emergency
                        relief transportation routes.
                    </p>

                </div>

                <div className="status-badge status-available">
                    <Navigation size={16} />
                    Routing Engine Online
                </div>

            </div>


            {error && (

                <div className="error-banner">

                    <AlertTriangle size={18} />

                    {error}

                </div>

            )}


            <div className="logistics-layout">


                {/* ROUTE PLANNER */}

                <div className="card logistics-planner">

                    <div className="card-header">

                        <div>

                            <h2>
                                <Route size={21} />
                                Route Planner
                            </h2>

                            <p>
                                Enter the origin and
                                destination for the
                                relief operation.
                            </p>

                        </div>

                    </div>


                    <div className="form-grid">

                        <div className="form-group">

                            <label>
                                Origin
                            </label>

                            <div className="input-icon">

                                <MapPin size={17} />

                                <input
                                    name="origin"
                                    value={form.origin}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                Destination
                            </label>

                            <div className="input-icon">

                                <MapPin size={17} />

                                <input
                                    name="destination"
                                    value={form.destination}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                Origin Latitude
                            </label>

                            <input
                                type="number"
                                step="any"
                                name="origin_latitude"
                                value={
                                    form.origin_latitude
                                }
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Origin Longitude
                            </label>

                            <input
                                type="number"
                                step="any"
                                name="origin_longitude"
                                value={
                                    form.origin_longitude
                                }
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Destination Latitude
                            </label>

                            <input
                                type="number"
                                step="any"
                                name="destination_latitude"
                                value={
                                    form.destination_latitude
                                }
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Destination Longitude
                            </label>

                            <input
                                type="number"
                                step="any"
                                name="destination_longitude"
                                value={
                                    form.destination_longitude
                                }
                                onChange={handleChange}
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Vehicle Type
                            </label>

                            <select
                                name="vehicle_type"
                                value={
                                    form.vehicle_type
                                }
                                onChange={handleChange}
                            >

                                <option>
                                    Relief Truck
                                </option>

                                <option>
                                    Ambulance
                                </option>

                                <option>
                                    Supply Van
                                </option>

                                <option>
                                    Water Tanker
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Cargo
                            </label>

                            <input
                                name="cargo"
                                value={form.cargo}
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    <button
                        className="primary-button logistics-generate"
                        onClick={generateRoute}
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <RefreshCw
                                    size={18}
                                    className="spin"
                                />

                                Calculating Route...
                            </>
                        ) : (
                            <>
                                <Route size={18} />

                                Generate Relief Route
                            </>
                        )}

                    </button>

                </div>


                {/* ROUTE RESULT */}

                <div className="card route-result">

                    {!route ? (

                        <div className="module-placeholder">

                            <Route size={40} />

                            <h2>
                                No Route Generated
                            </h2>

                            <p>
                                Enter the operation
                                details and generate
                                a route.
                            </p>

                        </div>

                    ) : (

                        <>

                            <div className="route-result-header">

                                <div>

                                    <span className="request-label">
                                        ROUTE GENERATED
                                    </span>

                                    <h2>
                                        {route.origin}
                                        {" → "}
                                        {route.destination}
                                    </h2>

                                </div>

                                <div className="status-badge status-available">
                                    <CheckCircle size={16} />
                                    {route.status}
                                </div>

                            </div>


                            <div className="route-metrics">

                                <div className="route-metric">

                                    <Route size={22} />

                                    <span>
                                        Distance
                                    </span>

                                    <strong>
                                        {route.distance_km}
                                        {" km"}
                                    </strong>

                                </div>


                                <div className="route-metric">

                                    <Clock size={22} />

                                    <span>
                                        Estimated Time
                                    </span>

                                    <strong>
                                        {route.estimated_time}
                                    </strong>

                                </div>


                                <div className="route-metric">

                                    <Truck size={22} />

                                    <span>
                                        Vehicle
                                    </span>

                                    <strong>
                                        {route.vehicle_type}
                                    </strong>

                                </div>


                                <div className="route-metric">

                                    <Package size={22} />

                                    <span>
                                        Cargo
                                    </span>

                                    <strong>
                                        {route.cargo}
                                    </strong>

                                </div>

                            </div>


                            <div className="route-map-preview">

                                <div className="route-line"></div>

                                <div className="route-point start">
                                    <MapPin size={20} />
                                    <span>
                                        {route.origin}
                                    </span>
                                </div>

                                <div className="route-point end">
                                    <MapPin size={20} />
                                    <span>
                                        {route.destination}
                                    </span>
                                </div>

                                <div className="route-truck">
                                    <Truck size={24} />
                                </div>

                            </div>


                            <div className="route-timeline">

                                <h3>
                                    Operation Stages
                                </h3>

                                {route.stages.map(
                                    (stage) => (

                                        <div
                                            className="route-stage"
                                            key={
                                                stage.stage
                                            }
                                        >

                                            <div className="stage-number">
                                                {stage.stage}
                                            </div>

                                            <div className="stage-content">

                                                <strong>
                                                    {stage.name}
                                                </strong>

                                                <span>
                                                    {stage.location}
                                                </span>

                                            </div>

                                            <span
                                                className={
                                                    stage.status ===
                                                    "Completed"
                                                        ? "status-badge status-available"
                                                        : stage.status ===
                                                          "In Progress"
                                                        ? "status-badge status-progress"
                                                        : "status-badge"
                                                }
                                            >
                                                {stage.status}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </>

                    )}

                </div>

            </div>

        </div>
    );
}


export default Logistics;