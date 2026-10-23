import { useEffect, useState } from "react";

import {
    Brain,
    RefreshCw,
    MapPin,
    Package,
    Users,
    AlertTriangle,
    Truck,
    CheckCircle
} from "lucide-react";

import { API_URL } from "../services/api";


function Allocation() {

    const [recommendations, setRecommendations] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [creatingDelivery, setCreatingDelivery] =
        useState(null);

    const [successMessage, setSuccessMessage] =
        useState("");


    // ============================================================
    // LOAD AI RECOMMENDATIONS
    // ============================================================

    async function loadRecommendations() {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/allocation/recommendations`
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Unable to load AI recommendations"
                );

            }

            setRecommendations(
                data.recommendations || []
            );

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {

        loadRecommendations();

    }, []);


    // ============================================================
    // CREATE DELIVERY FROM AI ALLOCATION
    // ============================================================

    async function createDelivery(
        requestId,
        donationId
    ) {

        try {

            setCreatingDelivery(
                `${requestId}-${donationId}`
            );

            setError("");
            setSuccessMessage("");


            const response = await fetch(
                `${API_URL}/deliveries/from-allocation`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        request_id:
                            requestId,

                        donation_id:
                            donationId,

                        vehicle:
                            "TN-38-DR-101"
                    })
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


            setSuccessMessage(
                `Delivery #${data.delivery.id} created successfully. ` +
                `AI allocation converted into a relief operation.`
            );


            // Reload recommendations.
            // The allocated request/donation will
            // no longer appear as pending/available.
            await loadRecommendations();


        } catch (err) {

            setError(err.message);

        } finally {

            setCreatingDelivery(null);

        }
    }


    // ============================================================
    // SCORE COLOR
    // ============================================================

    function getScoreClass(score) {

        if (score >= 80) {
            return "priority-critical";
        }

        if (score >= 60) {
            return "priority-high";
        }

        if (score >= 40) {
            return "priority-medium";
        }

        return "priority-low";
    }


    return (

        <div className="page">


            {/* ================================================== */}
            {/* HEADER */}
            {/* ================================================== */}

            <div className="page-header">

                <div>

                    <h1>
                        AI Donor Allocation
                    </h1>

                    <p>
                        Intelligent matching of donations
                        to emergency requests.
                    </p>

                </div>


                <button
                    className="secondary-button"
                    onClick={loadRecommendations}
                >

                    <RefreshCw size={17} />

                    Refresh Analysis

                </button>

            </div>


            {/* ================================================== */}
            {/* AI BANNER */}
            {/* ================================================== */}

            <div className="ai-banner">

                <div className="ai-banner-icon">

                    <Brain size={30} />

                </div>


                <div>

                    <h2>
                        AI Allocation Engine
                    </h2>

                    <p>
                        Matching donations with emergency
                        requests using location, resource
                        type, urgency and quantity.
                    </p>

                </div>

            </div>


            {/* ================================================== */}
            {/* SUCCESS */}
            {/* ================================================== */}

            {successMessage && (

                <div className="success-banner">

                    <CheckCircle size={18} />

                    {successMessage}

                </div>

            )}


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
            {/* LOADING */}
            {/* ================================================== */}

            {loading ? (

                <div className="module-placeholder">

                    <Brain size={35} />

                    <h2>
                        Analyzing Resources...
                    </h2>

                    <p>
                        Calculating the best
                        donation-request matches.
                    </p>

                </div>


            ) : recommendations.length === 0 ? (

                /* ================================================= */
                /* NO REQUESTS */
                /* ================================================= */

                <div className="module-placeholder">

                    <Package size={35} />

                    <h2>
                        No Pending Requests
                    </h2>

                    <p>
                        Create a relief request and an
                        available donation to generate
                        an AI recommendation.
                    </p>

                </div>


            ) : (

                /* ================================================= */
                /* ALLOCATION LIST */
                /* ================================================= */

                <div className="allocation-list">

                    {recommendations.map(
                        (item) => (

                            <div
                                className="allocation-card"
                                key={
                                    item.request_id
                                }
                            >


                                {/* ================================= */}
                                {/* REQUEST HEADER */}
                                {/* ================================= */}

                                <div
                                    className=
                                    "allocation-card-header"
                                >

                                    <div>

                                        <span
                                            className=
                                            "request-label"
                                        >
                                            RELIEF REQUEST #
                                            {item.request_id}
                                        </span>


                                        <h2>
                                            {
                                                item.request_location
                                            }
                                        </h2>

                                    </div>


                                    <div
                                        className={
                                            `priority-badge ${getScoreClass(
                                                item.priority_score
                                            )}`
                                        }
                                    >

                                        Priority{" "}
                                        {
                                            item.priority_score
                                        }

                                    </div>

                                </div>


                                {/* ================================= */}
                                {/* REQUEST DETAILS */}
                                {/* ================================= */}

                                <div
                                    className=
                                    "allocation-details"
                                >

                                    <div>

                                        <Users size={18} />

                                        <span>

                                            {
                                                item.people_affected
                                            }

                                            {" "}
                                            people affected

                                        </span>

                                    </div>


                                    <div>

                                        <AlertTriangle
                                            size={18}
                                        />

                                        <span>

                                            {
                                                item.urgency
                                            }

                                            {" "}
                                            urgency

                                        </span>

                                    </div>

                                </div>


                                {/* ================================= */}
                                {/* MATCH TITLE */}
                                {/* ================================= */}

                                <div
                                    className=
                                    "match-title"
                                >

                                    <Brain size={19} />

                                    Recommended Donations

                                </div>


                                {/* ================================= */}
                                {/* NO MATCH */}
                                {/* ================================= */}

                                {
                                    item
                                        .recommended_donations
                                        .length === 0
                                        ? (

                                            <div
                                                className=
                                                "no-match"
                                            >

                                                No suitable
                                                donation found.

                                            </div>

                                        )
                                        : (

                                            /* ========================= */
                                            /* DONATION MATCHES */
                                            /* ========================= */

                                            <div
                                                className=
                                                "donation-matches"
                                            >

                                                {
                                                    item
                                                        .recommended_donations
                                                        .map(
                                                            (
                                                                donation
                                                            ) => {

                                                                const
                                                                    deliveryKey =
                                                                    `${item.request_id}-${donation.donation_id}`;

                                                                const
                                                                    isCreating =
                                                                    creatingDelivery ===
                                                                    deliveryKey;

                                                                return (

                                                                    <div
                                                                        className=
                                                                        "donation-match"
                                                                        key={
                                                                            donation.donation_id
                                                                        }
                                                                    >


                                                                        {/* =================== */}
                                                                        {/* MATCH MAIN */}
                                                                        {/* =================== */}

                                                                        <div
                                                                            className=
                                                                            "match-main"
                                                                        >

                                                                            <strong>

                                                                                {
                                                                                    donation.donor_name
                                                                                }

                                                                            </strong>


                                                                            <span>

                                                                                <Package
                                                                                    size={15}
                                                                                />

                                                                                {
                                                                                    donation.resource_type
                                                                                }

                                                                            </span>

                                                                        </div>


                                                                        {/* =================== */}
                                                                        {/* MATCH INFO */}
                                                                        {/* =================== */}

                                                                        <div
                                                                            className=
                                                                            "match-info"
                                                                        >

                                                                            <span>

                                                                                <MapPin
                                                                                    size={15}
                                                                                />

                                                                                {
                                                                                    donation.location
                                                                                }

                                                                            </span>


                                                                            <span>

                                                                                Quantity:{" "}

                                                                                {
                                                                                    donation.quantity
                                                                                }

                                                                            </span>

                                                                        </div>


                                                                        {/* =================== */}
                                                                        {/* SCORE */}
                                                                        {/* =================== */}

                                                                        <div
                                                                            className={
                                                                                `match-score ${getScoreClass(
                                                                                    donation.match_score
                                                                                )}`
                                                                            }
                                                                        >

                                                                            {
                                                                                donation.match_score
                                                                            }%

                                                                        </div>


                                                                        {/* =================== */}
                                                                        {/* CREATE DELIVERY */}
                                                                        {/* =================== */}

                                                                        <button
                                                                            className=
                                                                            "primary-button"
                                                                            disabled={
                                                                                isCreating
                                                                            }
                                                                            onClick={() =>
                                                                                createDelivery(
                                                                                    item.request_id,
                                                                                    donation.donation_id
                                                                                )
                                                                            }
                                                                        >

                                                                            {
                                                                                isCreating
                                                                                    ? (
                                                                                        <>
                                                                                            <RefreshCw
                                                                                                size={16}
                                                                                                className=
                                                                                                "spin"
                                                                                            />

                                                                                            Creating...
                                                                                        </>
                                                                                    )
                                                                                    : (
                                                                                        <>
                                                                                            <Truck
                                                                                                size={16}
                                                                                            />

                                                                                            Create Delivery
                                                                                        </>
                                                                                    )
                                                                            }

                                                                        </button>

                                                                    </div>

                                                                );

                                                            }
                                                        )
                                                }

                                            </div>

                                        )
                                }

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    );
}


export default Allocation;