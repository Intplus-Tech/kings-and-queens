"use client"

import { useState, useImperativeHandle, forwardRef, useEffect, useRef } from "react"
import { joinTournamentAction } from "@/lib/actions/tournaments/tournaments"

interface Player {
  _id: string
  name: string
  alias?: string
}

interface JoinTournamentFormProps {
  players: Player[]
  tournamentId: string
  onSuccess?: () => void
  onStateChange?: (state: { canSubmit: boolean; loading: boolean }) => void
  hideSubmitButton?: boolean // <-- add this
}

const JoinTournamentForm = forwardRef(function JoinTournamentForm(
  { players, tournamentId, onSuccess, onStateChange, hideSubmitButton }: JoinTournamentFormProps,
  ref
) {
  const [selected, setSelected] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const errorRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
  }))

  useEffect(() => {
    onStateChange?.({ canSubmit: selected.length > 0 && !loading && !success, loading })
  }, [selected, loading, onStateChange, success])

  useEffect(() => {
    if (error && errorRef.current) errorRef.current.focus()
    if (success && successRef.current) successRef.current.focus()
  }, [error, success])

  function handleSelect(playerId: string) {
    setSelected((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : prev.length < 3
          ? [...prev, playerId]
          : prev
    )
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await joinTournamentAction(tournamentId, selected)

      console.log("Tournament ID:", tournamentId, "Selected Players:", selected)

      console.log("Join Tournament Result:", result)

      if (!result.success) {
        setError(result.message || "Failed to join tournament")
        setLoading(false)
        // Notify parent that submission failed so buttons are enabled
        onStateChange?.({ canSubmit: selected.length > 0, loading: false })
        return
      }
      setSuccess(true)
      setSelected([])
    } catch (err: any) {
      setError(err.message || "Something went wrong")
      // Notify parent that submission failed so buttons are enabled
      onStateChange?.({ canSubmit: selected.length > 0, loading: false })
    } finally {
      setLoading(false)
    }
  }

  function handleClose() {
    setSuccess(false)
    setError(null)
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#222] p-6 rounded-lg shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-white">Select up to 3 team members</h2>
      {error && (
        <div
          ref={errorRef}
          tabIndex={-1}
          className="text-red-500 mb-4 p-2 rounded bg-red-100/10 border border-red-500"
          aria-live="assertive"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          ref={successRef}
          tabIndex={-1}
          className="text-green-500 mb-4 p-2 rounded bg-green-100/10 border border-green-500 flex flex-col items-start gap-2"
          aria-live="polite"
        >
          <span>✅ Successfully joined tournament!</span>
          <button
            type="button"
            onClick={handleClose}
            className="bg-primary text-white px-4 py-2 rounded mt-2"
          >
            Close
          </button>
        </div>
      )}
      {!success && (
        <>
          <div className="mb-2 text-gray-300">
            {`Selected: ${selected.length} / 3`}
          </div>
          <ul className="mb-4 space-y-2">
            {players.map(player => (
              <li key={player._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={player._id}
                  checked={selected.includes(player._id)}
                  onChange={() => handleSelect(player._id)}
                  disabled={loading || (!selected.includes(player._id) && selected.length >= 3)}
                  className="accent-primary"
                />
                <label htmlFor={player._id} className="text-white cursor-pointer">
                  {player.name} {player.alias && <span className="text-gray-400">({player.alias})</span>}
                </label>
              </li>
            ))}
          </ul>
          {!hideSubmitButton && (
            <button
              type="submit"
              disabled={selected.length === 0 || loading}
              className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
              {loading ? "Submitting..." : "Join Tournament"}
            </button>
          )}
        </>
      )}
    </form>
  )
})

export default JoinTournamentForm