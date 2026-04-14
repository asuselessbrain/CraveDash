import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { CuisineService } from "./cuisine.service";

const createCuisine = catchAsync(async (req: Request & { user?: { email: string } }, res: Response) => {

    const providerEmail = req.user?.email as string;

    const result = await CuisineService.createCuisine({ ...req.body, providerEmail });

    res.status(201).json({
        success: true,
        message: "Cuisine created successfully",
        data: result
    })
})

const getCuisines = catchAsync(async (req: Request, res: Response) => {

    const result = await CuisineService.getCuisines(req.query);

    res.status(200).json({
        success: true,
        message: "Cuisines retrieved successfully",
        data: result
    })
})

const getAllCuisinesForFiltering = catchAsync(async (req: Request, res: Response) => {

    const result = await CuisineService.getAllCuisinesForFiltering();

    res.status(200).json({
        success: true,
        message: "Cuisines for filtering retrieved successfully",
        data: result
    })
})

const updateCuisine = catchAsync(async (req: Request, res: Response) => {
    const cuisineId = req.params.id as string;
    const result = await CuisineService.updateCuisine(cuisineId, req.body);

    res.status(200).json({
        success: true,
        message: "Cuisine updated successfully",
        data: result
    })
})

const getProviderAllCuisines = catchAsync(async (req: Request & { user?: { email: string } }, res: Response) => {

    const providerEmail = req.user?.email as string;
    const result = await CuisineService.getProviderAllCuisines(providerEmail, req.query);

    res.status(200).json({
        success: true,
        message: "Cuisines retrieved successfully",
        data: result
    })
})

export const CuisineController = {
    createCuisine,
    getCuisines,
    getAllCuisinesForFiltering,
    updateCuisine,
    getProviderAllCuisines
}