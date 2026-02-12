import { Router, Request, Response } from "express";
import * as categoryRepo from "../repositories/categoryRepository";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
    const categories = await categoryRepo.findAll();
    res.json({ data: categories });
});

export default router;
