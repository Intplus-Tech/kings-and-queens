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
import Image from "next/image";
import { useState } from "react";
import type { Schedule, Match } from "@/types/schedule";
import type { PlayerData } from "@/types/user";

interface UpcomingMatchProps {
  currentUserId: string;
  currentUserName: string;
  schedules: Schedule[];
  allMatches: Match[];
  authToken?: string;
}

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
  player1Data?: PlayerData;
  player2Data?: PlayerData;
}

export function UpcomingMatch({
  currentUserId,
  currentUserName,
  schedules: initialSchedules = [],
  allMatches: initialMatches = [],
}: UpcomingMatchProps) {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [allMatches, setAllMatches] = useState<MatchWithGame[]>(initialMatches);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find the closest upcoming match from all matches
  const getUpcomingMatch = () => {
    const now = new Date();
    let upcomingMatch: {
      match: MatchWithGame;
      tournament: string;
      round: number;
    } | null = null;

    for (const match of allMatches) {
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

  if (error) {
    return (
      <div className="text-center text-red-400">
        <p>Error loading schedules: {error}</p>
      </div>
    );
  }

  const upcomingMatchData = upcomingGame ? upcomingGame : null;

  return (
    <div className="space-y-6">
      {/* Upcoming Match Card */}
      {upcomingMatchData &&
        (upcomingMatchData.match.gameData?.startTime ||
          upcomingMatchData.match.game?.startTime) && (
          <Card className="bg-[url('/upcoming.jpg')] bg-center bg-cover border-indigo-500/20">
            <CardHeader>
              <CardTitle className="text-white font-normal text-lg">
                Your Upcoming Match
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">
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
                  <p className="text-muted-foreground">
                    {upcomingMatchData.tournament} - Round{" "}
                    {upcomingMatchData.round}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/placeholder.svg?height=40&width=40&text=P1"
                        alt="Player 1"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-sm font-semibold">
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
                      <p className="text-sm font-bold">VS</p>
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
                      <div>
                        <p className="text-sm font-semibold">
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

                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Join Game
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Scheduled Matches Table */}
      <Card className="border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Scheduled Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-800/50">
                  <TableHead className="text-gray-300">Tournament</TableHead>
                  <TableHead className="text-gray-300">Round</TableHead>
                  <TableHead className="text-gray-300">Player 1</TableHead>
                  <TableHead className="text-gray-300">Player 2</TableHead>
                  <TableHead className="text-gray-300">Start Time</TableHead>
                  <TableHead className="text-gray-300 text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allMatches.map((match, idx) => {
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
                      <TableCell className="font-medium text-gray-100">
                        {schedules
                          .find((s) => s.matches.includes(match))
                          ?.tournament.name.slice(0, 20)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {
                          schedules.find((s) => s.matches.includes(match))
                            ?.round
                        }
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {match.player1 === currentUserId ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-900/30 text-green-300"
                          >
                            You
                          </Badge>
                        ) : (
                          <span className="text-sm">
                            {match.player1Data
                              ? match.player1Data.name ||
                                match.player1Data.alias
                              : "Player"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {match.player2 === currentUserId ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-900/30 text-green-300"
                          >
                            You
                          </Badge>
                        ) : (
                          <span className="text-sm">
                            {match.player2Data
                              ? match.player2Data.name ||
                                match.player2Data.alias
                              : "Opponent"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300 text-sm">
                        {startTime ? (
                          <div>
                            <div>{startTime.toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">
                              {startTime.toLocaleTimeString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">TBD</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white"
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
    </div>
  );
}
