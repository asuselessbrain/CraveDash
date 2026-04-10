import MealDetailsContent from '@/components/modules/Meals/MealDetailsContent'
import { getMealById } from '@/services/meal'
import { MealDetailsFromAPI, NormalizedMealDetails } from '@/types/meals'
import React from 'react'

function toNumber(value: unknown, fallback: number) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
}

function normalizeMealDetails(rawMeal: MealDetailsFromAPI): NormalizedMealDetails {
    const price = toNumber(rawMeal.price, 0)
    const discount = toNumber(rawMeal.discount, 0)
    const finalPrice = price * (1 - discount / 100)

    return {
        id: rawMeal.id,
        name: rawMeal.name,
        description: rawMeal.description,
        price,
        discount,
        finalPrice,
        image: rawMeal.image,
        images: rawMeal.images || [rawMeal.image],
        preparationTime: rawMeal.preparationTime || 20,
        servingSize: rawMeal.servingSize || '1 Serve',
        mealType: rawMeal.mealType || 'Any Time',
        dietaryTag: rawMeal.dietaryTag || 'Regular',
        spiceLevel: rawMeal.spiceLevel || 'MEDIUM',
        ingredients: rawMeal.ingredients || [],
        availabilityStatus: rawMeal.availabilityStatus,
        stockQuantity: rawMeal.stockQuantity || 0,
        isPopular: rawMeal.isPopular || false,
        isFeatured: rawMeal.isFeatured || false,
        videoUrl: rawMeal.videoUrl || '',
        categoryName: rawMeal.category?.name || 'Uncategorized',
        cuisineName: rawMeal.category?.cuisine?.name || 'Global',
    }
}

export default async function MealDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedPromise = await params
    const meal = await getMealById(resolvedPromise.id)

    if (!meal?.data) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Meal Not Found</h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">The meal you&apos;re looking for doesn&apos;t exist.</p>
                </div>
            </div>
        )
    }

    const normalizedMeal = normalizeMealDetails(meal.data as MealDetailsFromAPI)

    return <MealDetailsContent meal={normalizedMeal} />
}
