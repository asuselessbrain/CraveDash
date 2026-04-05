import { baseApi } from "../baseApi"

export const createCuisine = async (data: { name: string, image: string }) => {
    const result = await baseApi("cuisine", "POST", data)
    return result;
}