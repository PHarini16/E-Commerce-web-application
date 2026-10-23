import { useEffect, useState } from "react";

import {
    Building2,
    MapPin,
    Package,
    ShieldCheck,
    ShieldAlert,
    Clock,
    Plus,
    RefreshCw,
    Trash2,
    X,
    CheckCircle,
    XCircle,
    AlertTriangle
} from "lucide-react";

import { API_URL } from "../services/api";


function Suppliers() {

    const [suppliers, setSuppliers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [form, setForm] = useState({
        name: "",
        location: "",
        resource_type: "Food"
    });


    async function loadSuppliers() {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/suppliers/`
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Unable to load suppliers"
                );
            }

            setSuppliers(data);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    }


    useEffect(() => {
        loadSuppliers();
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


    async function createSupplier(event) {

        event.preventDefault();

        try {

            setError("");

            const response = await fetch(
                `${API_URL}/suppliers/`,
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
                    "Unable to register supplier"
                );
            }

            setShowForm(false);

            setForm({
                name: "",
                location: "",
                resource_type: "Food"
            });

            await loadSuppliers();

        } catch (err) {

            setError(err.message);

        }
    }


    async function updateVerification(
        supplierId,
        status
    ) {

        try {

            setError("");

            const response = await fetch(
                `${API_URL}/suppliers/${supplierId}/verify`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        verification_status:
                            status
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Unable to update verification"
                );
            }

            await loadSuppliers();

        } catch (err) {

            setError(err.message);

        }
    }


    async function deleteSupplier(id) {

        if (
            !window.confirm(
                "Delete this supplier?"
            )
        ) {
            return;
        }

        try {

            const response = await fetch(
                `${API_URL}/suppliers/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Unable to delete supplier"
                );
            }

            await loadSuppliers();

        } catch (err) {

            setError(err.message);

        }
    }


    function statusIcon(status) {

        if (status === "Verified") {
            return <ShieldCheck size={17} />;
        }

        if (status === "Rejected") {
            return <ShieldAlert size={17} />;
        }

        return <Clock size={17} />;
    }


    function statusClass(status) {

        if (status === "Verified") {
            return "supplier-verified";
        }

        if (status === "Rejected") {
            return "supplier-rejected";
        }

        return "supplier-pending";
    }


    const verified =
        suppliers.filter(
            item =>
                item.verification_status ===
                "Verified"
        ).length;

    const pending =
        suppliers.filter(
            item =>
                item.verification_status ===
                "Pending"
        ).length;

    const rejected =
        suppliers.filter(
            item =>
                item.verification_status ===
                "Rejected"
        ).length;


    return (
        <div className="page">

            <div className="page-header">

                <div>

                    <h1>
                        Supplier Network
                    </h1>

                    <p>
                        Manage and verify organizations
                        supplying emergency resources.
                    </p>

                </div>


                <div className="page-header-actions">

                    <button
                        className="secondary-button"
                        onClick={loadSuppliers}
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
                        Register Supplier
                    </button>

                </div>

            </div>


            {error && (

                <div className="error-banner">

                    <AlertTriangle size={18} />

                    {error}

                </div>

            )}


            <div className="supplier-summary">

                <div className="supplier-summary-card">

                    <Building2 size={23} />

                    <div>

                        <span>
                            Total Suppliers
                        </span>

                        <strong>
                            {suppliers.length}
                        </strong>

                    </div>

                </div>


                <div className="supplier-summary-card">

                    <ShieldCheck size={23} />

                    <div>

                        <span>
                            Verified
                        </span>

                        <strong>
                            {verified}
                        </strong>

                    </div>

                </div>


                <div className="supplier-summary-card">

                    <Clock size={23} />

                    <div>

                        <span>
                            Pending
                        </span>

                        <strong>
                            {pending}
                        </strong>

                    </div>

                </div>


                <div className="supplier-summary-card">

                    <ShieldAlert size={23} />

                    <div>

                        <span>
                            Rejected
                        </span>

                        <strong>
                            {rejected}
                        </strong>

                    </div>

                </div>

            </div>


            {showForm && (

                <div className="supplier-form-overlay">

                    <div className="supplier-form-modal">

                        <div className="modal-header">

                            <div>

                                <h2>
                                    Register Supplier
                                </h2>

                                <p>
                                    Add an organization
                                    to the relief network.
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
                            onSubmit={createSupplier}
                        >

                            <div className="form-group">

                                <label>
                                    Supplier Name
                                </label>

                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Organization name"
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
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="City / District"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Primary Resource
                                </label>

                                <select
                                    name="resource_type"
                                    value={
                                        form.resource_type
                                    }
                                    onChange={
                                        handleChange
                                    }
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
                                        Shelter
                                    </option>

                                    <option>
                                        Clothing
                                    </option>

                                    <option>
                                        Emergency Equipment
                                    </option>

                                </select>

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
                                >
                                    Register Supplier
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}


            {loading ? (

                <div className="module-placeholder">

                    <Building2 size={40} />

                    <h2>
                        Loading Supplier Network...
                    </h2>

                </div>

            ) : suppliers.length === 0 ? (

                <div className="module-placeholder">

                    <Building2 size={40} />

                    <h2>
                        No Suppliers Registered
                    </h2>

                    <p>
                        Register suppliers to build
                        the emergency resource network.
                    </p>

                    <button
                        className="primary-button"
                        onClick={() =>
                            setShowForm(true)
                        }
                    >
                        <Plus size={17} />
                        Register Supplier
                    </button>

                </div>

            ) : (

                <div className="supplier-grid">

                    {suppliers.map(
                        supplier => (

                            <div
                                className="supplier-card"
                                key={supplier.id}
                            >

                                <div className="supplier-card-top">

                                    <div className="supplier-logo">

                                        <Building2
                                            size={23}
                                        />

                                    </div>


                                    <div>

                                        <span className="supplier-id">
                                            SUPPLIER #
                                            {supplier.id}
                                        </span>

                                        <h2>
                                            {supplier.name}
                                        </h2>

                                    </div>

                                </div>


                                <div
                                    className={
                                        `supplier-status ${statusClass(
                                            supplier.verification_status
                                        )}`
                                    }
                                >

                                    {statusIcon(
                                        supplier.verification_status
                                    )}

                                    {
                                        supplier.verification_status
                                    }

                                </div>


                                <div className="supplier-details">

                                    <div>

                                        <MapPin size={16} />

                                        <div>

                                            <span>
                                                Location
                                            </span>

                                            <strong>
                                                {
                                                    supplier.location
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    <div>

                                        <Package size={16} />

                                        <div>

                                            <span>
                                                Resource
                                            </span>

                                            <strong>
                                                {
                                                    supplier.resource_type
                                                }
                                            </strong>

                                        </div>

                                    </div>

                                </div>


                                {supplier.verification_status ===
                                    "Pending" && (

                                    <div className="supplier-actions">

                                        <button
                                            className="verify-button"
                                            onClick={() =>
                                                updateVerification(
                                                    supplier.id,
                                                    "Verified"
                                                )
                                            }
                                        >

                                            <CheckCircle
                                                size={16}
                                            />

                                            Verify

                                        </button>


                                        <button
                                            className="reject-button"
                                            onClick={() =>
                                                updateVerification(
                                                    supplier.id,
                                                    "Rejected"
                                                )
                                            }
                                        >

                                            <XCircle
                                                size={16}
                                            />

                                            Reject

                                        </button>

                                    </div>

                                )}


                                {supplier.verification_status ===
                                    "Verified" && (

                                    <div className="supplier-verified-message">

                                        <ShieldCheck
                                            size={17}
                                        />

                                        Approved for relief
                                        operations

                                    </div>

                                )}


                                {supplier.verification_status ===
                                    "Rejected" && (

                                    <div className="supplier-rejected-message">

                                        <ShieldAlert
                                            size={17}
                                        />

                                        Supplier rejected

                                    </div>

                                )}


                                <button
                                    className="supplier-delete"
                                    onClick={() =>
                                        deleteSupplier(
                                            supplier.id
                                        )
                                    }
                                >

                                    <Trash2 size={15} />

                                    Remove Supplier

                                </button>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}


export default Suppliers;