"use client";

import type { FC } from "react";
import { useChessGameContext } from "@/context/chess-game-context";
import { GameSetup } from "./game-setup";
import { GameLayout } from "./game-layout";
import { GameBoard } from "./game-board";
import { PlayerTimer } from "./player-timer";
import { GameInfoSidebar } from "./game-info-sidebar";
import { LogPanel } from "./log-panel";

/**
 * Main chess application orchestrator
 * Manages game states and renders appropriate UI
 * Routes between setup and active game views
 */
export const ChessApp: FC = () => {
  const {
    isGameActive,
    gameId,
    setGameId,
    joinGame,
    isConnected,
    authUserId,
    myColor,
    players,
    whiteTime,
    blackTime,
    isWhiteTimeLow,
    isBlackTimeLow,
    logs,
    clearLogs,
  } = useChessGameContext();

  // Get current turn from game context (via game object)
  const { game } = useChessGameContext() as any;
  const currentTurn = game?.turn?.() === "w" ? "white" : "black";
  const isMyTurn =
    (myColor === "white" && currentTurn === "white") ||
    (myColor === "black" && currentTurn === "black");

  if (!isGameActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <GameSetup
          onJoinGame={joinGame}
          gameId={gameId}
          setGameId={setGameId}
          disabled={!isConnected || !authUserId}
        />
        <LogPanel logs={logs} onClear={clearLogs} />
      </div>
    );
  }

  // Active game view
  const whiteTimer = (
    <PlayerTimer
      playerName={players.white}
      time={whiteTime}
      isCurrentTurn={currentTurn === "white"}
      isMyInfo={myColor === "white"}
      isLowTime={isWhiteTimeLow}
    />
  );

  const blackTimer = (
    <PlayerTimer
      playerName={players.black}
      time={blackTime}
      isCurrentTurn={currentTurn === "black"}
      isMyInfo={myColor === "black"}
      isLowTime={isBlackTimeLow}
    />
  );

  const topTimer = myColor === "white" ? blackTimer : whiteTimer;
  const bottomTimer = myColor === "white" ? whiteTimer : blackTimer;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4 font-sans">
      <GameLayout
        leftColumn={
          <>
            {topTimer}
            <GameBoard />
            {bottomTimer}
          </>
        }
        rightColumn={<GameInfoSidebar />}
      />
    </div>
  );
};
