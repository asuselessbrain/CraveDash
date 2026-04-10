import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { MealService } from "./meal.service";

const createMeal = catchAsync(async (req: Request, res: Response) => {
    
    const result = await MealService.createMeal(req.body);

    res.status(201).json({
        success: true,
        message: "Meal created successfully",
        data: result
    })
})

const getProvidersMeals = catchAsync(async (req: Request, res: Response) => {
    
    const result = await MealService.getProvidersMeals(req.query);

    res.status(200).json({
        success: true,
        message: "Meals retrieved successfully",
        data: result
    })
})

const getMeals = catchAsync(async (req: Request, res: Response) => {
    
    const result = await MealService.getMeals(req.query);

    res.status(200).json({
        success: true,
        message: "Meals retrieved successfully",
        data: result
    })
})

const getMealById = catchAsync(async (req: Request, res: Response) => {
    const mealId = req.params.id as string;
    const result = await MealService.getMealById(mealId);

    res.status(200).json({
        success: true,
        message: "Meal retrieved successfully",
        data: result,
    });
});

const updateMeal = catchAsync(async (req: Request, res: Response) => {
    const mealId = req.params.id as string;
    const result = await MealService.updateMeal(mealId, req.body);

    res.status(200).json({
        success: true,
        message: "Meal updated successfully",
        data: result,
    });
});

const deleteMeal = catchAsync(async (req: Request, res: Response) => {
    const mealId = req.params.id as string;
    const result = await MealService.deleteMeal(mealId);

    res.status(200).json({
        success: true,
        message: "Meal deleted successfully",
        data: result,
    });
});

export const MealController = {
    createMeal,
    getProvidersMeals,
    getMealById,
    updateMeal,
    deleteMeal,
    getMeals,
}