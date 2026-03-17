import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.service";
import { cookieOptions } from "../auth/auth.controller";

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

export const UserController = {
    createCustomer
}