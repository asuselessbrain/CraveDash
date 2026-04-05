"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { mealStatusOptions, providerCategories, providerMealsSeed, type MealStatus, type ProviderMeal } from "../data";

type MealFormState = {
    id?: string;
    name: string;
    description: string;
    price: string;
    category: string;
    image: string;
    status: MealStatus;
};

const activeCategories = providerCategories.filter((category) => category.status === "Active");

const getCuisineForCategory = (categoryName: string) => providerCategories.find((category) => category.name === categoryName)?.cuisine ?? "Italian";

const emptyForm: MealFormState = {
    name: "",
    description: "",
    price: "",
    category: activeCategories[0]?.name ?? "",
    image: "/categories/pizza.svg",
    status: "Active",
};

export default function ProviderMenuPage() {
    const [meals, setMeals] = useState<ProviderMeal[]>(providerMealsSeed);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingMeal, setEditingMeal] = useState<MealFormState>(emptyForm);

    const activeCount = useMemo(() => meals.filter((meal) => meal.status === "Active").length, [meals]);

    const openAddMeal = () => {
        setEditingMeal(emptyForm);
        setDialogOpen(true);
    };

    const openEditMeal = (meal: ProviderMeal) => {
        setEditingMeal({
            id: meal.id,
            name: meal.name,
            description: meal.description,
            price: meal.price.toString(),
            category: meal.category,
            image: meal.image,
            status: meal.status,
        });
        setDialogOpen(true);
    };

    const updateField = (key: keyof MealFormState, value: string) => {
        setEditingMeal((prev) => ({ ...prev, [key]: value }));
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        updateField("image", URL.createObjectURL(file));
    };

    const saveMeal = () => {
        if (!editingMeal.name || !editingMeal.description || !editingMeal.price) return;

        const nextMeal: ProviderMeal = {
            id: editingMeal.id ?? `meal-${Date.now()}`,
            name: editingMeal.name,
            description: editingMeal.description,
            price: Number(editingMeal.price),
            category: editingMeal.category,
            cuisine: getCuisineForCategory(editingMeal.category),
            image: editingMeal.image,
            status: editingMeal.status,
        };

        setMeals((prev) => {
            if (editingMeal.id) {
                return prev.map((meal) => (meal.id === editingMeal.id ? nextMeal : meal));
            }
            return [nextMeal, ...prev];
        });

        setDialogOpen(false);
        setEditingMeal(emptyForm);
    };

    const deleteMeal = (id: string) => {
        setMeals((prev) => prev.filter((meal) => meal.id !== id));
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Manage Menu</p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Meal Catalog</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Add, update, pause, or remove meals from the live menu.</p>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openAddMeal} className="h-11 rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                            <Plus className="h-4 w-4" /> Add New Meal
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>{editingMeal.id ? "Edit Meal" : "Add New Meal"}</DialogTitle>
                            <DialogDescription>Fill in the menu information and upload an image if needed.</DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Name</label>
                                <Input value={editingMeal.name} onChange={(event) => updateField("name", event.target.value)} className="h-11 rounded-xl bg-white dark:bg-slate-950" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                                <textarea
                                    rows={4}
                                    value={editingMeal.description}
                                    onChange={(event) => updateField("description", event.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Price</label>
                                <Input type="number" value={editingMeal.price} onChange={(event) => updateField("price", event.target.value)} className="h-11 rounded-xl bg-white dark:bg-slate-950" />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Category</label>
                                <select
                                    value={editingMeal.category}
                                    onChange={(event) => updateField("category", event.target.value)}
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                                >
                                    {activeCategories.map((category) => (
                                        <option key={category.id} value={category.name}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Status</label>
                                <select
                                    value={editingMeal.status}
                                    onChange={(event) => updateField("status", event.target.value)}
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                                >
                                    {mealStatusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Image Upload</label>
                                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                                        <Upload className="h-4 w-4" /> Choose file
                                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    </label>
                                    <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700">
                                        <Image src={editingMeal.image} alt="Meal preview" fill sizes="64px" className="object-cover" />
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Current image preview is shown here.</p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">Cancel</Button>
                            <Button onClick={saveMeal} className="rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                                {editingMeal.id ? "Save Changes" : "Add Meal"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </header>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                    <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Total Meals</p>
                    <p className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-100">{meals.length}</p>
                </div>
                <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                    <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Active Meals</p>
                    <p className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-100">{activeCount}</p>
                </div>
                <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                    <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Paused Meals</p>
                    <p className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-100">{meals.length - activeCount}</p>
                </div>
                <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90">
                    <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">Average Price</p>
                    <p className="mt-3 text-3xl font-black text-slate-900 dark:text-slate-100">${(meals.reduce((sum, meal) => sum + meal.price, 0) / meals.length).toFixed(2)}</p>
                </div>
            </section>

            <section className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-950">
                            <tr className="text-left text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Cuisine</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-900">
                            {meals.map((meal) => (
                                <tr key={meal.id} className="align-middle hover:bg-slate-50 dark:hover:bg-slate-950/70">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700">
                                                <Image src={meal.image} alt={meal.name} fill sizes="48px" className="object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 dark:text-slate-100">{meal.name}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{meal.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{meal.cuisine}</td>
                                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{meal.category}</td>
                                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">${meal.price.toFixed(2)}</td>
                                    <td className="px-4 py-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${meal.status === "Active" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"}`}>
                                            {meal.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditMeal(meal)} className="rounded-xl">
                                                <Pencil className="h-4 w-4" /> Edit
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => deleteMeal(meal.id)} className="rounded-xl">
                                                <Trash2 className="h-4 w-4" /> Delete
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
