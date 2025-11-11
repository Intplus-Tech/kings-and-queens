"use client"

import { useMemo } from "react"
import type { Chess } from "chess.js"
import type { CapturedPieces } from "@/lib/chess-types"

/**
 * Hook for calculating captured pieces from game state
 * Memoized for performance optimization
 */
export const useCapturedPieces = (game: Chess, fen: string): CapturedPieces => {
  return useMemo(() => {
    const piecesOnBoard = {
      w: { Q: 0, R: 0, B: 0, N: 0, P: 0 },
      b: { q: 0, r: 0, b: 0, n: 0, p: 0 },
    }
    const initialCounts = {
      w: { Q: 1, R: 2, B: 2, N: 2, P: 8 },
      b: { q: 1, r: 2, b: 2, n: 2, p: 8 },
    }

    // Count pieces currently on the board
    game.board().forEach((row) => {
      row.forEach((piece) => {
        if (piece) {
          const type = piece.type.toUpperCase()
          if (piece.color === "w") {
            piecesOnBoard.w[type as keyof typeof piecesOnBoard.w] =
              (piecesOnBoard.w[type as keyof typeof piecesOnBoard.w] || 0) + 1
          } else {
            piecesOnBoard.b[piece.type.toLowerCase() as keyof typeof piecesOnBoard.b] =
              (piecesOnBoard.b[piece.type.toLowerCase() as keyof typeof piecesOnBoard.b] || 0) + 1
          }
        }
      })
    })

    const captured: CapturedPieces = {
      white: [],
      black: [],
    }

      // Determine pieces captured by Black (White's missing pieces)
      ; (Object.keys(initialCounts.w) as Array<keyof typeof initialCounts.w>).forEach((type) => {
        const char = type as "Q" | "R" | "B" | "N" | "P"
        const initial = initialCounts.w[char]
        const current = piecesOnBoard.w[char]
        for (let i = 0; i < initial - current; i++) {
          captured.black.push(char)
        }
      })

      // Determine pieces captured by White (Black's missing pieces)
      ; (Object.keys(initialCounts.b) as Array<keyof typeof initialCounts.b>).forEach((type) => {
        const char = type as "q" | "r" | "b" | "n" | "p"
        const initial = initialCounts.b[char]
        const current = piecesOnBoard.b[char]
        for (let i = 0; i < initial - current; i++) {
          captured.white.push(char)
        }
      })

    return captured
  }, [fen, game])
}
