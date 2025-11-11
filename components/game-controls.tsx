"use client";

import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FlipVertical, Flag, Handshake, Download } from "lucide-react";
import { useChessGameContext } from "@/context/chess-game-context";

/**
 * Game control buttons and actions
 * Handles resign, draw offers, board flip, and PGN export
 * Enhanced with draw offer state management and rejection
 */
export const GameControls: FC = () => {
  const {
    myColor,
    isGameActive,
    gameResult,
    drawOffer,
    boardOrientation,
    setBoardOrientation,
    resign,
    offerDraw,
    acceptDraw,
    rejectDraw,
    game,
    addLog,
  } = useChessGameContext();

  // Get current turn from context
  const isMyTurn =
    (myColor === "white" && game?.turn() === "w") ||
    (myColor === "black" && game?.turn() === "b");

  const handleExportPgn = () => {
    const pgn = game?.pgn?.() || "";
    addLog("PGN: " + (pgn || "No moves made yet."), "#aaccff");
  };

  return (
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setBoardOrientation(
                boardOrientation === "white" ? "black" : "white"
              )
            }
            className="bg-gray-700 border-gray-600 hover:bg-gray-600"
          >
            <FlipVertical className="mr-2 h-4 w-4" />
            Flip Board
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportPgn}
            className="bg-gray-700 border-gray-600 hover:bg-gray-600"
            disabled={game?.moves().length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export PGN
          </Button>
        </div>

        {isGameActive && !gameResult && myColor !== "observer" && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-700">
            {drawOffer.isPending && !drawOffer.isOfferedByMe ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-yellow-800 hover:bg-yellow-800 cursor-not-allowed text-white hover:text-white"
                  disabled
                  // onClick={acceptDraw}
                >
                  <Handshake className="mr-2 h-4 w-4" />
                  Draw Pending
                </Button>
                {/* <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                  onClick={rejectDraw}
                >
                  Reject
                </Button> */}
              </>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!isMyTurn || drawOffer.isPending}
                    className="bg-gray-700 border-gray-600 hover:bg-gray-600 disabled:opacity-50"
                  >
                    <Handshake className="mr-2 h-4 w-4" />
                    {drawOffer.isPending && drawOffer.isOfferedByMe
                      ? "Draw Pending..."
                      : "Offer Draw"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Offer Draw</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to offer a draw to your opponent?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 border-gray-600 hover:bg-gray-600">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={offerDraw}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Offer Draw
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Flag className="mr-2 h-4 w-4" />
                  Resign
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Resign Game</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to resign? This will end the game
                    immediately.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-700 border-gray-600 hover:bg-gray-600">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={resign}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Resign
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
