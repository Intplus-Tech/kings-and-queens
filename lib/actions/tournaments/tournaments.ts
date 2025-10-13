"use server"

import { Tournament } from "@/types/tournamentType";
import { cookies } from "next/headers"



export async function getTournamentsAction(): Promise<{ tournaments: Tournament[]; success: boolean; status: number; message: string; error?: string }> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("k_n_q_auth_token")?.value

    if (!token) {
      return {
        tournaments: [],
        success: false,
        status: 401,
        message: "Unauthorized: No token found",
      }
    }

    const response = await fetch(`${process.env.BASE_URL}/tournaments/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })

    // Safely parse JSON (handle empty body)
    let result: any = undefined
    try {
      result = await response.json()
    } catch {
      result = undefined
    }

    if (!response.ok || (result && result.success === false)) {
      return {
        tournaments: [],
        success: false,
        status: response.status,
        message: result?.message || "Failed to fetch tournaments.",
        error: result?.error || result?.message,
      }
    }

    // Normalize to array
    let tournaments: Tournament[] = []
    if (Array.isArray(result?.data)) {
      tournaments = result.data
    } else if (result?.data) {
      tournaments = [result.data]
    }

    return {
      tournaments,
      success: true,
      status: response.status,
      message: result?.message || "Tournaments retrieved successfully.",
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return {
      tournaments: [],
      success: false,
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
      error: errorMessage,
    }
  }
}


interface TournamentJoinResponse {
  success: boolean
  status: number
  message: string
  data?: any
  error?: string
}

/**
 * Submit participants to join a tournament.
 * @param tournamentId - the tournament id (dynamic)
 * @param participants - array of player ids to join
 */
export async function joinTournamentAction(
  tournamentId: string,
  participants: string[]
): Promise<TournamentJoinResponse> {
  try {
    // basic validation
    if (!Array.isArray(participants) || participants.length === 0) {
      return {
        success: false,
        status: 400,
        message: "Invalid request: participants must be a non-empty array",
      }
    }

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

    const response = await fetch(`${process.env.BASE_URL}/tournaments/${tournamentId}/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ participants }),
    })

    // Safely parse JSON if present
    let result: any = undefined
    try {
      result = await response.json()
    } catch {
      result = undefined
    }

    if (!response.ok || (result && result.success === false)) {
      return {
        success: false,
        status: response.status,
        message: result?.message || "Failed to join tournament",
        error: result?.error || result?.message,
      }
    }

    return {
      success: true,
      status: response.status,
      message: result?.message || "Participants submitted successfully",
      data: result?.data,
    }
  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}



export interface GetTournamentResponse {
  tournament?: Tournament | null;
  success: boolean;
  status: number;
  message: string;
  error?: string;
}

/**
 * Fetch a single tournament by id.
 * @param tournamentId - the tournament id (dynamic)
 */
export async function getTournamentAction(
  tournamentId: string
): Promise<GetTournamentResponse> {
  try {
    // Basic validation
    if (!tournamentId || typeof tournamentId !== "string") {
      return {
        tournament: null,
        success: false,
        status: 400,
        message: "Invalid request: tournamentId is required",
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("k_n_q_auth_token")?.value;

    if (!token) {
      return {
        tournament: null,
        success: false,
        status: 401,
        message: "Unauthorized: No token found",
        error: "No authentication token found",
      };
    }

    const response = await fetch(
      `${process.env.BASE_URL}/tournaments/${encodeURIComponent(tournamentId)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Safely parse JSON (handle empty body)
    let result: any = undefined;
    try {
      result = await response.json();
    } catch {
      result = undefined;
    }

    if (!response.ok || (result && result.success === false)) {
      return {
        tournament: null,
        success: false,
        status: response.status,
        message: result?.message || "Failed to fetch tournament.",
        error: result?.error || result?.message,
      };
    }

    // Normalize result.data to single tournament
    let tournament: Tournament | null = null;
    if (Array.isArray(result?.data) && result.data.length > 0) {
      tournament = result.data[0];
    } else if (result?.data) {
      tournament = result.data as Tournament;
    }

    return {
      tournament,
      success: true,
      status: response.status,
      message: result?.message || "Tournament retrieved successfully.",
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      tournament: null,
      success: false,
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
      error: errorMessage,
    };
  }
}