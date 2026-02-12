import { Router, Request, Response } from "express";
import { Server as SocketIOServer } from "socket.io";
import * as announcementRepo from "../repositories/announcementRepository";
import { validateAnnouncement } from "../middleware/validation";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const categoriesParam = req.query.category ? String(req.query.category) : undefined;
    const categories = categoriesParam ? categoriesParam.split(",").map(Number) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;

    const announcements = await announcementRepo.findAll({ categories, search });
    res.json({ data: announcements });
});

router.get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const announcement = await announcementRepo.findById(id);
    if (!announcement) {
        res.status(404).json({ error: "Announcement not found" });
        return;
    }
    res.json({ data: announcement });
});

router.post("/", validateAnnouncement, async (req: Request, res: Response) => {
    const announcement = await announcementRepo.create(req.body);
    const io = req.app.get("io") as SocketIOServer;
    io.emit("announcement:created", { data: announcement });
    res.status(201).json({ data: announcement });
});

router.put("/:id", validateAnnouncement, async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const announcement = await announcementRepo.update(id, req.body);
    if (!announcement) {
        res.status(404).json({ error: "Announcement not found" });
        return;
    }
    res.json({ data: announcement });
});

router.delete("/:id", async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const deleted = await announcementRepo.remove(id);
    if (!deleted) {
        res.status(404).json({ error: "Announcement not found" });
        return;
    }
    res.status(204).send();
});

export default router;
