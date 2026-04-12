import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { getCategories } from "@/services/category";
import Search from "@/components/modules/shared/SearchComponent";
import SortingComponent from "@/components/modules/shared/SortingComponent";
import PaginationComponent from "@/components/modules/shared/PaginationComponent";

type AdminCategory = {
    id?: string;
    _id?: string;
    name?: string;
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

export default async function AdminCategoriesPage({ searchParams }: {
    searchParams: Promise<{
        page?: string;
        searchTerm?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }>;
}) {
    const resolvedSearchParams = await searchParams;
    const currentPage = Math.max(1, Number(resolvedSearchParams.page ?? 1) || 1);

    const categories = (await getCategories({
        searchTerm: resolvedSearchParams.searchTerm,
        skip: currentPage - 1,
        sortBy: resolvedSearchParams.sortBy,
        sortOrder: resolvedSearchParams.sortOrder,
    })) as CategoryApiResponse;

    const displayCategories = (categories.data?.data ?? []).map((cat) => ({
        ...cat,
        displayName: cat.name ?? "Unnamed Category",
        displayImage: cat.image ?? cat.icon ?? "/categories/pizza.svg",
        displayMeals: cat.meals ?? cat.mealsCount ?? 0,
        displayStatus: cat.status ?? "Active",
    }));

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
                </Dialog>
            </header>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Search placeholder="Search categories..." debounceWait={300} />
                <SortingComponent
                    className="h-12 rounded-2xl"
                    label="Sort"
                    options={[
                        { label: "Name", value: "name" },
                        { label: "Created At", value: "createdAt" },
                    ]}
                />
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
                                            category.displayStatus === "Active"
                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                        }`}
                                    >
                                        {category.displayStatus}
                                    </span>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl"
                                    >
                                        <Pencil className="h-4 w-4" /> Edit
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="rounded-xl"
                                    >
                                        <Trash2 className="h-4 w-4" /> Delete
                                    </Button>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            )}

            <PaginationComponent totalPage={categories.data?.meta?.totalPages ?? 1} />
        </div>
    );
}
