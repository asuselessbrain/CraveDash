import { baseApi } from "../baseApi";
import { QueryParams } from "@/types";

type CreateOrderPayload = {
  items: Array<{
    mealId?: string;
    quantity: number;
  }>;
  paymentMethod: "CASH_ON_DELIVERY" | "ONLINE_PAYMENT" | string;
  deliveryAddress: {
    fullName: string;
    phoneNumber: string;
    streetAddress: string;
    city: string;
    area: string;
    deliveryInstructions?: string;
  };
  pricing: {
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
  };
};

export const createOrder = async (data: CreateOrderPayload) => {
  const result = await baseApi("order", "POST", data);
  return result;
};

type StripeCheckoutPayload = {
  deliveryAddress: CreateOrderPayload["deliveryAddress"];
};

export const createStripeCheckoutSession = async (data: StripeCheckoutPayload) => {
  const result = await baseApi("order/stripe/session", "POST", data);
  return result;
};

export const confirmStripeCheckoutSession = async (sessionId: string) => {
  const result = await baseApi("order/stripe/confirm", "POST", { sessionId }, undefined, "orders");
  return result;
};


export const getCustomerOrders = async (queryParams?: QueryParams) => {
  const params = new URLSearchParams();

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
  }

  const result = await baseApi("order/my", "GET", undefined, params.toString(), "orders");
  return result;
}

export const getCustomerOrderById = async (orderId: string) => {
  const result = await baseApi(`order/${orderId}`, "GET", undefined, undefined, "orders");
  return result;
};

export const getProviderOrders = async (queryParams?: QueryParams) => {
  const params = new URLSearchParams();

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
  }

  const result = await baseApi("order/provider", "GET", undefined, params.toString(), "orders");
  return result;
};

export const getProviderOrderById = async (orderId: string) => {
  const result = await baseApi(`order/${orderId}`, "GET", undefined, undefined, "orders");
  return result;
};

export const getOrderById = async (orderId: string) => {
  const result = await baseApi(`order/${orderId}`, "GET", undefined, undefined, "orders");
  return result;
};

export const getAdminOrderById = async (orderId: string) => {
  const result = await baseApi(`order/admin/${orderId}`, "GET", undefined, undefined, "orders");
  return result;
};

type UpdateProviderOrderStatusPayload = {
  orderStatus: "CONFIRMED" | "PREPARING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
};

export const updateProviderOrderStatus = async (
  orderId: string,
  payload: UpdateProviderOrderStatusPayload
) => {
  const result = await baseApi(`order/${orderId}/status`, "PATCH", payload, undefined, "orders");
  return result;
};

export const getOrders = async (queryParams?: QueryParams) => {
  const params = new URLSearchParams();

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
  }

  const result = await baseApi("order/admin", "GET", undefined, params.toString(), "orders");
  return result;
};