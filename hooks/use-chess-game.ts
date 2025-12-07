"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Chess, type Square, type Move } from "chess.js"

/**
 * Central chess.js wrapper.
 * Keeps a single authoritative Chess instance, validates moves, and exposes
 * derived state (fen + move history) in React-friendly form.
 */
export const useChessGame = () => {
  const gameRef = useRef(new Chess())
  const [fen, setFen] = useState(gameRef.current.fen())
  const [moveHistory, setMoveHistory] = useState<string[]>([])
  const moveHistoryRef = useRef<string[]>([])

  useEffect(() => {
    moveHistoryRef.current = moveHistory
  }, [moveHistory])

  // Reset game to starting position
  const resetGame = useCallback(() => {
    gameRef.current = new Chess()
    setFen(gameRef.current.fen())
    setMoveHistory([])
  }, [])

  // Load game from FEN (authoritative server state)
  const loadGameFromFen = useCallback(
    (newFen: string, history?: string[]) => {
      const nextGame = new Chess(newFen)
      gameRef.current = nextGame
      setFen(nextGame.fen())
      if (history) {
        setMoveHistory([...history])
      } else {
        setMoveHistory(moveHistoryRef.current)
      }
    },
    [],
  )

  // Make a move if legal and update game state; returns move or null
  const makeMove = useCallback(
    (from: Square, to: Square, promotion?: string): Move | null => {
      const workingCopy = new Chess(gameRef.current.fen())

      try {
        const move = workingCopy.move({
          from,
          to,
          promotion: promotion || "q",
        })

        if (!move) return null

        gameRef.current = workingCopy
        setFen(workingCopy.fen())
        setMoveHistory((prev) => [...prev, move.san])
        return move
      } catch (err) {
        return null
      }
    },
    [],
  )

  // Check if a move is legal without mutating state
  const isMoveLegal = useCallback(
    (from: Square, to: Square, promotion?: string): boolean => {
      const moves = gameRef.current.moves({ square: from, verbose: true })
      return moves.some((m) => m.to === to && (!promotion || m.promotion === promotion || !m.promotion))
    },
    [],
  )

  // Apply a move received from the server to keep move history intact
  const applyServerMove = useCallback(
    (from: Square, to: Square, promotion?: string): Move | null => {
      try {
        const move = gameRef.current.move({ from, to, promotion: promotion || "q" })
        if (!move) return null
        setFen(gameRef.current.fen())
        setMoveHistory((prev) => [...prev, move.san])
        return move
      } catch (err) {
        return null
      }
    },
    [],
  )

  // Get all legal destination squares for UI highlighting
  const getLegalMoves = useCallback((square: Square): string[] => {
    return gameRef.current.moves({ square, verbose: true }).map((m) => m.to)
  }, [])

  const isInCheck = useCallback(() => gameRef.current.isCheck(), [])
  const isCheckmate = useCallback(() => gameRef.current.isCheckmate(), [])
  const isDraw = useCallback(() => gameRef.current.isDraw(), [])

  const getCurrentTurn = useCallback(
    (): "white" | "black" => (gameRef.current.turn() === "w" ? "white" : "black"),
    [],
  )

  const getPgn = useCallback((): string => gameRef.current.pgn() || "", [])

  return {
    game: gameRef.current,
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
    applyServerMove,
  }
}
