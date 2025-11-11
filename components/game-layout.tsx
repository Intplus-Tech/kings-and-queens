"use client";

import type { FC, ReactNode } from "react";

interface GameLayoutProps {
  leftColumn: ReactNode;
  rightColumn: ReactNode;
}

/**
 * Two-column layout wrapper for active game
 * Responsive: stacks on mobile, side-by-side on desktop
 */
export const GameLayout: FC<GameLayoutProps> = ({
  leftColumn,
  rightColumn,
}) => (
  <div className="w-full max-w-6xl">
    <h1 className="text-3xl font-bold text-center mb-4 text-indigo-400">
      Multiplayer Chess
    </h1>
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
      {/* Left Column: Board & Timers */}
      <div className="flex flex-col space-y-4">{leftColumn}</div>

      {/* Right Column: Info Panels */}
      <div className="space-y-4">{rightColumn}</div>
    </div>
  </div>
);

export default GameLayout;
