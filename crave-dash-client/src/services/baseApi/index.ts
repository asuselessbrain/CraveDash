"use server"
import { cookies } from "next/headers"

export const baseApi = async (
    endpoint: string,
    method: string,
    data?: unknown,
    queryString?: string,
    tag: string = "default"
) => {

    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    const normalizedQuery = queryString ? `?${queryString}` : ""

    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        ...(tag ? { next: { tags: [tag] } } : {}),
    }

    if (data !== undefined && method !== "GET" && method !== "HEAD") {
        options.body = JSON.stringify(data)
    }

    const result = await fetch(
        `http://localhost:5000/api/v1/${endpoint}${normalizedQuery}`,
        options
    );
    return await result.json();
}