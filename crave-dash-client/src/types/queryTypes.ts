export interface QueryParams {
    skip?: number;
    searchTerm?: string | undefined;
    semester?: string | undefined;
    status?: string | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    take?: number;
}