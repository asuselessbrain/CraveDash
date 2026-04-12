export type CustomerOrderStatus = "Delivered" | "On the way" | "Preparing" | "Cancelled";

export type CustomerOrder = {
  id: string;
  date: string;
  status: CustomerOrderStatus;
  total: number;
  itemsCount: number;
  items: string[];
  address: string;
};

export const customerOrders: CustomerOrder[] = [
  {
    id: "ORD-240401",
    date: "Apr 1, 2026",
    status: "Delivered",
    total: 24.46,
    itemsCount: 3,
    items: ["Margherita Pizza", "Chocolate Lava Cake", "Mango Smoothie"],
    address: "House 21, Road 12, Dhanmondi, Dhaka",
  },
  {
    id: "ORD-240402",
    date: "Apr 2, 2026",
    status: "On the way",
    total: 18.48,
    itemsCount: 2,
    items: ["Classic Beef Burger", "Cold Coffee"],
    address: "House 8, Road 3, Banani, Dhaka",
  },
  {
    id: "ORD-240403",
    date: "Apr 3, 2026",
    status: "Preparing",
    total: 31.97,
    itemsCount: 4,
    items: ["Kacchi Biryani", "Chicken Biryani", "Mango Smoothie", "Lava Cake"],
    address: "Sector 7, Uttara, Dhaka",
  },
  {
    id: "ORD-240390",
    date: "Mar 30, 2026",
    status: "Cancelled",
    total: 11.99,
    itemsCount: 1,
    items: ["Smoked BBQ Wings"],
    address: "Mohammadpur, Dhaka",
  },
];

export const customerStats = [
  { label: "Total Orders", value: "12", note: "Across all time" },
  { label: "Active Deliveries", value: "2", note: "On the way right now" },
  { label: "Saved Meals", value: "7", note: "Quick reorders" },
  { label: "Reward Points", value: "240", note: "Ready to redeem" },
];
