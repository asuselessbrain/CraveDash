"use server"
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const cookieOptions = {
  httpOnly: true,
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
} as const

export const signInUser = async (data: FieldValues) => {
  const cookieStore = await cookies()
  try {
    const res = await fetch(
      "http://localhost:5000/api/v1/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      },
    );
    const result = await res.json();
    if (result.success) {
      cookieStore.set("token", result.data.token, cookieOptions)
    }
    return result;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

export const signUpUser = async (data: FieldValues) => {
  const cookieStore = await cookies()
  try {
    const res = await fetch(
      "http://localhost:5000/api/v1/user/customers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );
    const result = await res.json();

    if (result.success) {
      cookieStore.set("token", result.data.token, cookieOptions)
    }
    return result;
  }
  catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

export const forgotPassword = async (email: FieldValues) => {
  try {
    const res = await fetch(
      "http://localhost:5000/api/v1/auth/forgot-password",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
      }
    );
    const result = await res.json();
    console.log(result)
    return result;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}

export const resetPassword = async (data: FieldValues) => {
  try {
    const res = await fetch(
      "http://localhost:5000/api/v1/auth/reset-password",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
}
