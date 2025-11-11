import { io, type Socket } from "socket.io-client"
import type { ServerToClientEvents, ClientToServerEvents } from "./chess-types"
import { SERVER_URL } from "./chess-constants"

// Create and return a Socket.IO client
export const createSocketClient = (): Socket<ServerToClientEvents, ClientToServerEvents> => {
  return io(SERVER_URL, { transports: ["websocket"] })
}

// Type export for convenience
export type ChessSocket = Socket<ServerToClientEvents, ClientToServerEvents>
