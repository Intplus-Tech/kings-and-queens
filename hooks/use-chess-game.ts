"use client"

import { useState, useCallback } from "react"
import { Chess, type Square, type Move } from "chess.js"

/**
 * Hook for managing core chess.js game logic
 * Handles move validation, game state, and history tracking
 */
export const useChessGame = () => {
  const [game, setGame] = useState(new Chess())
  const [fen, setFen] = useState(game.fen())
  const [moveHistory, setMoveHistory] = useState<string[]>([])

  // Reset game to starting position
  const resetGame = useCallback(() => {
    const newGame = new Chess()
    setGame(newGame)
    setFen(newGame.fen())
    setMoveHistory([])
  }, [])

  // Load game from FEN
  const loadGameFromFen = useCallback((newFen: string) => {
    const newGame = new Chess(newFen)
    setGame(newGame)
    setFen(newFen)
    setMoveHistory(newGame.history())
  }, [])

  // Make a move and update game state
  const makeMove = useCallback(
    (from: Square, to: Square, promotion?: string): Move | null => {
      const gameCopy = new Chess(fen)
      let move: Move | null = null

      try {
        move = gameCopy.move({
          from,
          to,
          promotion: promotion || "q",
        })
      } catch (e) {
        return null
      }

      if (move === null) {
        return null
      }

      setGame(gameCopy)
      setFen(gameCopy.fen())
      setMoveHistory(gameCopy.history())

      return move
    },
    [fen],
  )

  // Check if a move is legal
  const isMoveLegal = useCallback(
    (from: Square, to: Square): boolean => {
      const gameCopy = new Chess(fen)
      const moves = gameCopy.moves({ square: from, verbose: true })
      return moves.some((m) => m.to === to)
    },
    [fen],
  )

  // Get all legal moves
  const getLegalMoves = useCallback(
    (square: Square): string[] => {
      const gameCopy = new Chess(fen)
      const moves = gameCopy.moves({ square, verbose: true })
      return moves.map((m) => m.to)
    },
    [fen],
  )

  // Check if game is in check
  const isInCheck = useCallback(() => {
    return game.isCheck()
  }, [game])

  // Check if game is in checkmate
  const isCheckmate = useCallback(() => {
    return game.isCheckmate()
  }, [game])

  // Check if game is a draw
  const isDraw = useCallback(() => {
    return game.isDraw()
  }, [game])

  // Get current turn
  const getCurrentTurn = useCallback((): "white" | "black" => {
    return game.turn() === "w" ? "white" : "black"
  }, [game])

  // Get game PGN
  const getPgn = useCallback((): string => {
    return game.pgn() || ""
  }, [game])

  return {
    game,
    fen,
    moveHistory,
    resetGame,
    loadGameFromFen,
    makeMove,
    isMoveLegal,
    getLegalMoves,
    isInCheck,
    isCheckmate,
    isDraw,
    getCurrentTurn,
    getPgn,
  }
}
