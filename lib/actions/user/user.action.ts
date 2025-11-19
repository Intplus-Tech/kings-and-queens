"use server"

import { SchoolData } from '@/types/school';
import { PlayerData, UserData } from '@/types/user';
import { cookies } from 'next/headers';

interface GetUserResponse {
  success: boolean
  status: number
  message: string
  data?: UserData
  error?: string
}

interface GetPlayerResponse {
  success: boolean
  status: number
  message: string
  data?: PlayerData
  error?: string
}


interface GetSchoolInfoResponse {
  success: boolean;
  status: number;
  message: string;
  data?: SchoolData;
  error?: string;
}

export async function getUser(): Promise<GetUserResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('k_n_q_auth_token')?.value;
    console.log("Token:", token);


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

    console.log("getUser response status:", response.status);


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


export async function getPlayer(): Promise<GetPlayerResponse> {
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
    const response = await fetch(`${process.env.BASE_URL}/players/profile`, {
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
        message: result.message || "Failed to fetch player",
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

export async function getPlayerByIdAction(playerId: string): Promise<GetPlayerResponse> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("k_n_q_auth_token")?.value

    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Unauthorized: No token found",
        error: "No authentication token found",
      }
    }

    const response = await fetch(`${process.env.BASE_URL}/players/${playerId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })


    const result = await response.json()

    if (!response.ok || !result.success) {
      return {
        success: false,
        status: response.status,
        message: result.message || "Failed to fetch player data.",
        error: result.error || result.message,
      }
    }

    return {
      success: true,
      status: result.status || response.status,
      message: result.message || "Player data fetched successfully.",
      data: result.data || null,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return {
      success: false,
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
      error: errorMessage,
    }
  }
}


export async function getSchoolById(schoolId: string): Promise<GetSchoolInfoResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('k_n_q_auth_token')?.value;
    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Unauthorized: No token found",
        error: "No authentication token found",
      };
    }
    const response = await fetch(`${process.env.BASE_URL}/schools/${schoolId}`, {
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
        message: result.message || "Failed to fetch school info",
        error: result.error || result.message,
      };
    }
    return {
      success: true,
      status: result.status,
      message: result.message,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getPlayerProfileWithSchool(): Promise<GetPlayerResponse & { school?: SchoolData }> {
  try {
    const userResponse = await getPlayer();

    if (!userResponse.success || !userResponse.data) {
      return userResponse;
    }

    const player = Array.isArray(userResponse.data) ? userResponse.data[0] : userResponse.data;

    let schoolId = player.schoolId;

    if (!schoolId && player.school) {
      schoolId = player.school._id;
      console.log("schoolId found in nested school object:", schoolId);
    }

    let schoolData: SchoolData | undefined = undefined;
    if (schoolId) {
      const schoolResponse = await getSchoolById(schoolId);
      if (schoolResponse.success && schoolResponse.data) {
        schoolData = schoolResponse.data;
      }
    }

    return {
      ...userResponse,
      school: schoolData,
    };
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An error occurred while fetching player profile with school.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}