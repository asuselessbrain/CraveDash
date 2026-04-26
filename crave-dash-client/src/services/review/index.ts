"use server";

import { baseApi } from "../baseApi";

type CreateReviewPayload = {
  mealId: string;
  orderId: string;
  rating: number;
  comment?: string;
};

export const createReview = async (data: CreateReviewPayload) => {
  const result = await baseApi("review", "POST", data, undefined, "reviews");
  return result;
};
