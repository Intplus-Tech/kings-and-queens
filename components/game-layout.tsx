"use client";

import type { FC, ReactNode } from "react";

interface GameLayoutProps {
  infoColumn: ReactNode;
  boardColumn: ReactNode;
  detailsColumn: ReactNode;
}

/**
 * Three-column tournament layout inside a single container.
 * Ensures info, board, and insights columns share equal height.
 */
export const GameLayout: FC<GameLayoutProps> = ({
  infoColumn,
  boardColumn,
  detailsColumn,
}) => (
  <div className="w-full max-w-[1280px]">
    <div className="bg-[#302E2C] p-3 sm:p-5 lg:p-6 shadow-[0_30px_70px_rgba(0,0,0,0.65)]">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_320px] items-stretch">
        <div className="order-2 flex h-full flex-col gap-4 lg:order-1">
          {infoColumn}
        </div>
        <div className="order-1 flex h-full flex-col gap-4 lg:order-2">
          {boardColumn}
        </div>
        <div className="order-3 flex h-full flex-col gap-4 lg:order-3 lg:col-span-2 xl:col-span-1">
          {detailsColumn}
        </div>
      </div>
    </div>
  </div>
);

export default GameLayout;
