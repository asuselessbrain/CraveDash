import express from "express";
import { AuthController } from "./auth.controller";

const router = express.Router();

router.post("/login", AuthController.login)
router.patch("/forgot-password", AuthController.forgetPassword)
router.patch("/reset-password", AuthController.resetPassword)

export const AuthRoutes = router;