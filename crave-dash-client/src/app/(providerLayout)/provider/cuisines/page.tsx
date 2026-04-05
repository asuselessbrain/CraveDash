import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CuisineForm from "@/components/modules/Provider/Cuisine/CuisineForm";



export default function ProviderCuisinesPage() {
    

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

            {/* <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cuisines.map((cuisine) => (
                    <article key={cuisine.id} className="overflow-hidden rounded-2xl border border-orange-200/70 bg-white/90 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                        <div className="relative h-32 w-full">
                            <Image src={cuisine.image} alt={cuisine.name} fill sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                        </div>
                        <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">{cuisine.name}</h2>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{cuisine.meals} meals</p>
                                </div>
                                <span className={`rounded-full px-2 py-1 text-xs font-bold whitespace-nowrap ${cuisine.status === "Active" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"}`}>
                                    {cuisine.status}
                                </span>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => startEdit(cuisine)} className="rounded-xl flex-1"><Pencil className="h-4 w-4" /> Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => deleteCuisine(cuisine.id)} className="rounded-xl flex-1"><Trash2 className="h-4 w-4" /> Delete</Button>
                            </div>
                        </div>
                    </article>
                ))}
            </section> */}
        </div>
    );
}
