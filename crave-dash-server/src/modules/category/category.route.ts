import express from "express";
import { CategoryController } from "./category.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/", auth(Role.PROVIDER, Role.ADMIN), CategoryController.createCategory)
router.get("/", CategoryController.getCategories)
router.get("/provider", auth(Role.PROVIDER), CategoryController.getProviderAllCategories)
router.get("/slider", CategoryController.getAllCategoriesForSlider)
router.patch("/:id", auth(Role.PROVIDER, Role.ADMIN), CategoryController.updateCategory)
router.delete("/:id", auth(Role.PROVIDER, Role.ADMIN), CategoryController.deleteCategory)

export const CategoryRoutes = router;