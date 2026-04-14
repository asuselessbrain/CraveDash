export type ProviderOrderStatus = "Placed" | "Preparing" | "Ready" | "Delivered" | "Cancelled";
export type MealStatus = "Active" | "Paused";
export type ProviderCategoryStatus = "ACTIVE" | "INACTIVE";

export type ProviderDashboardStats = {
    totalOrders: number;
    todayOrders: number;
    totalRevenue: number;
    activeMeals: number;
};

export type ProviderRecentOrder = {
    id: string;
    customer: string;
    itemsCount: number;
    total: number;
    status: ProviderOrderStatus;
    date: string;
};

export type ProviderMeal = {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    cuisine: string;
    image: string;
    status: MealStatus;
};

export type ProviderOrder = {
    id: string;
    customer: string;
    items: string;
    status: ProviderOrderStatus;
    date: string;
    total: number;
    address: string;
    itemsList: Array<{ name: string; qty: number; price: number }>;
};

export type ProviderCategory = {
    id?: string;
    name: string;
    cuisine?: string;
    cuisineId?: string;
    image?: string;
    meals?: number;
    mealsCount?: number;
    status?: ProviderCategoryStatus;
};

export type ProviderCuisine = {
    id?: string;
    name: string;
    image: string;
    meals?: number;
    mealsCount?: number;
    categories?: number;
    categoriesCount?: number;
    status?: string
};

export const providerStats: ProviderDashboardStats = {
    totalOrders: 1284,
    todayOrders: 74,
    totalRevenue: 28640.5,
    activeMeals: 42,
};

export const mealCategories = ["All", "Pizza", "Burger", "Biryani", "Dessert"] as const;
export const cuisineOptions = ["Italian", "Chinese", "Indian", "Mexican", "Japanese", "Thai", "Turkish", "Lebanese", "American", "Continental"] as const;
export const orderStatusOptions = ["All", "Placed", "Preparing", "Ready", "Delivered", "Cancelled"] as const;
export const mealStatusOptions = ["Active", "Paused"] as const;
