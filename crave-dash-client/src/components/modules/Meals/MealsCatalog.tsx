"use client";

import { useMemo, useState } from "react";
import { Clock3, Flame, Star, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Search from "../shared/SearchComponent";
import PaginationComponent from "../shared/PaginationComponent";
import { ProviderCategory } from "@/app/(providerLayout)/provider/data";

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
    cuisines?: { id: string; name: string }[];
}

export default function MealsCatalog({ meals, meta, categories, cuisines }: MealsCatalogProps) {

    return (
        <section className="landing-reveal-delay-2 grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            <aside className="h-fit rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm lg:sticky lg:top-24 dark:border-slate-700 dark:bg-slate-900/90">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-sm font-extrabold tracking-widest text-slate-800 uppercase dark:text-slate-200">Filters</h2>
                    <button
                        type="button"
                        // onClick={clearAllFilters}
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
                                <label key={category.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        // checked={selectedMealTypes.includes(mealType)}
                                        // onChange={() => toggleValue(category.id, selectedMealTypes, setSelectedMealTypes)}
                                        className="h-4 w-4 accent-orange-500"
                                    />
                                    {category.name}
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
                                            // checked={selectedCuisines.includes(cuisine.id)}
                                            // onChange={() => toggleValue(cuisine.id, selectedCuisines, setSelectedCuisines)}
                                            className="h-4 w-4 accent-orange-500"
                                        />
                                        {cuisine.name}
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* <div>
                        <p className="mb-2 text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300">Dietary</p>
                        <div className="space-y-2">
                            {dietaryOptions.map((dietary) => (
                                <label key={dietary} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={selectedDietary.includes(dietary)}
                                        onChange={() => toggleValue(dietary, selectedDietary, setSelectedDietary)}
                                        className="h-4 w-4 accent-orange-500"
                                    />
                                    {dietary}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300">Max Price</p>
                            <span className="text-xs font-bold text-orange-600 dark:text-orange-300">${maxPrice.toFixed(0)}</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={Math.max(Math.ceil(Math.max(...meals.map((meal) => meal.price), 0)), 50)}
                            step={1}
                            value={maxPrice}
                            onChange={(event) => setMaxPrice(Number(event.target.value))}
                            className="w-full accent-orange-500"
                        />
                    </div>

                    <div>
                        <p className="mb-2 text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300">Minimum Rating</p>
                        <div className="grid grid-cols-2 gap-2">
                            {[0, 3, 4, 4.5].map((rating) => (
                                <button
                                    key={rating}
                                    type="button"
                                    onClick={() => setSelectedMinRating(rating)}
                                    className={`rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${selectedMinRating === rating
                                        ? "border-orange-500 bg-orange-500 text-white"
                                        : "border-slate-300 text-slate-700 hover:border-orange-400 dark:border-slate-700 dark:text-slate-300"
                                        }`}
                                >
                                    {rating === 0 ? "Any" : `${rating}+`}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="sort-by" className="mb-2 block text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-300">
                            Sort By
                        </label>
                        <select
                            id="sort-by"
                            value={sortBy}
                            onChange={(event) => setSortBy(event.target.value as "popular" | "price-low" | "price-high" | "rating")}
                            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                        >
                            <option value="popular">Most Popular</option>
                            <option value="rating">Top Rated</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div> */}
                </div>
            </aside>

            <div>
                {meals.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white/90 p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No meals found</h3>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Try reducing filters or changing search text.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                        {meals.map((meal) => (
                            <Link
                                key={meal.id}
                                href={`/meals/${meal.id}`}
                                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/90"
                            >
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
                                            <UtensilsCrossed className="h-4 w-4 text-orange-500" />
                                            <span className="line-clamp-1">{meal.providerName}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <div className="col-span-1 lg:col-span-2 mt-6 flex justify-center items-center">
                <PaginationComponent totalPage={meta.totalPages} />
            </div>
        </section>
    );
}
