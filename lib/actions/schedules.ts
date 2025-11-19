"use server";

import type { Schedule } from "@/types/schedule";
import type { PlayerData } from "@/types/user";
import { cookies } from "next/headers";
import { getPlayerByIdAction } from "./user/user.action";

interface GameData {
  _id: string;
  startTime?: string;
  players?: {
    white: string;
    black: string;
  };
  [key: string]: any;
}

interface MatchWithGameData {
  _id: string;
  player1: string;
  player2: string;
  gameId: string;
  scheduled: boolean;
  gameData?: GameData;
  startTime?: string;
  player1Data?: PlayerData;
  player2Data?: PlayerData;
}

interface ScheduleWithGames extends Schedule {
  matches: MatchWithGameData[];
}

/**
 * Fetches player schedules with game data and determines upcoming match
 * @returns Object containing schedules with game data and the upcoming match
 */
export async function fetchPlayerSchedules() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("k_n_q_auth_token")?.value;

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    // Fetch schedules from API
    const scheduleResponse = await fetch(
      `${process.env.BASE_URL}/schedules/player`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 }, // Cache for 5 minutes on Vercel
      }
    );

    if (!scheduleResponse.ok) {
      throw new Error("Failed to fetch schedules");
    }

    const scheduleJson = await scheduleResponse.json();
    const schedules: Schedule[] = scheduleJson.data;

    if (!schedules || schedules.length === 0) {
      return {
        schedules: [],
        upcomingMatch: null,
        allMatches: [],
      };
    }

    // Collect all unique player IDs from all matches
    const playerIds = new Set<string>();
    for (const schedule of schedules) {
      for (const match of schedule.matches) {
        playerIds.add(match.player1);
        playerIds.add(match.player2);
      }
    }

    // Fetch all player data at once
    const playerDataMap = new Map<string, PlayerData>();
    if (playerIds.size > 0) {
      for (const playerId of playerIds) {
        try {
          const playerRes = await getPlayerByIdAction(playerId);
          if (playerRes.success && playerRes.data) {
            playerDataMap.set(playerId, playerRes.data);
          }
        } catch (e) {
          console.error(`Failed to fetch player ${playerId}:`, e);
        }
      }
    }

    // Fetch game data for all matches
    const schedulesWithGames: ScheduleWithGames[] = [];
    let nextUpcoming: {
      match: MatchWithGameData;
      tournament: string;
      round: number;
    } | null = null;
    let allMatches: MatchWithGameData[] = [];
    const now = new Date();

    for (const schedule of schedules) {
      const matchesWithGames: MatchWithGameData[] = [];

      for (const match of schedule.matches) {
        try {
          const gameResponse = await fetch(
            `${process.env.BASE_URL}/games/${match.gameId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          let gameData: GameData | undefined;

          if (gameResponse.ok) {
            const gameJson = await gameResponse.json();
            gameData = gameJson.data;
          }

          // Get player data from pre-fetched map
          const player1Data = playerDataMap.get(match.player1);
          const player2Data = playerDataMap.get(match.player2);

          const matchWithGame: MatchWithGameData = {
            ...match,
            gameData,
            startTime: gameData?.startTime,
            player1Data,
            player2Data,
          };

          matchesWithGames.push(matchWithGame);
          allMatches.push(matchWithGame);

          // Determine if this is the next upcoming game
          if (gameData?.startTime) {
            const gameTime = new Date(gameData.startTime);
            // Find games that haven't started yet, closest to now
            if (gameTime > now) {
              if (
                !nextUpcoming ||
                gameTime < new Date(nextUpcoming.match.gameData?.startTime || 0)
              ) {
                nextUpcoming = {
                  match: matchWithGame,
                  tournament: schedule.tournament.name,
                  round: schedule.round,
                };
              }
            }
          }
        } catch (error) {
          console.error(`Failed to fetch game data for ${match.gameId}:`, error);
          // Continue with match data even if game fetch fails
          const player1Data = playerDataMap.get(match.player1);
          const player2Data = playerDataMap.get(match.player2);

          matchesWithGames.push({
            ...match,
            gameData: undefined,
            startTime: undefined,
            player1Data,
            player2Data,
          });
          allMatches.push({
            ...match,
            gameData: undefined,
            startTime: undefined,
            player1Data,
            player2Data,
          });
        }
      }

      schedulesWithGames.push({
        ...schedule,
        matches: matchesWithGames,
      });
    }

    return {
      schedules: schedulesWithGames,
      upcomingMatch: nextUpcoming,
      allMatches,
    };
  } catch (error) {
    console.error("Error fetching schedules:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch schedules"
    );
  }
}

/**
 * Fetches a single schedule with game data
 * @param scheduleId Schedule ID to fetch
 * @returns Schedule with game data populated
 */
export async function fetchScheduleById(scheduleId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("k_n_q_auth_token")?.value;

    if (!token) {
      throw new Error("Unauthorized: No token found");
    }

    const response = await fetch(
      `${process.env.BASE_URL}/schedules/${scheduleId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch schedule");
    }

    const json = await response.json();
    const schedule: Schedule = json.data;

    // Collect all unique player IDs from matches
    const playerIds = new Set<string>();
    for (const match of schedule.matches) {
      playerIds.add(match.player1);
      playerIds.add(match.player2);
    }

    // Fetch all player data at once
    const playerDataMap = new Map<string, PlayerData>();
    if (playerIds.size > 0) {
      console.log(`Fetching ${playerIds.size} player(s)`);
      for (const playerId of playerIds) {
        try {
          const playerRes = await getPlayerByIdAction(playerId);
          if (playerRes.success && playerRes.data) {
            playerDataMap.set(playerId, playerRes.data);
          }
        } catch (e) {
          console.error(`Failed to fetch player ${playerId}:`, e);
        }
      }
    }

    // Fetch game data for all matches
    const matchesWithGames: MatchWithGameData[] = [];

    for (const match of schedule.matches) {
      try {
        const gameResponse = await fetch(
          `${process.env.BASE_URL}/games/${match.gameId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        let gameData: GameData | undefined;

        if (gameResponse.ok) {
          const gameJson = await gameResponse.json();
          gameData = gameJson.data;
        }

        // Get player data from pre-fetched map
        const player1Data = playerDataMap.get(match.player1);
        const player2Data = playerDataMap.get(match.player2);

        matchesWithGames.push({
          ...match,
          gameData,
          startTime: gameData?.startTime,
          player1Data,
          player2Data,
        });
      } catch (error) {
        console.error(`Failed to fetch game for match ${match._id}:`, error);
        matchesWithGames.push({
          ...match,
          gameData: undefined,
          startTime: undefined,
        });
      }
    }

    return {
      ...schedule,
      matches: matchesWithGames,
    } as ScheduleWithGames;
  } catch (error) {
    console.error("Error fetching schedule:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch schedule"
    );
  }
}
