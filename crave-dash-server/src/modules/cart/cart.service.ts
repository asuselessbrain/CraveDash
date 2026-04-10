import { Decimal } from "@prisma/client/runtime/client";
import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../errors/appError";

type AddToCartPayload = {
    mealId: string;
    quantity?: number;
};

const addToCart = async (payload: AddToCartPayload, userEmail: string) => {
    const meal = await prisma.cart.findFirst({
        where: {
            mealId: payload.mealId,
            userEmail
        },
    });

    if (!meal) {
        const data: Prisma.cartUncheckedCreateInput = {
            userEmail,
            mealId: payload.mealId,
            quantity: payload.quantity ?? 1,
        };

        const result = await prisma.cart.create({
            data,
        });
        return result;
    }
    else {
        const result = await prisma.cart.update({
            where: {
                id: meal.id
            },
            data: {
                quantity: meal.quantity + (payload.quantity ?? 1)
            }
        })
        return result;
    }
};

const clearCart = async (email: string) => {
    const result = await prisma.cart.deleteMany({
        where: {
            userEmail: email
        },
    });
    return result;
}

const removeFromCart = async (cartId: string, mealId: string, email: string) => {
    const isUserCart = await prisma.cart.findFirst({
        where: {
            id: cartId,
            userEmail: email
        }
    })

    if (!isUserCart) {
        throw new AppError(401, "Unauthorized")
    }

    const result = await prisma.cart.deleteMany({
        where: {
            id: cartId,
            mealId,
            userEmail: email
        },
    });
    return result;
};


const getCartItems = async (userEmail: string) => {
    const result = await prisma.cart.findMany({
        where: {
            userEmail,
        },
        include: {
            meal: {
                select: {
                    name: true,
                    price: true,
                    image: true,
                }
            }
        },
    });

    result.forEach(cartItem => {
        if (cartItem.meal) {
            cartItem.meal.price = cartItem.meal.price.mul(cartItem.quantity);
        }
    })

    const subTotal = result.reduce((acc, item) => {
        if (item.meal) {
            return acc.add(item.meal.price.mul(item.quantity));
        }
        return acc;
    }, new Decimal(0));

    const deliveryCharge = 120

    const total = subTotal.add(deliveryCharge);

    return {
        items: result, meta: {
            subTotal,
            deliveryCharge,
            total
        }
    };
};

const increaseCartItemQuantity = async (cartId: string) => {
    const result = await prisma.cart.update({
        where: {
            id: cartId
        },
        data: {
            quantity: {
                increment: 1
            }
        },
    });
    return result;
}

const decreaseCartItemQuantity = async (cartId: string) => {
    const result = await prisma.cart.update({
        where: {
            id: cartId
        },
        data: {
            quantity: {
                decrement: 1
            }
        },
    });
    return result;
}

export const CartService = {
    addToCart,
    clearCart,
    removeFromCart,
    getCartItems,
    increaseCartItemQuantity,
    decreaseCartItemQuantity
};