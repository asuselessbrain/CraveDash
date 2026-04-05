export type ProviderOrderStatus = "Placed" | "Preparing" | "Ready" | "Delivered" | "Cancelled";
export type MealStatus = "Active" | "Paused";
export type ProviderCategoryStatus = "Active" | "Hidden";

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
    id: string;
    name: string;
    cuisine: string;
    image: string;
    meals: number;
    status: ProviderCategoryStatus;
};

export type ProviderCuisine = {
    id?: string;
    name: string;
    image: string;
    meals?: number;
    status: ProviderCategoryStatus;
};

export const providerStats: ProviderDashboardStats = {
    totalOrders: 1284,
    todayOrders: 74,
    totalRevenue: 28640.5,
    activeMeals: 42,
};

export const recentProviderOrders: ProviderRecentOrder[] = [
    { id: "PO-240401", customer: "Nafis Rahman", itemsCount: 3, total: 24.46, status: "Delivered", date: "Apr 1, 2026" },
    { id: "PO-240402", customer: "Sadia Kabir", itemsCount: 2, total: 18.48, status: "Ready", date: "Apr 2, 2026" },
    { id: "PO-240403", customer: "Imran Chowdhury", itemsCount: 4, total: 31.97, status: "Preparing", date: "Apr 3, 2026" },
    { id: "PO-240404", customer: "Farhana Noor", itemsCount: 1, total: 11.99, status: "Placed", date: "Apr 4, 2026" },
];

export const providerMealsSeed: ProviderMeal[] = [
    {
        id: "meal-1",
        name: "Margherita Pizza",
        description: "Stone-baked pizza with tomato sauce, mozzarella, and fresh basil.",
        price: 8.99,
        category: "Pizza",
        cuisine: "Italian",
        image: "/categories/pizza.svg",
        status: "Active",
    },
    {
        id: "meal-2",
        name: "Pepperoni Pizza",
        description: "Loaded with premium pepperoni and melted cheese.",
        price: 10.99,
        category: "Pizza",
        cuisine: "Italian",
        image: "/categories/pizza.svg",
        status: "Active",
    },
    {
        id: "meal-3",
        name: "Classic Beef Burger",
        description: "Juicy beef patty with house sauce and fresh vegetables.",
        price: 7.99,
        category: "Burger",
        cuisine: "American",
        image: "/categories/burger.svg",
        status: "Active",
    },
    {
        id: "meal-4",
        name: "Chicken Biryani",
        description: "Aromatic rice layered with tender chicken and spices.",
        price: 8.99,
        category: "Biryani",
        cuisine: "Indian",
        image: "/categories/biryani.svg",
        status: "Paused",
    },
    {
        id: "meal-5",
        name: "Chocolate Lava Cake",
        description: "Warm chocolate cake with a molten center.",
        price: 5.99,
        category: "Dessert",
        cuisine: "Continental",
        image: "/categories/desserts.svg",
        status: "Active",
    },
];

export const providerOrders: ProviderOrder[] = [
    {
        id: "PO-240401",
        customer: "Nafis Rahman",
        items: "Margherita Pizza, Mango Smoothie",
        status: "Delivered",
        date: "Apr 1, 2026",
        total: 24.46,
        address: "Dhanmondi, Dhaka",
        itemsList: [
            { name: "Margherita Pizza", qty: 1, price: 8.99 },
            { name: "Chocolate Lava Cake", qty: 2, price: 5.99 },
        ],
    },
    {
        id: "PO-240402",
        customer: "Sadia Kabir",
        items: "Pepperoni Pizza",
        status: "Ready",
        date: "Apr 2, 2026",
        total: 18.48,
        address: "Banani, Dhaka",
        itemsList: [
            { name: "Pepperoni Pizza", qty: 1, price: 10.99 },
            { name: "Cold Coffee", qty: 2, price: 3.99 },
        ],
    },
    {
        id: "PO-240403",
        customer: "Imran Chowdhury",
        items: "Biryani Combo",
        status: "Preparing",
        date: "Apr 3, 2026",
        total: 31.97,
        address: "Uttara, Dhaka",
        itemsList: [
            { name: "Kacchi Biryani", qty: 2, price: 9.99 },
            { name: "Mango Smoothie", qty: 1, price: 4.49 },
        ],
    },
    {
        id: "PO-240404",
        customer: "Farhana Noor",
        items: "Burger Combo",
        status: "Placed",
        date: "Apr 4, 2026",
        total: 11.99,
        address: "Mohammadpur, Dhaka",
        itemsList: [{ name: "Smoked BBQ Wings", qty: 1, price: 11.99 }],
    },
];

export const providerOrderDetailMap: Record<string, ProviderOrder> = providerOrders.reduce<Record<string, ProviderOrder>>((accumulator, order) => {
    accumulator[order.id.toLowerCase()] = order;
    return accumulator;
}, {});

export const providerCategories: ProviderCategory[] = [
    { id: "cat-1", name: "Pizza", cuisine: "Italian", image: "/categories/pizza.svg", meals: 12, status: "Active" },
    { id: "cat-2", name: "Burger", cuisine: "American", image: "/categories/burger.svg", meals: 8, status: "Active" },
    { id: "cat-3", name: "Biryani", cuisine: "Indian", image: "/categories/biryani.svg", meals: 6, status: "Active" },
    { id: "cat-4", name: "Dessert", cuisine: "Continental", image: "/categories/desserts.svg", meals: 5, status: "Active" },
    { id: "cat-5", name: "Beverages", cuisine: "Continental", image: "/categories/beverages.svg", meals: 4, status: "Hidden" },
];

export const providerCuisines: ProviderCuisine[] = [
    { id: "cui-1", name: "Italian", image: "/cuisines/italian.svg", meals: 8, status: "Active" },
    { id: "cui-2", name: "Chinese", image: "/cuisines/chinese.svg", meals: 10, status: "Active" },
    { id: "cui-3", name: "Indian", image: "/cuisines/indian.svg", meals: 12, status: "Active" },
    { id: "cui-4", name: "Mexican", image: "/cuisines/mexican.svg", meals: 6, status: "Active" },
    { id: "cui-5", name: "Japanese", image: "/cuisines/japanese.svg", meals: 7, status: "Active" },
];

export const mealCategories = ["All", "Pizza", "Burger", "Biryani", "Dessert"] as const;
export const cuisineOptions = ["Italian", "Chinese", "Indian", "Mexican", "Japanese", "Thai", "Turkish", "Lebanese", "American", "Continental"] as const;
export const orderStatusOptions = ["All", "Placed", "Preparing", "Ready", "Delivered", "Cancelled"] as const;
export const mealStatusOptions = ["Active", "Paused"] as const;
