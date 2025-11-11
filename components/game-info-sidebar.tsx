"use client";

import type { FC } from "react";
import { useChessGameContext } from "@/context/chess-game-context";
import { GameStatus } from "./game-status";
import { CapturedPiecesDisplay } from "./captured-pieces";
import { MoveHistoryPanel } from "./move-history-panel";
import { GameControls } from "./game-controls";
import { LogPanel } from "./log-panel";
import { DrawOfferModal } from "./draw-offer-modal";
import { DrawOfferNotification } from "./draw-offer-notification";

/**
 * Right sidebar container for game info and controls
 * Composes multiple info panels for organized layout
 * Added draw offer modal and notification components
 */
export const GameInfoSidebar: FC = () => {
  const { myColor, gameResult, capturedPieces, moveHistory, logs, clearLogs } =
    useChessGameContext();

  return (
    <>
      <GameStatus myColor={myColor} gameResult={gameResult} />
      <CapturedPiecesDisplay captured={capturedPieces} />
      <MoveHistoryPanel moveHistory={moveHistory} />
      <GameControls />
      <LogPanel logs={logs} onClear={clearLogs} />
      <DrawOfferModal />
      <DrawOfferNotification />
    </>
  );
};
