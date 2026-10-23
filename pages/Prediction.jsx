import { useEffect, useState } from "react";

import {
    TrendingDown,
    RefreshCw,
    AlertTriangle,
    Package,
    CheckCircle
} from "lucide-react";

import { API_URL } from "../services/api";


function Prediction() {

    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    async function loadPredictions() {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/prediction/shortages`
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Unable to load shortage prediction"
                );

            }

            setPredictions(
                data.predictions || []
            );

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        loadPredictions();

    }, []);


    function getRiskClass(risk) {

        if (risk === "Critical") {
            return "risk-critical";
        }

        if (risk === "High") {
            return "risk-high";
        }

        if (risk === "Medium") {
            return "risk-medium";
        }

        return "risk-low";

    }


    function getRiskIcon(risk) {

        if (
            risk === "Critical" ||
            risk === "High"
        ) {

            return (
                <AlertTriangle size={18} />
            );

        }

        return (
            <CheckCircle size={18} />
        );

    }


    return (

        <div className="page">

            <div className="page-header">

                <div>

                    <h1>
                        Shortage Prediction
                    </h1>

                    <p>
                        Predict resource shortages
                        from current supply and
                        emergency demand.
                    </p>

                </div>


                <button
                    className="secondary-button"
                    onClick={loadPredictions}
                >

                    <RefreshCw size={17} />

                    Refresh Prediction

                </button>

            </div>


            <div className="ai-banner">

                <div className="ai-banner-icon">

                    <TrendingDown size={30} />

                </div>


                <div>

                    <h2>
                        AI Resource Forecast
                    </h2>

                    <p>
                        The system compares available
                        resources with the requirements
                        of all pending emergency
                        requests.
                    </p>

                </div>

            </div>


            {error && (

                <div className="error-banner">

                    <AlertTriangle size={18} />

                    {error}

                </div>

            )}


            {loading ? (

                <div className="module-placeholder">

                    <TrendingDown size={35} />

                    <h2>
                        Analyzing Resource Demand...
                    </h2>

                    <p>
                        Calculating current supply
                        versus emergency demand.
                    </p>

                </div>

            ) : (

                <div className="prediction-grid">

                    {predictions.map(
                        (item) => (

                            <div
                                className="prediction-card"
                                key={item.resource}
                            >

                                <div className="prediction-header">

                                    <div className="prediction-resource">

                                        <Package size={22} />

                                        <h2>
                                            {item.resource}
                                        </h2>

                                    </div>


                                    <div
                                        className={
                                            `risk-badge ${getRiskClass(
                                                item.risk
                                            )}`
                                        }
                                    >

                                        {getRiskIcon(
                                            item.risk
                                        )}

                                        {item.risk}

                                    </div>

                                </div>


                                <div className="prediction-values">

                                    <div>

                                        <span>
                                            Current Supply
                                        </span>

                                        <strong>
                                            {item.current_supply}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Current Demand
                                        </span>

                                        <strong>
                                            {item.current_demand}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Shortage
                                        </span>

                                        <strong>
                                            {item.shortage_quantity}
                                        </strong>

                                    </div>

                                </div>


                                <div className="prediction-progress">

                                    <div className="progress-label">

                                        <span>
                                            Shortage Risk
                                        </span>

                                        <strong>
                                            {item.shortage_percentage}%
                                        </strong>

                                    </div>


                                    <div className="progress-bar">

                                        <div
                                            className={
                                                `progress-fill ${getRiskClass(
                                                    item.risk
                                                )}`
                                            }
                                            style={{
                                                width: `${Math.min(
                                                    item.shortage_percentage,
                                                    100
                                                )}%`
                                            }}
                                        />

                                    </div>

                                </div>


                                <div className="prediction-message">

                                    {item.shortage_quantity > 0 ? (

                                        <>
                                            <AlertTriangle
                                                size={17}
                                            />

                                            Additional{" "}
                                            <strong>
                                                {
                                                    item.shortage_quantity
                                                }
                                            </strong>{" "}
                                            units required.
                                        </>

                                    ) : (

                                        <>
                                            <CheckCircle
                                                size={17}
                                            />

                                            Current supply
                                            can meet the
                                            estimated demand.
                                        </>

                                    )}

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    );

}


export default Prediction;