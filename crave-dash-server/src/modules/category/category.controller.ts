import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { CategoryService } from "./category.service";

const createCategory = catchAsync(async (req: Request, res: Response) => {
    
    const result = await CategoryService.createCategory(req.body);

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: result
    })
})

const getCategories = catchAsync(async (req: Request, res: Response) => {
    
    const result = await CategoryService.getCategories(req.query);

    res.status(200).json({
        success: true,
        message: "Categories retrieved successfully",
        data: result
    })
})
export const CategoryController = {
    createCategory,
    getCategories
}