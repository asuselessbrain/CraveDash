"use client";
import { ProviderCuisine } from "@/app/(providerLayout)/provider/data";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { uploadImageClientSide } from "../../shared/ReusableImageUploaderFunction";
import { toast } from "sonner";
import { createCategory } from "@/services/category";

type CategoryForm = {
    id?: string;
    name: string;
    cuisineId: string;
    image: string;
};

type CuisineOption = ProviderCuisine & { _id?: string };

const emptyForm: CategoryForm = {
    name: "",
    cuisineId: "",
    image: "/categories/pizza.svg",
};

export default function CategoryForm({ cuisineOptions }: { cuisineOptions: CuisineOption[] }) {

    const [form, setForm] = useState<CategoryForm>(emptyForm);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const closeRef = useRef<HTMLButtonElement>(null);

    const getCuisineId = (cuisine: CuisineOption) => cuisine.id ?? cuisine._id ?? "";

    useEffect(() => {
        if (!form.cuisineId && cuisineOptions.length > 0) {
            const firstCuisineId = getCuisineId(cuisineOptions[0]);
            if (firstCuisineId) {
                setForm((prev) => ({ ...prev, cuisineId: firstCuisineId }));
            }
        }
    }, [cuisineOptions, form.cuisineId]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setIsUploading(true);

        try {
            const res = await uploadImageClientSide(file)
            if (res) {
                setForm((prev) => ({ ...prev, image: res }));
            }
        } catch {
            toast.error("Image upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const saveCategory = async () => {
        if (!form.name.trim() || !form.cuisineId) return;

        const nextCategory = {
            name: form.name,
            cuisineId: form.cuisineId,
            image: form.image
        };

        setIsSubmitting(true);

        const res = await createCategory(nextCategory)

        if (res.success) {
            toast.success(res.message || "Category saved successfully!");
            setForm(emptyForm);
            closeRef.current?.click();
            setIsSubmitting(false);
            return;
        }
        else {
            toast.error(res.errorMessage || "Failed to save category. Please try again.");
            setIsSubmitting(false);
        }


    };

    const isActionDisabled = isUploading || isSubmitting || !form.name.trim() || !form.cuisineId;

    return (
        <DialogContent className="max-w-lg">
            <DialogHeader>
                <DialogTitle>{form.id ? "Edit Category" : "Add New Category"}</DialogTitle>
                <DialogDescription>Create or update a category name and image.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Category Name</label>
                    <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} className="h-11 rounded-xl bg-white dark:bg-slate-950" disabled={isUploading || isSubmitting} />
                </div>
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Cuisine</label>
                    <select
                        value={form.cuisineId}
                        onChange={(event) => setForm((prev) => ({ ...prev, cuisineId: event.target.value }))}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                        disabled={isUploading || isSubmitting || cuisineOptions.length === 0}
                    >
                        <option value="" disabled>
                            Select a cuisine
                        </option>
                        {cuisineOptions.map((cuisine) => (
                            <option key={getCuisineId(cuisine)} value={getCuisineId(cuisine)}>
                                {cuisine.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Image Upload</label>
                    <div className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            <Upload className="h-4 w-4" /> Choose file
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={isUploading || isSubmitting} />
                        </label>
                        {isUploading && (
                            <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                            </div>
                        )}
                        <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700">
                            <Image src={form.image} alt="Category preview" fill sizes="56px" className="object-cover" />
                        </div>
                    </div>
                </div>
            </div>

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" className="rounded-xl" disabled={isUploading || isSubmitting}>Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                    <button ref={closeRef} type="button" className="hidden" aria-hidden="true" />
                </DialogClose>
                <Button onClick={saveCategory} className="rounded-xl bg-orange-500 text-white hover:bg-orange-400" disabled={isActionDisabled}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                        </>
                    ) : (
                        "Save Category"
                    )}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
