"use server"
import { baseApi } from "../baseApi";
import { QueryParams } from "@/types";
import { revalidateTag } from "next/cache";


export const getAdminUsers = async (queryParams?: QueryParams) => {
  const params = new URLSearchParams();

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
  }

  const queryString = params.toString() || undefined;

  const res = await baseApi("user/admin/users", "GET", undefined, queryString, "users");
  return res
};

export const getAdminUserById = async (userId: string) => {
  const res = await baseApi(`user/admin/users/${userId}`, "GET", undefined, undefined, "users");
  return res;
};

type CreateUserByAdminPayload = {
  name: string;
  email: string;
  role: string;
  password?: string;
  phone?: string;
  address?: string;
};

export const createUserByAdmin = async (payload: CreateUserByAdminPayload) => {
  const res = await baseApi("user/admin/users", "POST", payload, undefined, "users");
  revalidateTag("users", "max");
  return res;
};

type UpdateUserByAdminPayload = {
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  address?: string;
};

export const updateUserByAdmin = async (userId: string, payload: UpdateUserByAdminPayload) => {
  const res = await baseApi(`user/admin/users/${userId}`, "PATCH", payload, undefined, "users");
  revalidateTag("users", "max");
  return res;
};

export const blockUserByAdmin = async (userId: string) => {
  const res = await baseApi(`user/admin/users/${userId}/block`, "PATCH", undefined, undefined, "users");
  revalidateTag("users", "max");
  return res;
};
