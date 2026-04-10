"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { deleteMeal } from "@/services/meal";

type MealDetailsContentProps = {
    meal: {
        _id: string;
        id?: string;
        name: string;
        description: string;
        price: number | string;
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
        createdAt?: string | Date;
        updatedAt?: string | Date;
    };
    mealId: string;
    categoryName?: string;
};

const dietaryTagColors: Record<string, { bg: string; text: string }> = {
    VEG: { bg: "bg-green-100 dark:bg-green-900", text: "text-green-800 dark:text-green-200" },
    NON_VEG: { bg: "bg-red-100 dark:bg-red-900", text: "text-red-800 dark:text-red-200" },
    VEGAN: { bg: "bg-yellow-100 dark:bg-yellow-900", text: "text-yellow-800 dark:text-yellow-200" },
};

const spiceLevelColors: Record<string, { bg: string; text: string }> = {
    MILD: { bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-800 dark:text-blue-200" },
    MEDIUM: { bg: "bg-orange-100 dark:bg-orange-900", text: "text-orange-800 dark:text-orange-200" },
    HOT: { bg: "bg-red-100 dark:bg-red-900", text: "text-red-800 dark:text-red-200" },
    EXTRA_HOT: { bg: "bg-purple-100 dark:bg-purple-900", text: "text-purple-800 dark:text-purple-200" },
};

const formatDateTime = (value?: string | Date) => {
    if (!value) return "N/A";
    const date = typeof value === "string" ? new Date(value) : value;
    return Number.isNaN(date.getTime()) ? "N/A" : date.toLocaleString();
};

export default function MealDetailsContent({ meal, mealId, categoryName }: MealDetailsContentProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this meal?")) return;

        setIsDeleting(true);
        try {
            const result = await deleteMeal(mealId);
            if (result?.success) {
                toast.success("Meal deleted successfully!");
                router.push("/provider/menu");
            } else {
                toast.error(result?.errorMessage || "Failed to delete meal");
            }
        } catch {
            toast.error("Something went wrong while deleting meal");
        } finally {
            setIsDeleting(false);
        }
    };

    const displayImages = meal.images && meal.images.length > 0 ? meal.images : [meal.image];
    const currentImage = displayImages[selectedImageIndex] || meal.image;

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-6">
                {/* Main Image */}
                <div className="rounded-3xl border border-slate-200 overflow-hidden bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
                    <div className="relative h-96 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                        <Image
                            src={currentImage}
                            alt={meal.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 66vw"
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Image Gallery Thumbnails */}
                    {displayImages.length > 1 && (
                        <div className="border-t border-slate-200 dark:border-slate-700 p-4">
                            <p className="mb-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                                Gallery ({displayImages.length} images)
                            </p>
                            <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
                                {displayImages.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`relative h-16 overflow-hidden rounded-xl border-2 transition ${
                                            selectedImageIndex === index
                                                ? "border-orange-500"
                                                : "border-slate-200 dark:border-slate-700 hover:border-orange-300"
                                        }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`Gallery ${index + 1}`}
                                            fill
                                            sizes="80px"
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="text-sm font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase">Description</h3>
                    <p className="mt-3 text-base leading-relaxed text-slate-900 dark:text-slate-100">
                        {meal.description}
                    </p>
                </div>

                {/* Metadata */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="text-sm font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase">Meal Metadata</h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Category</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{categoryName || meal.categoryId}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Availability</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{meal.availabilityStatus || "AVAILABLE"}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Preparation Time</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{meal.preparationTime ? `${meal.preparationTime} mins` : "N/A"}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Serving Size</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{meal.servingSize ? `${meal.servingSize} servings` : "N/A"}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Stock Quantity</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{meal.stockQuantity ?? 0}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Discount</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{meal.discount ? `$${Number(meal.discount).toFixed(2)}` : "N/A"}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Video URL</p>
                            <p className="mt-2 break-all text-sm font-semibold text-slate-900 dark:text-slate-100">{meal.videoUrl || "N/A"}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Created At</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{formatDateTime(meal.createdAt)}</p>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-950 sm:col-span-2">
                            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">Updated At</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{formatDateTime(meal.updatedAt)}</p>
                        </div>
                    </div>
                </div>

                {/* Ingredients */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="text-sm font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase">
                        Ingredients ({meal.ingredients.length})
                    </h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {meal.ingredients.map((ingredient, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1.5 text-sm font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-200"
                            >
                                <Check className="h-3.5 w-3.5 mr-1.5" />
                                {ingredient}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebar - Right Side */}
            <div className="space-y-4">
                {/* Price Card */}
                <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-6 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                    <p className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-400 uppercase">Price</p>
                    <p className="mt-2 text-4xl font-black text-orange-600 dark:text-orange-400">
                        ${Number(meal.price).toFixed(2)}
                    </p>
                </div>

                {/* Meal Info Card */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900 space-y-4">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-400 uppercase">Meal Type</p>
                        <p className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                            {meal.mealType}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-400 uppercase">Dietary Tag</p>
                        <p
                            className={`mt-2 inline-block rounded-full px-3 py-1.5 text-sm font-semibold ${
                                dietaryTagColors[meal.dietaryTag].bg
                            } ${dietaryTagColors[meal.dietaryTag].text}`}
                        >
                            {meal.dietaryTag}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-400 uppercase">Spice Level</p>
                        <p
                            className={`mt-2 inline-block rounded-full px-3 py-1.5 text-sm font-semibold ${
                                spiceLevelColors[meal.spiceLevel].bg
                            } ${spiceLevelColors[meal.spiceLevel].text}`}
                        >
                            {meal.spiceLevel}
                        </p>
                    </div>
                </div>

                {/* Additional Details Card */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900 space-y-3">
                    <div>
                        <p className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-400 uppercase">Availability</p>
                        <p className={`mt-2 inline-block rounded-full px-3 py-1.5 text-sm font-semibold ${
                            meal.availabilityStatus === "AVAILABLE"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                        }`}>
                            {meal.availabilityStatus || "AVAILABLE"}
                        </p>
                    </div>

                    {meal.preparationTime && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-400 uppercase">Prep Time</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{meal.preparationTime} mins</p>
                        </div>
                    )}

                    {meal.servingSize && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-400 uppercase">Serving Size</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{meal.servingSize} servings</p>
                        </div>
                    )}

                    {meal.stockQuantity !== undefined && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-400 uppercase">Stock</p>
                            <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{meal.stockQuantity} items</p>
                        </div>
                    )}

                    {meal.discount && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-semibold tracking-widest text-slate-600 dark:text-slate-400 uppercase">Discount</p>
                            <p className="mt-2 text-sm font-semibold text-red-600 dark:text-red-400">-${Number(meal.discount).toFixed(2)}</p>
                        </div>
                    )}

                    {(meal.isPopular || meal.isFeatured) && (
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex gap-2">
                            {meal.isPopular && (
                                <span className="inline-block rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                                    ⭐ Popular
                                </span>
                            )}
                            {meal.isFeatured && (
                                <span className="inline-block rounded-full bg-pink-100 px-2.5 py-1 text-xs font-semibold text-pink-800 dark:bg-pink-900/30 dark:text-pink-200">
                                    💎 Featured
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Button asChild className="w-full h-11 rounded-xl bg-blue-500 text-white hover:bg-blue-600">
                        <Link href={`/provider/menu/${mealId}/edit`}>
                            <Edit className="h-4 w-4 mr-2" /> Edit Meal
                        </Link>
                    </Button>

                    <Button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-full h-11 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-700 dark:bg-red-900/20 dark:text-red-200"
                    >
                        <Trash2 className="h-4 w-4 mr-2" /> {isDeleting ? "Deleting..." : "Delete Meal"}
                    </Button>
                </div>

                {/* Stats Card */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                    <p className="text-sm font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase">Quick Stats</p>
                    <div className="mt-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Total Images</span>
                            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{displayImages.length}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Total Ingredients</span>
                            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{meal.ingredients.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
