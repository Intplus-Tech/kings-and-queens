// components/JoinTournamentModal.tsx
"use client"

import { useEffect, useState } from "react"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // optional search input
import { getPlayersAction } from "@/lib/actions/players/get-palyer.action" // server action (use server)
import { joinTournamentAction } from "@/lib/actions/tournaments/tournaments" // server action (use server)
import { Checkbox } from "@/components/ui/checkbox" // if available; otherwise use native checkbox
import { useToast } from "@/hooks/use-toast"

type Player = {
  _id: string
  name?: string
  alias?: string
  [k: string]: any
}

export default function JoinTournamentModal({ tournamentId }: { tournamentId: string }) {
  const [open, setOpen] = useState(false)
  const [loadingPlayers, setLoadingPlayers] = useState(false)
  const [players, setPlayers] = useState<Player[]>([])
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState("")

  const { toast } = useToast()

  // fetch players when dialog opens
  useEffect(() => {
    if (!open) return

    let mounted = true
    const fetchPlayers = async () => {
      setLoadingPlayers(true)
      try {
        const res = await getPlayersAction()
        if (!mounted) return
        if (res.success) {
          setPlayers(res.players || [])
        } else {
          toast({
            title: "Error",
            description: res.error || "Failed to fetch players",
            variant: "destructive",
          })
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.error || "Failed to fetch players",
          variant: "destructive",
        })
      } finally {
        if (mounted) setLoadingPlayers(false)
      }
    }

    fetchPlayers()
    return () => {
      mounted = false
    }
  }, [open])

  const toggleSelect = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }))
  }

  const handleSubmit = async () => {
    const participantIds = Object.entries(selected).filter(([, v]) => v).map(([k]) => k)
    if (participantIds.length === 0) {
      toast({
        title: "Error",
        description: "Select at least one player",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const res = await joinTournamentAction(tournamentId, participantIds)

      console.log("response", res);

      if (res.success) {
        toast({
          title: "Success",
          description: res.error || "Joined tournament successfully",
        })
        // Optionally close the dialog and clear selection
        setOpen(false)
        setSelected({})
      } else {
        toast({
          title: "Error",
          description: res.error || "Failed to join tournament",
          variant: "destructive",
        })
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.error || "Failed to join tournament",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const filteredPlayers = players.filter((p) => {
    const q = filter.trim().toLowerCase()
    if (!q) return true
    return (p.name || p.alias || "").toLowerCase().includes(q)
  })

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>Join Tournament</Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Join Tournament</AlertDialogTitle>
          <AlertDialogDescription>
            Select the players you want to submit for this tournament.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex items-center gap-2">
            <Input placeholder="Search players..." value={filter} onChange={(e) => setFilter(e.target.value)} />
            <div className="text-sm text-muted-foreground">{loadingPlayers ? "Loading..." : `${players.length} players`}</div>
          </div>

          <div className="max-h-56 overflow-auto divide-y rounded border p-2">
            {loadingPlayers && <div className="p-4 text-center text-sm">Loading players...</div>}

            {!loadingPlayers && filteredPlayers.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">No players found</div>
            )}

            {!loadingPlayers && filteredPlayers.map((p) => (
              <label key={p._id} className="flex items-center gap-3 p-2 hover:bg-muted rounded">
                {/* Prefer shadcn Checkbox if available; otherwise native checkbox */}
                {typeof Checkbox !== "undefined" ? (
                  // if Checkbox component exists in your project
                  <Checkbox checked={!!selected[p._id]} onCheckedChange={() => toggleSelect(p._id)} />
                ) : (
                  <input type="checkbox" checked={!!selected[p._id]} onChange={() => toggleSelect(p._id)} />
                )}

                <div>
                  <div className="font-medium">{p.name ?? p.alias ?? "Unknown"}</div>
                  <div className="text-sm text-muted-foreground">{p.alias ?? p.playerClass ?? ""}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
