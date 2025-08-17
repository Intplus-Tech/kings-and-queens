import { cookies } from "next/headers";
import { getUser } from "../user/user.action";
import { SchoolData } from "@/types/school";

interface GetSchoolInfoResponse {
  success: boolean;
  status: number;
  message: string;
  data?: SchoolData;
  error?: string;
}

export async function getSchoolInfo(): Promise<GetSchoolInfoResponse> {
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

    // Fetch user profile to get the schoolId
    const user = await getUser();
    const schoolId = user?.data?.coordinatorId?.schoolId;

    if (!schoolId) {
      return {
        success: false,
        status: 404,
        message: "School ID not found in user profile.",
        error: "School ID not found.",
      };
    }

    // Fetch school information using the schoolId
    const response = await fetch(`${process.env.BASE_URL}/schools/${schoolId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        status: response.status,
        message: result.message || "Failed to fetch school info.",
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
      message: "An error occurred while fetching school info.",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
