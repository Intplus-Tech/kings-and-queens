"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { Schedule, Match, ScheduleMatchPlayer } from "@/types/schedule";

interface GameData {
  _id: string;
  startTime?: string;
  players?: {
    white: string;
    black: string;
  };
  [key: string]: any;
}

interface MatchWithGame extends Match {
  gameData?: GameData;
  game?: GameData;
  startTime?: string;
  player1Data?: ScheduleMatchPlayer;
  player2Data?: ScheduleMatchPlayer;
  status?: string;
}

interface UpcomingMatchCardProps {
  schedules: Schedule[];
  allMatches: MatchWithGame[];
  currentUserId: string;
}

export function UpcomingMatchCard({
  schedules,
  allMatches,
  currentUserId,
}: UpcomingMatchCardProps) {
  const router = useRouter();
  const [now, setNow] = useState(() => Date.now());
  const countdownWindowMs = 5 * 60 * 1000;
  const graceWindowMs = 20 * 60 * 1000; // keep card visible up to 20 min after start
  const completedStatuses = new Set([
    "completed",
    "finished",
    "done",
    "closed",
  ]);
  const activeStatuses = new Set([
    "ongoing",
    "in_progress",
    "live",
    "scheduled",
    "pending",
    "upcoming",
    "created",
  ]);

  const formatCountdown = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  // Find the closest upcoming match from all matches
  const getUpcomingMatch = () => {
    const nowDate = new Date();
    const graceCutoffMs = nowDate.getTime() - graceWindowMs;
    let upcomingMatch: {
      match: MatchWithGame;
      tournament: string;
      round: number;
    } | null = null;

    for (const match of allMatches) {
      const isParticipant =
        match.player1 === currentUserId || match.player2 === currentUserId;
      if (!isParticipant) continue;

      const gameData = match.gameData || match.game;
      const normalizedStatus = (() => {
        const rawStatus =
          match.status ||
          (match as Record<string, any>)?.status ||
          (match.gameMeta?.status as string | undefined) ||
          (gameData?.status as string | undefined);
        return typeof rawStatus === "string"
          ? rawStatus.trim().toLowerCase()
          : undefined;
      })();

      if (
        normalizedStatus &&
        (completedStatuses.has(normalizedStatus) ||
          (!activeStatuses.has(normalizedStatus) && normalizedStatus !== ""))
      ) {
        // Skip finished matches so we can fall back to the next available one
        continue;
      }

      if (gameData?.startTime) {
        const startTime = new Date(gameData.startTime);
        const startTimeMs = startTime.getTime();
        if (Number.isNaN(startTimeMs)) continue;

        // Consider matches that are upcoming or within the grace window
        if (startTimeMs >= graceCutoffMs) {
          const existingStartMs = upcomingMatch
            ? new Date(
                (upcomingMatch.match.gameData || upcomingMatch.match.game)
                  ?.startTime || 0
              ).getTime()
            : null;

          if (
            !upcomingMatch ||
            (existingStartMs !== null && !Number.isNaN(existingStartMs)
              ? startTimeMs < existingStartMs
              : true)
          ) {
            // Find the schedule info for this match
            const schedule = schedules.find((s) =>
              s.matches.some((m) => m._id === match._id)
            );

            upcomingMatch = {
              match,
              tournament: schedule?.tournament.name || "Unknown",
              round: schedule?.round || 0,
            };
          }
        }
      }
    }

    return upcomingMatch;
  };

  const upcomingGame = getUpcomingMatch();
  const upcomingMatchData = upcomingGame ? upcomingGame : null;
  const resolvedGameId = upcomingMatchData
    ? upcomingMatchData.match.gameId ||
      upcomingMatchData.match.gameData?._id ||
      upcomingMatchData.match.game?._id ||
      null
    : null;
  const matchStartIso = upcomingMatchData
    ? upcomingMatchData.match.gameData?.startTime ||
      upcomingMatchData.match.game?.startTime ||
      null
    : null;
  const matchStartDate = useMemo(
    () => (matchStartIso ? new Date(matchStartIso) : null),
    [matchStartIso]
  );

  useEffect(() => {
    if (!matchStartIso) return;
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => window.clearInterval(timer);
  }, [matchStartIso]);

  const timeUntilStart = matchStartDate ? matchStartDate.getTime() - now : null;
  const isMatchLive = typeof timeUntilStart === "number" && timeUntilStart <= 0;
  const isCountdownWindow =
    typeof timeUntilStart === "number" &&
    timeUntilStart > 0 &&
    timeUntilStart <= countdownWindowMs;
  const isPreCountdown =
    typeof timeUntilStart === "number" && timeUntilStart > countdownWindowMs;
  const countdownLabel =
    isCountdownWindow && typeof timeUntilStart === "number"
      ? formatCountdown(timeUntilStart)
      : null;

  const handleJoinClick = () => {
    if (!resolvedGameId || !isMatchLive) return;
    router.push(`/player/play?gameId=${encodeURIComponent(resolvedGameId)}`);
  };

  if (
    !upcomingMatchData ||
    !(
      upcomingMatchData.match.gameData?.startTime ||
      upcomingMatchData.match.game?.startTime
    )
  ) {
    return (
      <Card className="border-indigo-500/20">
        <CardHeader>
          <CardTitle className="text-white font-normal text-lg\">
            Your Upcoming Match
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No upcoming matches scheduled yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const matchDateLabel = matchStartDate
    ? matchStartDate.toLocaleDateString()
    : "";
  const matchTimeLabel = matchStartDate
    ? matchStartDate.toLocaleTimeString()
    : "";

  const renderPlayer = (
    label: string,
    isYou: boolean,
    displayName?: string | null
  ) => (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-3 backdrop-blur">
      <div className="h-12 w-12 overflow-hidden rounded-full border border-white/30">
        <Image
          src="/placeholder.svg?height=48&width=48&text=P"
          alt={label}
          width={48}
          height={48}
        />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white line-clamp-1">
          {displayName || label}
        </p>
        <p className="text-xs uppercase tracking-[0.3em] text-gray-300">
          {isYou ? "You" : label}
        </p>
      </div>
    </div>
  );

  const statusPanel = (
    <div className="w-full rounded-2xl border border-white/20 bg-black/40 p-4 text-left sm:w-64">
      <div className="mt-3 text-xs text-gray-200">
        {isMatchLive ? (
          resolvedGameId ? (
            <p>Both players may join immediately.</p>
          ) : (
            <p className="text-red-100">
              Match is live but missing a game ID. Notify an official.
            </p>
          )
        ) : isCountdownWindow && countdownLabel ? (
          <div className="space-y-1">
            <p className="uppercase tracking-[0.4em] text-[10px] text-gray-400">
              Countdown
            </p>
            <p className="text-2xl font-semibold text-white font-mono">
              {countdownLabel}
            </p>
          </div>
        ) : isPreCountdown ? (
          <p>
            Join unlocks 5 minutes before start •{" "}
            {matchStartDate?.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        ) : (
          <p>Waiting for the arbiter to start the round.</p>
        )}
      </div>
      {resolvedGameId && isMatchLive && (
        <Button
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500"
          onClick={handleJoinClick}
        >
          Join Game
        </Button>
      )}
    </div>
  );

  return (
    <Card className="border-none bg-transparent shadow-none">
      <div className="relative overflow-hidden rounded-[28px] border border-indigo-300/20 bg-[url('/upcoming.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        <div className="relative flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1 text-white">
              <p className="text-[10px] uppercase tracking-[0.6em] text-gray-300">
                Your Upcoming Match
              </p>
              <h3 className="text-lg font-semibold">
                {matchDateLabel} @ {matchTimeLabel}
              </h3>
              <p className="text-sm text-gray-200">
                {upcomingMatchData.tournament} • Round {upcomingMatchData.round}
              </p>
            </div>
            {statusPanel}
          </div>

          <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
            {renderPlayer(
              upcomingMatchData.match.player1Data?.name ||
                upcomingMatchData.match.player1Data?.alias ||
                "Player 1",
              upcomingMatchData.match.player1 === currentUserId
            )}

            <div className="flex flex-col items-center gap-2 text-white">
              <div className="text-xs uppercase tracking-[0.5em] text-gray-400">
                VS
              </div>
              <Badge className="bg-white/90 text-black text-xs font-medium">
                Match
              </Badge>
            </div>

            {renderPlayer(
              upcomingMatchData.match.player2Data?.name ||
                upcomingMatchData.match.player2Data?.alias ||
                "Player 2",
              upcomingMatchData.match.player2 === currentUserId
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
