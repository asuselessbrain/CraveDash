import express from "express";
import { CuisineController } from "./cuisine.controller";

const router = express.Router();

router.post("/", CuisineController.createCuisine)

export const CuisineRoutes = router;