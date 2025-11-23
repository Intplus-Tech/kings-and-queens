"use client";

import type { Schedule, Match, ScheduleMatchPlayer } from "@/types/schedule";
import { UpcomingMatchCard } from "./upcoming-match-card";
import { ScheduledMatchesTable } from "./scheduled-matches-table";

interface UpcomingMatchProps {
  currentUserId: string;
  currentUserName: string;
  schedules: Schedule[];
  allMatches: Match[];
  compact?: boolean;
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
  player1Data?: ScheduleMatchPlayer;
  player2Data?: ScheduleMatchPlayer;
}

export function UpcomingMatch({
  currentUserId,
  schedules = [],
  allMatches = [],
  compact = false,
}: UpcomingMatchProps) {
  const typedMatches = allMatches as MatchWithGame[];
  const participantMatches = typedMatches.filter(
    (match) =>
      match.player1 === currentUserId || match.player2 === currentUserId
  );

  return (
    <div className="space-y-6">
      <UpcomingMatchCard
        schedules={schedules}
        allMatches={participantMatches}
        currentUserId={currentUserId}
      />
      <ScheduledMatchesTable
        schedules={schedules}
        allMatches={typedMatches}
        currentUserId={currentUserId}
        compact={compact}
      />
    </div>
  );
}
