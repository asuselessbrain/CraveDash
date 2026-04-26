"use client";

import { useState } from "react";
import {
    Plus,
    Minus,
    Flame,
    Leaf,
    AlertCircle,
    Star,
    ShoppingCart,
    CheckCircle2,
    ChevronRight,
    Clock,
    Package,
} from "lucide-react";
import Image from "next/image";
import { NormalizedMealDetails } from "@/types/meals";
import Link from "next/link";
import { addToCart } from "@/services/cart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type MealDetailsContentProps = {
    meal: NormalizedMealDetails;
};

const spiceLevelEmoji: Record<string, string> = {
    MILD: "🌶️",
    MEDIUM: "🌶️🌶️",
    HOT: "🌶️🌶️🌶️",
    EXTRA_HOT: "🌶️🌶️🌶️🌶️",
};

function formatLabel(value: string) {
    return value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export default function MealDetailsContent({ meal }: MealDetailsContentProps) {
    const [activeImage, setActiveImage] = useState(meal.image);
    const [quantity, setQuantity] = useState(1);
    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const router = useRouter();

    const isAvailable = meal.availabilityStatus === "AVAILABLE";
    const canOrder = isAvailable && meal.stockQuantity > 0;

    const totalPrice = meal.finalPrice * quantity;

    const handleAddToCart = async () => {
        if (!canOrder || isAddingToCart) return;

        setIsAddingToCart(true);
        try {
            const res = await addToCart(meal.id, quantity);

            if (res.success) {
                toast.success(res.message || "Added to cart!");
                return;
            }

            toast.error(res.errorMessage || "Failed to add to cart. Please try again.");
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        if (!canOrder || isBuyingNow) return;

        setIsBuyingNow(true);
        try {
            const res = await addToCart(meal.id, quantity);

            if (res.success) {
                toast.success("Added to cart. Redirecting to checkout...");
                router.push("/checkout");
            } else {
                toast.error(res.errorMessage || "Failed to process Buy Now. Please try again.");
            }
        } finally {
            setIsBuyingNow(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 pb-14 dark:bg-slate-950">
            <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
                <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm font-medium">
                    <Link href="/meals" className="text-slate-500 transition hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-300">
                        Meals
                    </Link>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                    <Link
                        href={`/meals?cuisine=${meal.cuisineName}`}
                        className="text-slate-500 transition hover:text-orange-600 dark:text-slate-400 dark:hover:text-orange-300"
                    >
                        {meal.cuisineName}
                    </Link>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{meal.name}</span>
                </nav>

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1fr]">
                    <div className="space-y-4">
                        <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <Image
                                src={activeImage}
                                alt={meal.name}
                                fill
                                unoptimized
                                priority
                                className="object-cover"
                            />
                            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                                {meal.isFeatured && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                                        <Star className="h-3.5 w-3.5 fill-current" /> Featured
                                    </span>
                                )}
                                {meal.isPopular && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white">
                                        <Flame className="h-3.5 w-3.5 fill-current" /> Popular
                                    </span>
                                )}
                            </div>
                        </div>

                        {meal.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-1">
                                {meal.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setActiveImage(img)}
                                        className={`relative h-18 w-18 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                                            activeImage === img
                                                ? "border-orange-500"
                                                : "border-slate-200 hover:border-orange-300 dark:border-slate-700"
                                        }`}
                                    >
                                        <Image src={img} alt={`${meal.name} ${idx + 1}`} fill unoptimized className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                                <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
                                    {meal.categoryName}
                                </span>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                    {formatLabel(meal.mealType)}
                                </span>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                                    {formatLabel(meal.dietaryTag)}
                                </span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">{meal.name}</h1>
                            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{meal.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Preparation</p>
                                <p className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                                    <Clock className="h-4 w-4 text-orange-500" /> {meal.preparationTime} min
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Spice level</p>
                                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
                                    {spiceLevelEmoji[meal.spiceLevel] || formatLabel(meal.spiceLevel)}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Serving</p>
                                <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{meal.servingSize}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Availability</p>
                                <p className={`mt-1 inline-flex items-center gap-1 text-sm font-bold ${canOrder ? "text-emerald-600 dark:text-emerald-300" : "text-rose-600 dark:text-rose-300"}`}>
                                    {canOrder ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                    {canOrder ? "In stock" : "Out of stock"}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-500/25 dark:bg-orange-500/10">
                            <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">Total price</p>
                            <div className="mt-2 flex items-end gap-3">
                                <span className="text-4xl font-black text-slate-900 dark:text-slate-100">৳{totalPrice.toFixed(0)}</span>
                                {meal.discount > 0 && (
                                    <span className="text-sm font-semibold text-slate-500 line-through dark:text-slate-400">৳{(meal.price * quantity).toFixed(0)}</span>
                                )}
                            </div>
                            {meal.discount > 0 && (
                                <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                                    You save {meal.discount}% on this meal
                                </p>
                            )}
                        </div>

                        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/60">
                            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Quantity</p>
                            <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
                                <button
                                    type="button"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="px-3 py-2 text-slate-700 transition hover:text-orange-600 dark:text-slate-200"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="min-w-8 text-center text-sm font-bold text-slate-900 dark:text-slate-100">{quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="px-3 py-2 text-slate-700 transition hover:text-orange-600 dark:text-slate-200"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={!canOrder || isAddingToCart}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-900 transition hover:border-orange-300 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-orange-500/40 dark:hover:text-orange-300"
                            >
                                <ShoppingCart className="h-4 w-4" />
                                {isAddingToCart ? "Adding..." : "Add to Cart"}
                            </button>
                            <button
                                type="button"
                                onClick={handleBuyNow}
                                disabled={!canOrder || isBuyingNow}
                                className="inline-flex h-12 items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isBuyingNow ? "Processing..." : canOrder ? "Buy Now" : "Out of Stock"}
                            </button>
                        </div>
                    </div>
                </section>

                {meal.ingredients.length > 0 && (
                    <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Ingredients</h2>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {meal.ingredients.map((ingredient, idx) => (
                                <span
                                    key={`${ingredient}-${idx}`}
                                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                >
                                    <Package className="h-3.5 w-3.5 text-orange-500" />
                                    {ingredient}
                                </span>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
