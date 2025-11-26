"use client";

import { type FC, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { PlayerInfo } from "@/lib/chess-types";
import type { Player } from "@/types/player";
import { useToast } from "@/hooks/use-toast";
import { Crown, Shield, PlugZap, Copy, Share2 } from "lucide-react";

interface GameSetupProps {
  onJoinGame: (gameId: string) => void;
  gameId: string;
  setGameId: (id: string) => void;
  disabled: boolean;
  players: PlayerInfo;
  playersInfo: Record<string, Player | null>;
  myColor: "white" | "black" | "observer" | null;
  authUserId: string | null;
  isConnected: boolean;
}

/**
 * Form for joining or creating a chess game
 * Accepts a game ID and initiates the join/create process
 */
export const GameSetup: FC<GameSetupProps> = ({
  onJoinGame,
  gameId,
  setGameId,
  disabled,
  players,
  playersInfo,
  myColor,
  authUserId,
  isConnected,
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const trimmedGameId = gameId.trim();
  const isReadyToJoin = Boolean(trimmedGameId);
  const sharePath =
    trimmedGameId.length > 0 ? `/player/play?gameId=${trimmedGameId}` : null;

  const renderSeat = (color: "white" | "black") => {
    const seatPlayerId = players[color];
    const profile = seatPlayerId ? playersInfo[seatPlayerId] : null;
    const isMine = seatPlayerId && authUserId && seatPlayerId === authUserId;
    const fallbackId = seatPlayerId
      ? `${seatPlayerId.slice(0, 6)}…${seatPlayerId.slice(-4)}`
      : "Open Slot";
    const displayName = profile?.alias || profile?.name || fallbackId;
    const badgeLabel = seatPlayerId ? (isMine ? "You" : "Locked") : "Open";
    const badgeTone = seatPlayerId
      ? isMine
        ? "bg-emerald-500/20 text-emerald-200"
        : "bg-indigo-500/20 text-indigo-100"
      : "bg-gray-700 text-gray-200";
    const borderTone = seatPlayerId
      ? isMine
        ? "border-emerald-500/40"
        : "border-indigo-500/30"
      : "border-dashed border-gray-700";
    const icon =
      color === "white" ? (
        <Crown className="h-5 w-5 text-amber-300" />
      ) : (
        <Shield className="h-5 w-5 text-sky-300" />
      );

    return (
      <div
        key={color}
        className={`rounded-3xl border bg-gradient-to-br from-[#1f1b16] via-[#1c1a17] to-[#161412] p-5 shadow-inner shadow-black/40 ${borderTone} space-y-3`}
      >
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-gray-400">
          <span className="flex items-center gap-2 text-gray-200">
            {icon}
            {color === "white" ? "White" : "Black"} Seat
          </span>
          <Badge
            variant="secondary"
            className={`${badgeTone} border-transparent text-[10px] px-2 py-0.5`}
          >
            {badgeLabel}
          </Badge>
        </div>
        <p className="text-lg font-semibold text-white">{displayName}</p>
        <p className="text-xs text-gray-400">
          {seatPlayerId
            ? isMine
              ? "You are checked in for this board."
              : "Opponent already claimed this color."
            : "First player to join locks in this color."}
        </p>
      </div>
    );
  };

  const handleCopy = async () => {
    if (!trimmedGameId) {
      toast({
        title: "Match ID required",
        description: "Enter or paste the code you received.",
        variant: "destructive",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(trimmedGameId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast({
        title: "Match ID copied",
        description: trimmedGameId,
      });
    } catch (error) {
      console.error("Failed to copy match id", error);
      toast({
        title: "Copy failed",
        description: "Use Ctrl + C as a fallback.",
        variant: "destructive",
      });
    }
  };

  const handleJoin = () => {
    if (!trimmedGameId) {
      toast({
        title: "Match ID required",
        description: "Enter or paste the code you received.",
        variant: "destructive",
      });
      return;
    }
    if (disabled) {
      toast({
        title: "Still getting things ready",
        description:
          "We will enable the board once you are connected and authenticated.",
      });
      return;
    }
    toast({
      title: "Joining lobby",
      description: `Match ${trimmedGameId}`,
    });
    onJoinGame(trimmedGameId);
  };

  return (
    <Card className="relative w-full max-w-5xl mx-auto overflow-hidden border border-amber-500/20 bg-[#0f0e0c] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(246, 211, 139, 0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(119, 136, 255, 0.15), transparent 45%), linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 70%)",
        }}
      />
      <CardHeader className="relative space-y-3 pb-2">
        <p className="text-[10px] uppercase tracking-[0.6em] text-amber-300">
          Tournament Lobby
        </p>
        <CardTitle className="text-3xl font-semibold text-white">
          Match Lobby
        </CardTitle>
        <CardDescription className="text-sm text-gray-300">
          Share the lobby link or enter a match ID to claim your seat before the
          clocks start.
        </CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-6">
        {(!isConnected || !authUserId) && (
          <Alert
            variant={isConnected ? "default" : "destructive"}
            className={`border ${
              isConnected
                ? "border-amber-400/60 bg-amber-900/20 text-amber-100"
                : "border-red-500/40 bg-red-900/40 text-red-100"
            }`}
          >
            <div className="flex items-start gap-3">
              <PlugZap className="h-5 w-5" />
              <div>
                <AlertTitle className="text-sm font-semibold">
                  {isConnected
                    ? "Sign in to secure your board"
                    : "Reconnecting to the arbiter"}
                </AlertTitle>
                <AlertDescription className="text-xs text-inherit">
                  {isConnected
                    ? "Authenticated players can claim a color as soon as the match opens."
                    : "Your client will auto-join once the socket link is restored."}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <Badge
            variant="outline"
            className={`border ${
              isConnected
                ? "border-emerald-500/40 text-emerald-200"
                : "border-red-500/40 text-red-200"
            } bg-transparent uppercase tracking-[0.3em]`}
          >
            {isConnected ? "Socket Online" : "Socket Offline"}
          </Badge>
          <Badge
            variant="outline"
            className="border border-gray-600 text-gray-100 bg-transparent uppercase tracking-[0.3em]"
          >
            {authUserId ? "Identity Verified" : "Guest Session"}
          </Badge>
          {myColor && (
            <Badge className="bg-indigo-600/30 text-indigo-100 border border-indigo-400/40 uppercase tracking-[0.3em]">
              You Are {myColor}
            </Badge>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(["white", "black"] as const).map((color) => renderSeat(color))}
        </div>

        {/* <div className="space-y-4 rounded-3xl border border-gray-700/60 bg-black/40 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-[0.3em] text-gray-400">
                Match ID
              </Label>
              {trimmedGameId ? (
                <p className="font-mono text-base tracking-[0.2em] text-white">
                  {trimmedGameId}
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  Paste an ID to load this lobby.
                </p>
              )}
            </div>
            {sharePath && (
              <p className="flex items-center gap-2 text-xs text-gray-300">
                <Share2 className="h-4 w-4" />
                <span className="font-mono">{sharePath}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="gameId"
              placeholder="e.g. ROUND4-TBL3"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="flex-1 bg-gray-900/70 border-gray-700 text-white"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={!trimmedGameId}
                onClick={handleCopy}
                className="bg-gray-900/60 border-gray-700 text-gray-100"
              >
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied" : "Copy ID"}
              </Button>
              <Button
                onClick={handleJoin}
                disabled={!isReadyToJoin || disabled}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {disabled ? "Connecting..." : "Join Match"}
              </Button>
            </div>
          </div>

          {myColor && (
            <p className="text-xs text-indigo-200">
              You are currently assigned to the {myColor} pieces.
            </p>
          )}
        </div> */}
      </CardContent>
    </Card>
  );
};
