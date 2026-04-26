"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type CategoryOption = {
    id?: string;
    _id?: string;
    name: string;
};

type ProviderMenuFiltersProps = {
    categories: CategoryOption[];
};

const mealTypeOptions = ["BREAKFAST", "LUNCH", "DINNER"] as const;
const dietaryTagOptions = ["VEG", "NON_VEG", "VEGAN"] as const;
const availabilityOptions = ["AVAILABLE", "UNAVAILABLE"] as const;

const formatLabel = (value: string) =>
    value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

export default function ProviderMenuFilters({ categories }: ProviderMenuFiltersProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const applyFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        params.set("page", "1");

        const query = params.toString();
        replace(query ? `${pathname}?${query}` : pathname);
    };

    const clearAllFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        ["categoryId", "mealType", "dietaryTag", "availabilityStatus", "page"].forEach((key) => {
            params.delete(key);
        });

        const query = params.toString();
        replace(query ? `${pathname}?${query}` : pathname);
    };

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <select
                    value={searchParams.get("categoryId") ?? ""}
                    onChange={(event) => applyFilter("categoryId", event.target.value)}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-orange-500/20"
                    aria-label="Filter by category"
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => {
                        const categoryId = category.id ?? category._id;
                        if (!categoryId) return null;

                        return (
                            <option key={categoryId} value={categoryId}>
                                {category.name}
                            </option>
                        );
                    })}
                </select>

                <select
                    value={searchParams.get("mealType") ?? ""}
                    onChange={(event) => applyFilter("mealType", event.target.value)}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-orange-500/20"
                    aria-label="Filter by meal type"
                >
                    <option value="">All Meal Types</option>
                    {mealTypeOptions.map((mealType) => (
                        <option key={mealType} value={mealType}>
                            {formatLabel(mealType)}
                        </option>
                    ))}
                </select>

                <select
                    value={searchParams.get("dietaryTag") ?? ""}
                    onChange={(event) => applyFilter("dietaryTag", event.target.value)}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-orange-500/20"
                    aria-label="Filter by dietary tag"
                >
                    <option value="">All Dietary Types</option>
                    {dietaryTagOptions.map((dietaryTag) => (
                        <option key={dietaryTag} value={dietaryTag}>
                            {formatLabel(dietaryTag)}
                        </option>
                    ))}
                </select>

                <select
                    value={searchParams.get("availabilityStatus") ?? ""}
                    onChange={(event) => applyFilter("availabilityStatus", event.target.value)}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:ring-orange-500/20"
                    aria-label="Filter by availability"
                >
                    <option value="">All Availability</option>
                    {availabilityOptions.map((status) => (
                        <option key={status} value={status}>
                            {formatLabel(status)}
                        </option>
                    ))}
                </select>

            <button
                type="button"
                onClick={clearAllFilters}
                className="h-11 rounded-xl border border-orange-200 bg-white px-4 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 dark:border-orange-400/30 dark:bg-slate-900 dark:text-orange-300 dark:hover:bg-orange-500/10"
            >
                Clear Filters
            </button>
        </div>
    );
}
