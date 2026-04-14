"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Clock3, Flame, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Search from "../shared/SearchComponent";
import SortingComponent from "../shared/SortingComponent";
import PaginationComponent from "../shared/PaginationComponent";
import { ProviderCategory } from "@/app/(providerLayout)/provider/data";
import { addToCart } from "@/services/cart";
import { toast } from "sonner";
import { useState } from "react";

type MealCard = {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    rating: number;
    providerName: string;
    providerSlug: string;
    mealType: string;
    dietaryTag: string;
    preparationTime: number;
    discount: number;
};

type MealsCatalogProps = {
    meals: MealCard[];
    meta: {
        total: number;
        limit: number;
        currentPage: number;
        totalPages: number;
    };
    categories: ProviderCategory[];
    cuisines?: { id: string; name: string; categories?: number; categoriesCount?: number; meals?: number; mealsCount?: number }[];
}

function parseMultiValueFilter(value: string | null): string[] {
    if (!value) return [];

    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

const mealTypeOptions = ["BREAKFAST", "LUNCH", "DINNER"] as const;
const dietaryOptions = ["VEG", "NON_VEG", "VEGAN"] as const;

function formatLabel(value: string) {
    return value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

export default function MealsCatalog({ meals, meta, categories, cuisines }: MealsCatalogProps) {
    const [addingMealId, setAddingMealId] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const selectedCategoryIds = new Set(parseMultiValueFilter(searchParams.get("category")));
    const selectedCuisineIds = new Set(parseMultiValueFilter(searchParams.get("cuisine")));
    const selectedMealTypes = new Set(parseMultiValueFilter(searchParams.get("mealType")));
    const selectedDietaryTags = new Set(parseMultiValueFilter(searchParams.get("dietaryTag")));

    const updateMultiFilter = (key: "category" | "cuisine" | "mealType" | "dietaryTag", value: string, checked: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        const selectedValues = new Set(parseMultiValueFilter(params.get(key)));

        if (checked) {
            selectedValues.add(value);
        } else {
            selectedValues.delete(value);
        }

        if (selectedValues.size > 0) {
            params.set(key, Array.from(selectedValues).join(","));
        } else {
            params.delete(key);
        }

        params.set("page", "1");
        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname);
    };

    const clearAllFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        ["searchTerm", "category", "cuisine", "mealType", "dietaryTag", "sortBy", "sortOrder", "page"].forEach((key) => {
            params.delete(key);
        });

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname);
    };

    const handleAddToCart = async (mealId: string) => {
        if (!mealId || addingMealId) return;

        setAddingMealId(mealId);
        try {
            const res = await addToCart(mealId, 1);

            if (res?.success) {
                toast.success(res.message || "Added to cart");
            } else {
                toast.error(res?.errorMessage || "Failed to add to cart. Please try again.");
            }
        } catch {
            toast.error("Failed to add to cart. Please try again.");
        } finally {
            setAddingMealId(null);
        }
    };

    return (
        <section className="landing-reveal-delay-2 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="h-fit rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm lg:sticky lg:top-24 dark:border-slate-700 dark:bg-slate-900/90">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-sm font-extrabold tracking-widest text-slate-800 uppercase dark:text-slate-200">Filters</h2>
                    <button
                        type="button"
                        onClick={clearAllFilters}
                        className="text-xs font-semibold text-orange-600 transition hover:text-orange-700 dark:text-orange-300"
                    >
                        Clear all
                    </button>
                </div>

                <div className="space-y-5">
                    <div>
                        <label htmlFor="meal-search" className="mb-2 block text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                            Search
                        </label>
                        <div className="relative">
                            <Search />
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300">Categories</p>
                        <div className="space-y-2">
                            {categories.map((category) => (
                                <label key={category.id ?? category.name} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(category.id && selectedCategoryIds.has(category.id))}
                                        onChange={(event) => {
                                            if (!category.id) return;
                                            updateMultiFilter("category", category.id, event.target.checked);
                                        }}
                                        className="h-4 w-4 accent-orange-500"
                                    />
                                    <span className="flex w-full items-center justify-between gap-2">
                                        <span>{category.name}</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {cuisines && (
                        <div>
                            <p className="mb-2 text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300">Cuisines</p>
                            <div className="space-y-2">
                                {cuisines.map((cuisine) => (
                                    <label key={cuisine.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                        <input
                                            type="checkbox"
                                            checked={selectedCuisineIds.has(cuisine.id)}
                                            onChange={(event) => updateMultiFilter("cuisine", cuisine.id, event.target.checked)}
                                            className="h-4 w-4 accent-orange-500"
                                        />
                                        <span className="flex w-full items-center justify-between gap-2">
                                            <span>{cuisine.name}</span>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <p className="mb-2 text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300">Meal Type</p>
                        <div className="space-y-2">
                            {mealTypeOptions.map((mealType) => (
                                <label key={mealType} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={selectedMealTypes.has(mealType)}
                                        onChange={(event) => updateMultiFilter("mealType", mealType, event.target.checked)}
                                        className="h-4 w-4 accent-orange-500"
                                    />
                                    <span>{formatLabel(mealType)}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="mb-2 text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300">Dietary</p>
                        <div className="space-y-2">
                            {dietaryOptions.map((dietaryTag) => (
                                <label key={dietaryTag} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={selectedDietaryTags.has(dietaryTag)}
                                        onChange={(event) => updateMultiFilter("dietaryTag", dietaryTag, event.target.checked)}
                                        className="h-4 w-4 accent-orange-500"
                                    />
                                    <span>{formatLabel(dietaryTag)}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </aside>

            <div>
                <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-900/90">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {meta.total} meals found
                    </p>
                    <SortingComponent
                        className="h-11 rounded-xl"
                        label="Sort"
                        options={[
                            { label: "Name Asc", sortBy: "name", sortOrder: "asc" },
                            { label: "Name Desc", sortBy: "name", sortOrder: "desc" },
                            { label: "Price Low", sortBy: "price", sortOrder: "asc" },
                            { label: "Price High", sortBy: "price", sortOrder: "desc" },
                            { label: "Rating High", sortBy: "rating", sortOrder: "desc" },
                        ]}
                    />
                </div>

                {meals.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white/90 p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No meals found</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try reducing filters or changing search text.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {meals.map((meal) => (
                            <article
                                key={meal.id}
                                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/90"
                            >
                                <Link href={`/meals/${meal.id}`}>
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={meal.image}
                                            alt={meal.name}
                                            fill
                                            unoptimized
                                            sizes="(min-width: 1280px) 23vw, (min-width: 640px) 45vw, 100vw"
                                            className="object-cover transition duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/65 via-slate-900/20 to-transparent" />

                                        <div className="absolute right-3 top-3 inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-orange-600 shadow dark:bg-slate-900/95 dark:text-orange-300">
                                            ${meal.price}
                                        </div>

                                        {meal.discount > 0 && (
                                            <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-rose-500/95 px-2.5 py-1 text-xs font-bold text-white shadow">
                                                <Flame className="h-3.5 w-3.5" />
                                                {meal.discount}% OFF
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3 p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <h3 className="line-clamp-1 text-base font-bold text-slate-900 dark:text-slate-100">{meal.name}</h3>
                                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                {meal.rating}
                                            </span>
                                        </div>

                                        <p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{meal.description}</p>

                                        <div className="flex flex-wrap gap-2">
                                            <span className="inline-flex items-center rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
                                                {meal.mealType}
                                            </span>
                                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                                                {meal.dietaryTag}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-slate-200/80 pt-3 text-sm dark:border-slate-700">
                                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                                <Clock3 className="h-4 w-4 text-orange-500" />
                                                <span>{meal.preparationTime} min</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddToCart(meal.id)}
                                                    disabled={addingMealId === meal.id}
                                                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    <ShoppingCart className="h-4 w-4" />
                                                    {addingMealId === meal.id ? "Adding..." : "Add to Cart"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            <div className="col-span-1 mt-6 flex items-center justify-center lg:col-span-2">
                <PaginationComponent totalPage={meta.totalPages} />
            </div>
        </section>
    );
}
