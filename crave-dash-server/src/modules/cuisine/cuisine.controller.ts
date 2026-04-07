import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { CuisineService } from "./cuisine.service";

const createCuisine = catchAsync(async (req: Request, res: Response) => {
    
    const result = await CuisineService.createCuisine(req.body);

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
export const CuisineController = {
    createCuisine,
    getCuisines
}