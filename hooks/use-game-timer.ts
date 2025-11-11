"use client"

import { useState, useEffect, useRef } from "react"
import { LOG_SCROLL_INTERVAL, LOW_TIME_THRESHOLD } from "@/lib/chess-constants"

/**
 * Hook for managing client-side countdown timers
 * Syncs with server updates and handles low-time warnings
 */
export const useGameTimer = (isGameActive: boolean, gameResult: string | null, currentTurn: "white" | "black") => {
  const [whiteTime, setWhiteTime] = useState(0)
  const [blackTime, setBlackTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Update timers from server (convert seconds to ms)
  const updateTimersFromServer = (whiteSeconds: number, blackSeconds: number) => {
    setWhiteTime(whiteSeconds * 1000)
    setBlackTime(blackSeconds * 1000)
  }

  // Client-side countdown timer
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (isGameActive && !gameResult) {
      timerRef.current = setInterval(() => {
        if (currentTurn === "white") {
          setWhiteTime((t) => Math.max(0, t - LOG_SCROLL_INTERVAL))
        } else {
          setBlackTime((t) => Math.max(0, t - LOG_SCROLL_INTERVAL))
        }
      }, LOG_SCROLL_INTERVAL)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isGameActive, gameResult, currentTurn])

  // Stop timer (used when making moves)
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  // Check if time is low
  const isWhiteTimeLow = whiteTime < LOW_TIME_THRESHOLD
  const isBlackTimeLow = blackTime < LOW_TIME_THRESHOLD

  return {
    whiteTime,
    blackTime,
    isWhiteTimeLow,
    isBlackTimeLow,
    updateTimersFromServer,
    stopTimer,
  }
}
