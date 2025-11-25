"use client";

import React, { type FC } from "react";
import { useChessGameContext } from "@/context/chess-game-context";
import { GameSetup } from "./game-setup";
import { GameLayout } from "./game-layout";
import { GameBoard } from "./game-board";
import { PlayerTimer } from "./player-timer";
import { GameInfoSidebar } from "./game-info-sidebar";
import { GameControls } from "./game-controls";
import { useToast } from "@/hooks/use-toast";

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
    playersInfo,
    whiteTime,
    blackTime,
    isWhiteTimeLow,
    isBlackTimeLow,
    logs,
    game,
  } = useChessGameContext();
  const { toast } = useToast();
  const deliveredLogIds = React.useRef<Set<string>>(new Set());

  const shouldNotify = React.useCallback((message: string | undefined) => {
    if (!message) return false;
    const patterns = [
      /game over/i,
      /draw offer accepted/i,
      /match ended/i,
      /won by/i,
      /timeout/i,
    ];
    return patterns.some((pattern) => pattern.test(message));
  }, []);

  React.useEffect(() => {
    logs.forEach((entry) => {
      if (!entry?.id || deliveredLogIds.current.has(entry.id)) return;
      deliveredLogIds.current.add(entry.id);
      if (!shouldNotify(entry.message)) return;
      const variant: "default" | "destructive" =
        entry.color && /(ff4444|ff6666|red|error)/i.test(entry.color)
          ? "destructive"
          : "default";
      toast({
        title: entry.message,
        description: entry.timestamp
          ? new Date(entry.timestamp).toLocaleTimeString()
          : undefined,
        variant,
      });
    });
  }, [logs, toast, shouldNotify]);
  const currentTurn = game?.turn?.() === "w" ? "white" : "black";

  // Look up resolved Player objects from cache; fall back to id if not resolved yet
  // Add defensive checks for undefined players object
  const whitePlayer = players?.white
    ? playersInfo[players.white] ?? players.white
    : null;
  const blackPlayer = players?.black
    ? playersInfo[players.black] ?? players.black
    : null;

  const formatPlayerName = (player: typeof whitePlayer) => {
    if (!player) return "Awaiting player";
    if (typeof player === "string") return player;
    return player.alias ?? player.name ?? player._id.slice(0, 12);
  };

  const formatPlayerRating = (player: typeof whitePlayer) => {
    if (!player || typeof player === "string") return "";
    const rating = player.rating ?? player.elo;
    return rating ? `• ${rating}` : "";
  };

  if (!isGameActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white py-10">
        <GameSetup
          onJoinGame={joinGame}
          gameId={gameId}
          setGameId={setGameId}
          disabled={!isConnected || !authUserId}
          players={players}
          playersInfo={playersInfo}
          myColor={myColor}
          authUserId={authUserId}
          isConnected={isConnected}
        />
        {/* LogPanel kept for development debugging within ./log-panel.tsx */}
      </div>
    );
  }

  const boardTimers = {
    white: (
      <PlayerTimer
        player={whitePlayer}
        time={whiteTime}
        isCurrentTurn={currentTurn === "white"}
        isMyInfo={myColor === "white"}
        isLowTime={isWhiteTimeLow}
        variant="arena"
        label="White"
      />
    ),
    black: (
      <PlayerTimer
        player={blackPlayer}
        time={blackTime}
        isCurrentTurn={currentTurn === "black"}
        isMyInfo={myColor === "black"}
        isLowTime={isBlackTimeLow}
        variant="arena"
        label="Black"
      />
    ),
  };

  const infoColumn = (
    <>
      <section className="bg-[#302E2C] p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.45)] space-y-5">
        <div className="text-[10px] uppercase tracking-[0.55em] text-[#f1d9b7]">
          Premier Chess Championship
        </div>
        <div className="space-y-2 text-sm">
          <div>
            <div className="text-xs tracking-[0.4em] text-[#8f8579]">White</div>
            <div className="flex items-center justify-between text-base font-semibold text-white">
              <span>{formatPlayerName(whitePlayer)}</span>
              <span className="text-sm text-[#d6c4ac]">
                {formatPlayerRating(whitePlayer) || "• —"}
              </span>
            </div>
          </div>
          <div className="h-px bg-[#3b332b]" />
          <div>
            <div className="text-xs tracking-[0.4em] text-[#8f8579]">Black</div>
            <div className="flex items-center justify-between text-base font-semibold text-white">
              <span>{formatPlayerName(blackPlayer)}</span>
              <span className="text-sm text-[#d6c4ac]">
                {formatPlayerRating(blackPlayer) || "• —"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-orange-500 text-white shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.5), transparent 45%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.35), transparent 40%)",
          }}
        />
        <div className="relative flex flex-col justify-between h-[440px] p-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.6em]">Feature Ad</p>
            <h3 className="mt-3 text-2xl font-bold leading-snug">
              Greatness starts
              <br />
              from breakfast.
            </h3>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.45em]">287 × 443</p>
            <p className="text-sm">Premium vertical placement</p>
          </div>
        </div>
      </section>
    </>
  );

  const boardColumn = (
    <section className="bg-[#302E2C]/0">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {boardTimers.black}
          <div
            className="mx-auto w-full"
            style={{ maxWidth: "min(560px, 90vw)" }}
          >
            <GameBoard />
          </div>
          {boardTimers.white}
        </div>
        <GameControls />
      </div>
    </section>
  );

  const detailsColumn = <GameInfoSidebar />;

  return (
    <div className="chess-ui flex min-h-screen w-full justify-center px-4 py-8 text-white">
      <GameLayout
        infoColumn={infoColumn}
        boardColumn={boardColumn}
        detailsColumn={detailsColumn}
      />
    </div>
  );
};
