"use client";

import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface GameStatusProps {
  myColor: "white" | "black" | "observer" | null;
  gameResult: string | null;
}

/**
 * Displays current game status and player color
 * Shows game over information if game has ended
 */
export const GameStatus: FC<GameStatusProps> = ({ myColor, gameResult }) => (
  <Card className="bg-gray-800 border-gray-700 text-white">
    <CardHeader className="py-2">
      <CardTitle className="text-lg">Status</CardTitle>
    </CardHeader>
    <CardContent>
      <Badge className="bg-indigo-600 hover:bg-indigo-700">
        You are playing as:{" "}
        <strong className="ml-1 capitalize">{myColor || "waiting..."}</strong>
      </Badge>
      {gameResult && (
        <div className="mt-4 p-4 bg-red-800 text-white rounded-lg">
          <h3 className="font-bold text-lg">Game Over</h3>
          <p>{gameResult}</p>
        </div>
      )}
    </CardContent>
  </Card>
);
