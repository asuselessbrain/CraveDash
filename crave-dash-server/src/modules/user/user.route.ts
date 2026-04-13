import express from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { customerSchema } from "./customerValidationSchema";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/customers", validateRequest(customerSchema), UserController.createCustomer)
router.get("/admin/users", auth(Role.ADMIN, Role.CUSTOMER), UserController.getAdminUsers)
router.get("/admin/users/:id", auth(Role.ADMIN, Role.CUSTOMER), UserController.getAdminUserById)
router.post("/admin/users", auth(Role.ADMIN, Role.CUSTOMER), UserController.createUserByAdmin)
router.patch("/admin/users/:id", auth(Role.ADMIN, Role.CUSTOMER), UserController.updateUserByAdmin)
router.patch("/admin/users/:id/block", auth(Role.ADMIN, Role.CUSTOMER), UserController.blockUserByAdmin)

export const UserRoutes = router;