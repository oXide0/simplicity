import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Toast from "./Toast";
import { useSocket } from "../hooks/useSocket";

export default function Layout() {
    const { notification, clearNotification } = useSocket();

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <main style={{ flex: 1, padding: "24px", backgroundColor: "#fff" }}>
                <Outlet />
            </main>
            {notification && <Toast message={notification} onClose={clearNotification} />}
        </div>
    );
}
