import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";


import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";


import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Requests from "./pages/Requests";
import Resources from "./pages/Resources";
import Donations from "./pages/Donations";
import Allocation from "./pages/Allocation";
import Prediction from "./pages/Prediction";
import Logistics from "./pages/Logistics";
import Deliveries from "./pages/Deliveries";
import Suppliers from "./pages/Suppliers";
import Verification from "./pages/Verification";
import DisasterMap from "./pages/DisasterMap";
import DigitalTwin from "./pages/DigitalTwin";


function ProtectedLayout() {

    const user =
        localStorage.getItem("user");


    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    return (

        <div className="app-layout">

            <Sidebar />

            <main className="main-content">

                <Topbar />

                <Routes>

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/requests"
                        element={<Requests />}
                    />

                    <Route
                        path="/resources"
                        element={<Resources />}
                    />

                    <Route
                        path="/donations"
                        element={<Donations />}
                    />

                    <Route
                        path="/allocation"
                        element={<Allocation />}
                    />

                    <Route
                        path="/prediction"
                        element={<Prediction />}
                    />

                    <Route
                        path="/logistics"
                        element={<Logistics />}
                    />

                    <Route
                        path="/deliveries"
                        element={<Deliveries />}
                    />

                    <Route
                        path="/suppliers"
                        element={<Suppliers />}
                    />

                    <Route
                        path="/verification"
                        element={<Verification />}
                    />

                    <Route
                        path="/map"
                        element={<DisasterMap />}
                    />

                    <Route
                        path="/digital-twin"
                        element={<DigitalTwin />}
                    />

                    <Route
                        path="*"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                </Routes>

            </main>

        </div>
    );
}


function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/*"
                    element={<ProtectedLayout />}
                />

            </Routes>

        </BrowserRouter>

    );
}


export default App;