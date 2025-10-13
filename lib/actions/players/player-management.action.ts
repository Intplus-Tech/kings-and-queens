"use server"

import { cookies } from "next/headers"

interface PlayerActionResponse {
  success: boolean
  status: number
  message: string
  data?: {
    elo: number
    _id: string
    schoolId: string
    alias: string
    name: string
    dob: string
    playerClass: string
    phoneNumber: string
    isCaptain: boolean
    isViceCaptain: boolean
    token: string
    createdAt: string
    updatedAt: string
    password: string
  }
  error?: string
}

// Update player
export async function updatePlayerAction(playerId: string, update: Record<string, any>): Promise<PlayerActionResponse> {

  // console.log("Updating player with ID:", playerId, "with data:", update);

  try {

    const cookieStore = await cookies()
    const token = cookieStore.get("k_n_q_auth_token")?.value


    // console.log("token", token)

    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Unauthorized: No token found",
        error: "No authentication token found",
      }
    }

    const response = await fetch(`${process.env.BASE_URL}/players/${playerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(update),
    })

    const result = await response.json()
    // console.log("Response from update:", response);
    // console.log("Update response:", result);
    if (!response.ok || !result.success) {
      return {
        success: false,
        status: response.status,
        message: result.message || "Failed to update player",
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

// Delete player
export async function deletePlayerAction(playerId: string): Promise<PlayerActionResponse> {

  // console.log("Deleting player with ID:", playerId);


  try {

    const cookieStore = await cookies()
    const token = cookieStore.get("k_n_q_auth_token")?.value

    // console.log("token", token)

    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Unauthorized: No token found",
        error: "No authentication token found",
      }
    }



    const response = await fetch(`${process.env.BASE_URL}/players/${playerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    const result = await response.json()
    // console.log("Response from delete:", response);
    // console.log("Delete response:", result);
    if (!response.ok || !result.success) {
      return {
        success: false,
        status: response.status,
        message: result.message || "Failed to delete player",
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
