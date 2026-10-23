import { useEffect, useState } from "react";
import {
    Plus,
    Trash2,
    RefreshCw,
    AlertTriangle
} from "lucide-react";

import { API_URL } from "../services/api";

function Requests() {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        location: "",
        people_affected: "",
        food_required: "",
        water_required: "",
        medicine_required: "",
        urgency: "Medium"
    });

    async function loadRequests() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/requests/`
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to load relief requests"
                );
            }

            const data = await response.json();

            setRequests(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRequests();
    }, []);

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {

            const response = await fetch(
                `${API_URL}/requests/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        location: form.location,
                        people_affected:
                            Number(form.people_affected),
                        food_required:
                            Number(form.food_required),
                        water_required:
                            Number(form.water_required),
                        medicine_required:
                            Number(form.medicine_required),
                        urgency: form.urgency
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Failed to create request"
                );
            }

            setForm({
                location: "",
                people_affected: "",
                food_required: "",
                water_required: "",
                medicine_required: "",
                urgency: "Medium"
            });

            setShowForm(false);

            loadRequests();

        } catch (err) {
            setError(err.message);
        }
    }

    async function deleteRequest(id) {

        const confirmed =
            window.confirm(
                "Delete this relief request?"
            );

        if (!confirmed) {
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/requests/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Failed to delete request"
                );
            }

            loadRequests();

        } catch (err) {
            setError(err.message);
        }
    }

    function getPriorityClass(score) {

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

            <div className="page-header">

                <div>
                    <h1>Relief Requests</h1>

                    <p>
                        Manage and prioritize emergency
                        assistance requests.
                    </p>
                </div>

                <div className="page-actions">

                    <button
                        className="secondary-button"
                        onClick={loadRequests}
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>

                    <button
                        className="primary-button"
                        onClick={() =>
                            setShowForm(!showForm)
                        }
                    >
                        <Plus size={17} />
                        Add Request
                    </button>

                </div>

            </div>


            {error && (

                <div className="error-banner">

                    <AlertTriangle size={18} />

                    {error}

                </div>

            )}


            {showForm && (

                <div className="form-card">

                    <div className="form-card-header">

                        <div>
                            <h2>
                                Create Relief Request
                            </h2>

                            <p>
                                Enter the emergency
                                requirements.
                            </p>
                        </div>

                    </div>


                    <form
                        className="request-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label>
                                Location
                            </label>

                            <input
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="Example: Coimbatore"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                People Affected
                            </label>

                            <input
                                type="number"
                                name="people_affected"
                                value={
                                    form.people_affected
                                }
                                onChange={handleChange}
                                placeholder="Example: 500"
                                min="1"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Food Required
                            </label>

                            <input
                                type="number"
                                name="food_required"
                                value={
                                    form.food_required
                                }
                                onChange={handleChange}
                                placeholder="Number of units"
                                min="0"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Water Required
                            </label>

                            <input
                                type="number"
                                name="water_required"
                                value={
                                    form.water_required
                                }
                                onChange={handleChange}
                                placeholder="Number of units"
                                min="0"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Medicine Required
                            </label>

                            <input
                                type="number"
                                name="medicine_required"
                                value={
                                    form.medicine_required
                                }
                                onChange={handleChange}
                                placeholder="Number of units"
                                min="0"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Urgency
                            </label>

                            <select
                                name="urgency"
                                value={form.urgency}
                                onChange={handleChange}
                            >
                                <option>
                                    Critical
                                </option>

                                <option>
                                    High
                                </option>

                                <option>
                                    Medium
                                </option>

                                <option>
                                    Low
                                </option>

                            </select>

                        </div>


                        <div className="form-actions">

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
                            >
                                Create Request
                            </button>

                        </div>

                    </form>

                </div>

            )}


            <div className="requests-card">

                <div className="section-header">

                    <div>
                        <h2>
                            Emergency Requests
                        </h2>

                        <p>
                            {requests.length} request(s)
                            registered
                        </p>
                    </div>

                </div>


                {loading ? (

                    <div className="loading-state">
                        Loading requests...
                    </div>

                ) : requests.length === 0 ? (

                    <div className="empty-state">

                        <AlertTriangle size={35} />

                        <h3>
                            No relief requests
                        </h3>

                        <p>
                            Click "Add Request" to create
                            the first emergency request.
                        </p>

                    </div>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>Location</th>

                                    <th>People</th>

                                    <th>Food</th>

                                    <th>Water</th>

                                    <th>Medicine</th>

                                    <th>Urgency</th>

                                    <th>Priority</th>

                                    <th>Status</th>

                                    <th>Action</th>

                                </tr>

                            </thead>


                            <tbody>

                                {requests.map(
                                    (request) => (

                                    <tr
                                        key={request.id}
                                    >

                                        <td>
                                            #{request.id}
                                        </td>

                                        <td>
                                            <strong>
                                                {
                                                    request.location
                                                }
                                            </strong>
                                        </td>

                                        <td>
                                            {
                                                request.people_affected
                                            }
                                        </td>

                                        <td>
                                            {
                                                request.food_required
                                            }
                                        </td>

                                        <td>
                                            {
                                                request.water_required
                                            }
                                        </td>

                                        <td>
                                            {
                                                request.medicine_required
                                            }
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    `urgency-badge urgency-${request.urgency.toLowerCase()}`
                                                }
                                            >
                                                {
                                                    request.urgency
                                                }
                                            </span>

                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    `priority-badge ${getPriorityClass(
                                                        request.priority_score
                                                    )}`
                                                }
                                            >
                                                {
                                                    request.priority_score
                                                }
                                            </span>

                                        </td>

                                        <td>

                                            <span className="status-badge">
                                                {
                                                    request.status
                                                }
                                            </span>

                                        </td>

                                        <td>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    deleteRequest(
                                                        request.id
                                                    )
                                                }
                                                title="Delete request"
                                            >
                                                <Trash2
                                                    size={17}
                                                />
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Requests;