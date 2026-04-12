"use server"
import { baseApi } from "../baseApi"

export const customerDashboardData = async () => {
    const result = await baseApi(`dashboard/customer`, "GET", undefined, undefined, "dashboard");
    return result;
}