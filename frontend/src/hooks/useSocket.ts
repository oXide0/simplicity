import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

export function useSocket() {
    const socketRef = useRef<Socket | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    useEffect(() => {
        const socket = io(SOCKET_URL);
        socketRef.current = socket;

        socket.on("announcement:created", (payload) => {
            setNotification(`New announcement: "${payload.data.title}"`);
            setTimeout(() => setNotification(null), 5000);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return {
        notification,
        clearNotification: () => setNotification(null),
    };
}
