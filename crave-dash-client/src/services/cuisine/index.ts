import { QueryParams } from "@/types";
import { baseApi } from "../baseApi"

export const createCuisine = async (data: { name: string, image: string }) => {
    const result = await baseApi("cuisine", "POST", data)
    return result;
}

export const getCuisines = async (queryParams?: QueryParams) => {
    const params = new URLSearchParams();

    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, String(value));
            }
        });
    }

    const result = await baseApi("cuisine", "GET", undefined, params.toString())
    return result;
}

export const getCuisinesForFiltering = async () => {
    const result = await baseApi("cuisine/filtering", "GET")
    return result;
}