import { QueryParams } from "@/types";
import { baseApi } from "../baseApi";

export const createCategory = async (data: { name: string; cuisineId: string; image?: string }) => {
    const result = await baseApi("category", "POST", data);
    return result;
};

export const getCategories = async (queryParams?: QueryParams) => {
    const params = new URLSearchParams();

    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, String(value));
            }
        });
    }

    const result = await baseApi("category", "GET", undefined, params.toString());
    return result;
};

export const getCategoryForSlider = async () => {
    const result = await baseApi("category/slider", "GET");
    return result;
}