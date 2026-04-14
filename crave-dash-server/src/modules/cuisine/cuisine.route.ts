import express from "express";
import { CuisineController } from "./cuisine.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";

const router = express.Router();

router.post("/", auth(Role.PROVIDER, Role.ADMIN), CuisineController.createCuisine)
router.get("/", CuisineController.getCuisines)
router.get("/provider", auth(Role.PROVIDER), CuisineController.getProviderAllCuisines)
router.get("/filtering", CuisineController.getAllCuisinesForFiltering)
router.patch("/:id", auth(Role.PROVIDER, Role.ADMIN), CuisineController.updateCuisine)
router.delete("/:id", auth(Role.PROVIDER, Role.ADMIN), CuisineController.deleteCuisine)

export const CuisineRoutes = router;