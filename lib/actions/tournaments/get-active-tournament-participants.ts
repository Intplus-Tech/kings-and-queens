"use server"

import { Player } from "@/types/player"
import { cookies } from "next/headers"
import { getActiveTournamentsAction } from "./tournaments"
import { getPlayerByIdAction } from "../players/get-palyer.action"

export interface TournamentParticipant extends Player {
  rank?: number
}

export interface GetActiveTournamentParticipantsResponse {
  participants: TournamentParticipant[]
  tournamentId: string | null
  tournamentName: string | null
  success: boolean
  status: number
  message: string
  error?: string
}

/**
 * Fetch all participants of the first active tournament and arrange them by rating (descending).
 * Returns participants sorted by rating (highest first).
 */
export async function getActiveTournamentParticipantsAction(): Promise<GetActiveTournamentParticipantsResponse> {
  try {
    // Fetch active tournaments
    const activeTournamentsRes = await getActiveTournamentsAction()

    console.log("Active Tournaments Response:", activeTournamentsRes)

    if (!activeTournamentsRes.success || activeTournamentsRes.tournaments.length === 0) {
      return {
        participants: [],
        tournamentId: null,
        tournamentName: null,
        success: false,
        status: 404,
        message: "No active tournaments found.",
        error: "No active tournaments available",
      }
    }

    // Get the first active tournament
    const activeTournament = activeTournamentsRes.tournaments[0]
    const rawParticipants = Array.isArray(activeTournament.participants)
      ? activeTournament.participants
      : []

    if (rawParticipants.length === 0) {
      return {
        participants: [],
        tournamentId: activeTournament._id,
        tournamentName: activeTournament.name,
        success: true,
        status: 200,
        message: "Active tournament found but has no participants.",
      }
    }

    // Resolve participant data (fetch full player details)
    const resolvedParticipants = await Promise.all(
      rawParticipants.map(async (p: any) => {
        try {
          if (!p) return null

          // If it's a string ID, fetch the full player data
          if (typeof p === "string") {
            const playerRes = await getPlayerByIdAction(p)
            if (playerRes.success && playerRes.player) {
              return playerRes.player
            }
            return null
          }

          // If it's already an object, return as Player
          if (typeof p === "object") {
            return p as Player
          }

          return null
        } catch {
          return null
        }
      })
    )

    // Filter out null values
    const participants = resolvedParticipants.filter(Boolean) as Player[]

    // Sort by rating (descending - highest rating first)
    const sortedParticipants = participants.sort((a, b) => {
      const ratingA = a.rating ?? 0
      const ratingB = b.rating ?? 0
      return ratingB - ratingA
    })

    // Add rank based on sorted position
    const rankedParticipants: TournamentParticipant[] = sortedParticipants.map(
      (participant, index) => ({
        ...participant,
        rank: index + 1,
      })
    )

    return {
      participants: rankedParticipants,
      tournamentId: activeTournament._id,
      tournamentName: activeTournament.name,
      success: true,
      status: 200,
      message: `${rankedParticipants.length} participants retrieved and sorted by rating.`,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return {
      participants: [],
      tournamentId: null,
      tournamentName: null,
      success: false,
      status: 500,
      message: "An unexpected error occurred. Please try again later.",
      error: errorMessage,
    }
  }
}
