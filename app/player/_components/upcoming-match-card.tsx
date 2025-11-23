"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
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
  // Find the closest upcoming match from all matches
  const getUpcomingMatch = () => {
    const now = new Date();
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

      if (gameData?.startTime) {
        const startTime = new Date(gameData.startTime);

        // Only consider future matches
        if (startTime > now) {
          if (
            !upcomingMatch ||
            startTime <
              new Date(
                (upcomingMatch.match.gameData || upcomingMatch.match.game)
                  ?.startTime || 0
              )
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
          <CardTitle className="text-white font-normal text-lg">
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

  return (
    <Card className="bg-[url('/upcoming.jpg')] bg-center bg-cover border-indigo-500/20">
      <CardHeader>
        <CardTitle className="text-white font-normal text-lg">
          Your Upcoming Match
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:space-y-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold">
              {new Date(
                (
                  upcomingMatchData.match.gameData ||
                  upcomingMatchData.match.game
                )?.startTime || ""
              ).toLocaleDateString()}{" "}
              @{" "}
              {new Date(
                (
                  upcomingMatchData.match.gameData ||
                  upcomingMatchData.match.game
                )?.startTime || ""
              ).toLocaleTimeString()}
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm">
              {upcomingMatchData.tournament} - Round {upcomingMatchData.round}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Image
                  src="/placeholder.svg?height=40&width=40&text=P1"
                  alt="Player 1"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold truncate">
                    {upcomingMatchData.match.player1Data
                      ? upcomingMatchData.match.player1Data.name ||
                        upcomingMatchData.match.player1Data.alias
                      : "Player 1"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {upcomingMatchData.match.player1 === currentUserId
                      ? "You"
                      : ""}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs sm:text-sm font-bold">VS</p>
                <Badge className="bg-white text-black text-xs font-medium">
                  MATCH
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Image
                  src="/placeholder.svg?height=40&width=40&text=P2"
                  alt="Player 2"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold truncate">
                    {upcomingMatchData.match.player2Data
                      ? upcomingMatchData.match.player2Data.name ||
                        upcomingMatchData.match.player2Data.alias
                      : "Player 2"}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {upcomingMatchData.match.player2 === currentUserId
                      ? "You"
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            <Button className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
              Join Game
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
