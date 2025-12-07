// Piece Unicode symbols for display
export const PIECE_SYMBOLS: { [key: string]: string } = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟︎",
  Q_w: "♕",
  R_w: "♖",
  B_w: "♗",
  N_w: "♘",
  P_w: "♙",
  Q_b: "♛",
  R_b: "♜",
  B_b: "♝",
  N_b: "♞",
  P_b: "♟︎",
}

// Socket event names
export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  C2S_AUTHENTICATE: "c2s-authenticate",
  S2C_AUTH_SUCCESS: "s2c-auth-success",
  S2C_ERROR: "s2c-error",
  C2S_JOIN_GAME: "c2s-join-game",
  S2C_GAME_STATE: "s2c-game-state",
  S2C_PLAYER_JOINED: "s2c-player-joined",
  C2S_MAKE_MOVE: "c2s-make-move",
  S2C_MOVE_MADE: "s2c-move-made",
  C2S_RESIGN: "c2s-resign",
  C2S_OFFER_DRAW: "c2s-offer-draw",
  C2S_ACCEPT_DRAW: "c2s-accept-draw",
  C2S_REJECT_DRAW: "c2s-reject-draw",
  S2C_DRAW_ACCEPTED: "s2c-draw-accepted",
  S2C_DRAW_REJECTED: "s2c-draw-rejected",
  S2C_GAME_OVER: "s2c-game-over",
  S2C_DRAW_OFFERED: "s2c-draw-offered",
  SOCKET_ERROR: "socket-error",
} as const

// Time control presets
export type TimeControl = {
  name: string
  time: number // in milliseconds
  increment: number // in milliseconds (always zero while increments are disabled)
}

export const TIME_CONTROLS: TimeControl[] = [
  { name: "Bullet (1+0)", time: 60 * 1000, increment: 0 * 1000 },
  { name: "Blitz (3+0)", time: 180 * 1000, increment: 0 * 1000 },
  { name: "Rapid (10+0)", time: 600 * 1000, increment: 0 * 1000 },
]

// LocalStorage keys
export const LS_KEY_GAME_ID = "multiplayer_chess_gameId"
export const LS_KEY_LOGS = "multiplayer_chess_logs"
export const LS_KEY_LAST_GAME_STATE = "multiplayer_chess_state"

// Server configuration
export const SERVER_URL = "https://knq-be.onrender.com/"

// Game constants
export const LOW_TIME_THRESHOLD = 30000 // 30 seconds in ms
export const MAX_LOG_ENTRIES = 100
export const LOG_SCROLL_INTERVAL = 100 // ms
