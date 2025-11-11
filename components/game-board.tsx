"use client";

import { type FC, useMemo } from "react";
import { Chessboard } from "react-chessboard";
import type { Square } from "chess.js";
import { useChessGameContext } from "@/context/chess-game-context";

/**
 * Chessboard container component
 * Handles move dropping, board orientation, and check highlighting
 */
export const GameBoard: FC = () => {
  const { fen, myColor, isGameActive, gameResult, boardOrientation, makeMove } =
    useChessGameContext();

  const { game } = useChessGameContext() as any; // Access game for check detection

  // Calculate current turn
  const getCurrentTurn = (): "white" | "black" => {
    const board = (global as any)?.Chess?.prototype?.turn || "w";
    return board === "w" ? "white" : "black";
  };

  const isMyTurn =
    (myColor === "white" && fen.includes(" w ")) ||
    (myColor === "black" && fen.includes(" b "));

  // Handle piece drop
  const onDrop = (sourceSquare: Square, targetSquare: Square): boolean => {
    if (!isGameActive || !myColor || gameResult) return false;
    if (!isMyTurn) return false;

    const success = makeMove(sourceSquare, targetSquare);
    return success;
  };

  // Highlight king when in check
  const squareStyles = useMemo(() => {
    try {
      // Prefer chess.js built-in detection when available
      const inCheck =
        typeof game?.in_check === "function"
          ? game.in_check()
          : typeof game?.isCheck === "function"
          ? game.isCheck()
          : false;
      const inCheckmate =
        typeof game?.in_checkmate === "function"
          ? game.in_checkmate()
          : typeof game?.isCheckmate === "function"
          ? game.isCheckmate()
          : false;

      if (!inCheck && !inCheckmate) return {};

      const kingColor = typeof game?.turn === "function" ? game.turn() : null; // 'w' or 'b' (side to move)
      const board = typeof game?.board === "function" ? game.board() : null;
      if (!board || !kingColor) return {};

      // find king square (the king of the side to move is the one being checked)
      for (let r = 0; r < board.length; r++) {
        for (let f = 0; f < board[r].length; f++) {
          const piece = board[r][f];
          if (!piece) continue;
          const isKing = piece.type === "k" || piece.type === "K";
          const colorMatches =
            (kingColor === "w" && piece.color === "w") ||
            (kingColor === "b" && piece.color === "b");
          if (isKing && colorMatches) {
            const file = String.fromCharCode(97 + f); // a-h
            const rank = 8 - r; // 8-1
            const square = `${file}${rank}`;

            // Use a strong radial gradient for check, and a darker variant for checkmate
            const background = inCheckmate
              ? "radial-gradient(circle, rgba(255,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%)"
              : "radial-gradient(circle, rgba(255,0,0,0.85) 0%, rgba(255,0,0,0.12) 60%, transparent 70%)";

            return {
              [square]: {
                background,
                boxShadow: inCheckmate
                  ? "0 0 30px 8px rgba(255,0,0,0.6)"
                  : "0 0 18px 4px rgba(255,0,0,0.45)",
                transition: "box-shadow 300ms ease, background 300ms ease",
              },
            };
          }
        }
      }
    } catch (e) {
      // ignore and return no styles
      return {};
    }

    return {};
  }, [fen]);

  const inCheck =
    typeof game?.in_check === "function"
      ? game.in_check()
      : typeof game?.isCheck === "function"
      ? game.isCheck()
      : false;
  const inCheckmate =
    typeof game?.in_checkmate === "function"
      ? game.in_checkmate()
      : typeof game?.isCheckmate === "function"
      ? game.isCheckmate()
      : false;

  return (
    <div className="relative">
      <Chessboard
        position={fen}
        onPieceDrop={onDrop}
        boardOrientation={boardOrientation}
        arePiecesDraggable={!gameResult && isMyTurn}
        customSquareStyles={squareStyles}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
        }}
      />

      {/* Overlay banner for check / checkmate */}
      {(inCheck || inCheckmate) && (
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
          <div
            className={`mt-4 rounded-md px-4 py-2 font-semibold text-white ${
              inCheckmate ? "bg-red-700/90" : "bg-orange-600/90"
            }`}
            style={{ backdropFilter: "blur(4px)" }}
          >
            {inCheckmate ? "Checkmate" : "Check"}
          </div>
        </div>
      )}
    </div>
  );
};
