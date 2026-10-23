import { useEffect, useState } from "react";

import {
    Truck,
    Package,
    MapPin,
    Clock,
    CheckCircle,
    RefreshCw,
    AlertTriangle,
    Navigation,
    Plus,
    X
} from "lucide-react";

import { API_URL } from "../services/api";


const STATUSES = [
    "Requested",
    "Allocated",
    "Packed",
    "Dispatched",
    "In Transit",
    "Arrived",
    "Delivered"
];


function Deliveries() {

    const [deliveries, setDeliveries] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [creating, setCreating] = useState(false);

    const [form, setForm] = useState({
        origin: "Coimbatore Warehouse",
        destination: "Coimbatore Relief Camp",
        vehicle: "TN-38-AB-1234",
        cargo: "Food and Water"
    });


    async function loadDeliveries() {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/deliveries/`
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Unable to load deliveries"
                );
            }

            setDeliveries(data);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {
        loadDeliveries();
    }, []);


    function handleChange(event) {

        const {
            name,
            value
        } = event.target;

        setForm({
            ...form,
            [name]: value
        });
    }


    async function createDelivery(event) {

        event.preventDefault();

        try {

            setCreating(true);
            setError("");

            const response = await fetch(
                `${API_URL}/deliveries/`,
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
                    "Unable to create delivery"
                );

            }

            setShowForm(false);

            setForm({
                origin: "Coimbatore Warehouse",
                destination:
                    "Coimbatore Relief Camp",
                vehicle:
                    "TN-38-AB-1234",
                cargo:
                    "Food and Water"
            });

            await loadDeliveries();

        } catch (err) {

            setError(err.message);

        } finally {

            setCreating(false);

        }
    }


    async function updateStatus(
        deliveryId,
        status
    ) {

        try {

            setError("");

            const response = await fetch(
                `${API_URL}/deliveries/${deliveryId}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Unable to update delivery"
                );

            }

            await loadDeliveries();

        } catch (err) {

            setError(err.message);

        }
    }


    async function deleteDelivery(
        deliveryId
    ) {

        const confirmed =
            window.confirm(
                "Delete this delivery?"
            );

        if (!confirmed) {
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/deliveries/${deliveryId}`,
                {
                    method: "DELETE"
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Unable to delete delivery"
                );

            }

            await loadDeliveries();

        } catch (err) {

            setError(err.message);

        }
    }


    function getStatusClass(status) {

        if (status === "Delivered") {
            return "status-delivered";
        }

        if (
            status === "In Transit" ||
            status === "Dispatched"
        ) {
            return "status-transit";
        }

        if (status === "Arrived") {
            return "status-arrived";
        }

        return "status-pending";
    }


    function getNextStatus(status) {

        const index =
            STATUSES.indexOf(status);

        if (
            index === -1 ||
            index === STATUSES.length - 1
        ) {
            return null;
        }

        return STATUSES[index + 1];
    }


    return (
        <div className="page">

            {/* HEADER */}

            <div className="page-header">

                <div>

                    <h1>
                        Delivery Operations
                    </h1>

                    <p>
                        Track and manage relief
                        deliveries from dispatch
                        to final delivery.
                    </p>

                </div>


                <div className="page-header-actions">

                    <button
                        className="secondary-button"
                        onClick={loadDeliveries}
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>


                    <button
                        className="primary-button"
                        onClick={() =>
                            setShowForm(true)
                        }
                    >
                        <Plus size={17} />
                        New Delivery
                    </button>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="error-banner">

                    <AlertTriangle size={18} />

                    {error}

                </div>

            )}


            {/* SUMMARY */}

            <div className="delivery-summary">

                <div className="delivery-summary-card">

                    <Truck size={23} />

                    <div>

                        <span>
                            Total Deliveries
                        </span>

                        <strong>
                            {deliveries.length}
                        </strong>

                    </div>

                </div>


                <div className="delivery-summary-card">

                    <Navigation size={23} />

                    <div>

                        <span>
                            In Transit
                        </span>

                        <strong>
                            {
                                deliveries.filter(
                                    item =>
                                        item.status ===
                                        "In Transit"
                                ).length
                            }
                        </strong>

                    </div>

                </div>


                <div className="delivery-summary-card">

                    <Clock size={23} />

                    <div>

                        <span>
                            Pending
                        </span>

                        <strong>
                            {
                                deliveries.filter(
                                    item =>
                                        item.status !==
                                        "Delivered"
                                ).length
                            }
                        </strong>

                    </div>

                </div>


                <div className="delivery-summary-card">

                    <CheckCircle size={23} />

                    <div>

                        <span>
                            Delivered
                        </span>

                        <strong>
                            {
                                deliveries.filter(
                                    item =>
                                        item.status ===
                                        "Delivered"
                                ).length
                            }
                        </strong>

                    </div>

                </div>

            </div>


            {/* CREATE FORM */}

            {showForm && (

                <div className="delivery-form-overlay">

                    <div className="delivery-form-modal">

                        <div className="modal-header">

                            <div>

                                <h2>
                                    Create New Delivery
                                </h2>

                                <p>
                                    Register a relief
                                    shipment.
                                </p>

                            </div>


                            <button
                                className="icon-button"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                <X size={20} />
                            </button>

                        </div>


                        <form
                            onSubmit={createDelivery}
                        >

                            <div className="form-grid">

                                <div className="form-group">

                                    <label>
                                        Origin
                                    </label>

                                    <input
                                        name="origin"
                                        value={
                                            form.origin
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Destination
                                    </label>

                                    <input
                                        name="destination"
                                        value={
                                            form.destination
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Vehicle
                                    </label>

                                    <input
                                        name="vehicle"
                                        value={
                                            form.vehicle
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Cargo
                                    </label>

                                    <input
                                        name="cargo"
                                        value={
                                            form.cargo
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() =>
                                        setShowForm(false)
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="primary-button"
                                    disabled={creating}
                                >
                                    {creating
                                        ? "Creating..."
                                        : "Create Delivery"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {/* DELIVERY LIST */}

            {loading ? (

                <div className="module-placeholder">

                    <Truck size={40} />

                    <h2>
                        Loading Deliveries...
                    </h2>

                    <p>
                        Connecting to the delivery
                        management system.
                    </p>

                </div>

            ) : deliveries.length === 0 ? (

                <div className="module-placeholder">

                    <Package size={40} />

                    <h2>
                        No Deliveries Yet
                    </h2>

                    <p>
                        Create a delivery to begin
                        tracking relief transportation.
                    </p>

                    <button
                        className="primary-button"
                        onClick={() =>
                            setShowForm(true)
                        }
                    >
                        <Plus size={17} />
                        Create First Delivery
                    </button>

                </div>

            ) : (

                <div className="delivery-list">

                    {deliveries.map(
                        delivery => {

                            const nextStatus =
                                getNextStatus(
                                    delivery.status
                                );

                            const currentIndex =
                                STATUSES.indexOf(
                                    delivery.status
                                );

                            return (

                                <div
                                    className="delivery-card"
                                    key={
                                        delivery.id
                                    }
                                >

                                    {/* CARD HEADER */}

                                    <div className="delivery-card-header">

                                        <div className="delivery-id">

                                            <div className="delivery-icon">

                                                <Truck
                                                    size={22}
                                                />

                                            </div>

                                            <div>

                                                <span>
                                                    DELIVERY #
                                                    {
                                                        delivery.id
                                                    }
                                                </span>

                                                <h2>
                                                    {
                                                        delivery.vehicle
                                                    }
                                                </h2>

                                            </div>

                                        </div>


                                        <span
                                            className={
                                                `delivery-status ${getStatusClass(
                                                    delivery.status
                                                )}`
                                            }
                                        >
                                            {delivery.status}
                                        </span>

                                    </div>


                                    {/* ROUTE */}

                                    <div className="delivery-route">

                                        <div className="delivery-location">

                                            <div className="location-dot origin-dot"></div>

                                            <div>

                                                <span>
                                                    ORIGIN
                                                </span>

                                                <strong>
                                                    {
                                                        delivery.origin
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        <div className="delivery-route-line">

                                            <Truck
                                                size={18}
                                            />

                                        </div>


                                        <div className="delivery-location">

                                            <div className="location-dot destination-dot"></div>

                                            <div>

                                                <span>
                                                    DESTINATION
                                                </span>

                                                <strong>
                                                    {
                                                        delivery.destination
                                                    }
                                                </strong>

                                            </div>

                                        </div>

                                    </div>


                                    {/* INFO */}

                                    <div className="delivery-info-grid">

                                        <div>

                                            <Package
                                                size={17}
                                            />

                                            <div>

                                                <span>
                                                    Cargo
                                                </span>

                                                <strong>
                                                    {
                                                        delivery.cargo
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        <div>

                                            <Navigation
                                                size={17}
                                            />

                                            <div>

                                                <span>
                                                    Vehicle
                                                </span>

                                                <strong>
                                                    {
                                                        delivery.vehicle
                                                    }
                                                </strong>

                                            </div>

                                        </div>


                                        <div>

                                            <Clock
                                                size={17}
                                            />

                                            <div>

                                                <span>
                                                    Progress
                                                </span>

                                                <strong>
                                                    {
                                                        delivery.progress
                                                    }%
                                                </strong>

                                            </div>

                                        </div>

                                    </div>


                                    {/* PROGRESS */}

                                    <div className="delivery-progress-section">

                                        <div className="progress-label">

                                            <span>
                                                Delivery Progress
                                            </span>

                                            <strong>
                                                {
                                                    delivery.progress
                                                }%
                                            </strong>

                                        </div>


                                        <div className="delivery-progress-bar">

                                            <div
                                                className="delivery-progress-fill"
                                                style={{
                                                    width:
                                                        `${delivery.progress}%`
                                                }}
                                            />

                                        </div>

                                    </div>


                                    {/* TIMELINE */}

                                    <div className="delivery-timeline">

                                        {STATUSES.map(
                                            (
                                                status,
                                                index
                                            ) => {

                                                const completed =
                                                    index <=
                                                    currentIndex;

                                                return (

                                                    <div
                                                        className={
                                                            completed
                                                                ? "timeline-step completed"
                                                                : "timeline-step"
                                                        }
                                                        key={
                                                            status
                                                        }
                                                    >

                                                        <div className="timeline-dot">

                                                            {completed ? (
                                                                <CheckCircle
                                                                    size={15}
                                                                />
                                                            ) : (
                                                                <span>
                                                                    {index + 1}
                                                                </span>
                                                            )}

                                                        </div>

                                                        <span>
                                                            {
                                                                status
                                                            }
                                                        </span>

                                                    </div>

                                                );

                                            }
                                        )}

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="delivery-actions">

                                        {nextStatus && (

                                            <button
                                                className="primary-button"
                                                onClick={() =>
                                                    updateStatus(
                                                        delivery.id,
                                                        nextStatus
                                                    )
                                                }
                                            >

                                                <Navigation
                                                    size={16}
                                                />

                                                Move to{" "}
                                                {
                                                    nextStatus
                                                }

                                            </button>

                                        )}


                                        {delivery.status ===
                                            "Delivered" && (

                                            <div className="delivery-complete">

                                                <CheckCircle
                                                    size={18}
                                                />

                                                Relief successfully
                                                delivered

                                            </div>

                                        )}


                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                deleteDelivery(
                                                    delivery.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>

            )}

        </div>
    );
}


export default Deliveries;