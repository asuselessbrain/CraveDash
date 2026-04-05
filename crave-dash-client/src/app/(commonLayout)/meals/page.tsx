"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Star } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Category = "pizza" | "burger" | "biryani" | "chinese" | "desserts" | "drinks" | "bbq" | "steak";
type Dietary = "veg" | "vegan" | "halal" | "gluten-free";

type Meal = {
    id: number;
    name: string;
    image: string;
    provider: string;
    category: Category;
    dietary: Dietary[];
    price: number;
    rating: number;
};

const categories: Category[] = ["pizza", "burger", "biryani", "chinese", "desserts", "drinks", "bbq", "steak"];
const dietaryOptions: Dietary[] = ["veg", "vegan", "halal", "gluten-free"];

const meals: Meal[] = [
    { id: 1, name: "Margherita Pizza", image: "/categories/pizza.svg", provider: "Pizza Palace", category: "pizza", dietary: ["veg"], price: 8.99, rating: 4.6 },
    { id: 2, name: "Pepperoni Pizza", image: "/categories/pizza.svg", provider: "Pizza Palace", category: "pizza", dietary: ["halal"], price: 10.99, rating: 4.7 },
    { id: 3, name: "Classic Beef Burger", image: "/categories/burger.svg", provider: "Burger Hub", category: "burger", dietary: ["halal"], price: 7.99, rating: 4.5 },
    { id: 4, name: "Crispy Chicken Burger", image: "/categories/burger.svg", provider: "Burger Hub", category: "burger", dietary: ["halal"], price: 8.49, rating: 4.4 },
    { id: 5, name: "Kacchi Biryani", image: "/categories/biryani.svg", provider: "Biryani Ghar", category: "biryani", dietary: ["halal"], price: 9.99, rating: 4.8 },
    { id: 6, name: "Chicken Biryani", image: "/categories/biryani.svg", provider: "Biryani Ghar", category: "biryani", dietary: ["halal"], price: 8.99, rating: 4.6 },
    { id: 7, name: "Szechuan Chicken", image: "/categories/chinese.svg", provider: "Wok Street", category: "chinese", dietary: ["halal"], price: 10.49, rating: 4.3 },
    { id: 8, name: "Chicken Chow Mein", image: "/categories/chinese.svg", provider: "Wok Street", category: "chinese", dietary: ["halal"], price: 9.49, rating: 4.4 },
    { id: 9, name: "Chocolate Lava Cake", image: "/categories/desserts.svg", provider: "Sweet Room", category: "desserts", dietary: ["veg"], price: 5.99, rating: 4.7 },
    { id: 10, name: "Strawberry Cheesecake", image: "/categories/desserts.svg", provider: "Sweet Room", category: "desserts", dietary: ["veg"], price: 6.49, rating: 4.8 },
    { id: 11, name: "Mango Smoothie", image: "/categories/drinks.svg", provider: "Juice Point", category: "drinks", dietary: ["veg", "vegan", "gluten-free"], price: 4.49, rating: 4.5 },
    { id: 12, name: "Cold Coffee", image: "/categories/drinks.svg", provider: "Juice Point", category: "drinks", dietary: ["veg", "gluten-free"], price: 3.99, rating: 4.4 },
    { id: 13, name: "Smoked BBQ Wings", image: "/categories/bbq.svg", provider: "Grill Yard", category: "bbq", dietary: ["halal"], price: 11.99, rating: 4.6 },
    { id: 14, name: "Grilled Ribeye", image: "/categories/steak.svg", provider: "Prime Cut", category: "steak", dietary: ["halal", "gluten-free"], price: 16.99, rating: 4.7 },
    { id: 15, name: "Veggie Supreme Pizza", image: "/categories/pizza.svg", provider: "Pizza Palace", category: "pizza", dietary: ["veg"], price: 9.49, rating: 4.5 },
    { id: 16, name: "Tofu Rice Bowl", image: "/categories/chinese.svg", provider: "Wok Street", category: "chinese", dietary: ["vegan"], price: 8.99, rating: 4.4 },
    { id: 17, name: "Falafel Burger", image: "/categories/burger.svg", provider: "Burger Hub", category: "burger", dietary: ["vegan"], price: 8.29, rating: 4.3 },
    { id: 18, name: "Greek Steak Platter", image: "/categories/steak.svg", provider: "Prime Cut", category: "steak", dietary: ["gluten-free"], price: 17.49, rating: 4.8 },
];

function titleCase(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

const providerSlugByName: Record<string, string> = {
    "Pizza Palace": "pizza-palace",
    "Burger Hub": "burger-hub",
    "Biryani Ghar": "biryani-ghor",
    "Wok Street": "wok-street",
    "Sweet Room": "sweet-room",
    "Juice Point": "sweet-room",
    "Grill Yard": "grill-yard",
    "Prime Cut": "grill-yard",
};

export default function MealsPage() {
    const [search, setSearch] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [selectedDietary, setSelectedDietary] = useState<Dietary[]>([]);
    const [maxPrice, setMaxPrice] = useState(25);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [page, setPage] = useState(1);

    const itemsPerPage = 8;

    const filteredMeals = useMemo(() => {
        return meals.filter((meal) => {
            const matchesSearch = meal.name.toLowerCase().includes(search.toLowerCase()) || meal.provider.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(meal.category);
            const matchesDietary = selectedDietary.length === 0 || selectedDietary.every((item) => meal.dietary.includes(item));
            const matchesPrice = meal.price <= maxPrice;

            return matchesSearch && matchesCategory && matchesDietary && matchesPrice;
        });
    }, [search, selectedCategories, selectedDietary, maxPrice]);

    const totalPages = Math.max(Math.ceil(filteredMeals.length / itemsPerPage), 1);
    const currentPage = Math.min(page, totalPages);

    const paginatedMeals = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredMeals.slice(start, start + itemsPerPage);
    }, [filteredMeals, currentPage]);

    const toggleDietary = (value: Dietary) => {
        setPage(1);
        setSelectedDietary((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
    };

    const toggleCategory = (value: Category) => {
        setPage(1);
        setSelectedCategories((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
    };

    return (
        <main className="food-landing-bg">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <header className="mb-6">
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Browse Meals</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Find Your Perfect Dish</h1>
                </header>

                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full max-w-lg">
                        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setPage(1);
                            }}
                            placeholder="Search meals or provider"
                            className="h-11 rounded-xl bg-white pl-9 dark:bg-slate-900"
                        />
                    </div>

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

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
                    <aside className="rounded-2xl border border-orange-200/70 bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-orange-400/20 dark:bg-slate-900/80">
                        <h2 className="text-sm font-bold tracking-widest text-slate-900 uppercase dark:text-slate-100">Filters</h2>

                        <div className="mt-5">
                            <h3 className="text-sm font-semibold">Category</h3>
                            <div className="mt-2 space-y-2">
                                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.length === 0}
                                        onChange={() => {
                                            setSelectedCategories([]);
                                            setPage(1);
                                        }}
                                        className="h-4 w-4 accent-orange-500"
                                    />
                                    All categories
                                </label>

                                {categories.map((category) => (
                                    <label key={category} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category)}
                                            onChange={() => toggleCategory(category)}
                                            className="h-4 w-4 accent-orange-500"
                                        />
                                        {titleCase(category)}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold">Price Range</h3>
                                <span className="text-xs font-medium text-orange-600 dark:text-orange-300">Up to ${maxPrice}</span>
                            </div>
                            <input
                                type="range"
                                min={5}
                                max={30}
                                step={1}
                                value={maxPrice}
                                onChange={(event) => {
                                    setMaxPrice(Number(event.target.value));
                                    setPage(1);
                                }}
                                className="mt-3 w-full accent-orange-500"
                            />
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm font-semibold">Dietary Preferences</h3>
                            <div className="mt-2 space-y-2">
                                {dietaryOptions.map((dietary) => (
                                    <label key={dietary} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                        <input
                                            type="checkbox"
                                            checked={selectedDietary.includes(dietary)}
                                            onChange={() => toggleDietary(dietary)}
                                            className="h-4 w-4 accent-orange-500"
                                        />
                                        {titleCase(dietary)}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    <div>
                        <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                            {paginatedMeals.map((meal) => (
                                <Link
                                    key={meal.id}
                                    href={`/meals/${meal.id}`}
                                    className={`group overflow-hidden rounded-2xl border border-slate-200/75 bg-white/90 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/90 ${viewMode === "list" ? "flex" : ""}`}
                                >
                                    <div className={`relative overflow-hidden ${viewMode === "list" ? "h-34 w-40 shrink-0" : "h-40 w-full"}`}>
                                        <Image src={meal.image} alt={meal.name} fill sizes="(min-width: 1280px) 24vw, 50vw" className="object-cover transition duration-500 group-hover:scale-110" />
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{meal.name}</h3>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            <Link href={`/providers/${providerSlugByName[meal.provider] ?? "pizza-palace"}`} className="hover:text-orange-600 hover:underline dark:hover:text-orange-300">
                                                {meal.provider}
                                            </Link>
                                        </p>

                                        <div className="mt-3 flex items-center justify-between text-sm">
                                            <span className="font-bold text-orange-600 dark:text-orange-300">${meal.price.toFixed(2)}</span>
                                            <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                                                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                                {meal.rating}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {paginatedMeals.length === 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                                No meals found for this filter.
                            </div>
                        )}

                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Showing {paginatedMeals.length} of {filteredMeals.length} meals
                            </p>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage <= 1}
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {currentPage} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage >= totalPages}
                                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
