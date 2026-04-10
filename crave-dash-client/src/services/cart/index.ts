import { baseApi } from "../baseApi";

export const addToCart = async (mealId: string, quantity: number) => {
    const result = await baseApi("cart", "POST", { mealId, quantity });
    return result;
}

export const getCartItems = async () => {
    const result = await baseApi("cart", "GET");
    return result;
}

export const clearCart = async() => {
    const result = await baseApi(`cart`, "DELETE");
    return result;
}