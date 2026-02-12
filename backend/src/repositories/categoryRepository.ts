import prisma from "../prisma";
import { CategoryDTO } from "../types";

export async function findAll(): Promise<CategoryDTO[]> {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    });

    return categories.map((c) => ({ id: c.id, name: c.name }));
}
