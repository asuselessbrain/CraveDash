import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { CategoryService } from "./category.service";

const createCategory = catchAsync(async (req: Request & { user?: any }, res: Response) => {

    const providerEmail = req.user?.email as string;

    const result = await CategoryService.createCategory({ ...req.body, providerEmail });

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

const getAllCategoriesForSlider = catchAsync(async (req: Request, res: Response) => {

    const result = await CategoryService.getAllCategoriesForSlider();

    res.status(200).json({
        success: true,
        message: "Categories for slider retrieved successfully",
        data: result
    })
})

const getProviderAllCategories = catchAsync(async (req: Request & { user?: any }, res: Response) => {

    const providerEmail = req.user?.email as string;
    const result = await CategoryService.getProviderAllCategories(providerEmail, req.query);

    res.status(200).json({
        success: true,
        message: "Categories retrieved successfully",
        data: result
    })
})

const updateCategory = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userEmail = req.user?.email as string;
    const userRole = req.user?.role as string;
    const categoryId = req.params.id as string;

    const result = await CategoryService.updateCategory(userEmail, userRole, categoryId, req.body);

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: result,
    })
})

const deleteCategory = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const userEmail = req.user?.email as string;
    const userRole = req.user?.role as string;
    const categoryId = req.params.id as string;

    await CategoryService.deleteCategory(userEmail, userRole, categoryId);

    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
    })
})


export const CategoryController = {
    createCategory,
    getCategories,
    getAllCategoriesForSlider,
    getProviderAllCategories,
    updateCategory,
    deleteCategory,
}