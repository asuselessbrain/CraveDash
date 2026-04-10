import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/services/category";
import { getMealById } from "@/services/meal";
import MealDetailsContent from "@/components/modules/Provider/Menu/MealDetailsContent";

export default async function MealDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const idParams = (await params).id;
    const [mealResponse, categoriesResponse] = await Promise.all([
        getMealById(idParams),
        getCategories(),
    ]);

    if (!mealResponse?.success || !mealResponse?.data) {
        notFound();
    }

    const meal = mealResponse.data;
    const categories = categoriesResponse.data?.data || [];
    const categoryName = categories.find((category: { id?: string; _id?: string; name: string }) => {
        const categoryId = category.id ?? category._id;
        return categoryId === meal.categoryId;
    })?.name;

    return (
        <div className="space-y-6">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-widest text-orange-700 uppercase dark:text-orange-300">Meal Details</p>
                    <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">{meal.name}</h2>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        {categoryName ? `Category: ${categoryName}` : `Category ID: ${meal.categoryId}`}
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button asChild variant="outline" className="w-fit rounded-xl">
                        <Link href="/provider/menu">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
                        </Link>
                    </Button>

                    <Button asChild className="w-fit rounded-xl bg-orange-500 text-white hover:bg-orange-400">
                        <Link href={`/provider/menu/${idParams}/edit`}>Edit Meal</Link>
                    </Button>
                </div>
            </div>

            {/* Content */}
            <Suspense fallback={<LoadingSkeleton />}>
                <MealDetailsContent meal={meal} mealId={idParams} categoryName={categoryName} />
            </Suspense>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
                <div className="h-96 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-40 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="space-y-4">
                <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>
        </div>
    );
}
