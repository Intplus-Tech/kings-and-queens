"use server"

import { UserData } from '@/types/user';
import { cookies } from 'next/headers';

interface GetUserResponse {
  success: boolean
  status: number
  message: string
  data?: UserData
  error?: string
}

export async function getUser(): Promise<GetUserResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('k_n_q_auth_token')?.value;

    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Unauthorized: No token found",
        error: "No authentication token found",
      }
    }

    const response = await fetch(`${process.env.BASE_URL}/users/user-profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });


    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        status: response.status,
        message: result.message || "Failed to fetch user",
        error: result.error || result.message,
      }
    }

    return {
      success: true,
      status: result.status,
      message: result.message,
      data: result.data,
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
