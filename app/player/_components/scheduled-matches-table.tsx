"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
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

interface ScheduledMatchesTableProps {
  schedules: Schedule[];
  allMatches: MatchWithGame[];
  currentUserId: string;
  compact?: boolean;
}

export function ScheduledMatchesTable({
  schedules,
  allMatches,
  currentUserId,
  compact = false,
}: ScheduledMatchesTableProps) {
  // Find the closest upcoming match to highlight it
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

  return (
    <Card className="border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Scheduled Matches</CardTitle>
        {compact && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-gray-400 hover:text-white"
          >
            <Link href="/player/matches">View All</Link>
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {/* Mobile View - List */}
        <div className="md:hidden space-y-4">
          {allMatches.slice(0, compact ? 3 : undefined).map((match, idx) => {
            const gameData = match.gameData || match.game;
            const startTime = gameData?.startTime
              ? new Date(gameData.startTime)
              : null;
            const isCurrent = upcomingMatchData?.match._id === match._id;
            const schedule = schedules.find((s) =>
              s.matches.some((m) => m._id === match._id)
            );
            const tournamentName =
              schedule?.tournament.name || "Unknown Tournament";
            const round = schedule?.round || "-";

            const player1Name =
              match.player1 === currentUserId
                ? "You"
                : match.player1Data?.name ||
                  match.player1Data?.alias ||
                  "Player 1";
            const player2Name =
              match.player2 === currentUserId
                ? "You"
                : match.player2Data?.name ||
                  match.player2Data?.alias ||
                  "Player 2";

            return (
              <div
                key={idx}
                className={`p-4 rounded-lg border border-gray-700 ${
                  isCurrent
                    ? "bg-indigo-600/10 border-indigo-500/30"
                    : "bg-card"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-sm text-gray-100 line-clamp-1">
                      {tournamentName}
                    </h4>
                    <p className="text-xs text-gray-400">Round {round}</p>
                  </div>
                  {startTime ? (
                    <div className="text-right">
                      <div className="text-xs font-medium text-gray-200">
                        {startTime.toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {startTime.toLocaleTimeString()}
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">TBD</span>
                  )}
                </div>

                <div className="flex items-center justify-between bg-secondary/30 p-2 rounded mb-3">
                  <div
                    className={`text-sm ${
                      match.player1 === currentUserId
                        ? "text-green-400 font-medium"
                        : "text-gray-300"
                    }`}
                  >
                    {player1Name}
                  </div>
                  <div className="text-xs font-bold text-muted-foreground px-2">
                    VS
                  </div>
                  <div
                    className={`text-sm ${
                      match.player2 === currentUserId
                        ? "text-green-400 font-medium"
                        : "text-gray-300"
                    }`}
                  >
                    {player2Name}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white h-8 text-xs"
                >
                  View Details
                </Button>
              </div>
            );
          })}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block w-full overflow-x-auto md:mx-0 md:px-0">
          <Table className="w-full min-w-max md:min-w-full">
            <TableHeader>
              <TableRow className="border-gray-700 hover:bg-gray-800/50">
                <TableHead className="text-gray-300 text-xs sm:text-sm">
                  Tournament
                </TableHead>
                <TableHead className="text-gray-300 text-xs sm:text-sm">
                  Round
                </TableHead>
                <TableHead className="text-gray-300 text-xs sm:text-sm hidden md:table-cell">
                  Player 1
                </TableHead>
                <TableHead className="text-gray-300 text-xs sm:text-sm hidden md:table-cell">
                  Player 2
                </TableHead>
                <TableHead className="text-gray-300 text-xs sm:text-sm">
                  Start Time
                </TableHead>
                <TableHead className="text-gray-300 text-right text-xs sm:text-sm">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allMatches
                .slice(0, compact ? 5 : undefined)
                .map((match, idx) => {
                  const gameData = match.gameData || match.game;
                  const startTime = gameData?.startTime
                    ? new Date(gameData.startTime)
                    : null;
                  const isCurrent = upcomingMatchData?.match._id === match._id;

                  return (
                    <TableRow
                      key={idx}
                      className={`border-gray-700 ${
                        isCurrent
                          ? "bg-indigo-600/10 hover:bg-indigo-600/20"
                          : "hover:bg-gray-800/50"
                      }`}
                    >
                      <TableCell className="font-medium text-gray-100 text-xs sm:text-sm max-w-xs truncate">
                        {schedules
                          .find((s) =>
                            s.matches.some((m) => m._id === match._id)
                          )
                          ?.tournament.name.slice(0, 20)}
                      </TableCell>
                      <TableCell className="text-gray-300 text-xs sm:text-sm">
                        {
                          schedules.find((s) =>
                            s.matches.some((m) => m._id === match._id)
                          )?.round
                        }
                      </TableCell>
                      <TableCell className="text-gray-300 text-xs sm:text-sm hidden md:table-cell">
                        {match.player1 === currentUserId ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-900/30 text-green-300 text-xs"
                          >
                            You
                          </Badge>
                        ) : (
                          <span className="text-xs sm:text-sm truncate">
                            {match.player1Data
                              ? match.player1Data.name ||
                                match.player1Data.alias
                              : "Player"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300 text-xs sm:text-sm hidden md:table-cell">
                        {match.player2 === currentUserId ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-900/30 text-green-300 text-xs"
                          >
                            You
                          </Badge>
                        ) : (
                          <span className="text-xs sm:text-sm truncate">
                            {match.player2Data
                              ? match.player2Data.name ||
                                match.player2Data.alias
                              : "Opponent"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300 text-xs sm:text-sm">
                        {startTime ? (
                          <div className="whitespace-nowrap">
                            <div className="text-xs sm:text-sm">
                              {startTime.toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {startTime.toLocaleTimeString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs sm:text-sm">
                            TBD
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white text-xs sm:text-sm"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
