import { Request, Response } from "express";
import { Role } from "../../../generated/prisma/enums";
import { catchAsync } from "../../utils/catchAsync";
import { DashboardService } from "./dashboard.service";

type AuthenticatedRequest = Request & {
  user: {
    email: string;
    role: Role;
  };
};

const getCustomerDashboard = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await DashboardService.getCustomerDashboard(req.user.email);

  res.status(200).json({
    success: true,
    message: "Customer dashboard data retrieved successfully",
    data: result,
  });
});

export const DashboardController = {
  getCustomerDashboard,
};