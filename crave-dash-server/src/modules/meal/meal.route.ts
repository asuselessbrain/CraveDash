import express from "express";
import { MealController } from "./meal.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/", auth(Role.PROVIDER, Role.ADMIN), MealController.createMeal)
router.get("/", MealController.getMeals)
router.get("/provider", auth(Role.PROVIDER), MealController.getProvidersMeals)
router.get("/:id", MealController.getMealById)
router.patch("/:id/toggle-availability", auth(Role.PROVIDER, Role.ADMIN), MealController.toggleMealAvailability)
router.patch("/:id", auth(Role.PROVIDER, Role.ADMIN), MealController.updateMeal)
router.delete("/:id", auth(Role.PROVIDER, Role.ADMIN), MealController.deleteMeal)

export const MealRoutes = router;