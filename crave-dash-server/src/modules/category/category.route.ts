import express from "express";
import { CategoryController } from "./category.controller";

const router = express.Router();

router.post("/", CategoryController.createCategory)
router.get("/", CategoryController.getCategories)
router.get("/slider", CategoryController.getAllCategoriesForSlider)

export const CategoryRoutes = router;