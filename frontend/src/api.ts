import axios from "axios";
import type { Announcement, Category, CreateAnnouncementInput, UpdateAnnouncementInput } from "./types";

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:4000/api",
});

api.interceptors.response.use(
    (res) => res,
    (error) => {
        const message = error.response?.data?.error || error.message || "Request failed";
        return Promise.reject(new Error(message));
    },
);

export async function fetchAnnouncements(params?: { categories?: number[]; search?: string }): Promise<Announcement[]> {
    const query: Record<string, string> = {};
    if (params?.categories && params.categories.length > 0) query.category = params.categories.join(",");
    if (params?.search) query.search = params.search;
    const { data } = await api.get("/announcements", { params: query });
    return data.data;
}

export async function fetchAnnouncement(id: string): Promise<Announcement> {
    const { data } = await api.get(`/announcements/${id}`);
    return data.data;
}

export async function createAnnouncement(input: CreateAnnouncementInput): Promise<Announcement> {
    const { data } = await api.post("/announcements", input);
    return data.data;
}

export async function updateAnnouncement(id: string, input: UpdateAnnouncementInput): Promise<Announcement> {
    const { data } = await api.put(`/announcements/${id}`, input);
    return data.data;
}

export async function deleteAnnouncement(id: string): Promise<void> {
    await api.delete(`/announcements/${id}`);
}

export async function fetchCategories(): Promise<Category[]> {
    const { data } = await api.get("/categories");
    return data.data;
}
