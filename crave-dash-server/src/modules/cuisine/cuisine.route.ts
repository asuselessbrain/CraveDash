import express from "express";
import { CuisineController } from "./cuisine.controller";

const router = express.Router();

router.post("/", CuisineController.createCuisine)
router.get("/", CuisineController.getCuisines)
router.get("/filtering", CuisineController.getAllCuisinesForFiltering)

export const CuisineRoutes = router;