import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { config } from "../../config";

export const cookieOptions = {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: config.nodeEnv === "production" ? "none" as const : "lax" as const,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/"
};

const login = catchAsync(async(req: Request, res: Response) =>{
    const result = await AuthService.loginUser(req.body);

    const { token, ...userData } = result;

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
            token, userData
        },
    })
})

const forgetPassword = catchAsync(async(req: Request, res: Response) =>{
    await AuthService.forgetPassword(req.body);
    res.status(200).json({
        success: true,
        message: "Password reset link sent to your email if the email is registered with us",
    })
})

const resetPassword = catchAsync(async(req: Request, res: Response) =>{
    await AuthService.resetPassword(req.body);
    res.status(200).json({
        success: true,
        message: "Password reset successfully",
    })
})

export const AuthController = {
    login,
    forgetPassword,
    resetPassword
}