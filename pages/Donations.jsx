import { useEffect, useState } from "react";
import {
    Plus,
    Trash2,
    RefreshCw,
    HeartHandshake
} from "lucide-react";

import { API_URL } from "../services/api";

function Donations() {

    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        donor_name: "",
        resource_type: "Food",
        quantity: "",
        location: ""
    });


    async function loadDonations() {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/donations/`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Unable to load donations"
                );
            }

            setDonations(data);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {
        loadDonations();
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
                `${API_URL}/donations/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        donor_name:
                            form.donor_name,

                        resource_type:
                            form.resource_type,

                        quantity:
                            Number(form.quantity),

                        location:
                            form.location
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to add donation"
                );

            }

            setForm({
                donor_name: "",
                resource_type: "Food",
                quantity: "",
                location: ""
            });

            setShowForm(false);

            loadDonations();

        } catch (err) {

            setError(err.message);

        }

    }


    async function deleteDonation(id) {

        const confirmed =
            window.confirm(
                "Delete this donation?"
            );

        if (!confirmed) {
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/donations/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to delete donation"
                );

            }

            loadDonations();

        } catch (err) {

            setError(err.message);

        }

    }


    return (

        <div className="page">

            <div className="page-header">

                <div>

                    <h1>
                        Donations
                    </h1>

                    <p>
                        Manage incoming relief
                        donations and supplies.
                    </p>

                </div>


                <div className="page-actions">

                    <button
                        className="secondary-button"
                        onClick={loadDonations}
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
                        Add Donation
                    </button>

                </div>

            </div>


            {error && (

                <div className="error-banner">
                    {error}
                </div>

            )}


            {showForm && (

                <div className="form-card">

                    <div className="form-card-header">

                        <div>

                            <h2>
                                Register Donation
                            </h2>

                            <p>
                                Enter the donor and
                                donated resource details.
                            </p>

                        </div>

                    </div>


                    <form
                        className="request-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label>
                                Donor Name
                            </label>

                            <input
                                name="donor_name"
                                value={
                                    form.donor_name
                                }
                                onChange={handleChange}
                                placeholder="Example: ABC Foundation"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Resource Type
                            </label>

                            <select
                                name="resource_type"
                                value={
                                    form.resource_type
                                }
                                onChange={handleChange}
                            >

                                <option>
                                    Food
                                </option>

                                <option>
                                    Water
                                </option>

                                <option>
                                    Medicine
                                </option>

                                <option>
                                    Blankets
                                </option>

                                <option>
                                    Clothing
                                </option>

                                <option>
                                    Shelter
                                </option>

                                <option>
                                    Other
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Quantity
                            </label>

                            <input
                                type="number"
                                name="quantity"
                                value={
                                    form.quantity
                                }
                                onChange={handleChange}
                                placeholder="Example: 500"
                                min="1"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Location
                            </label>

                            <input
                                name="location"
                                value={
                                    form.location
                                }
                                onChange={handleChange}
                                placeholder="Example: Coimbatore"
                                required
                            />

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
                                Add Donation
                            </button>

                        </div>

                    </form>

                </div>

            )}


            <div className="requests-card">

                <div className="section-header">

                    <div>

                        <h2>
                            Donation Registry
                        </h2>

                        <p>
                            {donations.length}
                            {" "}
                            donation(s)
                            registered
                        </p>

                    </div>

                </div>


                {loading ? (

                    <div className="loading-state">
                        Loading donations...
                    </div>

                ) : donations.length === 0 ? (

                    <div className="empty-state">

                        <HeartHandshake
                            size={35}
                        />

                        <h3>
                            No donations registered
                        </h3>

                        <p>
                            Click "Add Donation" to
                            register a donation.
                        </p>

                    </div>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>
                                        Donor
                                    </th>

                                    <th>
                                        Resource
                                    </th>

                                    <th>
                                        Quantity
                                    </th>

                                    <th>
                                        Location
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {donations.map(
                                    (donation) => (

                                    <tr
                                        key={
                                            donation.id
                                        }
                                    >

                                        <td>
                                            #
                                            {
                                                donation.id
                                            }
                                        </td>


                                        <td>

                                            <strong>
                                                {
                                                    donation.donor_name
                                                }
                                            </strong>

                                        </td>


                                        <td>

                                            <span className="category-badge">
                                                {
                                                    donation.resource_type
                                                }
                                            </span>

                                        </td>


                                        <td>

                                            <strong>
                                                {
                                                    donation.quantity
                                                }
                                            </strong>

                                        </td>


                                        <td>
                                            {
                                                donation.location
                                            }
                                        </td>


                                        <td>

                                            <span className="status-badge">
                                                {
                                                    donation.status
                                                }
                                            </span>

                                        </td>


                                        <td>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    deleteDonation(
                                                        donation.id
                                                    )
                                                }
                                                title="Delete donation"
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

export default Donations;