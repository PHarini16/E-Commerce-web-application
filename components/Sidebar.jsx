import {
    LayoutDashboard,
    ClipboardList,
    Package,
    HeartHandshake,
    Brain,
    TrendingDown,
    Route,
    Truck,
    Building2,
    Camera,
    Map,
    Boxes,
    LogOut
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";


function Sidebar() {

    const navigate = useNavigate();


    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard
        },
        {
            name: "Relief Requests",
            path: "/requests",
            icon: ClipboardList
        },
        {
            name: "Resources",
            path: "/resources",
            icon: Package
        },
        {
            name: "Donations",
            path: "/donations",
            icon: HeartHandshake
        },
        {
            name: "AI Allocation",
            path: "/allocation",
            icon: Brain
        },
        {
            name: "Shortage Prediction",
            path: "/prediction",
            icon: TrendingDown
        },
        {
            name: "Logistics",
            path: "/logistics",
            icon: Route
        },
        {
            name: "Deliveries",
            path: "/deliveries",
            icon: Truck
        },
        {
            name: "Suppliers",
            path: "/suppliers",
            icon: Building2
        },
        {
            name: "Verification",
            path: "/verification",
            icon: Camera
        },
        {
            name: "Disaster Map",
            path: "/map",
            icon: Map
        },
        {
            name: "Digital Twin",
            path: "/digital-twin",
            icon: Boxes
        }
    ];


    function logout() {

        localStorage.removeItem("user");

        navigate("/");

    }


    return (

        <aside className="sidebar">

            {/* LOGO */}

            <div className="sidebar-logo">

                <div className="sidebar-logo-icon">

                    <Brain size={23} />

                </div>


                <div>

                    <h2>
                        ReliefCore
                    </h2>

                    <span>
                        Command Centre
                    </span>

                </div>

            </div>


            {/* NAVIGATION */}

            <nav className="sidebar-nav">

                <div className="sidebar-section-title">
                    Operations
                </div>


                {menuItems.map(
                    (item) => {

                        const Icon =
                            item.icon;

                        return (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    isActive
                                        ? "sidebar-link active"
                                        : "sidebar-link"
                                }
                            >

                                <Icon size={18} />

                                <span>
                                    {item.name}
                                </span>

                            </NavLink>

                        );

                    }
                )}

            </nav>


            {/* LOGOUT */}

            <div className="sidebar-bottom">

                <button
                    className="sidebar-link"
                    onClick={logout}
                    style={{
                        border: "none",
                        background: "transparent",
                        width: "100%",
                        cursor: "pointer"
                    }}
                >

                    <LogOut size={18} />

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </aside>

    );

}


export default Sidebar;