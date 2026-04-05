"use client";

import Image from "next/image";
import { useState } from "react";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cuisineOptions, providerCategories, type ProviderCategory } from "../data";

type CategoryForm = {
    id?: string;
    name: string;
    cuisine: string;
    image: string;
};

const emptyForm: CategoryForm = {
    name: "",
    cuisine: "Italian",
    image: "/categories/pizza.svg",
};

export default function ProviderCategoriesPage() {
    const [categories, setCategories] = useState<ProviderCategory[]>(providerCategories);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<CategoryForm>(emptyForm);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setForm((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    };

    const startAdd = () => {
        setForm(emptyForm);
        setOpen(true);
    };

    const startEdit = (category: ProviderCategory) => {
        setForm({ id: category.id, name: category.name, cuisine: category.cuisine, image: category.image });
        setOpen(true);
    };

    const saveCategory = () => {
        if (!form.name.trim()) return;

        const nextCategory: ProviderCategory = {
            id: form.id ?? `cat-${Date.now()}`,
            name: form.name,
            cuisine: form.cuisine,
            image: form.image,
            meals: form.id ? categories.find((item) => item.id === form.id)?.meals ?? 0 : 0,
            status: "Active",
        };

        setCategories((prev) => {
            if (form.id) {
                return prev.map((item) => (item.id === form.id ? nextCategory : item));
            }
            return [nextCategory, ...prev];
        });

        setOpen(false);
        setForm(emptyForm);
    };

    const deleteCategory = (id: string) => {
        setCategories((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Manage Categories</p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">My Categories</h1>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={startAdd} className="h-11 rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                            <Plus className="h-4 w-4" /> Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{form.id ? "Edit Category" : "Add New Category"}</DialogTitle>
                            <DialogDescription>Create or update a category name and image.</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Category Name</label>
                                <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} className="h-11 rounded-xl bg-white dark:bg-slate-950" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Cuisine</label>
                                <select
                                    value={form.cuisine}
                                    onChange={(event) => setForm((prev) => ({ ...prev, cuisine: event.target.value }))}
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                                >
                                    {cuisineOptions.map((cuisine) => (
                                        <option key={cuisine} value={cuisine}>
                                            {cuisine}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Image Upload</label>
                                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                                        <Upload className="h-4 w-4" /> Choose file
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                    <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700">
                                        <Image src={form.image} alt="Category preview" fill sizes="56px" className="object-cover" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancel</Button>
                            <Button onClick={saveCategory} className="rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                                Save Category
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </header>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                                <Button variant="outline" size="sm" onClick={() => startEdit(category)} className="rounded-xl"><Pencil className="h-4 w-4" /> Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => deleteCategory(category.id)} className="rounded-xl"><Trash2 className="h-4 w-4" /> Delete</Button>
                            </div>
                        </div>
                    </article>
                ))}
            </section>
        </div>
    );
}
