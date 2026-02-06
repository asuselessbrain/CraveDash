import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { UserService } from "./user.service";

const createCustomer = catchAsync(async(req:Request, res: Response) =>{
    const result = await UserService.createCustomer(req.body);
    res.status(201).json({
        success: true,
        message: "Customer created successfully",
        data: result
    })
})

export const UserController = {
    createCustomer
}