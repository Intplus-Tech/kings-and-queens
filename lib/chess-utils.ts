import { PIECE_SYMBOLS } from "./chess-constants"

// Get local storage item safely (handles SSR)
export const getLocalStorageItem = (key: string): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(key)
}

// Set local storage item safely
export const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window === "undefined") return
  localStorage.setItem(key, value)
}

// Format milliseconds to MM:SS format
export const formatTime = (ms: number): string => {
  const safeMs = Math.max(0, ms)
  const totalSeconds = Math.floor(safeMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
}

// Convert piece ID to Unicode symbol
export const getSymbol = (pieceId: string): string => {
  if (pieceId.length === 1) {
    return PIECE_SYMBOLS[pieceId] || ""
  }
  return ""
}

// Sort pieces by type (Queens first, then Rooks, Bishops, Knights, Pawns)
export const sortPieces = (pieces: string[]): string[] => {
  const pieceOrder = ["Q", "R", "B", "N", "P", "q", "r", "b", "n", "p"]
  return pieces.sort((a, b) => {
    const aIndex = pieceOrder.indexOf(a)
    const bIndex = pieceOrder.indexOf(b)
    return aIndex - bIndex
  })
}

// Find king square on board for highlighting when in check
export const findKingSquare = (
  board: ({ type: string; color: string } | null)[][],
  color: "w" | "b",
): string | null => {
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = board[r][f]
      if (piece && piece.type === "k" && piece.color === color) {
        return `${"abcdefgh"[f]}${8 - r}`
      }
    }
  }
  return null
}

// Generate unique ID for log entries
export const generateLogId = (): string => {
  return crypto.randomUUID()
}

// Format timestamp for log entries
export const getFormattedTimestamp = (): string => {
  const now = new Date()
  return now.toLocaleTimeString()
}
