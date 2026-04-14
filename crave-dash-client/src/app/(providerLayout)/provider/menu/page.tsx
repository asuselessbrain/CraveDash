import { Plus } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProviderMeals } from "@/services/meal";
import SearchComponent from "../../../../components/modules/shared/SearchComponent";
import SortingComponent from "../../../../components/modules/shared/SortingComponent";
import PaginationComponent from "../../../../components/modules/shared/PaginationComponent";
import MealsList from "../../../../components/modules/Provider/Menu/MealsList";

export default async function ProviderMenuPage({
    searchParams,
}: {
    searchParams: Promise<{ searchTerm?: string; sortBy?: string; sortOrder?: string; page?: string }>;
}) {

    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1;
    const limit = 12;
    const skip = (page - 1);

    const mealsResponse = await getProviderMeals({
        searchTerm: resolvedSearchParams.searchTerm,
        sortBy: resolvedSearchParams.sortBy || "name",
        sortOrder: (resolvedSearchParams.sortOrder as "asc" | "desc") || "asc",
        skip,
        take: limit,
    });

    const meals = mealsResponse.data?.data || [];
    const totalPages = mealsResponse.data?.meta.totalPages || 1;

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Manage Menu</p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Meal Catalog</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Add, update, pause, or remove meals from the live menu.</p>
                </div>

                <Button asChild className="h-11 rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                    <Link href="/provider/menu/new">
                        <Plus className="h-4 w-4" /> Add New Meal
                    </Link>
                </Button>
            </header>

            {/* Search, Sort, Pagination Controls */}
            <section className="space-y-4 rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <SearchComponent placeholder="Search meals by name..." />
                    <SortingComponent
                        options={[
                            { label: "Name Asc", sortBy: "name", sortOrder: "asc" },
                            { label: "Name Desc", sortBy: "name", sortOrder: "desc" },
                            { label: "Price Low", sortBy: "price", sortOrder: "asc" },
                            { label: "Price High", sortBy: "price", sortOrder: "desc" },
                            { label: "Meal Type Asc", sortBy: "mealType", sortOrder: "asc" },
                            { label: "Meal Type Desc", sortBy: "mealType", sortOrder: "desc" },
                            { label: "Created Oldest", sortBy: "createdAt", sortOrder: "asc" },
                            { label: "Created Newest", sortBy: "createdAt", sortOrder: "desc" },
                        ]}
                        label="Sort By"
                    />
                </div>

                {/* Meals Grid */}
                <Suspense fallback={<LoadingSkeleton />}>
                    <MealsList meals={meals} totalPages={totalPages} />
                </Suspense>

                {/* Pagination */}
                <div className="mt-6 flex justify-center">
                    <PaginationComponent totalPage={totalPages} />
                </div>
            </section>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                    <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-800" />
                    <div className="mt-4 space-y-2">
                        <div className="h-4 rounded bg-slate-200 dark:bg-slate-800" />
                        <div className="h-3 rounded bg-slate-200 dark:bg-slate-800" />
                    </div>
                </div>
            ))}
        </div>
    );
}
