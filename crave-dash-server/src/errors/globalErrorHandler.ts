import { NextFunction, Request, Response } from "express";

class CustomError extends Error {
    public statusCode: number;
    constructor(statusCode: number, message: string){
        super(message)

        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

export const globalErrorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) =>{
    res.status(err.statusCode || 500).json({
        success: false,
        message: "An error occurred while processing your request",
        errorMessage: err.message || "Internal Server Error",
        error: err
    })
}