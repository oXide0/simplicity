import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import announcementRoutes from "./routes/announcements";
import categoryRoutes from "./routes/categories";

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: { origin: "http://localhost:5173" },
});

app.use(cors());
app.use(express.json());

app.set("io", io);

app.use("/api/announcements", announcementRoutes);
app.use("/api/categories", categoryRoutes);

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
