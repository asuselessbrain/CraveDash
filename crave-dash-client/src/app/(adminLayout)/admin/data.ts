export type AdminRole = "Admin" | "Customer" | "Provider" | "Moderator";
export type AdminUserStatus = "Active" | "Suspended";
export type AdminOrderStatus = "Placed" | "Preparing" | "Shipped" | "Delivered" | "Cancelled";

export type AdminUser = {
    id: string;
    name: string;
    email: string;
    role: AdminRole;
    status: AdminUserStatus;
    joinDate: string;
    phone: string;
    address: string;
};

export type AdminOrder = {
    id: string;
    customer: string;
    status: AdminOrderStatus;
    date: string;
    total: number;
    itemsCount: number;
    items: string[];
    address: string;
};

export type AdminCategory = {
    id: string;
    name: string;
    image: string;
    meals: number;
    status: "Active" | "Hidden";
};

export const adminStats = {
    totalUsers: 12846,
    totalOrders: 8724,
    totalProviders: 146,
    totalRevenue: 286405.2,
};

export const adminUsers: AdminUser[] = [
    { id: "usr-1", name: "Arman Khan", email: "arman@example.com", role: "Admin", status: "Active", joinDate: "Jan 12, 2025", phone: "01711-111111", address: "Dhanmondi, Dhaka" },
    { id: "usr-2", name: "Nafis Rahman", email: "nafis@example.com", role: "Customer", status: "Active", joinDate: "Mar 08, 2025", phone: "01822-222222", address: "Banani, Dhaka" },
    { id: "usr-3", name: "Pizza Palace", email: "hello@pizzapalace.com", role: "Provider", status: "Active", joinDate: "Feb 15, 2025", phone: "01933-333333", address: "Road 12, Dhanmondi" },
    { id: "usr-4", name: "Sadia Kabir", email: "sadia@example.com", role: "Customer", status: "Suspended", joinDate: "Apr 22, 2025", phone: "01744-444444", address: "Uttara, Dhaka" },
    { id: "usr-5", name: "Wok Street", email: "contact@wokstreet.com", role: "Provider", status: "Active", joinDate: "May 10, 2025", phone: "01855-555555", address: "Gulshan, Dhaka" },
    { id: "usr-6", name: "Mariya Ahmed", email: "mariya@example.com", role: "Moderator", status: "Active", joinDate: "Jun 02, 2025", phone: "01666-666666", address: "Mirpur, Dhaka" },
];

export const adminOrders: AdminOrder[] = [
    { id: "AO-240401", customer: "Nafis Rahman", status: "Delivered", date: "Apr 1, 2026", total: 24.46, itemsCount: 3, items: ["Margherita Pizza", "Chocolate Lava Cake", "Mango Smoothie"], address: "Dhanmondi, Dhaka" },
    { id: "AO-240402", customer: "Sadia Kabir", status: "Shipped", date: "Apr 2, 2026", total: 18.48, itemsCount: 2, items: ["Classic Beef Burger", "Cold Coffee"], address: "Banani, Dhaka" },
    { id: "AO-240403", customer: "Imran Chowdhury", status: "Preparing", date: "Apr 3, 2026", total: 31.97, itemsCount: 4, items: ["Kacchi Biryani", "Mango Smoothie"], address: "Uttara, Dhaka" },
    { id: "AO-240404", customer: "Farhana Noor", status: "Placed", date: "Apr 4, 2026", total: 11.99, itemsCount: 1, items: ["Smoked BBQ Wings"], address: "Mohammadpur, Dhaka" },
    { id: "AO-240405", customer: "Raihan Ahmed", status: "Cancelled", date: "Apr 4, 2026", total: 9.49, itemsCount: 1, items: ["Chicken Chow Mein"], address: "Mirpur, Dhaka" },
];

export const adminCategories: AdminCategory[] = [
    { id: "cat-1", name: "Pizza", image: "/categories/pizza.svg", meals: 18, status: "Active" },
    { id: "cat-2", name: "Burger", image: "/categories/burger.svg", meals: 22, status: "Active" },
    { id: "cat-3", name: "Biryani", image: "/categories/biryani.svg", meals: 15, status: "Active" },
    { id: "cat-4", name: "Chinese", image: "/categories/chinese.svg", meals: 20, status: "Active" },
    { id: "cat-5", name: "Desserts", image: "/categories/desserts.svg", meals: 12, status: "Active" },
    { id: "cat-6", name: "Drinks", image: "/categories/drinks.svg", meals: 9, status: "Hidden" },
];

export const orderTrend = [72, 88, 64, 105, 126, 110, 142];
export const revenueTrend = [36, 48, 42, 58, 64, 59, 74];
