"use client"
import { ProviderCuisine, providerCuisines } from '@/app/(providerLayout)/provider/data'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Upload } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

type CuisineForm = {
    id?: string;
    name: string;
    image: string;
};

const emptyForm: CuisineForm = {
    name: "",
    image: "/cuisines/italian.svg",
};

export default function CuisineForm() {
    const [cuisines, setCuisines] = useState<ProviderCuisine[]>(providerCuisines);
    const [form, setForm] = useState<CuisineForm>(emptyForm);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setForm((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    };


    const startEdit = (cuisine: ProviderCuisine) => {
        setForm({ id: cuisine.id, name: cuisine.name, image: cuisine.image });
    };

    const saveCuisine = () => {
        if (!form.name.trim()) return;

        const nextCuisine: ProviderCuisine = {
            name: form.name,
            image: form.image,
            status: "Active",
        };

        console.log(nextCuisine)
    };

    const deleteCuisine = (id: string) => {
        setCuisines((prev) => prev.filter((item) => item.id !== id));
    };
    return (
        <DialogContent className="max-w-lg">
            <DialogHeader>
                <DialogTitle>{form.id ? "Edit Cuisine" : "Add New Cuisine"}</DialogTitle>
                <DialogDescription>Create or update a cuisine type with a name and image.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Cuisine Name</label>
                    <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="e.g., Italian, Chinese, Indian" className="h-11 rounded-xl bg-white dark:bg-slate-950" />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Image Upload</label>
                    <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            <Upload className="h-4 w-4" /> Choose file
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700">
                            <Image src={form.image} alt="Cuisine preview" fill sizes="56px" className="object-cover" />
                        </div>
                    </div>
                </div>
            </div>

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" className="rounded-xl">Cancel</Button>
                </DialogClose>
                <Button onClick={saveCuisine} className="rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                    Save Cuisine
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
