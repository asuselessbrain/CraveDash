"use server"
import { ProviderCuisineStatus } from "@/app/(providerLayout)/provider/data";
import { QueryParams } from "@/types";
import { baseApi } from "../baseApi"
import { revalidateTag } from "next/cache";

export const createCuisine = async (data: { name: string, image: string }) => {
    const result = await baseApi("cuisine", "POST", data, undefined, "cuisines")
    revalidateTag("cuisines", "max")
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

    const result = await baseApi("cuisine", "GET", undefined, params.toString(), "cuisines")
    return result;
}

export const getProviderCuisines = async (queryParams?: QueryParams) => {
    const params = new URLSearchParams();

    if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                params.append(key, String(value));
            }
        });
    }

    const result = await baseApi("cuisine/provider", "GET", undefined, params.toString(), "cuisines")
    return result;
}

export const updateCuisine = async (id: string, data: { name?: string, image?: string, status?: ProviderCuisineStatus }) => {
    const result = await baseApi(`cuisine/${id}`, "PATCH", data, undefined, "cuisines")
    revalidateTag("cuisines", "max")
    return result;
}

export const getCuisinesForFiltering = async () => {
    const result = await baseApi("cuisine/filtering", "GET", undefined, undefined, "cuisines")
    return result;
}

export const deleteCuisine = async (id: string) => {
    const result = await baseApi(`cuisine/${id}`, "DELETE", undefined, undefined, "cuisines")
    revalidateTag("cuisines", "max")
    return result;
}