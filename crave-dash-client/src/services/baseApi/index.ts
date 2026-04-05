"use server"
import { cookies } from "next/headers"

export const baseApi = async (endpoint: string, method: string, data?: any) => {

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    const result = await fetch(
        `http://localhost:5000/api/v1/${endpoint}`,
        {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }
    );
    return await result.json();
}