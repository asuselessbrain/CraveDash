"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import {
    BadgeCheck,
    Bike,
    CheckCircle2,
    ChevronDown,
    CircleAlert,
    Clock3,
    Heart,
    Leaf,
    Minus,
    Plus,
    ShieldCheck,
    Star,
    Truck,
    Users,
} from "lucide-react";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";

type MealDetails = {
    id: string;
    name: string;
    category: string;
    provider: string;
    providerSlug: string;
    providerRating: number;
    providerReviews: number;
    rating: number;
    reviews: number;
    shortDescription: string;
    price: number;
    oldPrice: number;
    discountTag: string;
    badges: string[];
    images: string[];
    has360: boolean;
    dietaryTags: string[];
    ingredients: string[];
    allergens: string[];
    nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    preparation: string;
    servingSize: string;
    deliveryZones: string[];
    deliveryCharge: string;
    deliverySlots: string[];
};

const mealData: Record<string, MealDetails> = {
    "1": {
        id: "1",
        name: "Margherita Pizza",
        category: "Pizza",
        provider: "Pizza Palace",
        providerSlug: "pizza-palace",
        providerRating: 4.8,
        providerReviews: 1480,
        rating: 4.5,
        reviews: 1234,
        shortDescription:
            "Classic Italian style pizza baked on a stone oven with rich tomato sauce, fresh mozzarella, and hand-picked basil leaves.",
        price: 8.99,
        oldPrice: 11.49,
        discountTag: "22% OFF",
        badges: ["Bestseller", "Spicy", "Veg"],
        images: ["/categories/pizza.svg", "/cuisines/italian.svg", "/categories/desserts.svg", "/categories/drinks.svg", "/categories/chinese.svg"],
        has360: true,
        dietaryTags: ["Vegetarian", "Gluten Aware"],
        ingredients: ["Tomato Sauce", "Mozzarella", "Basil", "Olive Oil", "Flour", "Yeast"],
        allergens: ["Milk", "Gluten"],
        nutrition: {
            calories: 420,
            protein: 18,
            carbs: 46,
            fat: 16,
        },
        preparation: "Prepared fresh, proofed dough for 24h, baked at high heat for a crisp base and soft center.",
        servingSize: "1 medium pizza (serves 1-2)",
        deliveryZones: ["Dhanmondi", "Gulshan", "Banani", "Mirpur"],
        deliveryCharge: "$1.20",
        deliverySlots: ["11:00 AM - 12:00 PM", "12:30 PM - 1:30 PM", "7:00 PM - 8:00 PM"],
    },
};

const reviewBreakdown = [
    { star: 5, count: 780 },
    { star: 4, count: 290 },
    { star: 3, count: 96 },
    { star: 2, count: 41 },
    { star: 1, count: 27 },
];

const similarMeals = [
    { id: "2", name: "Pepperoni Pizza", image: "/categories/pizza.svg", price: 10.99, provider: "Pizza Palace" },
    { id: "15", name: "Veggie Supreme", image: "/categories/pizza.svg", price: 9.49, provider: "Pizza Palace" },
    { id: "3", name: "Classic Burger", image: "/categories/burger.svg", price: 7.99, provider: "Burger Hub" },
    { id: "5", name: "Kacchi Biryani", image: "/categories/biryani.svg", price: 9.99, provider: "Biryani Ghar" },
    { id: "7", name: "Szechuan Chicken", image: "/categories/chinese.svg", price: 10.49, provider: "Wok Street" },
    { id: "9", name: "Lava Cake", image: "/categories/desserts.svg", price: 5.99, provider: "Sweet Room" },
    { id: "11", name: "Mango Smoothie", image: "/categories/drinks.svg", price: 4.49, provider: "Juice Point" },
    { id: "14", name: "Ribeye Steak", image: "/categories/steak.svg", price: 16.99, provider: "Prime Cut" },
];

const providerPopular = [
    { id: "2", name: "Pepperoni Pizza", image: "/categories/pizza.svg", price: 10.99 },
    { id: "15", name: "Veggie Supreme", image: "/categories/pizza.svg", price: 9.49 },
    { id: "9", name: "Chocolate Lava Cake", image: "/categories/desserts.svg", price: 5.99 },
    { id: "11", name: "Mango Smoothie", image: "/categories/drinks.svg", price: 4.49 },
];

const detailedReviews = [
    {
        id: 1,
        name: "Nafis Rahman",
        avatar: "NR",
        rating: 5,
        date: "Mar 21, 2026",
        text: "One of the best pizzas I have had lately. The crust stayed crispy even after delivery.",
        verified: true,
        helpful: 38,
        photos: ["/categories/pizza.svg", "/categories/drinks.svg"],
    },
    {
        id: 2,
        name: "Sadia Kabir",
        avatar: "SK",
        rating: 4,
        date: "Mar 15, 2026",
        text: "Loved the flavor and portion size. Slightly more cheese would make it perfect.",
        verified: true,
        helpful: 21,
        photos: ["/cuisines/italian.svg"],
    },
    {
        id: 3,
        name: "Imran Chowdhury",
        avatar: "IC",
        rating: 5,
        date: "Mar 09, 2026",
        text: "Arrived hot and fresh. Great value with customization options.",
        verified: true,
        helpful: 14,
        photos: [],
    },
    {
        id: 4,
        name: "Farhana Noor",
        avatar: "FN",
        rating: 3,
        date: "Mar 02, 2026",
        text: "Good taste but delivery got delayed. Provider support was responsive.",
        verified: false,
        helpful: 9,
        photos: ["/categories/chinese.svg"],
    },
];

const customerPhotos = [
    "/categories/pizza.svg",
    "/cuisines/italian.svg",
    "/categories/desserts.svg",
    "/categories/drinks.svg",
    "/categories/chinese.svg",
    "/categories/burger.svg",
];

const faqItems = [
    { question: "Is this meal vegetarian?", answer: "Yes, this variant is vegetarian and prepared separately." },
    { question: "What is the serving size?", answer: "One medium pizza, suitable for 1-2 people." },
    { question: "Can I customize?", answer: "Yes, you can choose size, add-ons, spice level, and special notes." },
    { question: "Reheating instructions", answer: "Reheat in preheated oven for 4-5 minutes at 180C for best texture." },
    { question: "Shelf life", answer: "Best consumed within 2 hours of delivery." },
];

const bundleItems = [
    { id: "b1", name: "Garlic Bread", price: 3.5 },
    { id: "b2", name: "Cold Coffee", price: 3.99 },
    { id: "b3", name: "Lava Cake", price: 5.99 },
];

const recentViews = [
    { id: "7", name: "Szechuan Chicken", image: "/categories/chinese.svg", price: 10.49 },
    { id: "3", name: "Classic Beef Burger", image: "/categories/burger.svg", price: 7.99 },
    { id: "14", name: "Grilled Ribeye", image: "/categories/steak.svg", price: 16.99 },
];

type MealDetailsPageProps = {
    params: Promise<{
        id: string;
    }>;
};

function stars(value: number) {
    return Array.from({ length: 5 }).map((_, index) => (
        <Star
            key={`${value}-${index}`}
            className={`h-4 w-4 ${index < value ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
        />
    ));
}

export default function MealDetailsPage({ params }: MealDetailsPageProps) {
    const { id } = use(params);
    const meal = mealData[id];
    if (!meal) notFound();

    const [activeImage, setActiveImage] = useState(meal.images[0]);
    const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "nutrition" | "reviews">("description");
    const [size, setSize] = useState<"Small" | "Medium" | "Large">("Medium");
    const [addons, setAddons] = useState<string[]>([]);
    const [spice, setSpice] = useState<"Mild" | "Medium" | "Hot">("Medium");
    const [quantity, setQuantity] = useState(1);
    const [reviewFilter, setReviewFilter] = useState<number | "all">("all");
    const [reviewPage, setReviewPage] = useState(1);
    const [faqOpen, setFaqOpen] = useState<number | null>(0);
    const [selectedBundle, setSelectedBundle] = useState<string[]>([]);
    const [activePhoto, setActivePhoto] = useState<string | null>(null);

    const addOnOptions = [
        { name: "Extra cheese", price: 1.2 },
        { name: "Mushroom toppings", price: 0.9 },
        { name: "Soft drink", price: 1.5 },
    ];

    const sizePriceDiff = {
        Small: -1,
        Medium: 0,
        Large: 2,
    };

    const selectedAddOnTotal = addOnOptions
        .filter((item) => addons.includes(item.name))
        .reduce((sum, item) => sum + item.price, 0);

    const finalPrice = (meal.price + sizePriceDiff[size] + selectedAddOnTotal) * quantity;

    const filteredReviews = useMemo(() => {
        const list = reviewFilter === "all" ? detailedReviews : detailedReviews.filter((item) => item.rating === reviewFilter);
        return [...list].sort((a, b) => b.helpful - a.helpful);
    }, [reviewFilter]);

    const reviewPerPage = 2;
    const totalReviewPages = Math.max(Math.ceil(filteredReviews.length / reviewPerPage), 1);
    const safeReviewPage = Math.min(reviewPage, totalReviewPages);
    const pagedReviews = filteredReviews.slice((safeReviewPage - 1) * reviewPerPage, safeReviewPage * reviewPerPage);

    const bundleBase = bundleItems.reduce((sum, item) => sum + item.price, 0);
    const selectedBundleTotal = bundleItems
        .filter((item) => selectedBundle.includes(item.id))
        .reduce((sum, item) => sum + item.price, 0);

    return (
        <main className="food-landing-bg">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <nav className="mb-6 text-sm text-slate-600 dark:text-slate-300">
                    <Link href="/" className="hover:text-orange-600">Home</Link>
                    <span className="px-2">&gt;</span>
                    <Link href="/meals" className="hover:text-orange-600">Meals</Link>
                    <span className="px-2">&gt;</span>
                    <span>{meal.category}</span>
                    <span className="px-2">&gt;</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{meal.name}</span>
                </nav>

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
                    <div className="rounded-3xl border border-orange-200/70 bg-white/85 p-4 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85">
                        <div className="relative h-88 overflow-hidden rounded-2xl">
                            <Image src={activeImage} alt={meal.name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition duration-500 hover:scale-110" />
                            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                {meal.badges.map((badge) => (
                                    <span key={badge} className="rounded-full bg-orange-500 px-2.5 py-1 text-xs font-bold text-white">{badge}</span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-3 grid grid-cols-5 gap-2">
                            {meal.images.map((image) => (
                                <button
                                    key={image}
                                    type="button"
                                    onClick={() => setActiveImage(image)}
                                    className={`relative h-16 overflow-hidden rounded-xl border ${activeImage === image ? "border-orange-500" : "border-slate-200 dark:border-slate-700"}`}
                                >
                                    <Image src={image} alt="Meal thumbnail" fill sizes="80px" className="object-cover" />
                                </button>
                            ))}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                            {meal.has360 && (
                                <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold dark:border-slate-700">360 view available</span>
                            )}
                            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold dark:border-slate-700">Video demo</span>
                        </div>

                        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-950/90 p-4 text-sm text-slate-200 dark:border-slate-700">
                            Cooking / Presentation Video Demo
                        </div>
                    </div>

                    <div className="rounded-3xl border border-orange-200/70 bg-white/85 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/85">
                        <h1 className="text-3xl font-black tracking-tight">{meal.name}</h1>

                        <div className="mt-2 flex items-center gap-2 text-sm">
                            <Link href={`/providers/${meal.providerSlug}`} className="font-semibold text-orange-600 hover:underline dark:text-orange-300">
                                {meal.provider}
                            </Link>
                            <BadgeCheck className="h-4 w-4 text-emerald-500" />
                            <span className="text-slate-500 dark:text-slate-400">Verified</span>
                        </div>

                        <button type="button" className="mt-2 inline-flex items-center gap-1 text-sm text-slate-700 dark:text-slate-300">
                            <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {meal.rating} ({meal.reviews.toLocaleString()} reviews)
                        </button>

                        <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{meal.shortDescription}</p>

                        <div className="mt-4 flex items-end gap-2">
                            <span className="text-3xl font-black text-orange-600 dark:text-orange-300">${meal.price.toFixed(2)}</span>
                            <span className="text-sm text-slate-500 line-through dark:text-slate-400">${meal.oldPrice.toFixed(2)}</span>
                            <span className="rounded-full bg-orange-500 px-2 py-1 text-xs font-bold text-white">{meal.discountTag}</span>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div>
                                <p className="text-sm font-semibold">Size</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {(["Small", "Medium", "Large"] as const).map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setSize(item)}
                                            className={`rounded-full border px-3 py-1.5 text-sm ${size === item ? "border-orange-500 bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200" : "border-slate-200 dark:border-slate-700"}`}
                                        >
                                            {item} {sizePriceDiff[item] > 0 ? `(+${sizePriceDiff[item].toFixed(2)})` : sizePriceDiff[item] < 0 ? `(-${Math.abs(sizePriceDiff[item]).toFixed(2)})` : ""}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-semibold">Add-ons</p>
                                <div className="mt-2 space-y-2">
                                    {addOnOptions.map((item) => (
                                        <label key={item.name} className="flex items-center justify-between text-sm">
                                            <span className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={addons.includes(item.name)}
                                                    onChange={() =>
                                                        setAddons((prev) => (prev.includes(item.name) ? prev.filter((value) => value !== item.name) : [...prev, item.name]))
                                                    }
                                                    className="h-4 w-4 accent-orange-500"
                                                />
                                                {item.name}
                                            </span>
                                            <span className="text-slate-500 dark:text-slate-400">+${item.price.toFixed(2)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-semibold">Spice level</p>
                                <div className="mt-2 flex gap-2">
                                    {(["Mild", "Medium", "Hot"] as const).map((item) => (
                                        <button
                                            key={item}
                                            type="button"
                                            onClick={() => setSpice(item)}
                                            className={`rounded-full border px-3 py-1 text-sm ${spice === item ? "border-orange-500 bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200" : "border-slate-200 dark:border-slate-700"}`}
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-semibold">Special instructions</p>
                                <textarea
                                    rows={3}
                                    placeholder="Any special note for provider"
                                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-900"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700">
                                    <button type="button" onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))} className="px-3 py-1.5">
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="px-3 text-sm font-semibold">{quantity}</span>
                                    <button type="button" onClick={() => setQuantity((prev) => prev + 1)} className="px-3 py-1.5">
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>

                                <Button className="h-11 flex-1 rounded-xl bg-orange-500 text-white hover:bg-orange-400">Add to Cart - ${finalPrice.toFixed(2)}</Button>
                                <button type="button" aria-label="Add to wishlist" className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700">
                                    <Heart className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-sm">
                                <span className="font-semibold">Share:</span>
                                <button type="button" className="rounded-full border px-3 py-1">WhatsApp</button>
                                <button type="button" className="rounded-full border px-3 py-1">Facebook</button>
                                <button type="button" className="rounded-full border px-3 py-1">Twitter</button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mt-8 rounded-3xl border border-orange-200/70 bg-white/85 p-6 dark:border-orange-400/20 dark:bg-slate-900/85">
                    <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4 dark:border-slate-700">
                        {(["description", "ingredients", "nutrition", "reviews"] as const).map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${activeTab === tab ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {activeTab === "description" && (
                        <div className="mt-5 space-y-3 text-sm text-slate-700 dark:text-slate-300">
                            <p>{meal.shortDescription}</p>
                            <p><span className="font-semibold">Preparation:</span> {meal.preparation}</p>
                            <p><span className="font-semibold">Serving size:</span> {meal.servingSize}</p>
                            <p className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"><CircleAlert className="h-4 w-4" /> Contains: {meal.allergens.join(", ")}</p>
                        </div>
                    )}

                    {activeTab === "ingredients" && (
                        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {meal.ingredients.map((item) => (
                                <div key={item} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                                    <Leaf className="h-4 w-4 text-emerald-500" />
                                    {item}
                                </div>
                            ))}
                            <div className="sm:col-span-2 lg:col-span-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
                                Allergens: {meal.allergens.join(", ")}
                            </div>
                        </div>
                    )}

                    {activeTab === "nutrition" && (
                        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
                            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <p><span className="font-semibold">Calories:</span> {meal.nutrition.calories} kcal</p>
                                    <p><span className="font-semibold">Protein:</span> {meal.nutrition.protein}g</p>
                                    <p><span className="font-semibold">Carbs:</span> {meal.nutrition.carbs}g</p>
                                    <p><span className="font-semibold">Fat:</span> {meal.nutrition.fat}g</p>
                                </div>
                            </div>
                            <div className="space-y-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                                <div>
                                    <p className="text-xs font-semibold uppercase">Protein</p>
                                    <div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-2 rounded-full bg-emerald-500" style={{ width: `${meal.nutrition.protein * 2}%` }} /></div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase">Carbs</p>
                                    <div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-2 rounded-full bg-orange-500" style={{ width: `${meal.nutrition.carbs}%` }} /></div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase">Fat</p>
                                    <div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-2 rounded-full bg-rose-500" style={{ width: `${meal.nutrition.fat * 3}%` }} /></div>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-1">
                                    {meal.dietaryTags.map((tag) => (
                                        <span key={tag} className="rounded-full border border-slate-200 px-2 py-1 text-xs dark:border-slate-700">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div className="mt-5 grid gap-4 lg:grid-cols-[280px_1fr]">
                            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                                <p className="text-sm font-semibold">Rating breakdown</p>
                                <div className="mt-3 space-y-2">
                                    {reviewBreakdown.map((item) => {
                                        const width = (item.count / meal.reviews) * 100;
                                        return (
                                            <div key={item.star} className="flex items-center gap-2 text-xs">
                                                <span className="w-8">{item.star}★</span>
                                                <div className="h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700"><div className="h-2 rounded-full bg-orange-500" style={{ width: `${width}%` }} /></div>
                                                <span className="w-10 text-right">{item.count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-sm font-semibold">Top reviews</p>
                                    <select className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900">
                                        <option>Most recent</option>
                                        <option>Highest rated</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    {detailedReviews.slice(0, 2).map((review) => (
                                        <article key={review.id} className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
                                            <div className="flex items-center justify-between">
                                                <p className="font-semibold">{review.name}</p>
                                                <span className="text-xs text-slate-500">{review.date}</span>
                                            </div>
                                            <div className="mt-1 flex items-center gap-1">{stars(review.rating)}</div>
                                            <p className="mt-2 text-slate-600 dark:text-slate-300">{review.text}</p>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
                    <div className="rounded-3xl border border-orange-200/70 bg-white/85 p-6 dark:border-orange-400/20 dark:bg-slate-900/85">
                        <h2 className="text-xl font-bold">Delivery Information</h2>
                        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
                                <p className="inline-flex items-center gap-2 font-semibold"><Clock3 className="h-4 w-4 text-orange-500" /> 25-35 mins estimated</p>
                                <p className="mt-1 text-slate-600 dark:text-slate-300">Based on your current area and traffic.</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
                                <p className="inline-flex items-center gap-2 font-semibold"><Truck className="h-4 w-4 text-orange-500" /> Delivery charge: {meal.deliveryCharge}</p>
                                <p className="mt-1 text-slate-600 dark:text-slate-300">Free above $20 order value.</p>
                            </div>
                        </div>

                        <div className="mt-4 text-sm">
                            <p className="font-semibold">Delivery zones</p>
                            <p className="mt-1 text-slate-600 dark:text-slate-300">{meal.deliveryZones.join(", ")}</p>
                        </div>

                        <div className="mt-4 text-sm">
                            <p className="font-semibold">Available slots</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {meal.deliverySlots.map((slot) => (
                                    <span key={slot} className="rounded-full border border-slate-200 px-3 py-1 text-xs dark:border-slate-700">{slot}</span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                            <p className="text-sm font-semibold">Check if we deliver to your area</p>
                            <div className="mt-2 flex gap-2">
                                <input type="text" placeholder="Enter pincode" className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm dark:border-slate-700 dark:bg-slate-900" />
                                <Button className="h-10 rounded-lg bg-orange-500 text-white hover:bg-orange-400">Check</Button>
                            </div>
                        </div>
                    </div>

                    <aside className="rounded-3xl border border-orange-200/70 bg-white/85 p-5 dark:border-orange-400/20 dark:bg-slate-900/85">
                        <div className="flex items-center gap-3">
                            <div className="relative h-14 w-14 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700">
                                <Image src="/categories/pizza.svg" alt="Provider logo" fill sizes="56px" className="object-cover" />
                            </div>
                            <div>
                                <p className="font-bold">{meal.provider}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{meal.providerRating} rating • {meal.providerReviews.toLocaleString()} reviews</p>
                            </div>
                        </div>

                        <Button className="mt-4 h-10 w-full rounded-xl bg-orange-500 text-white hover:bg-orange-400">Visit Store</Button>

                        <div className="mt-4 rounded-xl bg-orange-50 p-3 text-sm text-orange-700 dark:bg-orange-500/10 dark:text-orange-300">
                            <p className="inline-flex items-center gap-2"><Bike className="h-4 w-4" /> Delivery 25-35 mins</p>
                            <p className="mt-1">Minimum order $8.00</p>
                        </div>

                        <div className="mt-4 space-y-2">
                            <p className="text-sm font-semibold">Popular from this provider</p>
                            {providerPopular.map((item) => (
                                <Link key={item.id} href={`/meals/${item.id}`} className="flex items-center gap-2 rounded-xl border border-slate-200 p-2 text-sm dark:border-slate-700">
                                    <div className="relative h-10 w-10 overflow-hidden rounded-lg">
                                        <Image src={item.image} alt={item.name} fill sizes="40px" className="object-cover" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium">{item.name}</p>
                                        <p className="text-xs text-orange-600 dark:text-orange-300">${item.price.toFixed(2)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </aside>
                </section>

                <section className="mt-8 rounded-3xl border border-orange-200/70 bg-white/85 p-6 dark:border-orange-400/20 dark:bg-slate-900/85">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-xl font-bold">Detailed Reviews</h2>
                        <div className="flex flex-wrap gap-2">
                            {(["all", 5, 4, 3, 2, 1] as const).map((item) => (
                                <button
                                    key={String(item)}
                                    type="button"
                                    onClick={() => {
                                        setReviewFilter(item);
                                        setReviewPage(1);
                                    }}
                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${reviewFilter === item ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}
                                >
                                    {item === "all" ? "All" : `${item}★`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        {pagedReviews.map((review, index) => (
                            <article key={review.id} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                                {index === 0 && <p className="mb-2 text-xs font-semibold tracking-widest text-orange-600 uppercase">Most Helpful</p>}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-700 dark:bg-orange-500/20 dark:text-orange-200">{review.avatar}</div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold">{review.name}</p>
                                                {review.verified && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                                                        <CheckCircle2 className="h-3 w-3" /> Verified purchase
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-1 flex items-center gap-1">{stars(review.rating)}</div>
                                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{review.date}</p>
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{review.text}</p>

                                {review.photos.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {review.photos.map((photo) => (
                                            <button key={photo} type="button" onClick={() => setActivePhoto(photo)} className="relative h-16 w-16 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                                                <Image src={photo} alt="Review upload" fill sizes="64px" className="object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <button type="button" className="mt-3 text-xs font-semibold text-slate-500 hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-300">
                                    👍 Was this helpful? ({review.helpful})
                                </button>
                            </article>
                        ))}
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" size="sm" disabled={safeReviewPage <= 1} onClick={() => setReviewPage((prev) => Math.max(prev - 1, 1))}>Prev</Button>
                        <Button variant="outline" size="sm" disabled={safeReviewPage >= totalReviewPages} onClick={() => setReviewPage((prev) => Math.min(prev + 1, totalReviewPages))}>Next</Button>
                    </div>
                </section>

                <section className="mt-8 rounded-3xl border border-orange-200/70 bg-white/85 p-6 dark:border-orange-400/20 dark:bg-slate-900/85">
                    <h2 className="text-xl font-bold">Photos from Customers</h2>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                        {customerPhotos.map((photo) => (
                            <button key={photo} type="button" onClick={() => setActivePhoto(photo)} className="relative h-24 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                                <Image src={photo} alt="Customer photo" fill sizes="120px" className="object-cover" />
                            </button>
                        ))}
                    </div>
                </section>

                {activePhoto && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setActivePhoto(null)}>
                        <div className="relative h-[70vh] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/20 bg-black">
                            <Image src={activePhoto} alt="Preview" fill sizes="100vw" className="object-contain" />
                        </div>
                    </div>
                )}

                <section className="mt-8 rounded-3xl border border-orange-200/70 bg-white/85 p-6 dark:border-orange-400/20 dark:bg-slate-900/85">
                    <h2 className="text-xl font-bold">FAQs</h2>
                    <div className="mt-4 space-y-2">
                        {faqItems.map((item, index) => (
                            <div key={item.question} className="rounded-xl border border-slate-200 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setFaqOpen((prev) => (prev === index ? null : index))}
                                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold"
                                >
                                    {item.question}
                                    <ChevronDown className={`h-4 w-4 transition ${faqOpen === index ? "rotate-180" : ""}`} />
                                </button>
                                {faqOpen === index && <p className="px-4 pb-4 text-sm text-slate-600 dark:text-slate-300">{item.answer}</p>}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-8 rounded-3xl border border-orange-200/70 bg-white/85 p-6 dark:border-orange-400/20 dark:bg-slate-900/85">
                    <h2 className="text-xl font-bold">You May Also Like</h2>
                    <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                        {similarMeals.map((item) => (
                            <Link key={item.id} href={`/meals/${item.id}`} className="group w-56 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                                <div className="relative h-32 overflow-hidden">
                                    <Image src={item.image} alt={item.name} fill sizes="220px" className="object-cover transition group-hover:scale-110" />
                                </div>
                                <div className="p-3 text-sm">
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.provider}</p>
                                    <p className="mt-2 font-bold text-orange-600 dark:text-orange-300">${item.price.toFixed(2)}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mt-8 rounded-3xl border border-orange-200/70 bg-white/85 p-6 dark:border-orange-400/20 dark:bg-slate-900/85">
                    <h2 className="text-xl font-bold">Complete Your Meal</h2>
                    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                        {bundleItems.map((item) => (
                            <label key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700">
                                <span className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedBundle.includes(item.id)}
                                        onChange={() =>
                                            setSelectedBundle((prev) => (prev.includes(item.id) ? prev.filter((value) => value !== item.id) : [...prev, item.id]))
                                        }
                                        className="h-4 w-4 accent-orange-500"
                                    />
                                    {item.name}
                                </span>
                                <span>${item.price.toFixed(2)}</span>
                            </label>
                        ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-orange-50 p-4 text-sm dark:bg-orange-500/10">
                        <p>
                            Bundle price: <span className="font-bold text-orange-700 dark:text-orange-300">${(selectedBundleTotal * 0.9).toFixed(2)}</span>
                            <span className="ml-2 text-slate-500 line-through dark:text-slate-400">${selectedBundleTotal.toFixed(2)}</span>
                        </p>
                        <Button className="rounded-lg bg-orange-500 text-white hover:bg-orange-400">Add selected</Button>
                    </div>

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">All-in combo value if selecting everything: ${(bundleBase * 0.9).toFixed(2)}</p>
                </section>

                <section className="mt-8 rounded-3xl border border-orange-200/70 bg-white/85 p-6 dark:border-orange-400/20 dark:bg-slate-900/85">
                    <h2 className="text-xl font-bold">Your Recent Browses</h2>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {recentViews.map((item) => (
                            <article key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                                <div className="relative h-14 w-14 overflow-hidden rounded-lg">
                                    <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold">{item.name}</p>
                                    <p className="text-xs text-orange-600 dark:text-orange-300">${item.price.toFixed(2)}</p>
                                </div>
                                <Button size="sm" className="rounded-lg bg-orange-500 text-white hover:bg-orange-400">Re-add</Button>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <ShieldCheck className="h-5 w-5" />
                        <p className="mt-2 font-semibold">Safe Delivery</p>
                    </article>
                    <article className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-300">
                        <Leaf className="h-5 w-5" />
                        <p className="mt-2 font-semibold">Fresh Ingredients Guarantee</p>
                    </article>
                    <article className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                        <CheckCircle2 className="h-5 w-5" />
                        <p className="mt-2 font-semibold">Money-back Guarantee</p>
                    </article>
                    <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300">
                        <Users className="h-5 w-5" />
                        <p className="mt-2 font-semibold">Contact-free Delivery</p>
                    </article>
                </section>
            </div>
        </main>
    );
}
