import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { CartService } from "./cart.service";

type AuthenticatedRequest = Request & {
    user: {
        email: string;
    };
};

const addToCart = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.email;
    const result = await CartService.addToCart(req.body, userId);
    res.status(201).json({
        success: true,
        message: "Item added to cart successfully",
        data: result
    });
});

const getCartItems = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user.email;
    const result = await CartService.getCartItems(userId);

    res.status(200).json({
        success: true,
        message: "Cart items retrieved successfully",
        data: result,
    });
});

const clearCart = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const email = req.user.email
    const result = await CartService.clearCart(email);

    res.status(200).json({
        success: true,
        message: "Cart item removed successfully",
        data: result,
    });
});

const removeFromCart = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const cartId = req.params.cartId as string;
    const mealId = req.params.mealId as string;
    const email = req.user.email
    const result = await CartService.removeFromCart(cartId, mealId, email);

    res.status(200).json({
        success: true,
        message: "Cart item removed successfully",
        data: result,
    });
});

const increaseCartItemQuantity = catchAsync(async (req: Request, res: Response) => {
    const cartId = req.params.cartId as string;

    const result = await CartService.increaseCartItemQuantity(cartId);

    res.status(200).json({
        success: true,
        message: "Cart item quantity increased successfully",
        data: result,
    });
})

const decreaseCartItemQuantity = catchAsync(async (req: Request, res: Response) => {
    const cartId = req.params.cartId as string;

    const result = await CartService.decreaseCartItemQuantity(cartId);

    res.status(200).json({
        success: true,
        message: "Cart item quantity decreased successfully",
        data: result,
    });
})

export const CartController = {
    addToCart,
    getCartItems,
    clearCart,
    removeFromCart,
    increaseCartItemQuantity,
    decreaseCartItemQuantity
};