"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Trophy, Handshake, ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChessGameContext } from "@/context/chess-game-context";
import { useToast } from "@/hooks/use-toast";
import type { Player } from "@/types/player";

const titleTokens = {
  win: { label: "Victory", accent: "text-emerald-200" },
  loss: { label: "Defeat", accent: "text-rose-200" },
  draw: { label: "Draw", accent: "text-amber-200" },
  neutral: { label: "Game Complete", accent: "text-slate-200" },
};

type Outcome = keyof typeof titleTokens;

const normalizePlayerName = (
  id: string | null,
  infoMap: Record<string, Player | null>
): string => {
  if (!id) return "—";
  const player = infoMap[id];
  if (!player) return id;
  return player.alias || player.name || player._id?.slice(0, 10) || id;
};

const inferOutcome = (
  message: string,
  winner: "white" | "black" | null,
  myColor: "white" | "black" | "observer" | null
): Outcome => {
  const normalized = message.toLowerCase();
  if (normalized.includes("draw")) return "draw";
  if (!winner) return "neutral";
  if (myColor === "observer" || !myColor) return "neutral";
  return winner === myColor ? "win" : "loss";
};

export const GameResultOverlay: React.FC = () => {
  const { gameResult, gameWinner, players, playersInfo, myColor, game } =
    useChessGameContext();
  const { toast } = useToast();
  const router = useRouter();
  const [isDismissed, setIsDismissed] = React.useState(false);

  React.useEffect(() => {
    setIsDismissed(false);
  }, [gameResult]);

  if (!gameResult || isDismissed) return null;

  const outcome = inferOutcome(gameResult, gameWinner ?? null, myColor);
  const token = titleTokens[outcome];
  const whiteName = normalizePlayerName(players.white, playersInfo);
  const blackName = normalizePlayerName(players.black, playersInfo);

  const annotate = (color: "white" | "black", name: string) => {
    if (!name || name === "—") return name;
    if (myColor === color) return `${name} · You`;
    return name;
  };

  const handleCopyPgn = async () => {
    try {
      const pgn = game?.pgn?.() ?? "";
      if (!pgn) {
        toast({ title: "No moves to export", variant: "destructive" });
        return;
      }
      if (typeof navigator === "undefined" || !navigator.clipboard) {
        toast({ title: "Clipboard unavailable", variant: "destructive" });
        return;
      }
      await navigator.clipboard.writeText(pgn);
      toast({
        title: "PGN copied",
        description: "Paste it anywhere to review.",
      });
    } catch (err) {
      toast({ title: "Unable to copy PGN", variant: "destructive" });
    }
  };

  const detailIcon =
    outcome === "draw" ? (
      <Handshake className="h-5 w-5 text-amber-200" />
    ) : (
      <Trophy
        className={
          outcome === "loss"
            ? "h-5 w-5 text-rose-300"
            : "h-5 w-5 text-emerald-300"
        }
      />
    );

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0c0906]/70 backdrop-blur-sm">
      <div className="pointer-events-auto w-full max-w-md rounded-[28px] border border-white/10 bg-[#221d18]/95 px-7 py-8 text-white shadow-[0_35px_110px_rgba(0,0,0,0.65)]">
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.5em] text-white/50">
          {detailIcon}
          <span className={`${token.accent}`}>{token.label}</span>
        </div>
        <p className="mt-4 text-2xl font-semibold leading-snug text-white">
          {gameResult}
        </p>
        <p className="mt-2 text-sm text-white/70">
          Relive the final position or head back when you are ready.
        </p>

        <div className="mt-6 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/60">
              <span>White</span>
              {gameWinner === "white" && (
                <span className="text-emerald-200">Winner</span>
              )}
            </div>
            <p className="mt-1 text-base font-semibold text-white">
              {annotate("white", whiteName)}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/60">
              <span>Black</span>
              {gameWinner === "black" && (
                <span className="text-emerald-200">Winner</span>
              )}
            </div>
            <p className="mt-1 text-base font-semibold text-white">
              {annotate("black", blackName)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            className="flex-1 bg-[#f1b561] text-black hover:bg-[#f0a543]"
            onClick={() => router.push("/player")}
          >
            Return to Lobby
          </Button>
          <Button
            variant="outline"
            className="flex-1 border-white/30 text-white hover:bg-white/10"
            onClick={() => setIsDismissed(true)}
          >
            Keep Reviewing
          </Button>
        </div>

        <Button
          variant="ghost"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 text-sm text-white/80 hover:bg-white/10"
          onClick={handleCopyPgn}
        >
          <ClipboardCheck className="h-4 w-4" /> Copy PGN
        </Button>
      </div>
    </div>
  );
};
