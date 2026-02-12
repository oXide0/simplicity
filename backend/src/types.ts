export interface CategoryDTO {
    id: number;
    name: string;
}

export interface AnnouncementDTO {
    id: string;
    title: string;
    body: string;
    publicationDate: string;
    createdAt: string;
    updatedAt: string;
    categories: CategoryDTO[];
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
