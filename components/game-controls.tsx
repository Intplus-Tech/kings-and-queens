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

  const showActionRow = isGameActive && !gameResult && myColor !== "observer";

  return (
    <Card className="bg-[#302E2C]/0 text-white border-0 w-full">
      <CardHeader className=" sr-only">
        <CardTitle className="text-sm uppercase tracking-[0.35em] text-[#bda98d] sr-only">
          Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setBoardOrientation(
                boardOrientation === "white" ? "black" : "white"
              )
            }
            className="bg-[#2a241f] border-[#45382f] text-[#e7d8c1] hover:bg-[#3a2f27] w-full"
          >
            <FlipVertical className="mr-2 h-4 w-4" />
            Flip Board
          </Button>
          {/* <Button
            variant="outline"
            size="sm"
            onClick={handleExportPgn}
            className="bg-[#2a241f] border-[#45382f] text-[#e7d8c1] hover:bg-[#3a2f27] w-full"
            disabled={game?.moves().length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export PGN
          </Button> */}
          {showActionRow && (
            <div className="w-full">
              {drawOffer.isPending && !drawOffer.isOfferedByMe ? (
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-[#a86f26] hover:bg-[#a86f26] cursor-not-allowed text-white w-full"
                  disabled
                >
                  <Handshake className="mr-2 h-4 w-4" />
                  Draw Pending
                </Button>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!isMyTurn || drawOffer.isPending}
                      className="bg-[#2a241f] border-[#45382f] text-[#e7d8c1] hover:bg-[#3a2f27] disabled:opacity-40 w-full"
                    >
                      <Handshake className="mr-2 h-4 w-4" />
                      {drawOffer.isPending && drawOffer.isOfferedByMe
                        ? "Draw Pending..."
                        : "Offer Draw"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-[#1f1a16] border-[#3a2f27] text-white">
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
            </div>
          )}

          {showActionRow && (
            <div className="w-full">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="w-full">
                    <Flag className="mr-2 h-4 w-4" />
                    Resign
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#1f1a16] border-[#3a2f27] text-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Resign Game</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to resign? This will end the game
                      immediately.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-[#2a241f] border-[#45382f] text-white hover:bg-[#3a2f27]">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={resign}
                      className="bg-[#c44734] hover:bg-[#a73628]"
                    >
                      Resign
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
