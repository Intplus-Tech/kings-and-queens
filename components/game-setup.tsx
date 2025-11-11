"use client";

import type { FC } from "react";
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

interface GameSetupProps {
  onJoinGame: (gameId: string) => void;
  gameId: string;
  setGameId: (id: string) => void;
  disabled: boolean;
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
}) => {
  const handleJoin = () => {
    onJoinGame(gameId);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Join or Create Game</CardTitle>
        <CardDescription>
          Enter a Game ID. If it exists, you'll join. If not, a new game will be
          created with this ID.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="gameId">Game ID</Label>
          <Input
            id="gameId"
            placeholder="Enter Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="flex-1 bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <Button
          onClick={handleJoin}
          disabled={!gameId.trim() || disabled}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          size="lg"
        >
          {disabled ? "Connecting..." : "Join / Create Game"}
        </Button>
      </CardContent>
    </Card>
  );
};
