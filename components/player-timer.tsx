"use client";

import type { FC } from "react";
import type { Player } from "@/types/player";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { formatTime } from "@/lib/chess-utils";

interface PlayerTimerProps {
  // Accept either a Player object (when available) or a player id string, or null
  player: Player | string | null;
  time: number; // in ms
  isCurrentTurn: boolean;
  isMyInfo: boolean;
  isLowTime: boolean;
}

/**
 * Displays a player's name and countdown timer
 * Highlights current turn and warns when time is low
 */
export const PlayerTimer: FC<PlayerTimerProps> = ({
  player,
  time,
  isCurrentTurn,
  isMyInfo,
  isLowTime,
}) => {
  const displayName = (() => {
    if (!player) return "Waiting...";
    if (typeof player === "string") return player.slice(0, 12);
    return player.alias ?? player.name ?? player._id.slice(0, 12);
  })();

  const displayRating =
    player &&
    typeof player !== "string" &&
    (player.rating ?? player.elo) !== undefined
      ? String(player.rating ?? player.elo)
      : null;
  return (
    <Card
      className={`transition-all duration-300 ${
        isCurrentTurn
          ? "ring-2 ring-indigo-500 shadow-lg"
          : "ring-1 ring-gray-700"
      }`}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <span
            className={`font-semibold ${
              isMyInfo ? "text-indigo-400" : "text-white"
            }`}
          >
            {displayName}
            {isMyInfo && " (You)"}
            {displayRating && (
              <span className="text-sm text-gray-300 ml-2">
                {displayRating}
              </span>
            )}
          </span>
          <div
            className={`flex items-center gap-2 font-mono text-lg font-bold p-2 rounded ${
              isCurrentTurn
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 text-gray-300"
            } ${isLowTime && isCurrentTurn ? "animate-pulse bg-red-600" : ""} ${
              isLowTime && !isCurrentTurn ? "text-red-400" : ""
            }`}
          >
            <Clock className="h-4 w-4" />
            {formatTime(time)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
