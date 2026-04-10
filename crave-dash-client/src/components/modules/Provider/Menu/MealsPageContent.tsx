"use client";

import MealsList from "./MealsList";

type MealData = {
    _id: string;
    id?: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    image: string;
    images: string[];
    mealType: "BREAKFAST" | "LUNCH" | "DINNER";
    dietaryTag: "VEG" | "NON_VEG" | "VEGAN";
    spiceLevel: "MILD" | "MEDIUM" | "HOT" | "EXTRA_HOT";
    ingredients: string[];
};

type MealsPageContentProps = {
    meals: MealData[];
    totalPages: number;
};

export default function MealsPageContent({ meals, totalPages }: MealsPageContentProps) {
    return (
        <MealsList
            meals={meals}
            totalPages={totalPages}
        />
    );
}
