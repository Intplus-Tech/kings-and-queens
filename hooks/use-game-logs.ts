"use client"

import { useState, useCallback, useEffect } from "react"
import type { LogEntry } from "@/lib/chess-types"
import { getLocalStorageItem, setLocalStorageItem, generateLogId, getFormattedTimestamp } from "@/lib/chess-utils"
import { LS_KEY_LOGS, MAX_LOG_ENTRIES } from "@/lib/chess-constants"

/**
 * Hook for managing game event logs
 * Persists logs to localStorage and handles auto-cleanup
 */
export const useGameLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = getLocalStorageItem(LS_KEY_LOGS)
    return saved ? (JSON.parse(saved) as LogEntry[]) : []
  })

  // Add a new log entry
  const addLog = useCallback((msg: string, color = "#00ff88") => {
    const newEntry: LogEntry = {
      id: generateLogId(),
      message: `[${getFormattedTimestamp()}] ${msg}`,
      color,
      timestamp: getFormattedTimestamp(),
    }

    setLogs((prev) => [...prev, newEntry].slice(-MAX_LOG_ENTRIES))
  }, [])

  // Clear all logs
  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  // Persist logs to localStorage
  useEffect(() => {
    setLocalStorageItem(LS_KEY_LOGS, JSON.stringify(logs))
  }, [logs])

  return {
    logs,
    addLog,
    clearLogs,
  }
}
