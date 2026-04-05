"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import { notFound } from "next/navigation";
import { Bike, Clock3, MapPin, Search, ShieldCheck, Star } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type MenuCategory = "Pizza" | "Burger" | "Biryani" | "Chinese" | "Dessert" | "Drinks" | "BBQ" | "Steak";

type ProviderMeal = {
    id: string;
    name: string;
    image: string;
    category: MenuCategory;
    price: number;
    rating: number;
    prepTime: string;
    tags: string[];
};

type ProviderProfile = {
    id: string;
    name: string;
    logo: string;
    banner: string;
    description: string;
    rating: number;
    reviews: number;
    deliveryTime: string;
    deliveryFee: string;
    minOrder: string;
    address: string;
    isVerified: boolean;
    cuisines: string[];
    openingHours: string;
    menu: ProviderMeal[];
};

const providerData: Record<string, ProviderProfile> = {
    "pizza-palace": {
        id: "pizza-palace",
        name: "Pizza Palace",
        logo: "/categories/pizza.svg",
        banner: "/cuisines/italian.svg",
        description:
            "Stone-oven pizzas, handcrafted sauces, and fresh toppings delivered hot and fast. Known for bold flavors and consistent quality.",
        rating: 4.8,
        reviews: 1480,
        deliveryTime: "25-30 min",
        deliveryFee: "$1.20",
        minOrder: "$6.00",
        address: "Road 12, Dhanmondi, Dhaka",
        isVerified: true,
        cuisines: ["Italian", "Fast Food", "Dessert"],
        openingHours: "10:00 AM - 11:30 PM",
        menu: [
            { id: "1", name: "Margherita Pizza", image: "/categories/pizza.svg", category: "Pizza", price: 8.99, rating: 4.6, prepTime: "18 min", tags: ["Veg", "Bestseller"] },
            { id: "2", name: "Pepperoni Pizza", image: "/categories/pizza.svg", category: "Pizza", price: 10.99, rating: 4.7, prepTime: "20 min", tags: ["Popular"] },
            { id: "15", name: "Veggie Supreme Pizza", image: "/categories/pizza.svg", category: "Pizza", price: 9.49, rating: 4.5, prepTime: "19 min", tags: ["Veg"] },
            { id: "9", name: "Chocolate Lava Cake", image: "/categories/desserts.svg", category: "Dessert", price: 5.99, rating: 4.7, prepTime: "14 min", tags: ["Sweet"] },
            { id: "12", name: "Cold Coffee", image: "/categories/drinks.svg", category: "Drinks", price: 3.99, rating: 4.4, prepTime: "8 min", tags: ["Cold"] },
        ],
    },
    "burger-hub": {
        id: "burger-hub",
        name: "Burger Hub",
        logo: "/categories/burger.svg",
        banner: "/categories/burger.svg",
        description: "Smash-style burgers and loaded sides made to order with premium buns and signature sauces.",
        rating: 4.7,
        reviews: 1210,
        deliveryTime: "20-28 min",
        deliveryFee: "$1.00",
        minOrder: "$5.00",
        address: "Banani 11, Dhaka",
        isVerified: true,
        cuisines: ["American", "Fast Food"],
        openingHours: "11:00 AM - 12:00 AM",
        menu: [
            { id: "3", name: "Classic Beef Burger", image: "/categories/burger.svg", category: "Burger", price: 7.99, rating: 4.5, prepTime: "13 min", tags: ["Bestseller"] },
            { id: "4", name: "Crispy Chicken Burger", image: "/categories/burger.svg", category: "Burger", price: 8.49, rating: 4.4, prepTime: "15 min", tags: ["Crunchy"] },
            { id: "17", name: "Falafel Burger", image: "/categories/burger.svg", category: "Burger", price: 8.29, rating: 4.3, prepTime: "12 min", tags: ["Vegan"] },
            { id: "11", name: "Mango Smoothie", image: "/categories/drinks.svg", category: "Drinks", price: 4.49, rating: 4.5, prepTime: "6 min", tags: ["Fresh"] },
        ],
    },
    "biryani-ghor": {
        id: "biryani-ghor",
        name: "Biryani Ghor",
        logo: "/categories/biryani.svg",
        banner: "/categories/biryani.svg",
        description: "Traditional dum biryani, aromatic rice, and slow-cooked meats with authentic spice blends.",
        rating: 4.9,
        reviews: 2034,
        deliveryTime: "30-38 min",
        deliveryFee: "$1.50",
        minOrder: "$7.00",
        address: "Mirpur DOHS, Dhaka",
        isVerified: true,
        cuisines: ["Bangladeshi", "Mughlai"],
        openingHours: "10:30 AM - 11:00 PM",
        menu: [
            { id: "5", name: "Kacchi Biryani", image: "/categories/biryani.svg", category: "Biryani", price: 9.99, rating: 4.8, prepTime: "24 min", tags: ["Signature"] },
            { id: "6", name: "Chicken Biryani", image: "/categories/biryani.svg", category: "Biryani", price: 8.99, rating: 4.6, prepTime: "20 min", tags: ["Classic"] },
        ],
    },
    "wok-street": {
        id: "wok-street",
        name: "Wok Street",
        logo: "/categories/chinese.svg",
        banner: "/cuisines/chinese.svg",
        description: "Street-style Asian bowls, wok-fried noodles, and quick comfort food prepared with balanced heat.",
        rating: 4.6,
        reviews: 932,
        deliveryTime: "22-30 min",
        deliveryFee: "$1.10",
        minOrder: "$6.00",
        address: "Gulshan 2, Dhaka",
        isVerified: true,
        cuisines: ["Chinese", "Asian Fusion"],
        openingHours: "11:00 AM - 11:30 PM",
        menu: [
            { id: "7", name: "Szechuan Chicken", image: "/categories/chinese.svg", category: "Chinese", price: 10.49, rating: 4.3, prepTime: "16 min", tags: ["Spicy"] },
            { id: "8", name: "Chicken Chow Mein", image: "/categories/chinese.svg", category: "Chinese", price: 9.49, rating: 4.4, prepTime: "15 min", tags: ["Popular"] },
            { id: "16", name: "Tofu Rice Bowl", image: "/categories/chinese.svg", category: "Chinese", price: 8.99, rating: 4.4, prepTime: "14 min", tags: ["Vegan"] },
        ],
    },
    "sweet-room": {
        id: "sweet-room",
        name: "Sweet Room",
        logo: "/categories/desserts.svg",
        banner: "/categories/desserts.svg",
        description: "Premium desserts, cakes, and sweet pairings handcrafted daily for every craving.",
        rating: 4.8,
        reviews: 865,
        deliveryTime: "18-25 min",
        deliveryFee: "$0.90",
        minOrder: "$4.00",
        address: "Bashundhara R/A, Dhaka",
        isVerified: true,
        cuisines: ["Dessert", "Bakery"],
        openingHours: "9:00 AM - 11:00 PM",
        menu: [
            { id: "9", name: "Chocolate Lava Cake", image: "/categories/desserts.svg", category: "Dessert", price: 5.99, rating: 4.7, prepTime: "10 min", tags: ["Hot"] },
            { id: "10", name: "Strawberry Cheesecake", image: "/categories/desserts.svg", category: "Dessert", price: 6.49, rating: 4.8, prepTime: "9 min", tags: ["Creamy"] },
            { id: "11", name: "Mango Smoothie", image: "/categories/drinks.svg", category: "Drinks", price: 4.49, rating: 4.5, prepTime: "6 min", tags: ["Refreshing"] },
        ],
    },
    "grill-yard": {
        id: "grill-yard",
        name: "Grill Yard",
        logo: "/categories/bbq.svg",
        banner: "/categories/bbq.svg",
        description: "Live-grilled platters, smoked meats, and high-protein meal boxes with robust flavor.",
        rating: 4.7,
        reviews: 1104,
        deliveryTime: "28-35 min",
        deliveryFee: "$1.30",
        minOrder: "$8.00",
        address: "Uttara Sector 7, Dhaka",
        isVerified: true,
        cuisines: ["BBQ", "Grill"],
        openingHours: "12:00 PM - 12:30 AM",
        menu: [
            { id: "13", name: "Smoked BBQ Wings", image: "/categories/bbq.svg", category: "BBQ", price: 11.99, rating: 4.6, prepTime: "20 min", tags: ["Smoked"] },
            { id: "14", name: "Grilled Ribeye", image: "/categories/steak.svg", category: "Steak", price: 16.99, rating: 4.7, prepTime: "26 min", tags: ["Premium"] },
            { id: "18", name: "Greek Steak Platter", image: "/categories/steak.svg", category: "Steak", price: 17.49, rating: 4.8, prepTime: "24 min", tags: ["Chef Pick"] },
        ],
    },
};

type ProviderProfilePageProps = {
    params: Promise<{ id: string }>;
};

export default function ProviderProfilePage({ params }: ProviderProfilePageProps) {
    const { id } = use(params);
    const provider = providerData[id];

    if (!provider) {
        notFound();
    }

    const [selectedCategories, setSelectedCategories] = useState<MenuCategory[]>([]);
    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const menuCategories = useMemo(() => {
        return [...new Set(provider.menu.map((item) => item.category))] as MenuCategory[];
    }, [provider.menu]);

    const filteredMenu = useMemo(() => {
        return provider.menu.filter((item) => {
            const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
            const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
            return matchCategory && matchSearch;
        });
    }, [provider.menu, search, selectedCategories]);

    const toggleCategory = (value: MenuCategory) => {
        setSelectedCategories((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
    };

    return (
        <main className="food-landing-bg">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <section className="relative overflow-hidden rounded-3xl border border-orange-200/70 bg-white/85 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85 sm:p-8">
                    <div className="absolute inset-0 opacity-20">
                        <Image src={provider.banner} alt={`${provider.name} banner`} fill sizes="100vw" className="object-cover" />
                    </div>

                    <div className="relative grid gap-6 lg:grid-cols-[120px_1fr] lg:items-center">
                        <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-white/80 bg-white shadow-sm">
                            <Image src={provider.logo} alt={`${provider.name} logo`} fill sizes="96px" className="object-cover" />
                        </div>

                        <div>
                            <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Provider Profile</p>
                            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">{provider.name}</h1>
                            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">{provider.description}</p>

                            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-900">
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    {provider.rating} ({provider.reviews.toLocaleString()} reviews)
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-900">
                                    <Bike className="h-4 w-4 text-orange-500" />
                                    {provider.deliveryTime}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-slate-700 dark:bg-slate-900">
                                    <Clock3 className="h-4 w-4 text-orange-500" />
                                    {provider.openingHours}
                                </span>
                                {provider.isVerified && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                                        <ShieldCheck className="h-4 w-4" />
                                        Verified Provider
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-900/90">
                        <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Delivery Fee</p>
                        <p className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">{provider.deliveryFee}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-900/90">
                        <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Minimum Order</p>
                        <p className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">{provider.minOrder}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-900/90">
                        <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Cuisine Focus</p>
                        <p className="mt-2 text-xl font-black text-slate-900 dark:text-slate-100">{provider.cuisines.slice(0, 2).join(" & ")}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-900/90">
                        <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Location</p>
                        <p className="mt-2 inline-flex items-center gap-1 text-base font-bold text-slate-900 dark:text-slate-100">
                            <MapPin className="h-4 w-4 text-orange-500" />
                            {provider.address}
                        </p>
                    </div>
                </section>

                <section className="mt-8 rounded-3xl border border-orange-200/70 bg-white/85 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85 sm:p-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Complete Menu</p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">Explore Meals by Category</h2>
                        </div>

                        <div className="relative w-full max-w-sm">
                            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search from this provider"
                                className="h-11 rounded-xl bg-white pl-9 dark:bg-slate-900"
                            />
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
                        <aside className="rounded-2xl border border-orange-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-orange-400/20 dark:bg-slate-900/80">
                            <h3 className="text-sm font-bold tracking-widest text-slate-900 uppercase dark:text-slate-100">Category</h3>
                            <div className="mt-3 space-y-2">
                                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.length === 0}
                                        onChange={() => setSelectedCategories([])}
                                        className="h-4 w-4 accent-orange-500"
                                    />
                                    All categories
                                </label>

                                {menuCategories.map((category) => (
                                    <label key={category} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => toggleCategory(category)}
                                            className="h-4 w-4 accent-orange-500"
                                        />
                                        {category}
                                    </label>
                                ))}
                            </div>

                            <div className="mt-6">
                                <h3 className="text-sm font-bold tracking-widest text-slate-900 uppercase dark:text-slate-100">Provider Stats</h3>
                                <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                    <p className="flex items-center justify-between"><span>Rating</span><span className="font-semibold">{provider.rating}</span></p>
                                    <p className="flex items-center justify-between"><span>Reviews</span><span className="font-semibold">{provider.reviews.toLocaleString()}</span></p>
                                    <p className="flex items-center justify-between"><span>Delivery</span><span className="font-semibold">{provider.deliveryTime}</span></p>
                                </div>
                            </div>
                        </aside>

                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    Showing {filteredMenu.length} meals
                                </p>

                                <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode("grid")}
                                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${viewMode === "grid" ? "bg-orange-500 text-white" : "text-slate-600 dark:text-slate-300"}`}
                                    >
                                        Grid
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setViewMode("list")}
                                        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${viewMode === "list" ? "bg-orange-500 text-white" : "text-slate-600 dark:text-slate-300"}`}
                                    >
                                        List
                                    </button>
                                </div>
                            </div>

                            <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                                {filteredMenu.map((item) => (
                                    <article key={item.id} className={`overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/90 ${viewMode === "list" ? "flex" : ""}`}>
                                        <div className={`relative overflow-hidden ${viewMode === "list" ? "h-34 w-40 shrink-0" : "h-40 w-full"}`}>
                                            <Image src={item.image} alt={item.name} fill sizes="(min-width: 1280px) 30vw, 50vw" className="object-cover transition duration-500 hover:scale-110" />
                                        </div>

                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{item.name}</h3>
                                                    <p className="mt-1 text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">{item.category}</p>
                                                </div>
                                                <span className="text-base font-black text-orange-600 dark:text-orange-300">${item.price.toFixed(2)}</span>
                                            </div>

                                            <div className="mt-3 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                                                <span className="inline-flex items-center gap-1">
                                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                                    {item.rating}
                                                </span>
                                                <span>{item.prepTime}</span>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {item.tags.map((tag) => (
                                                    <span key={tag} className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="mt-4 flex gap-2">
                                                <Button asChild className="h-10 flex-1 rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                                                    <Link href={`/meals/${item.id}`}>View Details</Link>
                                                </Button>
                                                <Button variant="outline" className="h-10 rounded-xl">
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </div>

                    {filteredMenu.length === 0 && (
                        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            No meals matched your current filter.
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}