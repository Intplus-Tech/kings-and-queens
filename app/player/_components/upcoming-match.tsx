"use client";

import type { Schedule, Match } from "@/types/schedule";
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
}

export function UpcomingMatch({
  currentUserId,
  schedules = [],
  allMatches = [],
  compact = false,
}: UpcomingMatchProps) {
  const typedMatches = allMatches as MatchWithGame[];

  return (
    <div className="space-y-6">
      <UpcomingMatchCard
        schedules={schedules}
        allMatches={typedMatches}
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
