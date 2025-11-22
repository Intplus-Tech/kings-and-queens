"use client";

import type { FC } from "react";
import { useChessGameContext } from "@/context/chess-game-context";
import { GameStatus } from "./game-status";
import { MoveHistoryPanel } from "./move-history-panel";
import { LogPanel } from "./log-panel";
import { DrawOfferModal } from "./draw-offer-modal";
import { DrawOfferNotification } from "./draw-offer-notification";
import { PlayerTimer } from "./player-timer";
import { getSymbol, sortPieces } from "@/lib/chess-utils";

/**
 * Right sidebar container for game info and controls
 * Composes multiple info panels for organized layout
 * Added draw offer modal and notification components
 */
export const GameInfoSidebar: FC = () => {
  const {
    myColor,
    gameResult,
    capturedPieces,
    moveHistory,
    logs,
    clearLogs,
    players,
    playersInfo,
    whiteTime,
    blackTime,
    isWhiteTimeLow,
    isBlackTimeLow,
    game,
  } = useChessGameContext();

  const whitePlayer = players?.white
    ? playersInfo[players.white] ?? players.white
    : null;
  const blackPlayer = players?.black
    ? playersInfo[players.black] ?? players.black
    : null;
  const currentTurn = game?.turn?.() === "w" ? "white" : "black";

  const pieceValues: Record<string, number> = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0,
  };

  const captured = capturedPieces ?? { white: [], black: [] };
  const materialScore = (color: "white" | "black") =>
    (captured[color] ?? []).reduce(
      (acc, piece) => acc + (pieceValues[piece.toLowerCase()] ?? 0),
      0
    );

  const whiteMaterial = materialScore("white");
  const blackMaterial = materialScore("black");

  const renderCapturedRow = (
    color: "white" | "black",
    position: "top" | "bottom"
  ) => {
    const pieces = sortPieces(captured[color] ?? []);
    const symbols = pieces.map((piece, index) => (
      <span
        key={`${color}-cap-${index}`}
        className="text-2xl leading-none text-[#f5f4ed]"
      >
        {color === "white"
          ? getSymbol(piece.toUpperCase())
          : getSymbol(piece.toLowerCase())}
      </span>
    ));

    const advantage =
      color === "white"
        ? whiteMaterial - blackMaterial
        : blackMaterial - whiteMaterial;

    return (
      <div
        className={`flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[#7d7a75] ${
          position === "top" ? "pb-2" : "pt-2"
        }`}
      >
        <div className="flex flex-wrap gap-1 text-2xl text-[#fdf8ed]">
          {symbols.length > 0 ? (
            symbols
          ) : (
            <span className="text-[10px] tracking-[0.4em] text-[#4a4641]">
              No captures
            </span>
          )}
        </div>
        <span className="text-[#8df172] text-sm font-semibold tracking-normal">
          {advantage >= 0 ? `+${advantage}` : advantage}
        </span>
      </div>
    );
  };

  const renderPlayerSection = (
    color: "white" | "black",
    position: "top" | "bottom"
  ) => {
    const player = color === "white" ? whitePlayer : blackPlayer;
    const time = color === "white" ? whiteTime : blackTime;
    const isLow = color === "white" ? isWhiteTimeLow : isBlackTimeLow;

    return (
      <div
        className={`space-y-2 ${
          position === "top" ? "pb-4 border-b border-[#2b241f]" : "pt-4"
        }`}
      >
        {position === "top" && renderCapturedRow(color, "top")}
        <PlayerTimer
          player={player}
          time={time}
          isCurrentTurn={currentTurn === color}
          isMyInfo={myColor === color}
          isLowTime={isLow}
          variant="sidebar"
          label={color === "white" ? "White" : "Black"}
        />
        {position === "bottom" && renderCapturedRow(color, "bottom")}
      </div>
    );
  };

  return (
    <>
      <section className="bg-[#302E2C] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.5)] space-y-4">
        {renderPlayerSection("black", "top")}
        <MoveHistoryPanel moveHistory={moveHistory} />
        {renderPlayerSection("white", "bottom")}
      </section>
      {/* i'll only show this when debugging */}
      {/* <LogPanel logs={logs} onClear={clearLogs} /> */}
      <DrawOfferModal />
      <DrawOfferNotification />
    </>
  );
};
