import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.service";
import { cookieOptions } from "../auth/auth.controller";
import { Role } from "../../../generated/prisma/enums";

type AuthenticatedRequest = Request & {
    user: {
        email: string;
        role: Role;
    };
};

const createCustomer = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createCustomer(req.body);

    const { token, ...userData } = result;

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
        success: true,
        message: "Customer created successfully",
        data: {
            token, userData
        }
    })
})

const getAdminUsers = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const result = await UserService.getAdminUsers(req.query);

    res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result
    })
})

const getAdminUserById = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.params.id as string;
    const result = await UserService.getAdminUserById(userId);

    res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: result
    })
})

const createUserByAdmin = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const result = await UserService.createUserByAdmin(req.body);

    res.status(201).json({
        success: true,
        message: "User created successfully",
        data: result
    })
})

const updateUserByAdmin = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.params.id as string;
    const result = await UserService.updateUserByAdmin(userId, req.body, req.user.email);

    res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: result
    })
})

const blockUserByAdmin = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.params.id as string;
    const result = await UserService.blockUserByAdmin(userId, req.user.email);

    res.status(200).json({
        success: true,
        message: "User blocked successfully",
        data: result
    })
})

export const UserController = {
    createCustomer,
    getAdminUsers,
    getAdminUserById,
    createUserByAdmin,
    updateUserByAdmin,
    blockUserByAdmin
}