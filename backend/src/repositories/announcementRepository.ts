import prisma from "../prisma";
import { AnnouncementDTO, CreateAnnouncementInput, UpdateAnnouncementInput } from "../types";
import type { Prisma } from "../generated/prisma/client";

const announcementInclude = {
    categories: {
        include: {
            category: true,
        },
    },
} satisfies Prisma.AnnouncementInclude;

function toDTO(
    announcement: Prisma.AnnouncementGetPayload<{
        include: typeof announcementInclude;
    }>,
): AnnouncementDTO {
    return {
        id: announcement.id,
        title: announcement.title,
        body: announcement.body,
        publicationDate: announcement.publicationDate.toISOString(),
        createdAt: announcement.createdAt.toISOString(),
        updatedAt: announcement.updatedAt.toISOString(),
        categories: announcement.categories.map((ac) => ({
            id: ac.category.id,
            name: ac.category.name,
        })),
    };
}

export async function findAll(filters?: { category?: number; search?: string }): Promise<AnnouncementDTO[]> {
    const where: Prisma.AnnouncementWhereInput = {};

    if (filters?.category) {
        where.categories = {
            some: {
                categoryId: filters.category,
            },
        };
    }

    if (filters?.search) {
        where.OR = [{ title: { contains: filters.search } }, { body: { contains: filters.search } }];
    }

    const announcements = await prisma.announcement.findMany({
        where,
        include: announcementInclude,
        orderBy: { updatedAt: "desc" },
    });

    return announcements.map(toDTO);
}

export async function findById(id: string): Promise<AnnouncementDTO | null> {
    const announcement = await prisma.announcement.findUnique({
        where: { id },
        include: announcementInclude,
    });

    return announcement ? toDTO(announcement) : null;
}

export async function create(input: CreateAnnouncementInput): Promise<AnnouncementDTO> {
    const announcement = await prisma.announcement.create({
        data: {
            title: input.title,
            body: input.body,
            publicationDate: new Date(input.publicationDate),
            categories: {
                create: input.categoryIds.map((categoryId) => ({
                    categoryId,
                })),
            },
        },
        include: announcementInclude,
    });

    return toDTO(announcement);
}

export async function update(id: string, input: UpdateAnnouncementInput): Promise<AnnouncementDTO | null> {
    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) return null;

    const announcement = await prisma.announcement.update({
        where: { id },
        data: {
            title: input.title,
            body: input.body,
            publicationDate: new Date(input.publicationDate),
            categories: {
                deleteMany: {},
                create: input.categoryIds.map((categoryId) => ({
                    categoryId,
                })),
            },
        },
        include: announcementInclude,
    });

    return toDTO(announcement);
}

export async function remove(id: string): Promise<boolean> {
    try {
        await prisma.announcement.delete({ where: { id } });
        return true;
    } catch {
        return false;
    }
}
