import { baseApi } from "../baseApi";

export const addToCart = async (mealId: string, quantity: number) => {
    const result = await baseApi("cart", "POST", { mealId, quantity });
    return result;
}

export const getCartItems = async () => {
    const result = await baseApi("cart", "GET");
    return result;
}

export const clearCart = async () => {
    const result = await baseApi(`cart`, "DELETE");
    return result;
}

export const removeItemFromCart = async (itemId: string, mealId: string) => {
    const result = await baseApi(`cart/${itemId}/${mealId}`, "DELETE");
    return result;
}

export const increaseCartItemQuantity = async (itemId: string) => {
    const result = await baseApi(`cart/${itemId}/increase`, "PATCH");
    return result;
}

export const decreaseCartItemQuantity = async (itemId: string) => {
    const result = await baseApi(`cart/${itemId}/decrease`, "PATCH");
    return result;
}