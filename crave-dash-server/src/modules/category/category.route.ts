import express from "express";
import { CategoryController } from "./category.controller";

const router = express.Router();

router.post("/", CategoryController.createCategory)
router.get("/", CategoryController.getCategories)

export const CategoryRoutes = router;