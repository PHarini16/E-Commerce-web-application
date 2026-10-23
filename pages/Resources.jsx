import { useEffect, useState } from "react";
import {
    Plus,
    Trash2,
    RefreshCw,
    Package
} from "lucide-react";

import { API_URL } from "../services/api";

function Resources() {

    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        category: "Food",
        quantity: "",
        location: ""
    });

    async function loadResources() {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/resources/`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail ||
                    "Unable to load resources"
                );
            }

            setResources(data);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    }

    useEffect(() => {
        loadResources();
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
                `${API_URL}/resources/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: form.name,
                        category: form.category,
                        quantity:
                            Number(form.quantity),
                        location: form.location
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to add resource"
                );

            }

            setForm({
                name: "",
                category: "Food",
                quantity: "",
                location: ""
            });

            setShowForm(false);

            loadResources();

        } catch (err) {

            setError(err.message);

        }

    }


    async function deleteResource(id) {

        const confirmed =
            window.confirm(
                "Delete this resource?"
            );

        if (!confirmed) {
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/resources/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to delete resource"
                );

            }

            loadResources();

        } catch (err) {

            setError(err.message);

        }

    }


    return (

        <div className="page">

            <div className="page-header">

                <div>

                    <h1>
                        Resources
                    </h1>

                    <p>
                        Monitor available relief
                        resources and supplies.
                    </p>

                </div>


                <div className="page-actions">

                    <button
                        className="secondary-button"
                        onClick={loadResources}
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
                        Add Resource
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
                                Add Relief Resource
                            </h2>

                            <p>
                                Register available
                                supplies.
                            </p>

                        </div>

                    </div>


                    <form
                        className="request-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label>
                                Resource Name
                            </label>

                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Example: Rice"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Category
                            </label>

                            <select
                                name="category"
                                value={form.category}
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
                                value={form.quantity}
                                onChange={handleChange}
                                placeholder="Example: 1000"
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
                                value={form.location}
                                onChange={handleChange}
                                placeholder="Example: Coimbatore Warehouse"
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
                                Add Resource
                            </button>

                        </div>

                    </form>

                </div>

            )}


            <div className="requests-card">

                <div className="section-header">

                    <div>

                        <h2>
                            Resource Inventory
                        </h2>

                        <p>
                            {resources.length}
                            {" "}
                            resource(s)
                            registered
                        </p>

                    </div>

                </div>


                {loading ? (

                    <div className="loading-state">
                        Loading resources...
                    </div>

                ) : resources.length === 0 ? (

                    <div className="empty-state">

                        <Package size={35} />

                        <h3>
                            No resources available
                        </h3>

                        <p>
                            Click "Add Resource" to
                            register the first supply.
                        </p>

                    </div>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>
                                        Resource
                                    </th>

                                    <th>
                                        Category
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

                                {resources.map(
                                    (resource) => (

                                    <tr
                                        key={
                                            resource.id
                                        }
                                    >

                                        <td>
                                            #
                                            {
                                                resource.id
                                            }
                                        </td>


                                        <td>

                                            <strong>
                                                {
                                                    resource.name
                                                }
                                            </strong>

                                        </td>


                                        <td>

                                            <span className="category-badge">
                                                {
                                                    resource.category
                                                }
                                            </span>

                                        </td>


                                        <td>

                                            <strong>
                                                {
                                                    resource.quantity
                                                }
                                            </strong>

                                        </td>


                                        <td>
                                            {
                                                resource.location
                                            }
                                        </td>


                                        <td>

                                            <span className="status-badge">
                                                {
                                                    resource.status
                                                }
                                            </span>

                                        </td>


                                        <td>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    deleteResource(
                                                        resource.id
                                                    )
                                                }
                                                title="Delete resource"
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

export default Resources;