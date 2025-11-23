"use server";

import type {
  Match,
  Schedule,
  ScheduleMatchPlayer,
} from "@/types/schedule";
import { cookies } from "next/headers";

type ApiMatchPlayerField = string | ScheduleMatchPlayer;

type ApiGameField = string | { _id: string;[key: string]: any } | null;

type ApiMatch = Omit<
  Match,
  "player1" | "player2" | "gameId" | "player1Data" | "player2Data" | "gameMeta"
> & {
  player1: ApiMatchPlayerField;
  player2: ApiMatchPlayerField;
  gameId: ApiGameField;
};

type ApiSchedule = Omit<Schedule, "matches"> & {
  matches: ApiMatch[];
};

interface GameData {
  _id: string;
  startTime?: string;
  players?: {
    white: string;
    black: string;
  };
  [key: string]: any;
}

interface MatchWithGameData extends Match {
  gameData?: GameData;
  startTime?: string;
}

interface ScheduleWithGames extends Schedule {
  matches: MatchWithGameData[];
}

interface NormalizedPlayerResult {
  id: string;
  data?: ScheduleMatchPlayer;
}

const normalizePlayerField = (
  player: ApiMatchPlayerField
): NormalizedPlayerResult => {
  if (!player) {
    return { id: "" };
  }

  if (typeof player === "string") {
    return { id: player };
  }

  const { _id, name, alias, rating, schoolId } = player;

  return {
    id: _id,
    data: {
      _id,
      name,
      alias,
      rating,
      schoolId,
    },
  };
};

const normalizeGameField = (
  game: ApiGameField
): { id: string; meta?: Record<string, any> } => {
  if (!game) {
    return { id: "" };
  }

  if (typeof game === "string") {
    return { id: game };
  }

  const { _id, ...rest } = game;
  return {
    id: _id,
    meta: Object.keys(rest).length ? rest : undefined,
  };
};

const normalizeMatch = (match: ApiMatch): Match => {
  const player1 = normalizePlayerField(match.player1);
  const player2 = normalizePlayerField(match.player2);
  const game = normalizeGameField(match.gameId);

  return {
    ...match,
    player1: player1.id,
    player2: player2.id,
    gameId: game.id,
    player1Data: player1.data,
    player2Data: player2.data,
    gameMeta: game.meta,
  };
};

const normalizeSchedules = (schedules: ApiSchedule[] = []): Schedule[] =>
  schedules.map((schedule) => ({
    ...schedule,
    matches: schedule.matches.map((match) => normalizeMatch(match)),
  }));

const normalizeSchedule = (
  schedule: ApiSchedule | null | undefined
): Schedule | null => {
  if (!schedule) return null;
  return {
    ...schedule,
    matches: schedule.matches.map((match) => normalizeMatch(match)),
  } as Schedule;
};

async function attachGameDataToMatch(
  match: Match,
  token: string
): Promise<MatchWithGameData> {
  if (!match.gameId) {
    return {
      ...match,
      gameData: undefined,
      startTime: undefined,
    };
  }

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

    if (!gameResponse.ok) {
      throw new Error(`Failed to fetch game ${match.gameId}`);
    }

    const gameJson = await gameResponse.json();
    const gameData: GameData | undefined = gameJson.data;

    return {
      ...match,
      gameData,
      startTime: gameData?.startTime,
    };
  } catch (error) {
    console.error(`Failed to fetch game data for ${match.gameId}:`, error);
    return {
      ...match,
      gameData: undefined,
      startTime: undefined,
    };
  }
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
    const schedules = normalizeSchedules(
      (scheduleJson.data || []) as ApiSchedule[]
    );

    if (!schedules.length) {
      return {
        schedules: [],
        upcomingMatch: null,
        allMatches: [],
      };
    }

    const now = new Date();

    const schedulesWithGames: ScheduleWithGames[] = await Promise.all(
      schedules.map(async (schedule) => {
        const matchesWithGames = await Promise.all(
          schedule.matches.map((match) =>
            attachGameDataToMatch(match, token)
          )
        );

        return {
          ...schedule,
          matches: matchesWithGames,
        };
      })
    );

    // Flatten all matches and find upcoming match
    const allMatches: MatchWithGameData[] = [];
    let nextUpcoming: {
      match: MatchWithGameData;
      tournament: string;
      round: number;
    } | null = null;

    for (const schedule of schedulesWithGames) {
      for (const match of schedule.matches) {
        allMatches.push(match);

        // Determine if this is the next upcoming game
        if (match.gameData?.startTime) {
          const gameTime = new Date(match.gameData.startTime);
          // Find games that haven't started yet, closest to now
          if (gameTime > now) {
            if (
              !nextUpcoming ||
              gameTime < new Date(nextUpcoming.match.gameData?.startTime || 0)
            ) {
              nextUpcoming = {
                match,
                tournament: schedule.tournament.name,
                round: schedule.round,
              };
            }
          }
        }
      }
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
    const schedule = normalizeSchedule(json.data as ApiSchedule);

    if (!schedule) {
      throw new Error("Failed to normalize schedule data");
    }

    const matchesWithGames = await Promise.all(
      schedule.matches.map((match) => attachGameDataToMatch(match, token))
    );

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
