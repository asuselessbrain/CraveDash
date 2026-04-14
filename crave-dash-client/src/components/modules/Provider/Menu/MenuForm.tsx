"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMeal, updateMeal } from "@/services/meal";
import { uploadImageClientSide } from "../../shared/ReusableImageUploaderFunction";

type CategoryOption = {
    id?: string;
    _id?: string;
    name: string;
    cuisineId?: string;
    cuisine?: string;
    meals?: number;
    mealsCount?: number;
};

type MealType = "BREAKFAST" | "LUNCH" | "DINNER";
type DietaryTag = "VEG" | "NON_VEG" | "VEGAN";
type SpiceLevel = "MILD" | "MEDIUM" | "HOT" | "EXTRA_HOT";
type AvailabilityStatus = "AVAILABLE" | "UNAVAILABLE";

type MealFormState = {
    id?: string;
    name: string;
    description: string;
    categoryId: string;
    price: string;
    image: string;
    images: string[];
    mealType: MealType;
    dietaryTag: DietaryTag;
    spiceLevel: SpiceLevel;
    ingredients: string;
    availabilityStatus: AvailabilityStatus;
    preparationTime: string;
    servingSize: string;
    discount: string;
    stockQuantity: string;
    isPopular: boolean;
    isFeatured: boolean;
    videoUrl: string;
};

const emptyForm: MealFormState = {
    name: "",
    description: "",
    categoryId: "",
    price: "",
    image: "/categories/pizza.svg",
    images: [],
    mealType: "LUNCH",
    dietaryTag: "NON_VEG",
    spiceLevel: "MEDIUM",
    ingredients: "",
    availabilityStatus: "AVAILABLE",
    preparationTime: "",
    servingSize: "",
    discount: "",
    stockQuantity: "0",
    isPopular: false,
    isFeatured: false,
    videoUrl: "",
};

const mealTypeOptions: MealType[] = ["BREAKFAST", "LUNCH", "DINNER"];
const dietaryTagOptions: DietaryTag[] = ["VEG", "NON_VEG", "VEGAN"];
const spiceLevelOptions: SpiceLevel[] = ["MILD", "MEDIUM", "HOT", "EXTRA_HOT"];

export default function MenuForm({
    categoryOptions,
    initialMeal,
    mealId,
    title,
    description,
    successHref = "/provider/menu",
}: {
    categoryOptions: CategoryOption[];
    initialMeal?: {
        _id?: string;
        id?: string;
        name: string;
        description: string;
        categoryId: string;
        price: number | string;
        image: string;
        images: string[];
        mealType: MealType;
        dietaryTag: DietaryTag;
        spiceLevel: SpiceLevel;
        ingredients: string[] | string;
        availabilityStatus?: AvailabilityStatus;
        preparationTime?: number;
        servingSize?: number;
        discount?: number;
        stockQuantity?: number;
        isPopular?: boolean;
        isFeatured?: boolean;
        videoUrl?: string;
    };
    mealId?: string;
    title?: string;
    description?: string;
    cancelHref?: string;
    successHref?: string;
}) {
    const router = useRouter();
    const [form, setForm] = useState<MealFormState>(() => {
        if (initialMeal) {
            return {
                id: initialMeal._id || initialMeal.id,
                name: initialMeal.name,
                description: initialMeal.description,
                categoryId: initialMeal.categoryId,
                price: String(initialMeal.price),
                image: initialMeal.image,
                images: initialMeal.images || [],
                mealType: initialMeal.mealType,
                dietaryTag: initialMeal.dietaryTag,
                spiceLevel: initialMeal.spiceLevel,
                ingredients: Array.isArray(initialMeal.ingredients)
                    ? initialMeal.ingredients.join(", ")
                    : initialMeal.ingredients,
                availabilityStatus: initialMeal.availabilityStatus || "AVAILABLE",
                preparationTime: initialMeal.preparationTime ? String(initialMeal.preparationTime) : "",
                servingSize: initialMeal.servingSize ? String(initialMeal.servingSize) : "",
                discount: initialMeal.discount ? String(initialMeal.discount) : "",
                stockQuantity: String(initialMeal.stockQuantity || 0),
                isPopular: initialMeal.isPopular || false,
                isFeatured: initialMeal.isFeatured || false,
                videoUrl: initialMeal.videoUrl || "",
            };
        }
        return emptyForm;
    });
    const [isUploading, setIsUploading] = useState(false);
    const [isGalleryUploading, setIsGalleryUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getCategoryId = (category: CategoryOption) => category.id ?? category._id ?? "";

    const updateField = <K extends keyof MealFormState>(key: K, value: MealFormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);

        try {
            const res = await uploadImageClientSide(file);
            if (res) {
                setForm((prev) => ({ ...prev, image: res }));
            }
        } catch {
            toast.error("Image upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleGalleryImagesChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        if (!files.length) return;

        setIsGalleryUploading(true);

        try {
            const uploadedImages = await Promise.all(files.map((file) => uploadImageClientSide(file)));
            const nextImages = uploadedImages.filter((url): url is string => Boolean(url));

            if (!nextImages.length) {
                toast.error("Image upload failed. Please try again.");
                return;
            }

            setForm((prev) => ({ ...prev, images: [...prev.images, ...nextImages] }));
        } catch {
            toast.error("Image upload failed. Please try again.");
        } finally {
            setIsGalleryUploading(false);
        }
    };

    const removeGalleryImage = (imageUrl: string) => {
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((currentImage) => currentImage !== imageUrl),
        }));
    };

    const parseStringList = (value: string) =>
        value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);

    const saveMeal = async () => {
        if (
            !form.name.trim() ||
            !form.description.trim() ||
            !form.price ||
            !form.categoryId ||
            !form.images.length ||
            !form.ingredients.trim()
        ) {
            toast.error("Please fill in all required fields.");
            return;
        }

        const parsedPrice = Number(form.price);
        if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
            toast.error("Price must be greater than 0.");
            return;
        }

        const ingredients = parseStringList(form.ingredients);

        if (!ingredients.length) {
            toast.error("Add at least one ingredient.");
            return;
        }

        setIsSubmitting(true);

        try {
            const mealData = {
                name: form.name.trim(),
                description: form.description.trim(),
                categoryId: form.categoryId,
                price: parsedPrice,
                image: form.image.trim(),
                images: form.images,
                mealType: form.mealType,
                dietaryTag: form.dietaryTag,
                spiceLevel: form.spiceLevel,
                ingredients,
                availabilityStatus: form.availabilityStatus,
                preparationTime: form.preparationTime ? Number(form.preparationTime) : undefined,
                servingSize: form.servingSize ? Number(form.servingSize) : undefined,
                discount: form.discount ? Number(form.discount) : undefined,
                stockQuantity: Number(form.stockQuantity) || 0,
                isPopular: form.isPopular,
                isFeatured: form.isFeatured,
                videoUrl: form.videoUrl.trim() || undefined,
            };

            const result = mealId
                ? await updateMeal(mealId, mealData)
                : await createMeal(mealData);

            if (result?.success) {
                toast.success(result.message || `Meal ${mealId ? "updated" : "created"} successfully!`);
                router.push(successHref);
                return;
            }

            toast.error(result?.errorMessage || "Failed to save meal. Please try again.");
        } catch {
            toast.error("Something went wrong while saving meal.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isActionDisabled =
        isUploading ||
        isGalleryUploading ||
        isSubmitting ||
        !form.name.trim() ||
        !form.description.trim() ||
        !form.price ||
        !form.categoryId ||
        !form.images.length ||
        !form.ingredients.trim();

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">{form.id ? "Edit Meal" : "Create Meal"}</p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
                        {title || (form.id ? "Update meal details" : "Add a new meal")}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        {description || "Fill in all required information, then save the meal to the backend."}
                    </p>
                </div>
            </div>

            <div className="rounded-3xl border border-orange-200/70 bg-white/90 p-5 shadow-sm dark:border-orange-400/20 dark:bg-slate-900/90 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Name</label>
                    <Input value={form.name} onChange={(event) => updateField("name", event.target.value)} className="h-11 rounded-xl bg-white dark:bg-slate-950" disabled={isUploading || isSubmitting} />
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                    <textarea
                        rows={4}
                        value={form.description}
                        onChange={(event) => updateField("description", event.target.value)}
                        disabled={isUploading || isSubmitting}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Price</label>
                    <Input type="number" value={form.price} onChange={(event) => updateField("price", event.target.value)} className="h-11 rounded-xl bg-white dark:bg-slate-950" disabled={isUploading || isSubmitting} />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Category</label>
                    <select
                        value={form.categoryId}
                        onChange={(event) => updateField("categoryId", event.target.value)}
                        disabled={isUploading || isSubmitting || categoryOptions.length === 0}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                    >
                        <option value="" disabled>
                            Select category
                        </option>
                        {categoryOptions.map((category) => {
                            const categoryId = getCategoryId(category);
                            const mealCount = Number(category.mealsCount ?? category.meals ?? 0) || 0;
                            return (
                                <option key={categoryId} value={categoryId}>
                                    {category.name} ({mealCount} meals)
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Meal Type</label>
                    <select
                        value={form.mealType}
                        onChange={(event) => updateField("mealType", event.target.value as MealType)}
                        disabled={isUploading || isSubmitting}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                    >
                        {mealTypeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Dietary Tag</label>
                    <select
                        value={form.dietaryTag}
                        onChange={(event) => updateField("dietaryTag", event.target.value as DietaryTag)}
                        disabled={isUploading || isSubmitting}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                    >
                        {dietaryTagOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Spice Level</label>
                    <select
                        value={form.spiceLevel}
                        onChange={(event) => updateField("spiceLevel", event.target.value as SpiceLevel)}
                        disabled={isUploading || isSubmitting}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                    >
                        {spiceLevelOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Ingredients</label>
                    <textarea
                        rows={3}
                        value={form.ingredients}
                        onChange={(event) => updateField("ingredients", event.target.value)}
                        placeholder="Comma separated ingredients"
                        disabled={isUploading || isSubmitting}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Images Upload</label>
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                            <Upload className="h-4 w-4" /> Choose images
                            <input type="file" accept="image/*" multiple onChange={handleGalleryImagesChange} className="hidden" disabled={isUploading || isSubmitting || isGalleryUploading} />
                        </label>

                        {isGalleryUploading && (
                            <div className="mt-3 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                <Loader2 className="h-4 w-4 animate-spin" /> Uploading images...
                            </div>
                        )}

                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {form.images.map((imageUrl) => (
                                <div key={imageUrl} className="group relative h-24 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700">
                                    <Image src={imageUrl} alt="Meal gallery" fill sizes="120px" className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeGalleryImage(imageUrl)}
                                        className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] font-semibold text-white opacity-0 transition group-hover:opacity-100"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Uploaded image URLs will be stored in the database as an array.</p>
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Main Image Upload</label>
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
                        <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700">
                            <Image src={form.image} alt="Meal preview" fill sizes="64px" className="object-cover" />
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Main image preview is shown here.</p>
                    </div>
                </div>

                {/* Additional Fields Row 1 */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Availability Status</label>
                    <select
                        value={form.availabilityStatus}
                        onChange={(event) => updateField("availabilityStatus", event.target.value as AvailabilityStatus)}
                        disabled={isUploading || isSubmitting}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-950"
                    >
                        <option value="AVAILABLE">Available</option>
                        <option value="UNAVAILABLE">Unavailable</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Preparation Time (mins)</label>
                    <Input
                        type="number"
                        value={form.preparationTime}
                        onChange={(event) => updateField("preparationTime", event.target.value)}
                        placeholder="e.g., 30"
                        className="h-11 rounded-xl bg-white dark:bg-slate-950"
                        disabled={isUploading || isSubmitting}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Serving Size</label>
                    <Input
                        type="number"
                        value={form.servingSize}
                        onChange={(event) => updateField("servingSize", event.target.value)}
                        placeholder="e.g., 2"
                        className="h-11 rounded-xl bg-white dark:bg-slate-950"
                        disabled={isUploading || isSubmitting}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Stock Quantity</label>
                    <Input
                        type="number"
                        value={form.stockQuantity}
                        onChange={(event) => updateField("stockQuantity", event.target.value)}
                        className="h-11 rounded-xl bg-white dark:bg-slate-950"
                        disabled={isUploading || isSubmitting}
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Discount ($)</label>
                    <Input
                        type="number"
                        step="0.01"
                        value={form.discount}
                        onChange={(event) => updateField("discount", event.target.value)}
                        placeholder="0.00"
                        className="h-11 rounded-xl bg-white dark:bg-slate-950"
                        disabled={isUploading || isSubmitting}
                    />
                </div>

                {/* Video URL */}
                <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Video URL (Optional)</label>
                    <Input
                        type="url"
                        value={form.videoUrl}
                        onChange={(event) => updateField("videoUrl", event.target.value)}
                        placeholder="https://youtube.com/..."
                        className="h-11 rounded-xl bg-white dark:bg-slate-950"
                        disabled={isUploading || isSubmitting}
                    />
                </div>

                {/* Toggles */}
                <div className="sm:col-span-2 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.isPopular}
                            onChange={(event) => updateField("isPopular", event.target.checked)}
                            disabled={isUploading || isSubmitting}
                            className="h-4 w-4 rounded border-slate-300"
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mark as Popular</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={form.isFeatured}
                            onChange={(event) => updateField("isFeatured", event.target.checked)}
                            disabled={isUploading || isSubmitting}
                            className="h-4 w-4 rounded border-slate-300"
                        />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Mark as Featured</span>
                    </label>
                </div>
            </div>

            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-start">
                <Button onClick={saveMeal} className="rounded-xl bg-orange-500 text-white hover:bg-orange-400" disabled={isActionDisabled}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                        </>
                    ) : form.id ? (
                        "Save Changes"
                    ) : (
                        "Add Meal"
                    )}
                </Button>
            </div>
        </div>
    );
}
