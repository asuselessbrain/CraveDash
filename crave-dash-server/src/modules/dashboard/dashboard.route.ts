import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { DashboardController } from "./dashboard.controller";

const router = express.Router();

router.get("/customer", auth(Role.CUSTOMER), DashboardController.getCustomerDashboard);
router.get("/provider", auth(Role.PROVIDER, Role.CUSTOMER, Role.ADMIN), DashboardController.getProviderDashboard);
router.get("/admin", auth(Role.ADMIN), DashboardController.getAdminDashboard);

export const DashboardRoutes = router;