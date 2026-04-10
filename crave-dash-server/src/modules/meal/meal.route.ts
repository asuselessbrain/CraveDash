import express from "express";
import { MealController } from "./meal.controller";

const router = express.Router();

router.post("/", MealController.createMeal)
router.get("/", MealController.getMeals)
router.get("/provider", MealController.getProvidersMeals)
router.get("/:id", MealController.getMealById)
router.patch("/:id", MealController.updateMeal)
router.delete("/:id", MealController.deleteMeal)

export const MealRoutes = router;