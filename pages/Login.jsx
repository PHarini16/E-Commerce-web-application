import { useState } from "react";

import {
    useNavigate
} from "react-router-dom";

import {
    Shield,
    Lock,
    User,
    AlertCircle,
    Activity,
    Radio,
    MapPin,
    ArrowRight,
    Eye,
    EyeOff,
    CheckCircle2,
    Waves,
    Truck
} from "lucide-react";

import { login } from "../services/api";


function Login() {

    const navigate = useNavigate();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [showPassword, setShowPassword] =
        useState(false);


    async function handleLogin(event) {

        event.preventDefault();

        setError("");

        setLoading(true);

        try {

            const data =
                await login(
                    username,
                    password
                );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            navigate("/dashboard");

        } catch (err) {

            setError(
                err.message ||
                "Invalid username or password"
            );

        } finally {

            setLoading(false);

        }
    }


    return (

        <div className="command-login-page">


            {/* ================================================= */}
            {/* BACKGROUND */}
            {/* ================================================= */}

            <div className="command-login-background">

                <div className="login-grid"></div>

                <div className="login-glow glow-one"></div>

                <div className="login-glow glow-two"></div>


                <div className="floating-signal signal-one">
                    <Radio size={16} />
                </div>

                <div className="floating-signal signal-two">
                    <MapPin size={16} />
                </div>

                <div className="floating-signal signal-three">
                    <Truck size={16} />
                </div>

            </div>


            {/* ================================================= */}
            {/* TOP SYSTEM BAR */}
            {/* ================================================= */}

            <div className="login-system-bar">

                <div className="login-brand-mini">

                    <div className="brand-mini-icon">

                        <Shield size={17} />

                    </div>

                    <span>
                        RELIEFCORE
                    </span>

                </div>


                <div className="login-system-status">

                    <span className="login-status-dot"></span>

                    SYSTEM OPERATIONAL

                </div>

            </div>


            {/* ================================================= */}
            {/* MAIN CONTENT */}
            {/* ================================================= */}

            <div className="command-login-content">


                {/* ================================================= */}
                {/* LEFT SIDE */}
                {/* ================================================= */}

                <div className="login-information">


                    <div className="login-live-label">

                        <span></span>

                        LIVE EMERGENCY NETWORK

                    </div>


                    <h1>

                        Disaster Relief
                        <br />

                        <span>
                            Command Centre
                        </span>

                    </h1>


                    <p className="login-description">

                        Coordinate emergency response,
                        monitor critical resources and
                        manage relief operations from
                        one intelligent command platform.

                    </p>


                    {/* FEATURE ITEMS */}

                    <div className="login-features">


                        <div className="login-feature">

                            <div className="feature-icon">

                                <Activity size={18} />

                            </div>

                            <div>

                                <strong>
                                    Real-Time Operations
                                </strong>

                                <span>
                                    Monitor relief activity
                                    as it happens.
                                </span>

                            </div>

                        </div>


                        <div className="login-feature">

                            <div className="feature-icon">

                                <Waves size={18} />

                            </div>

                            <div>

                                <strong>
                                    Intelligent Response
                                </strong>

                                <span>
                                    Prioritize requests and
                                    identify shortages.
                                </span>

                            </div>

                        </div>


                        <div className="login-feature">

                            <div className="feature-icon">

                                <Truck size={18} />

                            </div>

                            <div>

                                <strong>
                                    Coordinated Logistics
                                </strong>

                                <span>
                                    Track resources, vehicles
                                    and deliveries.
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* NETWORK STATUS */}

                    <div className="login-network-card">

                        <div className="network-card-header">

                            <span>
                                RESPONSE NETWORK
                            </span>

                            <span className="network-live">
                                LIVE
                            </span>

                        </div>


                        <div className="network-lines">

                            <div>
                                <span></span>
                                Emergency Requests
                            </div>

                            <div>
                                <span></span>
                                Relief Resources
                            </div>

                            <div>
                                <span></span>
                                Logistics Network
                            </div>

                            <div>
                                <span></span>
                                Field Operations
                            </div>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* LOGIN CARD */}
                {/* ================================================= */}

                <div className="command-login-card">


                    {/* CARD HEADER */}

                    <div className="secure-login-icon">

                        <Shield size={28} />

                    </div>


                    <div className="secure-badge">

                        <span></span>

                        SECURE COMMAND ACCESS

                    </div>


                    <h2>
                        Welcome Back
                    </h2>


                    <p className="secure-login-description">

                        Sign in to access the disaster
                        response operations dashboard.

                    </p>


                    {/* ERROR */}

                    {error && (

                        <div className="login-error">

                            <AlertCircle size={18} />

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* FORM */}

                    <form
                        onSubmit={handleLogin}
                        className="command-login-form"
                    >


                        {/* USERNAME */}

                        <div className="login-field">

                            <label>
                                Username
                            </label>


                            <div className="command-input">

                                <User size={18} />


                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(
                                            e.target.value
                                        )
                                    }
                                    required
                                    autoComplete="username"
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="login-field">

                            <label>
                                Password
                            </label>


                            <div className="command-input">

                                <Lock size={18} />


                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(
                                            e.target.value
                                        )
                                    }
                                    required
                                    autoComplete="current-password"
                                />


                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    tabIndex="-1"
                                >

                                    {
                                        showPassword
                                            ? (
                                                <EyeOff
                                                    size={17}
                                                />
                                            )
                                            : (
                                                <Eye
                                                    size={17}
                                                />
                                            )
                                    }

                                </button>

                            </div>

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="command-login-button"
                            disabled={loading}
                        >

                            {
                                loading
                                    ? (
                                        <>
                                            <span className="login-spinner"></span>
                                            Authenticating...
                                        </>
                                    )
                                    : (
                                        <>
                                            Access Command Centre

                                            <ArrowRight
                                                size={18}
                                            />

                                        </>
                                    )
                            }

                        </button>

                    </form>


                    {/* DEMO ACCESS */}

                    <div className="login-demo-section">

                        <div className="demo-section-title">

                            <CheckCircle2 size={15} />

                            DEMO ENVIRONMENT

                        </div>


                        <div className="demo-credentials">

                            <div>

                                <span>
                                    Admin
                                </span>

                                <code>
                                    admin / admin123
                                </code>

                            </div>


                            <div>

                                <span>
                                    NGO
                                </span>

                                <code>
                                    ngo / ngo123
                                </code>

                            </div>

                        </div>

                    </div>


                    {/* CARD FOOTER */}

                    <div className="login-card-footer">

                        <span>
                            Protected Command Interface
                        </span>

                        <span>
                            v1.0

                        </span>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* BOTTOM BAR */}
            {/* ================================================= */}

            <div className="login-bottom-bar">

                <span>
                    DISASTER RESPONSE NETWORK
                </span>

                <span>
                    •
                </span>

                <span>
                    REAL-TIME OPERATIONS
                </span>

                <span>
                    •
                </span>

                <span>
                    RELIEF COORDINATION
                </span>

            </div>

        </div>

    );

}


export default Login;