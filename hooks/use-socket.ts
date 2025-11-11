"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import { createSocketClient, type ChessSocket } from "@/lib/socket-config"
import type { ServerToClientEvents, ClientToServerEvents } from "@/lib/chess-types"

/**
 * Hook for managing Socket.IO connection and events
 * Handles authentication, event listeners, and emission
 */
export const useSocket = (token: string | undefined) => {
  const socketRef = useRef<ChessSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [socketId, setSocketId] = useState<string | null>(null)

  // Initialize socket connection
  useEffect(() => {
    if (!token) {
      console.log("[v0] Socket: No token provided, skipping connection")
      return
    }

    console.log("[v0] Socket: Creating socket connection with token")
    const socket = createSocketClient()
    socketRef.current = socket

    const handleConnect = () => {
      console.log("[v0] Socket: Connected - ID:", socket.id)
      setIsConnected(true)
      setSocketId(socket.id || null)
    }

    const handleDisconnect = () => {
      console.log("[v0] Socket: Disconnected")
      setIsConnected(false)
    }

    const handleConnectError = (error: Error) => {
      console.error("[v0] Socket: Connection error:", error.message)
    }

    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)
    socket.on("connect_error", handleConnectError)

    return () => {
      console.log("[v0] Socket: Cleanup - disconnecting")
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
      socket.off("connect_error", handleConnectError)
      socket.disconnect()
    }
  }, [token])

  // Emit an event to the server
  const emit = useCallback(
    <K extends keyof ClientToServerEvents>(event: K, data: Parameters<ClientToServerEvents[K]>[0]) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit(event, data)
      } else {
        console.warn("[v0] Socket: Cannot emit event - socket not connected", event)
      }
    },
    [],
  )

  // Listen for an event from the server
  const on = useCallback(<K extends keyof ServerToClientEvents>(event: K, handler: ServerToClientEvents[K]) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler as any)
      return () => {
        if (socketRef.current) {
          socketRef.current.off(event, handler as any)
        }
      }
    }
    return () => { }
  }, [])

  return {
    socket: socketRef.current,
    isConnected,
    socketId,
    emit,
    on,
  }
}
