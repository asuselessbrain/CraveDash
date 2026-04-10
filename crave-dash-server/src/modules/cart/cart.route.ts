import express from "express";
import { CartController } from "./cart.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/", auth(Role.CUSTOMER, Role.ADMIN, Role.PROVIDER), CartController.addToCart);
router.get("/", auth(Role.CUSTOMER, Role.ADMIN, Role.PROVIDER), CartController.getCartItems);
router.delete("/", auth(Role.CUSTOMER, Role.ADMIN, Role.PROVIDER), CartController.clearCart);
router.delete("/:cartId/:mealId", auth(Role.CUSTOMER, Role.ADMIN, Role.PROVIDER), CartController.removeFromCart);

export const CartRoutes = router;