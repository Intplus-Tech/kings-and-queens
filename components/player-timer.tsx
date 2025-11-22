"use client";

import type { FC } from "react";
import type { Player } from "@/types/player";
import { formatTime } from "@/lib/chess-utils";

interface PlayerTimerProps {
  // Accept either a Player object (when available) or a player id string, or null
  player: Player | string | null;
  time: number; // in ms
  isCurrentTurn: boolean;
  isMyInfo: boolean;
  isLowTime: boolean;
  variant?: "arena" | "sidebar";
  label?: string;
}

/**
 * Displays a player's name and countdown timer with two layout variants to match
 * the reference UI (wide arena bars around the board and stacked sidebar cards).
 */
export const PlayerTimer: FC<PlayerTimerProps> = ({
  player,
  time,
  isCurrentTurn,
  isMyInfo,
  isLowTime,
  variant = "arena",
  label,
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
  if (variant === "sidebar") {
    return (
      <div
        className={`relative rounded-2xl border border-[#242424] bg-[#111313]/95 px-4 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.45)] transition-colors ${
          isCurrentTurn ? "ring-1 ring-[#6dde3d]" : "ring-1 ring-transparent"
        }`}
      >
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.4em] text-[#777]">
          <span>{label ?? "Player"}</span>
          {displayRating && (
            <span className="tracking-normal text-xs text-[#bdbdbd]">
              {displayRating}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-end justify-between gap-4">
          <div className="flex flex-col">
            <span
              className={`text-base font-semibold ${
                isMyInfo ? "text-white" : "text-[#e1e1e1]"
              }`}
            >
              {displayName}
              {isMyInfo && " (You)"}
            </span>
          </div>
          <span
            className={`font-mono text-4xl font-bold leading-none ${
              isCurrentTurn ? "text-white" : "text-[#b5b5b5]"
            } ${isLowTime ? "animate-pulse text-[#ffb4a2]" : ""}`}
          >
            {formatTime(time)}
          </span>
        </div>
        <span
          className={`absolute bottom-0 left-0 h-[3px] w-full ${
            isCurrentTurn ? "bg-[#72df3f]" : "bg-[#2f2f2f]"
          }`}
        />
      </div>
    );
  }

  const highlightRing = isCurrentTurn
    ? "shadow-[0_12px_30px_rgba(0,0,0,0.45)] ring-1 ring-[#f7d8a1]/80"
    : "shadow-[0_6px_20px_rgba(0,0,0,0.35)]";

  return (
    <div
      className={`rounded-2xl border border-[#41362d] bg-[#1e1a16] px-4 py-3 sm:px-6 sm:py-4 ${highlightRing}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          {label && (
            <span className="text-[10px] uppercase tracking-[0.45em] text-[#8d8376]">
              {label}
            </span>
          )}
          <span
            className={`font-semibold ${
              isMyInfo ? "text-[#f4d7aa]" : "text-white"
            }`}
          >
            {displayName}
            {isMyInfo && " (You)"}
          </span>
          {displayRating && (
            <span className="text-xs text-[#a29486] mt-0.5">
              {displayRating}
            </span>
          )}
        </div>
        <div
          className={`font-mono font-bold rounded-xl border border-[#3a3028] bg-[#131110] px-3 py-2 text-right text-2xl ${
            isCurrentTurn ? "text-[#f5f0d5]" : "text-[#aca294]"
          } ${isLowTime ? "animate-pulse text-[#ffb4a2]" : ""}`}
        >
          {formatTime(time)}
        </div>
      </div>
    </div>
  );
};
