import { X } from "lucide-react";
import styles from "./Toast.module.css";

interface ToastProps {
    message: string;
    onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
    return (
        <div className={styles.toast}>
            <span className={styles.message}>{message}</span>
            <button className={styles.closeBtn} onClick={onClose}>
                <X size={16} />
            </button>
        </div>
    );
}
