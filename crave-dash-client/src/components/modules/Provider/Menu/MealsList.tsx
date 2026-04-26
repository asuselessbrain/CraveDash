"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, Trash2, AlertCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

type MealData = {
    _id: string;
    id?: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    image: string;
    images: string[];
    mealType: "BREAKFAST" | "LUNCH" | "DINNER";
    dietaryTag: "VEG" | "NON_VEG" | "VEGAN";
    spiceLevel: "MILD" | "MEDIUM" | "HOT" | "EXTRA_HOT";
    ingredients: string[];
    availabilityStatus?: "AVAILABLE" | "UNAVAILABLE";
    preparationTime?: number;
    servingSize?: number;
    discount?: number;
    stockQuantity?: number;
    isPopular?: boolean;
    isFeatured?: boolean;
    videoUrl?: string;
};

type MealsListProps = {
    meals: MealData[];
    totalPages: number;
    onDelete?: (mealId: string) => void;
    onToggleAvailability?: (mealId: string) => void;
    isLoading?: boolean;
};

const dietaryTagColors: Record<string, string> = {
    VEG: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    NON_VEG: "text-red-800 bg-red-100 dark:bg-red-900 dark:text-red-200",
    VEGAN: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

const spiceLevelColors: Record<string, string> = {
    MILD: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    MEDIUM: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    HOT: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    EXTRA_HOT: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

export default function MealsList({
    meals,
    onDelete,
    onToggleAvailability,
    isLoading = false,
}: MealsListProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [togglingId, setTogglingId] = useState<string | null>(null);

    const handleDelete = async (mealId: string) => {
        if (!onDelete) return;

        setDeletingId(mealId);
        try {
            await onDelete(mealId);
            toast.success("Meal deleted successfully!");
        } catch {
            toast.error("Failed to delete meal. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggleAvailability = async (mealId: string) => {
        if (!onToggleAvailability) return;

        setTogglingId(mealId);
        try {
            await onToggleAvailability(mealId);
            toast.success("Meal availability toggled successfully!");
        } catch {
            toast.error("Failed to toggle meal availability. Please try again.");
        } finally {
            setTogglingId(null);
        }
    };

    if (meals.length === 0 && !isLoading) {
        return (
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
                <AlertCircle className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">No meals found</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Try adjusting your search or filters to find meals.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {meals.map((meal) => (
                <div
                    key={meal._id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                >
                    <Link href={`/provider/menu/${meal.id ?? meal._id}`} className="block">
                        {/* Image */}
                        <div className="relative h-40 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                            <Image
                                src={meal.image}
                                alt={meal.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                className="object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex flex-col p-4">
                            {/* Name & Badges */}
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                                    {meal.name}
                                </h3>
                            </div>

                        {/* Tags */}
                        <div className="mt-2 flex flex-wrap gap-1">
                            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${dietaryTagColors[meal.dietaryTag]}`}>
                                {meal.dietaryTag}
                            </span>
                            <span className={`rounded-full px-2 py-1 text-xs font-semibold ${spiceLevelColors[meal.spiceLevel]}`}>
                                {meal.spiceLevel}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                                {meal.mealType}
                            </span>
                            {meal.availabilityStatus === "UNAVAILABLE" && (
                                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 dark:bg-red-900/30 dark:text-red-200">
                                    Unavailable
                                </span>
                            )}
                        </div>

                        {/* Popular/Featured Badges */}
                        {(meal.isPopular || meal.isFeatured) && (
                            <div className="mt-1 flex gap-1">
                                {meal.isPopular && (
                                    <span className="inline-block rounded-full bg-yellow-100 px-1.5 py-0.5 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                                        ⭐ Popular
                                    </span>
                                )}
                                {meal.isFeatured && (
                                    <span className="inline-block rounded-full bg-pink-100 px-1.5 py-0.5 text-xs font-semibold text-pink-800 dark:bg-pink-900/30 dark:text-pink-200">
                                        💎 Featured
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Ingredients count & stock info */}
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                            <span>{meal.ingredients.length} ingredient{meal.ingredients.length !== 1 ? "s" : ""}</span>
                            {meal.stockQuantity !== undefined && (
                                <span className={meal.stockQuantity === 0 ? "text-red-600 dark:text-red-400 font-semibold" : ""}>
                                    Stock: {meal.stockQuantity}
                                </span>
                            )}
                        </div>

                            {/* Price */}
                            <div className="mt-4 flex flex-col">
                                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                                    ৳{Number(meal.price).toFixed(2)}
                                </span>
                                {meal.discount && (
                                    <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                                        Save ৳{Number(meal.discount).toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>

                    <div className="grid grid-cols-2 gap-2 border-t border-slate-200 p-4 dark:border-slate-700">
                        <Button asChild variant="outline" size="sm" className="h-8 w-full rounded-lg px-3">
                                <Link href={`/provider/menu/${meal.id ?? meal._id}`}>
                                    <Eye className="mr-1 h-4 w-4" /> View
                                </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm" className="h-8 w-full rounded-lg px-3">
                                <Link href={`/provider/menu/${meal.id ?? meal._id}/edit`}>
                                    <Edit className="mr-1 h-4 w-4" /> Edit
                                </Link>
                        </Button>

                        {onToggleAvailability && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleAvailability(meal._id)}
                                className={`h-8 w-full rounded-lg px-3 ${
                                    meal.availabilityStatus === "UNAVAILABLE"
                                        ? "border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-900"
                                        : "border-green-200 text-green-600 hover:bg-green-50 dark:border-green-700 dark:hover:bg-green-900"
                                }`}
                                disabled={isLoading || togglingId === meal._id}
                                title={meal.availabilityStatus === "UNAVAILABLE" ? "Mark as Available" : "Mark as Unavailable"}
                            >
                                {meal.availabilityStatus === "UNAVAILABLE" ? "Make Active" : "Make Inactive"}
                            </Button>
                        )}

                        {onDelete && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(meal._id)}
                                className="h-8 w-full rounded-lg border-red-200 px-3 text-red-600 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900"
                                disabled={isLoading || deletingId === meal._id}
                            >
                                <Trash2 className="mr-1 h-4 w-4" /> Delete
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
