import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { OrderService } from "./order.service";
import { Role } from "../../../generated/prisma/enums";

type AuthenticatedRequest = Request & {
  user: {
    email: string;
    role: Role;
  };
};

const createOrder = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await OrderService.createOrder(req.body, req.user.email);

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await OrderService.getMyOrders(req.user.email, req.query);

  res.status(200).json({
    success: true,
    message: "My orders retrieved successfully",
    data: result,
  });
});

const getProvidersOrders = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const result = await OrderService.getProvidersOrders(req.user.email, req.query);

  res.status(200).json({
    success: true,
    message: "Provider orders retrieved successfully",
    data: result,
  });
});

const getOrderById = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const orderId = req.params.id as string;
  const result = await OrderService.getOrderById(orderId, req.user.email, req.user.role);

  res.status(200).json({
    success: true,
    message: "Order retrieved successfully",
    data: result,
  });
});

const updateProviderOrderStatus = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  const orderId = req.params.id as string;
  const result = await OrderService.updateProviderOrderStatus(
    orderId,
    req.body,
    req.user.email,
    req.user.role,
  );

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getMyOrders,
  getProvidersOrders,
  getOrderById,
  updateProviderOrderStatus,
};
