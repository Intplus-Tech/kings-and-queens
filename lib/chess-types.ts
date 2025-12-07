import { SOCKET_EVENTS } from "./chess-constants"

// Log entry for event tracking
export type LogEntry = {
  id: string
  message: string
  color: string
  timestamp: string
}

export type DrawOfferState = {
  isPending: boolean // Draw offer is waiting for response
  isOfferedByMe: boolean // I sent the offer
  offererPlayerId: string | null // Who sent the offer
  offeredAt: number | null // Timestamp when offer was sent
}

// Server to Client Socket Events
export interface ServerToClientEvents {
  [SOCKET_EVENTS.S2C_AUTH_SUCCESS]: (d: {
    message: string
    userId: string
  }) => void
  [SOCKET_EVENTS.S2C_ERROR]: (d: { message: string }) => void
  [SOCKET_EVENTS.S2C_GAME_STATE]: (d: {
    fen: string
    yourColor: "white" | "black" | "observer"
    players: { white: string | null; black: string | null }
    whiteTime: number // in SECONDS from server
    blackTime: number // in SECONDS from server
  }) => void
  [SOCKET_EVENTS.S2C_PLAYER_JOINED]: (d: {
    message: string
    players: { white: string | null; black: string | null }
  }) => void
  [SOCKET_EVENTS.S2C_MOVE_MADE]: (d: {
    from: string
    to: string
    newFen: string
    whiteTime: number // in SECONDS from server
    blackTime: number // in SECONDS from server
  }) => void
  [SOCKET_EVENTS.S2C_GAME_OVER]: (d: {
    reason: string
    winner?: "white" | "black"
  }) => void
  [SOCKET_EVENTS.S2C_DRAW_OFFERED]: (d: { fromPlayerId: string }) => void
  [SOCKET_EVENTS.S2C_DRAW_ACCEPTED]: (d: { fromPlayerId: string }) => void
  [SOCKET_EVENTS.S2C_DRAW_REJECTED]: (d: { fromPlayerId: string }) => void
  [SOCKET_EVENTS.SOCKET_ERROR]: (d: {
    context: string
    message: string
  }) => void
}

// Client to Server Socket Events
export interface ClientToServerEvents {
  [SOCKET_EVENTS.C2S_AUTHENTICATE]: (d: { token: string }) => void
  [SOCKET_EVENTS.C2S_JOIN_GAME]: (d: { gameId: string }) => void
  [SOCKET_EVENTS.C2S_MAKE_MOVE]: (d: {
    gameId: string
    from: string
    to: string
    promotion?: string
  }) => void
  [SOCKET_EVENTS.C2S_RESIGN]: (d: { gameId: string }) => void
  [SOCKET_EVENTS.C2S_OFFER_DRAW]: (d: { gameId: string }) => void
  [SOCKET_EVENTS.C2S_ACCEPT_DRAW]: (d: { gameId: string }) => void
  [SOCKET_EVENTS.C2S_REJECT_DRAW]: (d: { gameId: string }) => void
}

// Player information
export type PlayerInfo = {
  white: string | null
  black: string | null
}

// Game state snapshot
export type GameState = {
  fen: string
  moveHistory: string[]
  players: PlayerInfo
  myColor: "white" | "black" | "observer" | null
  whiteTime: number // in ms
  blackTime: number // in ms
  isGameActive: boolean
  gameResult: string | null
  gameWinner?: "white" | "black" | null
  drawOffer: DrawOfferState
}

// Captured pieces by color
export type CapturedPieces = {
  white: string[] // Pieces captured by white
  black: string[] // Pieces captured by black
}
