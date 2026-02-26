"use server"
import { FieldValues } from "react-hook-form";

export const signInUser = async (data: FieldValues) => {
  try {
    const res = await fetch(
      "https://crave-dash-server.vercel.app/api/v1/auth/login",
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
    return result;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};
