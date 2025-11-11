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
    // Parse FEN to detect check
    const fenParts = fen.split(" ");
    const isWhiteToMove = fenParts[1] === "w";

    // Simplified check detection - can be enhanced with chess.js
    if (fen) {
      // Return empty for now - enhanced check highlighting would go here
      return {};
    }
    return {};
  }, [fen]);

  return (
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
  );
};
