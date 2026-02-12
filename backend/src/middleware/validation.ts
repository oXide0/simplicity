import { Request, Response, NextFunction } from "express";

export function validateAnnouncement(req: Request, res: Response, next: NextFunction): void {
    const { title, body, publicationDate, categoryIds } = req.body;
    const errors: string[] = [];

    if (!title || typeof title !== "string" || !title.trim()) {
        errors.push("Title is required");
    }

    if (!body || typeof body !== "string" || !body.trim()) {
        errors.push("Body is required");
    }

    if (!publicationDate || typeof publicationDate !== "string" || !publicationDate.trim()) {
        errors.push("Publication date is required");
    } else {
        const date = new Date(publicationDate);
        if (isNaN(date.getTime())) {
            errors.push("Publication date must be a valid date");
        }
    }

    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
        errors.push("At least one category is required");
    } else if (!categoryIds.every((id: unknown) => typeof id === "number")) {
        errors.push("Category IDs must be numbers");
    }

    if (errors.length > 0) {
        res.status(400).json({ error: errors.join(". ") });
        return;
    }

    next();
}
