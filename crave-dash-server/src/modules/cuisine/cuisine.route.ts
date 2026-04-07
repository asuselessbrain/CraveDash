import express from "express";
import { CuisineController } from "./cuisine.controller";

const router = express.Router();

router.post("/", CuisineController.createCuisine)
router.get("/", CuisineController.getCuisines)

export const CuisineRoutes = router;