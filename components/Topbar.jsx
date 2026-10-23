import {
    Bell,
    UserCircle
} from "lucide-react";


function Topbar() {

    const storedUser =
        localStorage.getItem("user");

    const user = storedUser
        ? JSON.parse(storedUser)
        : null;


    return (

        <header className="topbar">

            <div>
                <h2>
                    Disaster Relief Operations
                </h2>

                <p>
                    Real-time emergency coordination
                </p>
            </div>


            <div className="topbar-right">

                <div className="system-status">
                    <span className="status-dot"></span>
                    System Online
                </div>


                <button className="icon-button">
                    <Bell size={20} />
                    <span className="notification-dot"></span>
                </button>


                <div className="user-info">

                    <UserCircle size={34} />

                    <div>

                        <strong>
                            {user?.username || "Admin"}
                        </strong>

                        <span>
                            {user?.role || "Administrator"}
                        </span>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default Topbar;