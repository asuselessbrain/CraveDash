import { QueryParams } from "@/types";
import { baseApi } from "../baseApi";

type MealPayload = {
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
    availabilityStatus?: "AVAILABLE" | "UNAVAILABLE";
    preparationTime?: number;
    servingSize?: number;
    discount?: number;
    stockQuantity?: number;
    isPopular?: boolean;
    isFeatured?: boolean;
    videoUrl?: string;
};

export const createMeal = async (data: MealPayload) => {
    const result = await baseApi("meal", "POST", data);
    return result;
};

export const getProviderMeals = async (queryParams?: QueryParams) => {
    const params = new URLSearchParams();

    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, String(value));
            }
        });
    }

    const result = await baseApi("meal/provider", "GET", undefined, params.toString());
    return result;
};

export const getMealById = async (mealId: string) => {
    const result = await baseApi(`meal/${mealId}`, "GET");
    return result;
};

export const deleteMeal = async (mealId: string) => {
    const result = await baseApi(`meal/${mealId}`, "DELETE");
    return result;
};

export const updateMeal = async (mealId: string, data: MealPayload) => {
    const result = await baseApi(`meal/${mealId}`, "PUT", data);
    return result;
};


export const getMeals = async (queryParams?: QueryParams) => {
    const params = new URLSearchParams();

    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, String(value));
            }
        });
    }

    const result = await baseApi("meal", "GET", undefined, params.toString());
    return result;
};