"use server"

import { Player } from "@/types/player";
import { cookies } from "next/headers"

export async function getPlayersAction(): Promise<{ players: Player[]; success: boolean; status: number; message: string; error?: string }> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("k_n_q_auth_token")?.value

    if (!token) {
      return {
        players: [],
        success: false,
        status: 401,
        message: "Unauthorized: No token found",
      }
    }

    const response = await fetch(`${process.env.BASE_URL}/players`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      next: { revalidate: 600 }, // Cache for 10 minutes
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        players: [],
        success: false,
        status: result.status,
        message: result.message || "Failed to fetch player data.",
        error: result.error || result.message,
      }
    }

    // Ensure result.data is always an array
    let players: Player[] = []
    if (Array.isArray(result.data)) {
      players = result.data
    } else if (result.data) {
      players = [result.data]
    }

    return {
      players,
      success: true,
      status: 200,
      message: "Player data fetched successfully.",
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return {
      players: [],
      success: false,
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
      error: errorMessage,
    }
  }
}


export async function getPlayersBySchoolIdAction(schoolId: string): Promise<{ players: Player[]; success: boolean; status: number; message: string; error?: string }> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("k_n_q_auth_token")?.value

    if (!token) {
      return {
        players: [],
        success: false,
        status: 401,
        message: "Unauthorized: No token found",
      }
    }

    const response = await fetch(`${process.env.BASE_URL}/players/school/${schoolId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      next: { revalidate: 600 }, // Cache for 10 minutes - players list by school
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        players: [],
        success: false,
        status: result.status,
        message: result.message || "Failed to fetch player data.",
        error: result.error || result.message,
      }
    }

    // Ensure result.data is always an array
    let players: Player[] = []
    if (Array.isArray(result.data)) {
      players = result.data
    } else if (result.data) {
      players = [result.data]
    }

    return {
      players,
      success: true,
      status: 200,
      message: "Player data fetched successfully.",
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return {
      players: [],
      success: false,
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
      error: errorMessage,
    }
  }
}

export async function getPlayerByIdAction(playerId: string): Promise<{ player: Player | null; success: boolean; status: number; message: string; error?: string }> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("k_n_q_auth_token")?.value

    if (!token) {
      return {
        player: null,
        success: false,
        status: 401,
        message: "Unauthorized: No token found",
      }
    }

    const response = await fetch(`${process.env.BASE_URL}/players/${playerId}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour - individual player data
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        player: null,
        success: false,
        status: result.status,
        message: result.message || "Failed to fetch player data.",
        error: result.error || result.message,
      }
    }

    return {
      player: result.data || null,
      success: true,
      status: 200,
      message: "Player data fetched successfully.",
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return {
      player: null,
      success: false,
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
      error: errorMessage,
    }
  }
}