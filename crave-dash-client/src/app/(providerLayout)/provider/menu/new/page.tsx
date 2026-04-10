import { getCategories } from "@/services/category";
import MenuForm from "../../../../../components/modules/Provider/Menu/MenuForm";

export default async function NewMealPage() {
    const categories = await getCategories();
    const categoryOptions = categories.data?.data || [];

    return (
        <div className="space-y-6">
            <MenuForm
                categoryOptions={categoryOptions}
                cancelHref="/provider/menu"
                successHref="/provider/menu"
                title="Meal information"
                description="Fill in every section carefully. This page is designed for richer meal data, so each field is visible at once."
            />
        </div>
    );
}