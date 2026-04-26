import Image from "next/image";
import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CategoryForm from "@/components/modules/Provider/Category/CategoryForm";
import CategoryActions from "@/components/modules/Provider/Category/CategoryActions";
import { deleteCategory, getCategories, updateCategory } from "@/services/category";
import { getCuisines } from "@/services/cuisine";
import Search from "@/components/modules/shared/SearchComponent";
import SortingComponent from "@/components/modules/shared/SortingComponent";
import PaginationComponent from "@/components/modules/shared/PaginationComponent";
import { revalidatePath } from "next/cache";
import { ProviderCategoryStatus, ProviderCuisine } from "@/app/(providerLayout)/provider/data";

type AdminCategory = {
    id?: string;
    _id?: string;
    name?: string;
    cuisineId?: string;
    image?: string;
    icon?: string;
    description?: string;
    meals?: number;
    mealsCount?: number;
    status?: string;
};

type CategoryApiResponse = {
    data: {
        data: AdminCategory[];
        meta: {
            totalPages: number;
        };
    };
};

type SearchParams = {
    page?: string;
    searchTerm?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

type CategoryActionResult = {
    success: boolean;
    message: string;
};

const statusFilters: Array<{ label: string; value?: string }> = [
    { label: "All" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
];

function buildStatusHref(current: SearchParams, status?: string): string {
    const params = new URLSearchParams();

    if (current.searchTerm) params.set("searchTerm", current.searchTerm);
    if (current.sortBy) params.set("sortBy", current.sortBy);
    if (current.sortOrder) params.set("sortOrder", current.sortOrder);
    params.set("page", "1");

    if (status) {
        params.set("status", status);
    }

    const query = params.toString();
    return query ? `?${query}` : "?";
}

export default async function AdminCategoriesPage({ searchParams }: {
    searchParams: Promise<SearchParams>;
}) {
    const resolvedSearchParams = await searchParams;
    const currentPage = Math.max(1, Number(resolvedSearchParams.page ?? 1) || 1);

    const cuisines = await getCuisines();
    const cuisineOptions = cuisines.data.data as ProviderCuisine[];

    const categories = (await getCategories({
        searchTerm: resolvedSearchParams.searchTerm,
        skip: currentPage - 1,
        status: resolvedSearchParams.status,
        sortBy: resolvedSearchParams.sortBy,
        sortOrder: resolvedSearchParams.sortOrder,
    })) as CategoryApiResponse;

    const displayCategories = (categories.data?.data ?? []).map((cat) => ({
        ...cat,
        displayName: cat.name ?? "Unnamed Category",
        displayImage: cat.image ?? cat.icon ?? "/categories/pizza.svg",
        displayMeals: cat.meals ?? cat.mealsCount ?? 0,
        displayStatus: cat.status ?? "ACTIVE",
    }));

    async function toggleCategoryStatusAction(formData: FormData) {
        "use server";

        const categoryId = String(formData.get("categoryId") || "").trim();
        const nextStatus = String(formData.get("nextStatus") || "").trim();

        if (!categoryId || (nextStatus !== "ACTIVE" && nextStatus !== "INACTIVE")) {
            return {
                success: false,
                message: "Invalid category or status.",
            } satisfies CategoryActionResult;
        }

        try {
            const result = await updateCategory(categoryId, { status: nextStatus as ProviderCategoryStatus });

            if (result?.success === false) {
                return {
                    success: false,
                    message: result?.errorMessage || "Failed to update category status.",
                } satisfies CategoryActionResult;
            }

            revalidatePath("/admin/categories");

            return {
                success: true,
                message: result?.message || "Category status updated successfully!",
            } satisfies CategoryActionResult;
        } catch {
            return {
                success: false,
                message: "Something went wrong while updating category status.",
            } satisfies CategoryActionResult;
        }
    }

    async function deleteCategoryAction(formData: FormData) {
        "use server";

        const categoryId = String(formData.get("categoryId") || "").trim();

        if (!categoryId) {
            return {
                success: false,
                message: "Invalid category id.",
            } satisfies CategoryActionResult;
        }

        try {
            const result = await deleteCategory(categoryId);

            if (result?.success === false) {
                return {
                    success: false,
                    message: result?.errorMessage || "Failed to delete category.",
                } satisfies CategoryActionResult;
            }

            revalidatePath("/admin/categories");

            return {
                success: true,
                message: result?.message || "Category deleted successfully!",
            } satisfies CategoryActionResult;
        } catch {
            return {
                success: false,
                message: "Something went wrong while deleting category.",
            } satisfies CategoryActionResult;
        }
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Manage Categories</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Category Library</h1>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="h-11 rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                            <Plus className="h-4 w-4" /> Add Category
                        </Button>
                    </DialogTrigger>
                    <CategoryForm cuisineOptions={cuisineOptions} />
                </Dialog>
            </header>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Search placeholder="Search categories..." debounceWait={300} />
                <SortingComponent
                    className="h-12 rounded-2xl"
                    label="Sort"
                    options={[
                        { label: "Name Asc", sortBy: "name", sortOrder: "asc" },
                        { label: "Name Desc", sortBy: "name", sortOrder: "desc" },
                        { label: "Created Oldest", sortBy: "createdAt", sortOrder: "asc" },
                        { label: "Created Newest", sortBy: "createdAt", sortOrder: "desc" },
                    ]}
                />
            </div>

            <div className="flex flex-wrap gap-2">
                {statusFilters.map((statusFilter) => {
                    const currentStatus = resolvedSearchParams.status?.toUpperCase();
                    const isActive =
                        (statusFilter.value && statusFilter.value === currentStatus) ||
                        (!statusFilter.value && !currentStatus);

                    return (
                        <Link
                            key={statusFilter.label}
                            href={buildStatusHref(resolvedSearchParams, statusFilter.value)}
                            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${isActive
                                ? "border-orange-500 bg-orange-500 text-white"
                                : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
                                }`}
                        >
                            {statusFilter.label}
                        </Link>
                    );
                })}
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
                {displayCategories.length} categor{displayCategories.length === 1 ? "y" : "ies"} found
            </p>

            {displayCategories.length === 0 ? (
                <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center dark:border-slate-700 dark:bg-slate-950">
                    <p className="text-sm text-slate-500 dark:text-slate-400">No categories found.</p>
                </div>
            ) : (
                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {displayCategories.map((category) => (
                        <article key={category.id ?? category._id} className="overflow-hidden rounded-3xl border border-orange-200/70 bg-white/90 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                            <div className="relative h-40 w-full bg-slate-100 dark:bg-slate-800">
                                <Image
                                    src={category.displayImage}
                                    alt={category.displayName}
                                    fill
                                    sizes="(min-width: 1280px) 30vw, 50vw"
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">{category.displayName}</h2>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{category.displayMeals} meals</p>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                                            category.displayStatus === "ACTIVE"
                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                        }`}
                                    >
                                        {category.displayStatus}
                                    </span>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-xl flex-1"
                                            >
                                                <Pencil className="h-4 w-4" /> Edit
                                            </Button>
                                        </DialogTrigger>
                                        <CategoryForm
                                            cuisineOptions={cuisineOptions}
                                            initialData={{
                                                id: category.id ?? category._id,
                                                name: category.displayName,
                                                cuisineId: category.cuisineId || "",
                                                image: category.displayImage,
                                            }}
                                        />
                                    </Dialog>
                                    <CategoryActions
                                        categoryId={category.id ?? category._id}
                                        status={category.displayStatus as ProviderCategoryStatus}
                                        onDeleteAction={deleteCategoryAction}
                                        onToggleStatusAction={toggleCategoryStatusAction}
                                        showToggle={false}
                                        containerClassName="flex-1"
                                    />
                                </div>
                                <CategoryActions
                                    categoryId={category.id ?? category._id}
                                    status={category.displayStatus as ProviderCategoryStatus}
                                    onDeleteAction={deleteCategoryAction}
                                    onToggleStatusAction={toggleCategoryStatusAction}
                                    showDelete={false}
                                    containerClassName="mt-2 w-full"
                                />
                            </div>
                        </article>
                    ))}
                </section>
            )}

            <PaginationComponent totalPage={categories.data?.meta?.totalPages ?? 1} />
        </div>
    );
}
