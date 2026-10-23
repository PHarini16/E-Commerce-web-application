import { useEffect, useState } from "react";

import {
    Activity,
    AlertTriangle,
    Bell,
    CheckCircle,
    Clock,
    MapPin,
    Package,
    RefreshCw,
    Truck,
    Users,
    Waves,
    Navigation,
    Warehouse,
    ShieldCheck,
    Siren,
    Route,
    Boxes
} from "lucide-react";

import { API_URL } from "../services/api";


function Dashboard() {

    const [dashboard, setDashboard] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ============================================================
    // LOAD LIVE DASHBOARD
    // ============================================================

    async function loadDashboard() {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/dashboard`
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Unable to load dashboard"
                );

            }

            setDashboard(data);

        } catch (err) {

            console.error(
                "Dashboard loading error:",
                err
            );

            setError(err.message);

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        loadDashboard();

    }, []);


    // ============================================================
    // LOADING STATE
    // ============================================================

    if (loading && !dashboard) {

        return (

            <div className="page dashboard-page">

                <div className="module-placeholder">

                    <Activity
                        size={40}
                    />

                    <h2>
                        Loading Command Centre...
                    </h2>

                    <p>
                        Connecting to live disaster
                        relief operations.
                    </p>

                </div>

            </div>

        );

    }


    // ============================================================
    // ERROR STATE
    // ============================================================

    if (error && !dashboard) {

        return (

            <div className="page dashboard-page">

                <div className="error-banner">

                    <AlertTriangle size={20} />

                    {error}

                    <button
                        className="secondary-button"
                        onClick={loadDashboard}
                    >
                        <RefreshCw size={16} />
                        Retry
                    </button>

                </div>

            </div>

        );

    }


    const statistics =
        dashboard?.statistics || {};


    const alerts =
        dashboard?.alerts || [];


    const recentRequests =
        dashboard?.recent_requests || [];


    const activeDeliveries =
        dashboard?.active_deliveries || [];


    const resourceBreakdown =
        dashboard?.resource_breakdown || {};


    // ============================================================
    // STATUS HELPERS
    // ============================================================

    function getUrgencyClass(urgency) {

        if (urgency === "Critical") {
            return "critical";
        }

        if (urgency === "High") {
            return "warning";
        }

        return "info";
    }


    function getDeliveryClass(status) {

        if (status === "In Transit") {
            return "transit";
        }

        if (status === "Delivered") {
            return "success";
        }

        return "pending";
    }


    return (

        <div className="page dashboard-page">


            {/* ================================================== */}
            {/* HEADER */}
            {/* ================================================== */}

            <div className="dashboard-hero">

                <div>

                    <div className="live-indicator">

                        <span className="live-dot"></span>

                        SYSTEM ONLINE

                    </div>


                    <h1>
                        Disaster Relief Command Centre
                    </h1>


                    <p>
                        Real-time emergency operations,
                        resource intelligence and response
                        coordination.
                    </p>

                </div>


                <div className="dashboard-header-actions">

                    <div className="dashboard-system-status">

                        <span className="status-online-dot"></span>

                        {dashboard?.system_status ||
                            "Operational"}

                    </div>


                    <button
                        className="refresh-dashboard-button"
                        onClick={loadDashboard}
                        disabled={loading}
                    >

                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "spin"
                                    : ""
                            }
                        />

                        Refresh

                    </button>

                </div>

            </div>


            {/* ================================================== */}
            {/* ERROR */}
            {/* ================================================== */}

            {error && (

                <div className="error-banner">

                    <AlertTriangle size={18} />

                    {error}

                </div>

            )}


            {/* ================================================== */}
            {/* TOP METRICS */}
            {/* ================================================== */}

            <div className="dashboard-metrics">


                {/* REQUESTS */}

                <div className="dashboard-metric-card blue">

                    <div className="metric-top">

                        <div className="dashboard-metric-icon">

                            <AlertTriangle
                                size={22}
                            />

                        </div>

                        <span className="metric-trend">
                            LIVE
                        </span>

                    </div>


                    <div className="metric-number">

                        {
                            statistics.pending_requests
                            ?? 0
                        }

                    </div>


                    <div className="metric-label">

                        Pending Requests

                    </div>


                    <div className="metric-footer">

                        <Activity size={14} />

                        {statistics.requests ?? 0}
                        {" "}
                        total requests

                    </div>

                </div>


                {/* PEOPLE */}

                <div className="dashboard-metric-card purple">

                    <div className="metric-top">

                        <div className="dashboard-metric-icon">

                            <Users size={22} />

                        </div>

                        <span className="metric-trend">
                            PEOPLE
                        </span>

                    </div>


                    <div className="metric-number">

                        {
                            (
                                statistics.people_affected
                                ?? 0
                            ).toLocaleString()
                        }

                    </div>


                    <div className="metric-label">

                        People Affected

                    </div>


                    <div className="metric-footer">

                        <Waves size={14} />

                        Across registered requests

                    </div>

                </div>


                {/* DELIVERIES */}

                <div className="dashboard-metric-card orange">

                    <div className="metric-top">

                        <div className="dashboard-metric-icon">

                            <Truck size={22} />

                        </div>

                        <span className="metric-trend">
                            TRACKING
                        </span>

                    </div>


                    <div className="metric-number">

                        {
                            statistics.active_deliveries
                            ?? 0
                        }

                    </div>


                    <div className="metric-label">

                        Active Deliveries

                    </div>


                    <div className="metric-footer">

                        <Navigation size={14} />

                        {
                            statistics.in_transit
                            ?? 0
                        }
                        {" "}
                        currently in transit

                    </div>

                </div>


                {/* VEHICLES */}

                <div className="dashboard-metric-card green">

                    <div className="metric-top">

                        <div className="dashboard-metric-icon">

                            <Navigation size={22} />

                        </div>

                        <span className="metric-trend">
                            FLEET
                        </span>

                    </div>


                    <div className="metric-number">

                        {
                            statistics.active_vehicles
                            ?? 0
                        }

                    </div>


                    <div className="metric-label">

                        Active Vehicles

                    </div>


                    <div className="metric-footer">

                        <Truck size={14} />

                        {
                            statistics.vehicles
                            ?? 0
                        }
                        {" "}
                        total vehicles

                    </div>

                </div>


                {/* DISASTER ZONES */}

                <div className="dashboard-metric-card red">

                    <div className="metric-top">

                        <div className="dashboard-metric-icon">

                            <Siren size={22} />

                        </div>

                        <span className="metric-trend">
                            ALERT
                        </span>

                    </div>


                    <div className="metric-number">

                        {
                            statistics.critical_zones
                            ?? 0
                        }

                    </div>


                    <div className="metric-label">

                        Critical Zones

                    </div>


                    <div className="metric-footer">

                        <MapPin size={14} />

                        {
                            statistics.disaster_zones
                            ?? 0
                        }
                        {" "}
                        total zones

                    </div>

                </div>

            </div>


            {/* ================================================== */}
            {/* ALERTS + RESOURCE INTELLIGENCE */}
            {/* ================================================== */}

            <div className="dashboard-main-grid">


                {/* ================================================= */}
                {/* CRITICAL ALERTS */}
                {/* ================================================= */}

                <div className="dashboard-alert-card">

                    <div className="section-header">

                        <div>

                            <div className="section-title-row">

                                <Bell size={19} />

                                <h2>
                                    Critical Alerts
                                </h2>

                            </div>

                            <p>
                                Immediate operational
                                attention
                            </p>

                        </div>


                        <span className="alert-count">

                            {
                                statistics.critical_requests
                                ?? 0
                            }

                        </span>

                    </div>


                    <div className="alerts-list">


                        {alerts.length > 0 ? (

                            alerts
                                .slice(0, 5)
                                .map(
                                    (
                                        alert,
                                        index
                                    ) => (

                                        <div
                                            className={
                                                `alert-item ${getUrgencyClass(
                                                    alert.type ===
                                                    "Critical Request"
                                                        ? "Critical"
                                                        : "High"
                                                )}`
                                            }
                                            key={index}
                                        >

                                            <div className="alert-icon">

                                                <AlertTriangle
                                                    size={17}
                                                />

                                            </div>


                                            <div className="alert-content">

                                                <strong>

                                                    {
                                                        alert.type
                                                    }

                                                </strong>


                                                <span>

                                                    {
                                                        alert.message
                                                    }

                                                </span>

                                            </div>

                                        </div>

                                    )
                                )

                        ) : (

                            <div className="no-alerts">

                                <CheckCircle
                                    size={25}
                                />

                                <strong>
                                    No critical alerts
                                </strong>

                                <span>
                                    Current operations
                                    are being monitored.
                                </span>

                            </div>

                        )}


                        {/* HIGH PRIORITY */}

                        {
                            (
                                statistics.high_priority_requests
                                ?? 0
                            ) > 0 && (

                                <div
                                    className=
                                    "alert-item warning"
                                >

                                    <div className="alert-icon">

                                        <Clock
                                            size={17}
                                        />

                                    </div>


                                    <div className="alert-content">

                                        <strong>
                                            High Priority
                                            Requests
                                        </strong>

                                        <span>

                                            {
                                                statistics.high_priority_requests
                                            }
                                            {" "}
                                            request(s)
                                            require attention.

                                        </span>

                                    </div>

                                </div>

                            )
                        }

                    </div>

                </div>


                {/* ================================================= */}
                {/* RESOURCE INTELLIGENCE */}
                {/* ================================================= */}

                <div className="dashboard-resource-card">

                    <div className="section-header">

                        <div>

                            <div className="section-title-row">

                                <Package size={19} />

                                <h2>
                                    Resource Intelligence
                                </h2>

                            </div>

                            <p>
                                Current relief supply
                                availability
                            </p>

                        </div>


                        <span className="resource-total">

                            {
                                (
                                    statistics.available_resources
                                    ?? 0
                                ).toLocaleString()
                            }

                        </span>

                    </div>


                    <div className="resource-list">

                        {
                            Object.keys(
                                resourceBreakdown
                            ).length > 0
                                ? (

                                    Object.entries(
                                        resourceBreakdown
                                    ).map(
                                        (
                                            [
                                                name,
                                                resource
                                            ]
                                        ) => {

                                            const total =
                                                resource.quantity
                                                || 0;

                                            const available =
                                                resource.available
                                                || 0;

                                            const percentage =
                                                total > 0
                                                    ? Math.round(
                                                        (
                                                            available /
                                                            total
                                                        ) * 100
                                                    )
                                                    : 0;

                                            return (

                                                <div
                                                    className=
                                                    "resource-row"
                                                    key={name}
                                                >

                                                    <div
                                                        className=
                                                        "resource-row-header"
                                                    >

                                                        <span>
                                                            {name}
                                                        </span>

                                                        <strong>

                                                            {
                                                                available
                                                            }

                                                        </strong>

                                                    </div>


                                                    <div
                                                        className=
                                                        "resource-progress"
                                                    >

                                                        <div
                                                            className=
                                                            "resource-progress-fill"
                                                            style={{
                                                                width:
                                                                    `${percentage}%`
                                                            }}
                                                        />

                                                    </div>


                                                    <div
                                                        className=
                                                        "resource-row-footer"
                                                    >

                                                        <span>
                                                            Available
                                                        </span>

                                                        <span>
                                                            {
                                                                total
                                                            }
                                                            {" "}
                                                            total
                                                        </span>

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )

                                )
                                : (

                                    <div className="no-alerts">

                                        <Package
                                            size={25}
                                        />

                                        <strong>
                                            No resource data
                                        </strong>

                                        <span>
                                            Resources will
                                            appear here when
                                            registered.
                                        </span>

                                    </div>

                                )
                        }

                    </div>

                </div>

            </div>


            {/* ================================================== */}
            {/* LIVE OPERATIONS */}
            {/* ================================================== */}

            <div className="dashboard-operations-card">

                <div className="section-header">

                    <div>

                        <div className="section-title-row">

                            <Truck size={19} />

                            <h2>
                                Active Relief Operations
                            </h2>

                        </div>

                        <p>
                            Live delivery movements
                            across the response network
                        </p>

                    </div>


                    <span className="live-badge">

                        <span></span>

                        LIVE

                    </span>

                </div>


                {
                    activeDeliveries.length > 0
                        ? (

                            <div className="operations-table">

                                <div className="operations-table-header">

                                    <span>
                                        Delivery
                                    </span>

                                    <span>
                                        Route
                                    </span>

                                    <span>
                                        Vehicle
                                    </span>

                                    <span>
                                        Status
                                    </span>

                                    <span>
                                        Progress
                                    </span>

                                </div>


                                {
                                    activeDeliveries.map(
                                        delivery => (

                                            <div
                                                className=
                                                "operations-table-row"
                                                key={
                                                    delivery.id
                                                }
                                            >

                                                <strong>
                                                    #
                                                    {
                                                        delivery.id
                                                    }
                                                </strong>


                                                <span>

                                                    {
                                                        delivery.origin
                                                    }

                                                    <Route
                                                        size={13}
                                                    />

                                                    {
                                                        delivery.destination
                                                    }

                                                </span>


                                                <span>

                                                    <Truck
                                                        size={15}
                                                    />

                                                    {
                                                        delivery.vehicle
                                                    }

                                                </span>


                                                <span>

                                                    <span
                                                        className={
                                                            `delivery-mini-status ${getDeliveryClass(
                                                                delivery.status
                                                            )}`
                                                        }
                                                    >

                                                        {
                                                            delivery.status
                                                        }

                                                    </span>

                                                </span>


                                                <span>

                                                    <div
                                                        className=
                                                        "mini-progress"
                                                    >

                                                        <div
                                                            className=
                                                            "mini-progress-fill"
                                                            style={{
                                                                width:
                                                                    `${delivery.progress}%`
                                                            }}
                                                        />

                                                    </div>

                                                    <small>
                                                        {
                                                            delivery.progress
                                                        }%
                                                    </small>

                                                </span>

                                            </div>

                                        )
                                    )
                                }

                            </div>

                        )
                        : (

                            <div className="dashboard-empty-state">

                                <Truck size={30} />

                                <strong>
                                    No active deliveries
                                </strong>

                                <span>
                                    Create a delivery from
                                    the AI Allocation module
                                    to see live operations.
                                </span>

                            </div>

                        )
                }

            </div>


            {/* ================================================== */}
            {/* RECENT REQUESTS + SYSTEM OVERVIEW */}
            {/* ================================================== */}

            <div className="dashboard-bottom-grid">


                {/* ================================================= */}
                {/* RECENT REQUESTS */}
                {/* ================================================= */}

                <div className="dashboard-requests-card">

                    <div className="section-header">

                        <div>

                            <div className="section-title-row">

                                <AlertTriangle size={19} />

                                <h2>
                                    Recent Relief Requests
                                </h2>

                            </div>

                            <p>
                                Latest emergency
                                assistance requests
                            </p>

                        </div>

                    </div>


                    <div className="recent-request-list">

                        {
                            recentRequests.length > 0
                                ? (

                                    recentRequests.map(
                                        request => (

                                            <div
                                                className=
                                                "recent-request"
                                                key={
                                                    request.id
                                                }
                                            >

                                                <div
                                                    className={
                                                        `request-urgency-dot ${getUrgencyClass(
                                                            request.urgency
                                                        )}`
                                                    }
                                                ></div>


                                                <div
                                                    className=
                                                    "recent-request-main"
                                                >

                                                    <strong>

                                                        Request #
                                                        {
                                                            request.id
                                                        }

                                                    </strong>

                                                    <span>

                                                        <MapPin
                                                            size={13}
                                                        />

                                                        {
                                                            request.location
                                                        }

                                                    </span>

                                                </div>


                                                <div
                                                    className=
                                                    "recent-request-info"
                                                >

                                                    <strong>

                                                        {
                                                            request.people_affected
                                                        }

                                                    </strong>

                                                    <span>
                                                        people
                                                    </span>

                                                </div>


                                                <div
                                                    className={
                                                        `request-status ${getUrgencyClass(
                                                            request.urgency
                                                        )}`
                                                    }
                                                >

                                                    {
                                                        request.urgency
                                                    }

                                                </div>

                                            </div>

                                        )
                                    )

                                )
                                : (

                                    <div className="dashboard-empty-state">

                                        <AlertTriangle
                                            size={28}
                                        />

                                        <strong>
                                            No relief requests
                                        </strong>

                                    </div>

                                )
                        }

                    </div>

                </div>


                {/* ================================================= */}
                {/* SYSTEM OVERVIEW */}
                {/* ================================================= */}

                <div className="dashboard-system-card">

                    <div className="section-header">

                        <div>

                            <div className="section-title-row">

                                <Activity size={19} />

                                <h2>
                                    System Overview
                                </h2>

                            </div>

                            <p>
                                Current response capacity
                            </p>

                        </div>

                    </div>


                    <div className="system-overview-grid">


                        <div className="system-overview-item">

                            <ShieldCheck size={19} />

                            <div>

                                <strong>
                                    {
                                        statistics.verified_suppliers
                                        ?? 0
                                    }
                                </strong>

                                <span>
                                    Verified Suppliers
                                </span>

                            </div>

                        </div>


                        <div className="system-overview-item">

                            <Warehouse size={19} />

                            <div>

                                <strong>
                                    {
                                        statistics.warehouses
                                        ?? 0
                                    }
                                </strong>

                                <span>
                                    Warehouses
                                </span>

                            </div>

                        </div>


                        <div className="system-overview-item">

                            <Users size={19} />

                            <div>

                                <strong>
                                    {
                                        statistics.relief_camps
                                        ?? 0
                                    }
                                </strong>

                                <span>
                                    Relief Camps
                                </span>

                            </div>

                        </div>


                        <div className="system-overview-item">

                            <Boxes size={19} />

                            <div>

                                <strong>
                                    {
                                        statistics.available_donations
                                        ?? 0
                                    }
                                </strong>

                                <span>
                                    Available Donations
                                </span>

                            </div>

                        </div>


                        <div className="system-overview-item">

                            <CheckCircle size={19} />

                            <div>

                                <strong>
                                    {
                                        statistics.delivered
                                        ?? 0
                                    }
                                </strong>

                                <span>
                                    Deliveries Completed
                                </span>

                            </div>

                        </div>


                        <div className="system-overview-item">

                            <Route size={19} />

                            <div>

                                <strong>
                                    {
                                        statistics.allocated_requests
                                        ?? 0
                                    }
                                </strong>

                                <span>
                                    Requests Allocated
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* ================================================== */}
            {/* MAP LINK */}
            {/* ================================================== */}

            <div className="dashboard-map-preview">

                <div className="dashboard-map-preview-content">

                    <div>

                        <div className="section-title-row">

                            <MapPin size={20} />

                            <h2>
                                Disaster Operations Map
                            </h2>

                        </div>

                        <p>
                            View disaster zones, relief camps,
                            warehouses, suppliers and moving
                            vehicles on the interactive map.
                        </p>

                    </div>


                    <a
                        href="/map"
                        className="primary-button"
                    >

                        <MapPin size={17} />

                        Open Live Map

                    </a>

                </div>

            </div>

        </div>

    );

}


export default Dashboard;