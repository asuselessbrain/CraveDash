"use client"
import { ProviderCuisine } from '@/app/(providerLayout)/provider/data'
import { Button } from '@/components/ui/button'
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { createCuisine } from '@/services/cuisine'
import { Loader2, Upload } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { uploadImageClientSide } from '../../shared/ReusableImageUploaderFunction'

type CuisineForm = {
    id?: string;
    name: string;
    image: string;
};

const emptyForm: CuisineForm = {
    name: "",
    image: "/cuisines/italian.svg",
};

type CuisineFormProps = {
    onSuccess?: () => void;
};

export default function CuisineForm({ onSuccess }: CuisineFormProps) {
    const [form, setForm] = useState<CuisineForm>(emptyForm);
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
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

    const saveCuisine = async() => {
        if (!form.name.trim()) return;

        const nextCuisine: ProviderCuisine = {
            name: form.name,
            image: form.image
        };

        setIsSubmitting(true);
        try {
            const result = await createCuisine(nextCuisine)
            if (result?.success) {
                toast.success(result.message || "Cuisine saved successfully!");
                setForm(emptyForm);
                onSuccess?.();
                return;
            }

            toast.error(result?.errorMessage || "Failed to save cuisine. Please try again.");
        } catch {
            toast.error("Something went wrong while saving cuisine.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isActionDisabled = isUploading || isSubmitting || !form.name.trim();

    return (
        <DialogContent className="max-w-lg">
            <DialogHeader>
                <DialogTitle>{form.id ? "Edit Cuisine" : "Add New Cuisine"}</DialogTitle>
                <DialogDescription>Create or update a cuisine type with a name and image.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Cuisine Name</label>
                    <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="e.g., Italian, Chinese, Indian" className="h-11 rounded-xl bg-white dark:bg-slate-950" disabled={isUploading || isSubmitting} />
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
                            <Image src={form.image} alt="Cuisine preview" fill sizes="56px" className="object-cover" />
                        </div>
                    </div>
                </div>
            </div>

            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" className="rounded-xl" disabled={isUploading || isSubmitting}>Cancel</Button>
                </DialogClose>
                <Button onClick={saveCuisine} className="rounded-xl bg-orange-500 text-white hover:bg-orange-400" disabled={isActionDisabled}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                        </>
                    ) : (
                        "Save Cuisine"
                    )}
                </Button>
            </DialogFooter>
        </DialogContent>
    )
}
