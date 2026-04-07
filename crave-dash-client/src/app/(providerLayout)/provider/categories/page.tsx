import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CategoryForm from "@/components/modules/Provider/Category/CategoryForm";
import { getCuisines } from "@/services/cuisine";


export default async function ProviderCategoriesPage() {
 
    const cuisines = await getCuisines()

    const cuisineOptions = cuisines.data.data

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Manage Categories</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">My Categories</h1>
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

            {/* <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {categories.map((category) => (
                    <article key={category.id} className="overflow-hidden rounded-3xl border border-orange-200/70 bg-white/90 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                        <div className="relative h-40 w-full">
                            <Image src={category.image} alt={category.name} fill sizes="(min-width: 1280px) 30vw, 50vw" className="object-cover" />
                        </div>
                        <div className="p-5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">{category.name}</h2>
                                            <p className="mt-1 text-sm font-semibold text-orange-600 dark:text-orange-300">{category.cuisine}</p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{category.meals} meals</p>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${category.status === "Active" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}>
                                    {category.status}
                                </span>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Button variant="outline" size="sm"className="rounded-xl"><Pencil className="h-4 w-4" /> Edit</Button>
                                <Button variant="destructive" size="sm" className="rounded-xl"><Trash2 className="h-4 w-4" /> Delete</Button>
                            </div>
                        </div>
                    </article>
                ))}
            </section> */}
        </div>
    );
}
