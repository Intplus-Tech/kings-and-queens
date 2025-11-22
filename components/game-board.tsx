"use client";

import { type CSSProperties, type FC, useMemo } from "react";
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

  // Compute check state and king square (memoized to prevent infinite renders)
  const checkInfo = useMemo(() => {
    const base = {
      inCheck: false,
      inCheckmate: false,
      squareStyles: {} as Record<string, CSSProperties>,
      kingSquare: null as string | null,
    };

    try {
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

      const result = { ...base, inCheck, inCheckmate };

      if (!inCheck && !inCheckmate) {
        return result;
      }

      const kingColor = typeof game?.turn === "function" ? game.turn() : null;
      const board = typeof game?.board === "function" ? game.board() : null;
      if (!board || !kingColor) return result;

      for (let r = 0; r < board.length; r++) {
        for (let f = 0; f < board[r].length; f++) {
          const piece = board[r][f];
          if (!piece) continue;
          const isKing = piece.type === "k" || piece.type === "K";
          const colorMatches =
            (kingColor === "w" && piece.color === "w") ||
            (kingColor === "b" && piece.color === "b");
          if (isKing && colorMatches) {
            const file = String.fromCharCode(97 + f);
            const rank = 8 - r;
            const square = `${file}${rank}`;

            const background = inCheckmate
              ? "radial-gradient(circle, rgba(255,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%)"
              : "radial-gradient(circle, rgba(255,0,0,0.85) 0%, rgba(255,0,0,0.12) 60%, transparent 70%)";

            result.squareStyles = {
              [square]: {
                background,
                boxShadow: inCheckmate
                  ? "0 0 30px 8px rgba(255,0,0,0.6)"
                  : "0 0 18px 4px rgba(0,0,0,0.45)",
                transition: "box-shadow 300ms ease, background 300ms ease",
              },
            };
            result.kingSquare = square;
            return result;
          }
        }
      }

      return result;
    } catch (e) {
      return base;
    }
  }, [fen]);

  const { squareStyles, kingSquare, inCheck, inCheckmate } = checkInfo;

  const overlayPosition = useMemo(() => {
    if (!kingSquare) return null;
    const fileIndex = kingSquare.charCodeAt(0) - 97;
    const rank = parseInt(kingSquare[1], 10);
    if (Number.isNaN(fileIndex) || Number.isNaN(rank)) return null;

    const squarePercent = 100 / 8;
    const halfSquare = squarePercent / 2;

    let column: number;
    let row: number;

    if (boardOrientation === "white") {
      column = fileIndex;
      row = 8 - rank;
    } else {
      column = 7 - fileIndex;
      row = rank - 1;
    }

    return {
      top: `${row * squarePercent + halfSquare}%`,
      left: `${column * squarePercent + halfSquare}%`,
    };
  }, [kingSquare, boardOrientation]);

  const responsiveBoardSize = "min(560px, 90vw)";

  return (
    <div className="relative w-full">
      <Chessboard
        position={fen}
        onPieceDrop={onDrop}
        boardOrientation={boardOrientation}
        arePiecesDraggable={!gameResult && isMyTurn}
        customSquareStyles={squareStyles}
        customBoardStyle={{
          borderRadius: "0px",
          border: "1px solid #4a3c32",
          boxShadow: "0 25px 60px rgba(0, 0, 0, 0.55)",
          width: "100%",
          maxWidth: responsiveBoardSize,
          margin: "0 auto",
        }}
        customDarkSquareStyle={{ backgroundColor: "#b18763" }}
        customLightSquareStyle={{ backgroundColor: "#f0d9b5" }}
      />

      {/* Overlay banner for check / checkmate */}
      {(inCheck || inCheckmate) && overlayPosition && (
        <div className="pointer-events-none absolute inset-0">
          <div
            className={`absolute rounded-md px-4 py-2 font-semibold text-white ${
              inCheckmate ? "bg-[#c44734]/90" : "bg-[#d98c34]/90"
            }`}
            style={{
              top: overlayPosition.top,
              left: overlayPosition.left,
              transform: "translate(-50%, -130%)",
              backdropFilter: "blur(4px)",
            }}
          >
            {inCheckmate ? "Checkmate" : "Check"}
          </div>
        </div>
      )}
    </div>
  );
};
