import express from "express";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { DashboardController } from "./dashboard.controller";

const router = express.Router();

router.get("/customer", auth(Role.CUSTOMER), DashboardController.getCustomerDashboard);

export const DashboardRoutes = router;