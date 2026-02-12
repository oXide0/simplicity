import { NavLink } from "react-router-dom";
import { Megaphone, Building2 } from "lucide-react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav}>
                <div className={styles.navItem}>
                    <Building2 size={18} />
                    Test city
                </div>
                <NavLink
                    to="/announcements"
                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                >
                    <Megaphone size={18} />
                    Announcements
                </NavLink>
            </nav>
        </aside>
    );
}
