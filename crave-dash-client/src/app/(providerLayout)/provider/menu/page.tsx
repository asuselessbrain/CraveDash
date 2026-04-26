import { Plus } from "lucide-react";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProviderMeals } from "@/services/meal";
import { deleteMeal, toggleMealAvailability } from "@/services/meal";
import { getProviderAllCategories } from "@/services/category";
import SearchComponent from "../../../../components/modules/shared/SearchComponent";
import SortingComponent from "../../../../components/modules/shared/SortingComponent";
import PaginationComponent from "../../../../components/modules/shared/PaginationComponent";
import MealsList from "../../../../components/modules/Provider/Menu/MealsList";
import ProviderMenuFilters from "../../../../components/modules/Provider/Menu/ProviderMenuFilters";

async function handleDeleteMealAction(mealId: string) {
    "use server";
    try {
        await deleteMeal(mealId);
    } catch (error) {
        throw new Error("Failed to delete meal");
    }
}

async function handleToggleAvailabilityAction(mealId: string) {
    "use server";
    try {
        await toggleMealAvailability(mealId);
    } catch (error) {
        throw new Error("Failed to toggle meal availability");
    }
}

export default async function ProviderMenuPage({
    searchParams,
}: {
    searchParams: Promise<{
        searchTerm?: string;
        sortBy?: string;
        sortOrder?: string;
        page?: string;
        categoryId?: string;
        mealType?: string;
        dietaryTag?: string;
        availabilityStatus?: string;
    }>;
}) {

    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1;
    const limit = 12;
    const skip = (page - 1);

    const [mealsResponse, categoriesResponse] = await Promise.all([
        getProviderMeals({
            searchTerm: resolvedSearchParams.searchTerm,
            sortBy: resolvedSearchParams.sortBy || "name",
            sortOrder: (resolvedSearchParams.sortOrder as "asc" | "desc") || "asc",
            categoryId: resolvedSearchParams.categoryId,
            mealType: resolvedSearchParams.mealType,
            dietaryTag: resolvedSearchParams.dietaryTag,
            availabilityStatus: resolvedSearchParams.availabilityStatus,
            skip,
            take: limit,
        }),
        getProviderAllCategories({ take: 100 }),
    ]);

    const meals = mealsResponse.data?.data || [];
    const totalPages = mealsResponse.data?.meta.totalPages || 1;
    const categories = categoriesResponse.data?.data || [];

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
            <section className="space-y-5 rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
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
                        className="h-12 rounded-xl border-slate-200 bg-white/95 px-4 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                    />
                </div>

                <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-950/40 sm:p-4">
                    <ProviderMenuFilters categories={categories} />
                </div>

                {/* Meals Grid */}
                <Suspense fallback={<LoadingSkeleton />}>
                    <MealsList 
                        meals={meals}
                        totalPages={totalPages}
                        onDelete={handleDeleteMealAction}
                        onToggleAvailability={handleToggleAvailabilityAction}
                    />
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
