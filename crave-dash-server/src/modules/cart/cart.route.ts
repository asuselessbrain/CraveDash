import express from "express";
import { CartController } from "./cart.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/", auth(Role.CUSTOMER), CartController.addToCart);
router.get("/", auth(Role.CUSTOMER), CartController.getCartItems);
router.delete("/", auth(Role.CUSTOMER), CartController.clearCart);
router.delete("/:cartId/:mealId", auth(Role.CUSTOMER), CartController.removeFromCart);
router.patch("/:cartId/increase", auth(Role.CUSTOMER), CartController.increaseCartItemQuantity);
router.patch("/:cartId/decrease", auth(Role.CUSTOMER), CartController.decreaseCartItemQuantity);

export const CartRoutes = router;