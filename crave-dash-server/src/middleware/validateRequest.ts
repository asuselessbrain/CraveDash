import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateRequest = (schema: ZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.safeParseAsync(req.body);
    next();
  });
};
