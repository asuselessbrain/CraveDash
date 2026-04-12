"use server"
import { baseApi } from "../baseApi"

export const customerDashboardData = async () => {
    const result = await baseApi(`dashboard/customer`, "GET", undefined, undefined, "dashboard");
    return result;
}

export const providerDashboardData = async () => {
    const result = await baseApi(`dashboard/provider`, "GET", undefined, undefined, "dashboard");
    return result;
}