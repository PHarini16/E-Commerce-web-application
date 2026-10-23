import { useEffect, useRef, useState } from "react";

import {
    Camera,
    ShieldCheck,
    ShieldAlert,
    UserCheck,
    FileCheck,
    CameraOff,
    CheckCircle,
    AlertTriangle,
    RotateCcw,
    RefreshCw
} from "lucide-react";

import { API_URL } from "../services/api";


function Verification() {

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const [cameraActive, setCameraActive] =
        useState(false);

    const [captured, setCaptured] =
        useState(false);

    const [imageData, setImageData] =
        useState(null);

    const [verificationId, setVerificationId] =
        useState(null);

    const [result, setResult] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [form, setForm] = useState({
        subject_name: "",
        subject_type: "Supplier",
        document_type: "Supplier ID"
    });


    /*
    ============================================================
    START CAMERA
    ============================================================
    */

    async function startCamera() {

        try {

            setError("");

            /*
            Stop any existing camera first.
            */

            stopCamera();


            /*
            Check browser support.
            */

            if (
                !navigator.mediaDevices ||
                !navigator.mediaDevices.getUserMedia
            ) {

                throw new Error(
                    "Camera access is not supported by this browser."
                );

            }


            /*
            Request camera permission.
            */

            const stream =
                await navigator.mediaDevices.getUserMedia({

                    video: {
                        facingMode: "user",
                        width: {
                            ideal: 1280
                        },
                        height: {
                            ideal: 720
                        }
                    },

                    audio: false

                });


            /*
            Store stream.
            */

            streamRef.current = stream;


            /*
            Attach stream to video.
            */

            if (videoRef.current) {

                const video =
                    videoRef.current;

                video.srcObject =
                    stream;

                video.muted = true;

                video.playsInline = true;

                /*
                Wait for video metadata.
                */

                video.onloadedmetadata =
                    async () => {

                        try {

                            await video.play();

                            setCameraActive(true);

                        } catch (playError) {

                            console.error(
                                "Video play error:",
                                playError
                            );

                            setError(
                                "Camera started, but the video preview could not be played."
                            );

                        }

                    };

            }

        } catch (err) {

            console.error(
                "Camera error:",
                err
            );


            /*
            Give useful error messages.
            */

            if (
                err.name ===
                "NotAllowedError"
            ) {

                setError(
                    "Camera permission was denied. Click the camera icon in Chrome's address bar and allow camera access."
                );

            } else if (
                err.name ===
                "NotFoundError"
            ) {

                setError(
                    "No camera was found on this device."
                );

            } else if (
                err.name ===
                "NotReadableError"
            ) {

                setError(
                    "The camera is already being used by another application."
                );

            } else {

                setError(
                    err.message ||
                    "Unable to access camera."
                );

            }

            setCameraActive(false);

        }

    }


    /*
    ============================================================
    STOP CAMERA
    ============================================================
    */

    function stopCamera() {

        if (streamRef.current) {

            streamRef.current
                .getTracks()
                .forEach(
                    track => track.stop()
                );

            streamRef.current = null;

        }


        if (videoRef.current) {

            videoRef.current.srcObject =
                null;

        }


        setCameraActive(false);

    }


    /*
    ============================================================
    CAPTURE IMAGE
    ============================================================
    */

    function captureImage() {

        const video =
            videoRef.current;


        if (!video) {

            setError(
                "Camera preview is not available."
            );

            return;

        }


        /*
        Make sure video has loaded.
        */

        if (
            video.readyState <
            2
        ) {

            setError(
                "Camera is still starting. Please wait a moment."
            );

            return;

        }


        if (
            video.videoWidth === 0 ||
            video.videoHeight === 0
        ) {

            setError(
                "Camera video is not ready yet."
            );

            return;

        }


        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            video.videoWidth;

        canvas.height =
            video.videoHeight;


        const context =
            canvas.getContext(
                "2d"
            );


        context.drawImage(
            video,
            0,
            0,
            canvas.width,
            canvas.height
        );


        const image =
            canvas.toDataURL(
                "image/jpeg",
                0.9
            );


        setImageData(
            image
        );

        setCaptured(
            true
        );


        stopCamera();

    }


    /*
    ============================================================
    RETAKE
    ============================================================
    */

    function retake() {

        setCaptured(false);

        setImageData(null);

        setResult(null);

        setError("");

        /*
        Give React time to restore
        the video element before
        starting the camera again.
        */

        setTimeout(() => {

            startCamera();

        }, 100);

    }


    /*
    ============================================================
    START VERIFICATION
    ============================================================
    */

    async function beginVerification() {

        if (
            !form.subject_name.trim()
        ) {

            setError(
                "Enter the person or organization name first."
            );

            return;

        }


        try {

            setLoading(true);

            setError("");


            const response =
                await fetch(
                    `${API_URL}/verification/start`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            subject_name:
                                form.subject_name,

                            subject_type:
                                form.subject_type,

                            document_type:
                                form.document_type,

                            verification_method:
                                "Webcam Capture"

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Unable to start verification"
                );

            }


            setVerificationId(
                data.verification
                    .verification_id
            );


        } catch (err) {

            setError(
                err.message
            );

        } finally {

            setLoading(false);

        }

    }


    /*
    ============================================================
    COMPLETE VERIFICATION
    ============================================================
    */

    async function completeVerification(
        verificationResult
    ) {

        if (!verificationId) {

            setError(
                "Start a verification session first."
            );

            return;

        }


        try {

            setLoading(true);

            setError("");


            const confidence =
                verificationResult ===
                "Verified"
                    ? 95
                    : 60;


            const response =
                await fetch(
                    `${API_URL}/verification/complete`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            verification_id:
                                verificationId,

                            result:
                                verificationResult,

                            confidence:
                                confidence,

                            message:
                                verificationResult ===
                                "Verified"

                                    ? "Webcam capture reviewed and verification completed."

                                    : "Additional manual review is recommended."

                        })

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Unable to complete verification"
                );

            }


            setResult(
                data.verification
            );


        } catch (err) {

            setError(
                err.message
            );

        } finally {

            setLoading(false);

        }

    }


    /*
    ============================================================
    FORM CHANGE
    ============================================================
    */

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


    /*
    ============================================================
    CLEANUP CAMERA WHEN LEAVING PAGE
    ============================================================
    */

    useEffect(() => {

        return () => {

            if (streamRef.current) {

                streamRef.current
                    .getTracks()
                    .forEach(
                        track =>
                            track.stop()
                    );

            }

        };

    }, []);


    /*
    ============================================================
    UI
    ============================================================
    */

    return (

        <div className="page">


            <div className="page-header">

                <div>

                    <h1>
                        Verification Centre
                    </h1>

                    <p>
                        Capture and review identity
                        information for emergency
                        operations.
                    </p>

                </div>


                <div className="status-badge status-available">

                    <ShieldCheck size={16} />

                    Verification System Online

                </div>

            </div>


            {error && (

                <div className="error-banner">

                    <AlertTriangle size={18} />

                    {error}

                </div>

            )}


            <div className="verification-layout">


                {/* =================================================
                    LEFT PANEL
                ================================================= */}

                <div className="card verification-panel">


                    <div className="verification-panel-header">

                        <div className="verification-icon">

                            <Camera size={24} />

                        </div>


                        <div>

                            <h2>
                                Webcam Verification
                            </h2>

                            <p>
                                Capture a verification
                                image for review.
                            </p>

                        </div>

                    </div>


                    <div className="verification-form">


                        <div className="form-group">

                            <label>
                                Person / Organization
                            </label>


                            <input
                                name="subject_name"
                                value={
                                    form.subject_name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter name"
                            />

                        </div>


                        <div className="form-grid">


                            <div className="form-group">

                                <label>
                                    Subject Type
                                </label>


                                <select
                                    name="subject_type"
                                    value={
                                        form.subject_type
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option>
                                        Supplier
                                    </option>

                                    <option>
                                        Volunteer
                                    </option>

                                    <option>
                                        Driver
                                    </option>

                                    <option>
                                        Relief Worker
                                    </option>

                                </select>

                            </div>


                            <div className="form-group">

                                <label>
                                    Document Type
                                </label>


                                <select
                                    name="document_type"
                                    value={
                                        form.document_type
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option>
                                        Supplier ID
                                    </option>

                                    <option>
                                        Organization ID
                                    </option>

                                    <option>
                                        Driver ID
                                    </option>

                                    <option>
                                        Relief Pass
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* =================================================
                            CAMERA AREA
                        ================================================= */}

                        {!captured ? (

                            <div
                                className={
                                    cameraActive
                                        ? "camera-box camera-active"
                                        : "camera-box"
                                }
                            >


                                {cameraActive ? (

                                    <>

                                        <video
                                            ref={
                                                videoRef
                                            }
                                            autoPlay
                                            muted
                                            playsInline
                                            className="camera-video"
                                        />


                                        <div className="camera-live-indicator">

                                            <span></span>

                                            LIVE CAMERA

                                        </div>


                                        <div className="camera-corner top-left"></div>
                                        <div className="camera-corner top-right"></div>
                                        <div className="camera-corner bottom-left"></div>
                                        <div className="camera-corner bottom-right"></div>

                                    </>

                                ) : (

                                    <div className="camera-placeholder">

                                        <div className="camera-placeholder-icon">

                                            <Camera
                                                size={42}
                                            />

                                        </div>


                                        <h3>
                                            Camera Ready
                                        </h3>


                                        <p>
                                            Click "Start Camera"
                                            to activate the
                                            webcam preview.
                                        </p>

                                    </div>

                                )}

                            </div>

                        ) : (

                            <div className="camera-box">

                                <img
                                    src={imageData}
                                    alt="Verification capture"
                                    className="captured-image"
                                />


                                <div className="capture-label">

                                    <CheckCircle
                                        size={16}
                                    />

                                    Image Captured

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            CAMERA BUTTONS
                        ================================================= */}

                        <div className="camera-actions">


                            {!cameraActive &&
                                !captured && (

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={
                                        startCamera
                                    }
                                >

                                    <Camera
                                        size={17}
                                    />

                                    Start Camera

                                </button>

                            )}


                            {cameraActive && (

                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={
                                        captureImage
                                    }
                                >

                                    <Camera
                                        size={17}
                                    />

                                    Capture Image

                                </button>

                            )}


                            {cameraActive && (

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={
                                        stopCamera
                                    }
                                >

                                    <CameraOff
                                        size={17}
                                    />

                                    Stop Camera

                                </button>

                            )}


                            {captured && (

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={
                                        retake
                                    }
                                >

                                    <RotateCcw
                                        size={17}
                                    />

                                    Retake

                                </button>

                            )}

                        </div>


                        {/* =================================================
                            VERIFICATION SESSION
                        ================================================= */}

                        <button
                            type="button"
                            className="verification-start-button"
                            onClick={
                                beginVerification
                            }
                            disabled={
                                loading
                            }
                        >

                            <FileCheck
                                size={18}
                            />

                            {loading
                                ? "Starting..."
                                : "Start Verification Session"}

                        </button>


                        {verificationId && (

                            <div className="verification-session">

                                <span>
                                    Verification Session
                                </span>

                                <strong>
                                    {verificationId}
                                </strong>

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    RIGHT PANEL
                ================================================= */}

                <div className="card verification-result-panel">


                    <div className="verification-result-header">

                        <div>

                            <h2>
                                Verification Result
                            </h2>

                            <p>
                                Review the captured
                                information.
                            </p>

                        </div>


                        <ShieldCheck
                            size={25}
                        />

                    </div>


                    {!result ? (

                        <div className="verification-empty">

                            <UserCheck
                                size={45}
                            />

                            <h3>
                                Awaiting Verification
                            </h3>

                            <p>
                                Start a session, capture
                                an image and complete the
                                verification process.
                            </p>

                        </div>

                    ) : (

                        <div className="verification-result">


                            <div
                                className={
                                    result.status ===
                                    "Verified"
                                        ? "result-success"
                                        : "result-review"
                                }
                            >

                                {result.status ===
                                "Verified" ? (

                                    <CheckCircle
                                        size={35}
                                    />

                                ) : (

                                    <ShieldAlert
                                        size={35}
                                    />

                                )}


                                <div>

                                    <span>
                                        Verification Status
                                    </span>

                                    <strong>
                                        {
                                            result.status
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="result-details">


                                <div>

                                    <span>
                                        Subject
                                    </span>

                                    <strong>
                                        {
                                            result.subject_name
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Type
                                    </span>

                                    <strong>
                                        {
                                            result.subject_type
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Document
                                    </span>

                                    <strong>
                                        {
                                            result.document_type
                                        }
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Confidence
                                    </span>

                                    <strong>
                                        {
                                            result.confidence
                                        }%
                                    </strong>

                                </div>

                            </div>


                            <div className="result-message">

                                <ShieldCheck
                                    size={18}
                                />

                                {result.message}

                            </div>

                        </div>

                    )}


                    {verificationId &&
                        !result && (

                        <div className="verification-decision">

                            <p>
                                Prototype verification
                                decision
                            </p>


                            <div>

                                <button
                                    type="button"
                                    className="verify-button"
                                    onClick={() =>
                                        completeVerification(
                                            "Verified"
                                        )
                                    }
                                    disabled={
                                        loading
                                    }
                                >

                                    <CheckCircle
                                        size={17}
                                    />

                                    Mark Verified

                                </button>


                                <button
                                    type="button"
                                    className="reject-button"
                                    onClick={() =>
                                        completeVerification(
                                            "Review"
                                        )
                                    }
                                    disabled={
                                        loading
                                    }
                                >

                                    <ShieldAlert
                                        size={17}
                                    />

                                    Require Review

                                </button>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}


export default Verification;