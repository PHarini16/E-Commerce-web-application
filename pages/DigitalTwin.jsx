import {
    useEffect,
    useState
} from "react";

import {
    Play,
    Pause,
    RotateCcw,
    Zap,
    Truck,
    Package,
    AlertTriangle,
    Activity,
    RefreshCw
} from "lucide-react";


const API_URL =
    "http://127.0.0.1:8000";


const defaultRoutes = [
    {
        id: 1,
        vehicle: "TN-38-DR-101",
        type: "Relief Truck",
        cargo: "Food Supplies",
        origin: "Coimbatore Warehouse",
        destination: "Coimbatore Relief Camp",

        start: {
            x: 18,
            y: 72
        },

        end: {
            x: 76,
            y: 30
        }
    },

    {
        id: 2,
        vehicle: "TN-38-DR-102",
        type: "Water Tanker",
        cargo: "Drinking Water",
        origin: "Coimbatore Warehouse",
        destination: "Mettupalayam Camp",

        start: {
            x: 20,
            y: 68
        },

        end: {
            x: 72,
            y: 68
        }
    },

    {
        id: 3,
        vehicle: "TN-38-DR-103",
        type: "Medical Van",
        cargo: "Medical Supplies",
        origin: "Medical Warehouse",
        destination: "Pollachi Emergency Zone",

        start: {
            x: 22,
            y: 25
        },

        end: {
            x: 70,
            y: 42
        }
    }
];


function DigitalTwin() {

    const [routes, setRoutes] =
        useState(defaultRoutes);

    const [running, setRunning] =
        useState(false);

    const [speed, setSpeed] =
        useState(1);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const [progress, setProgress] =
        useState({
            1: 25,
            2: 55,
            3: 75
        });


    async function loadVehicles() {

        try {

            setLoading(true);
            setError("");

            const response =
                await fetch(
                    `${API_URL}/map/overview`
                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Unable to load vehicle data"
                );
            }


            if (
                data.vehicles &&
                data.vehicles.length > 0
            ) {

                const backendRoutes =
                    data.vehicles.map(
                        (vehicle, index) => {

                            const templates =
                                defaultRoutes;

                            const template =
                                templates[
                                    index %
                                    templates.length
                                ];

                            return {

                                id:
                                    vehicle.id,

                                vehicle:
                                    vehicle.vehicle_number,

                                type:
                                    vehicle.vehicle_type,

                                cargo:
                                    vehicle.vehicle_type
                                        .toLowerCase()
                                        .includes("water")
                                        ? "Drinking Water"
                                        : vehicle.vehicle_type
                                            .toLowerCase()
                                            .includes("medical")
                                            ? "Medical Supplies"
                                            : "Relief Supplies",

                                origin:
                                    "Relief Warehouse",

                                destination:
                                    index === 0
                                        ? "Coimbatore Relief Camp"
                                        : index === 1
                                        ? "Mettupalayam Relief Camp"
                                        : "Pollachi Emergency Zone",

                                start:
                                    template.start,

                                end:
                                    template.end,

                                backendStatus:
                                    vehicle.status,

                                latitude:
                                    vehicle.latitude,

                                longitude:
                                    vehicle.longitude
                            };
                        }
                    );

                setRoutes(
                    backendRoutes
                );


                const initialProgress = {};

                backendRoutes.forEach(
                    (route, index) => {

                        initialProgress[
                            route.id
                        ] =
                            index === 0
                                ? 25
                                : index === 1
                                ? 55
                                : 75;

                    }
                );

                setProgress(
                    initialProgress
                );

            }

        } catch (err) {

            setError(
                err.message
            );

        } finally {

            setLoading(false);
        }
    }


    useEffect(() => {

        loadVehicles();

    }, []);


    useEffect(() => {

        if (!running) {
            return;
        }


        const interval =
            setInterval(() => {

                setProgress(
                    previous => {

                        const updated = {
                            ...previous
                        };


                        routes.forEach(
                            route => {

                                let value =
                                    updated[
                                        route.id
                                    ] || 0;


                                value +=
                                    1 * speed;


                                if (
                                    value >= 100
                                ) {
                                    value = 0;
                                }


                                updated[
                                    route.id
                                ] = value;

                            }
                        );


                        return updated;
                    }
                );

            }, 300);


        return () =>
            clearInterval(
                interval
            );

    }, [
        running,
        speed,
        routes
    ]);


    function resetSimulation() {

        setRunning(false);

        const reset = {};

        routes.forEach(
            (route, index) => {

                reset[
                    route.id
                ] =
                    index === 0
                        ? 25
                        : index === 1
                        ? 55
                        : 75;

            }
        );

        setProgress(reset);
    }


    function getVehiclePosition(
        route
    ) {

        const value =
            progress[
                route.id
            ] || 0;


        const ratio =
            value / 100;


        return {

            x:
                route.start.x +
                (
                    route.end.x -
                    route.start.x
                ) *
                ratio,


            y:
                route.start.y +
                (
                    route.end.y -
                    route.start.y
                ) *
                ratio
        };
    }


    const activeVehicles =
        routes.length;


    const averageProgress =
        routes.length === 0
            ? 0
            : Math.round(
                Object.values(progress)
                    .reduce(
                        (
                            sum,
                            value
                        ) =>
                            sum + value,
                        0
                    ) /
                    routes.length
            );


    if (loading) {

        return (

            <div className="page-container">

                <div className="loading-state">

                    Loading Digital Twin...

                </div>

            </div>
        );
    }


    return (

        <div className="page-container digital-twin-page">

            {/* HEADER */}

            <div className="page-header">

                <div>

                    <div className="page-title-row">

                        <Activity size={28} />

                        <h1>
                            Digital Twin
                        </h1>

                    </div>

                    <p>
                        Live simulation of
                        disaster relief operations
                    </p>

                </div>


                <button
                    className="primary-button"
                    onClick={
                        loadVehicles
                    }
                >

                    <RefreshCw size={17} />

                    Sync Vehicles

                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {/* STATUS */}

            <div className="digital-twin-status">

                <span
                    className={
                        running
                            ? "simulation-status running"
                            : "simulation-status"
                    }
                >

                    {running
                        ? "● Simulation Running"
                        : "● Simulation Paused"
                    }

                </span>

            </div>


            {/* CONTROLS */}

            <div className="simulation-controls">

                <button
                    className="simulation-button primary"
                    onClick={() =>
                        setRunning(true)
                    }
                    disabled={running}
                >

                    <Play size={17} />

                    Start

                </button>


                <button
                    className="simulation-button"
                    onClick={() =>
                        setRunning(false)
                    }
                    disabled={!running}
                >

                    <Pause size={17} />

                    Pause

                </button>


                <button
                    className="simulation-button"
                    onClick={
                        resetSimulation
                    }
                >

                    <RotateCcw size={17} />

                    Reset

                </button>


                <div className="speed-control">

                    <Zap size={17} />

                    <span>
                        Speed
                    </span>

                    <select
                        value={speed}
                        onChange={
                            event =>
                                setSpeed(
                                    Number(
                                        event.target.value
                                    )
                                )
                        }
                    >

                        <option value="1">
                            1×
                        </option>

                        <option value="2">
                            2×
                        </option>

                        <option value="4">
                            4×
                        </option>

                        <option value="8">
                            8×
                        </option>

                    </select>

                </div>

            </div>


            {/* METRICS */}

            <div className="digital-twin-metrics">

                <div className="twin-metric">

                    <div className="twin-metric-icon">

                        <Truck size={20} />

                    </div>

                    <div>

                        <strong>
                            {activeVehicles}
                        </strong>

                        <span>
                            Active Vehicles
                        </span>

                    </div>

                </div>


                <div className="twin-metric">

                    <div className="twin-metric-icon">

                        <Package size={20} />

                    </div>

                    <div>

                        <strong>
                            {averageProgress}%
                        </strong>

                        <span>
                            Average Delivery Progress
                        </span>

                    </div>

                </div>


                <div className="twin-metric">

                    <div className="twin-metric-icon">

                        <AlertTriangle size={20} />

                    </div>

                    <div>

                        <strong>
                            3
                        </strong>

                        <span>
                            Active Disaster Zones
                        </span>

                    </div>

                </div>


                <div className="twin-metric">

                    <div className="twin-metric-icon">

                        <Activity size={20} />

                    </div>

                    <div>

                        <strong>
                            {running
                                ? "LIVE"
                                : "READY"
                            }
                        </strong>

                        <span>
                            System State
                        </span>

                    </div>

                </div>

            </div>


            {/* SIMULATION MAP */}

            <div className="digital-twin-card">

                <div className="digital-twin-map">

                    <div className="twin-grid"></div>


                    <div className="twin-road road-horizontal road-1"></div>

                    <div className="twin-road road-horizontal road-2"></div>

                    <div className="twin-road road-diagonal"></div>


                    {/* DISASTER ZONES */}

                    <div className="twin-disaster-zone zone-1">

                        <span>
                            ⚠️
                        </span>

                        <small>
                            Flood Zone
                        </small>

                    </div>


                    <div className="twin-disaster-zone zone-2">

                        <span>
                            ⚠️
                        </span>

                        <small>
                            Emergency Zone
                        </small>

                    </div>


                    <div className="twin-disaster-zone zone-3">

                        <span>
                            ⚠️
                        </span>

                        <small>
                            Storm Zone
                        </small>

                    </div>


                    {/* VEHICLE ROUTES */}

                    {routes.map(
                        route => {

                            const vehicle =
                                getVehiclePosition(
                                    route
                                );

                            return (

                                <div
                                    key={
                                        route.id
                                    }
                                >

                                    <div
                                        className="twin-route-line"
                                        style={{
                                            left:
                                                `${route.start.x}%`,
                                            top:
                                                `${route.start.y}%`,
                                            width:
                                                `${Math.sqrt(
                                                    Math.pow(
                                                        route.end.x -
                                                        route.start.x,
                                                        2
                                                    ) +
                                                    Math.pow(
                                                        route.end.y -
                                                        route.start.y,
                                                        2
                                                    )
                                                )}%`
                                        }}
                                    />


                                    <div
                                        className="twin-vehicle"
                                        style={{
                                            left:
                                                `${vehicle.x}%`,
                                            top:
                                                `${vehicle.y}%`
                                        }}
                                    >

                                        🚚

                                    </div>

                                </div>

                            );

                        }
                    )}


                    {/* LOCATIONS */}

                    <div className="twin-location warehouse">

                        <span>
                            🏭
                        </span>

                        <strong>
                            Relief Warehouse
                        </strong>

                    </div>


                    <div className="twin-location camp">

                        <span>
                            ⛺
                        </span>

                        <strong>
                            Relief Camp
                        </strong>

                    </div>


                    <div className="twin-location command-centre">

                        <span>
                            🏢
                        </span>

                        <strong>
                            Command Centre
                        </strong>

                    </div>


                    <div className="twin-live-label">

                        <span></span>

                        LIVE SIMULATION

                    </div>

                </div>

            </div>


            {/* VEHICLE TABLE */}

            <div className="digital-twin-table-card">

                <div className="section-heading">

                    <div>

                        <h2>
                            Active Relief Operations
                        </h2>

                        <p>
                            Backend-connected
                            vehicle movement
                        </p>

                    </div>

                </div>


                <div className="table-wrapper">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Vehicle
                                </th>

                                <th>
                                    Type
                                </th>

                                <th>
                                    Cargo
                                </th>

                                <th>
                                    Destination
                                </th>

                                <th>
                                    Progress
                                </th>

                                <th>
                                    Backend Status
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {routes.map(
                                route => {

                                    const value =
                                        progress[
                                            route.id
                                        ] || 0;


                                    return (

                                        <tr
                                            key={
                                                route.id
                                            }
                                        >

                                            <td>

                                                <strong>
                                                    {
                                                        route.vehicle
                                                    }
                                                </strong>

                                            </td>


                                            <td>
                                                {
                                                    route.type
                                                }
                                            </td>


                                            <td>
                                                {
                                                    route.cargo
                                                }
                                            </td>


                                            <td>
                                                {
                                                    route.destination
                                                }
                                            </td>


                                            <td>

                                                <div className="progress-cell">

                                                    <div className="progress-bar">

                                                        <div
                                                            className="progress-fill"
                                                            style={{
                                                                width:
                                                                    `${value}%`
                                                            }}
                                                        />

                                                    </div>

                                                    <span>
                                                        {value}%
                                                    </span>

                                                </div>

                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        route.backendStatus
                                                            ?.toLowerCase()
                                                            .includes(
                                                                "en route"
                                                            )
                                                            ? "status-badge info"
                                                            : "status-badge success"
                                                    }
                                                >

                                                    {
                                                        route.backendStatus
                                                    }

                                                </span>

                                            </td>

                                        </tr>

                                    );

                                }
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}


export default DigitalTwin;