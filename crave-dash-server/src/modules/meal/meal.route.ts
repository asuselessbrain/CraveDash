import express from "express";
import { MealController } from "./meal.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/", auth(Role.PROVIDER, Role.CUSTOMER), MealController.createMeal)
router.get("/", MealController.getMeals)
router.get("/provider", auth(Role.PROVIDER, Role.CUSTOMER), MealController.getProvidersMeals)
router.get("/:id", MealController.getMealById)
router.patch("/:id", auth(Role.PROVIDER), MealController.updateMeal)
router.delete("/:id", auth(Role.PROVIDER), MealController.deleteMeal)

export const MealRoutes = router;