import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { OrderController } from "./order.controller";

const router = express.Router();

router.post("/", auth(Role.CUSTOMER, Role.ADMIN), OrderController.createOrder);
router.post("/stripe/session", auth(Role.CUSTOMER), OrderController.createStripeCheckoutSession);
router.post("/stripe/confirm", auth(Role.CUSTOMER), OrderController.confirmStripeCheckoutSession);
router.get("/my", auth(Role.CUSTOMER, Role.ADMIN), OrderController.getMyOrders);
router.get("/provider", auth(Role.PROVIDER, Role.CUSTOMER, Role.ADMIN), OrderController.getProvidersOrders);
router.get("/admin", auth(Role.ADMIN, Role.CUSTOMER), OrderController.getAdminOrders);
router.get("/admin/:id", auth(Role.ADMIN, Role.CUSTOMER), OrderController.getAdminOrderById);
router.get("/:id", auth(Role.CUSTOMER, Role.PROVIDER, Role.ADMIN), OrderController.getOrderById);
router.patch("/:id/status", auth(Role.PROVIDER, Role.CUSTOMER, Role.ADMIN), OrderController.updateProviderOrderStatus);

export const OrderRoutes = router;
