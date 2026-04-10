import { getMeals } from "@/services/meal";
import MealsCatalog from "@/components/modules/Meals/MealsCatalog";
import { getCategoryForSlider } from "@/services/category";
import { getCuisinesForFiltering } from "@/services/cuisine";

type ApiMeal = {
    id?: string;
    _id?: string;
    name?: string;
    title?: string;
    description?: string;
    image?: string;
    images?: string[];
    price?: number | string;
    rating?: number | string;
    provider?: string;
    providerName?: string;
    providerSlug?: string;
    mealType?: string;
    dietaryTag?: string;
    preparationTime?: number;
    discount?: number;
};

type MealCard = {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
    rating: number;
    providerName: string;
    providerSlug: string;
    mealType: string;
    dietaryTag: string;
    preparationTime: number;
    discount: number;
};

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

function toNumber(value: unknown, fallback: number) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeMeal(rawMeal: ApiMeal, index: number): MealCard {
    const providerName = rawMeal.providerName || rawMeal.provider || "CraveDash Kitchen";

    return {
        id: rawMeal.id || rawMeal._id || `meal-${index + 1}`,
        name: rawMeal.name || rawMeal.title || `Meal ${index + 1}`,
        description: rawMeal.description || "Freshly prepared and delivered warm from your favorite provider.",
        image: rawMeal.image || rawMeal.images?.[0] || "/categories/pizza.svg",
        price: toNumber(rawMeal.price, 0),
        rating: Math.max(0, Math.min(5, toNumber(rawMeal.rating, 4.4))),
        providerName,
        providerSlug: rawMeal.providerSlug || slugify(providerName) || "cravedash-kitchen",
        mealType: rawMeal.mealType || "Any Time",
        dietaryTag: rawMeal.dietaryTag || "Regular",
        preparationTime: Math.max(10, toNumber(rawMeal.preparationTime, 25)),
        discount: Math.max(0, toNumber(rawMeal.discount, 0)),
    };
}

export default async function MealsPage({ searchParams }: { searchParams: Promise<{ searchTerm?: string; sortBy?: string; sortOrder?: string; page?: string }> }) {

    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1;
    const limit = 12;
    const skip = (page - 1);


    const mealsResponse = await getMeals({
        searchTerm: resolvedSearchParams.searchTerm,
        sortBy: resolvedSearchParams.sortBy || "name",
        sortOrder: (resolvedSearchParams.sortOrder as "asc" | "desc") || "asc",
        skip,
        take: limit,
    });
    const meals = mealsResponse?.data?.data || mealsResponse?.data || [];

    const categoryResponse = await getCategoryForSlider();
    const categories = categoryResponse.data;

    const cuisineResponse = await getCuisinesForFiltering()

    const cuisines = cuisineResponse.data;


    const mealCount = mealsResponse.data.meta.total;


    return (
        <main className="food-landing-bg">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <header className="landing-reveal mb-8 rounded-3xl border border-orange-200/70 bg-white/85 p-6 shadow-sm backdrop-blur-sm dark:border-orange-400/20 dark:bg-slate-900/80">
                    <p className="text-xs font-semibold tracking-[0.24em] text-orange-700 uppercase dark:text-orange-300">Browse Meals</p>
                    <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">Taste What You Crave Today</h1>
                    <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base dark:text-slate-300">
                        Discover signature dishes from nearby providers. Each meal card shows quick details so you can pick faster.
                    </p>
                </header>

                {mealCount === 0 ? (
                    <div className="landing-reveal-delay-2 rounded-2xl border border-slate-200 bg-white/85 p-12 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900/85">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">No meals available right now</h2>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Please check back later after providers publish menu items.</p>
                    </div>
                ) : (
                    <MealsCatalog meals={meals} meta={mealsResponse.data.meta} categories={categories} cuisines={cuisines} />
                )}
            </div>
        </main>
    );
}