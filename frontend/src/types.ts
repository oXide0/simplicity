export interface Category {
    id: number;
    name: string;
}

export interface Announcement {
    id: string;
    title: string;
    body: string;
    publicationDate: string;
    createdAt: string;
    updatedAt: string;
    categories: Category[];
}

export interface CreateAnnouncementInput {
    title: string;
    body: string;
    publicationDate: string;
    categoryIds: number[];
}

export interface UpdateAnnouncementInput {
    title: string;
    body: string;
    publicationDate: string;
    categoryIds: number[];
}
