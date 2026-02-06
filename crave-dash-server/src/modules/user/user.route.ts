import express from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { customerSchema } from "./customerValidationSchema";

const router = express.Router();

router.post("/customers", validateRequest(customerSchema), UserController.createCustomer)

export const UserRoutes = router;