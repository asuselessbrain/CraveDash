import { Pencil, Plus, Trash2, } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CuisineForm from "@/components/modules/Provider/Cuisine/CuisineForm";
import Search from "@/components/modules/shared/SearchComponent";
import SortingComponent from "@/components/modules/shared/SortingComponent";
import { getCuisines, updateCuisine } from "@/services/cuisine";
import { ProviderCuisine } from "../data";
import Image from "next/image";
import PaginationComponent from "@/components/modules/shared/PaginationComponent";
import { revalidatePath } from "next/cache";

const statusFilters: Array<{ label: string; value?: string }> = [
        { label: "All" },
        { label: "Active", value: "ACTIVE" },
        { label: "Inactive", value: "INACTIVE" },
];

function buildStatusHref(params: {
    searchTerm?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}, status?: string): string {
    const query = new URLSearchParams();

    if (params.searchTerm) query.set("searchTerm", params.searchTerm);
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);
    query.set("page", "1");

    if (status) {
        query.set("status", status);
    }

    const queryString = query.toString();
    return queryString ? `?${queryString}` : "?";
}



export default async function ProviderCuisinesPage({searchParams}: {
  searchParams: Promise<{
    page?: string;
    searchTerm?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }>;
}) {
const resolvedSearchParams = await searchParams;
const currentPage = Math.max(1, Number(resolvedSearchParams.page ?? 1) || 1);

const cuisines = await getCuisines({
        searchTerm: resolvedSearchParams.searchTerm,
    skip: currentPage - 1,
        status: resolvedSearchParams.status,
        sortBy: resolvedSearchParams.sortBy,
        sortOrder: resolvedSearchParams.sortOrder,
})

const cuisinesList = cuisines.data?.data ?? [];

async function toggleCuisineStatusAction(formData: FormData) {
    "use server";

    const cuisineId = String(formData.get("cuisineId") || "").trim();
    const nextStatus = String(formData.get("nextStatus") || "").trim();

    if (!cuisineId || (nextStatus !== "ACTIVE" && nextStatus !== "INACTIVE")) {
        return;
    }

    await updateCuisine(cuisineId, { status: nextStatus });
    revalidatePath("/provider/cuisines");
}

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Manage Cuisines</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Cuisine Types</h1>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="h-11 rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                            <Plus className="h-4 w-4" /> Add Cuisine
                        </Button>
                    </DialogTrigger>
                    <CuisineForm />
                </Dialog>
            </header>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Search placeholder="Search cuisines..." debounceWait={300} />
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
                {cuisinesList.length} cuisine{cuisinesList.length === 1 ? "" : "s"} found
            </p>
            {cuisinesList.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
                    No cuisines available in the database yet.
                </div>
            ) : (
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {cuisinesList.map((cuisine: ProviderCuisine) => {
                        const mealsCount = Number(cuisine.mealsCount ?? cuisine.meals ?? 0) || 0;
                        const categoriesCount = Number(cuisine.categoriesCount ?? cuisine.categories ?? 0) || 0;
                        const cuisineId = cuisine.id ?? (cuisine as { _id?: string })._id;

                        return (
                        <article key={cuisine.id} className="overflow-hidden rounded-2xl border border-orange-200/70 bg-white/90 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                            <div className="relative h-32 w-full">
                                <Image src={cuisine.image} alt={cuisine.name} fill sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">{cuisine.name}</h2>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{categoriesCount} categories • {mealsCount} meals</p>
                                    </div>
                                    <span className={`rounded-full px-2 py-1 text-xs font-bold whitespace-nowrap ${cuisine.status === "ACTIVE" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}>
                                        {cuisine.status}
                                    </span>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="rounded-xl flex-1"><Pencil className="h-4 w-4" /> Edit</Button>
                                        </DialogTrigger>
                                        {cuisineId ? (
                                            <CuisineForm
                                                initialData={{
                                                    id: cuisineId,
                                                    name: cuisine.name,
                                                    image: cuisine.image,
                                                }}
                                            />
                                        ) : (
                                            <CuisineForm />
                                        )}
                                    </Dialog>
                                    <Button variant="destructive" size="sm" className="rounded-xl flex-1"><Trash2 className="h-4 w-4" /> Delete</Button>
                                </div>
                                {cuisineId ? (
                                    <form action={toggleCuisineStatusAction} className="mt-2">
                                        <input type="hidden" name="cuisineId" value={cuisineId} />
                                        <input
                                            type="hidden"
                                            name="nextStatus"
                                            value={cuisine.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"}
                                        />
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            size="sm"
                                            className="w-full rounded-xl"
                                        >
                                            {cuisine.status === "ACTIVE" ? "Mark Inactive" : "Mark Active"}
                                        </Button>
                                    </form>
                                ) : null}
                            </div>
                        </article>
                    )})}
                </section>
            )}
            <PaginationComponent totalPage={cuisines.data.meta.totalPages} />
        </div>
    );
}
