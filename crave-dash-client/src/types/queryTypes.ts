export interface QueryParams {
    skip?: number;
    searchTerm?: string | undefined;
    category?: string | undefined;
    cuisine?: string | undefined;
    categoryId?: string | undefined;
    cuisineId?: string | undefined;
    mealType?: string | undefined;
    dietaryTag?: string | undefined;
    semester?: string | undefined;
    role?: string | undefined;
    status?: string | undefined;
    orderStatus?: string | undefined;
    sortBy?: string | undefined;
    sortOrder?: "asc" | "desc" | undefined;
    take?: number;
}