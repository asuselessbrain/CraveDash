import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getCategories } from "@/services/category";
import { getMealById } from "@/services/meal";
import MenuForm from "../../../../../../components/modules/Provider/Menu/MenuForm";

export default async function EditMealPage({
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

    return (
        <div className="space-y-6">

            <MenuForm
                categoryOptions={categories}
                mealId={idParams}
                initialMeal={{
                    ...meal,
                    price: String(meal.price),
                    ingredients: Array.isArray(meal.ingredients) ? meal.ingredients.join(", ") : meal.ingredients,
                    availabilityStatus: meal.availabilityStatus || "AVAILABLE",
                    preparationTime: meal.preparationTime ? String(meal.preparationTime) : "",
                    servingSize: meal.servingSize ? String(meal.servingSize) : "",
                    discount: meal.discount ? String(meal.discount) : "",
                    stockQuantity: String(meal.stockQuantity || 0),
                    isPopular: meal.isPopular || false,
                    isFeatured: meal.isFeatured || false,
                    videoUrl: meal.videoUrl || "",
                }}
                cancelHref={`/provider/menu/${idParams}`}
                successHref={`/provider/menu/${idParams}`}
                title="Update meal information"
                description="Edit the meal data and save changes to update the record in the backend."
            />
        </div>
    );
}