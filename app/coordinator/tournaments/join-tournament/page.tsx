import Link from "next/link"
import React from "react"
import { getPlayersAction } from "@/lib/actions/players/get-palyer.action"
import { getTournamentsAction } from "@/lib/actions/tournaments/tournaments"

// If you use shadcn UI Card/Button components, uncomment these and adjust imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const fmtDateRange = (start?: string, end?: string) => {
  if (!start && !end) return "No dates"
  try {
    const opts: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
    const startD = start ? new Date(start) : null
    const endD = end ? new Date(end) : null

    if (startD && endD) {
      // If same day, show single date
      if (
        startD.getUTCFullYear() === endD.getUTCFullYear() &&
        startD.getUTCMonth() === endD.getUTCMonth() &&
        startD.getUTCDate() === endD.getUTCDate()
      ) {
        return startD.toLocaleDateString(undefined, opts)
      }
      return `${startD.toLocaleDateString(undefined, opts)} — ${endD.toLocaleDateString(
        undefined,
        opts
      )}`
    }

    return startD ? startD.toLocaleDateString(undefined, opts) : endD?.toLocaleDateString(undefined, opts) ?? "No dates"
  } catch {
    return "Invalid date"
  }
}

const joinTournamentPage = async () => {
  const playersResponse = await getPlayersAction()
  const players = playersResponse.players || []

  const tournamentsResponse = await getTournamentsAction()
  const tournaments = tournamentsResponse.tournaments || []

  // Optional: sort soonest first by startDate
  tournaments.sort((a: any, b: any) => {
    const da = a.startDate ? new Date(a.startDate).getTime() : 0
    const db = b.startDate ? new Date(b.startDate).getTime() : 0
    return da - db
  })

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Join a Tournament</h1>
        <p className="text-sm text-muted-foreground">
          {players.length} players available to join
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {tournaments.length === 0 && (
          <div className="col-span-full text-center py-8 text-sm text-muted-foreground">
            No tournaments found.
          </div>
        )}

        {tournaments.map((t: any) => {
          const participantCount = Array.isArray(t.participants)
            ? t.participants.length
            : 0

          return (
            <Card key={t._id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t.name}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {t.type ?? "—"}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {fmtDateRange(t.startDate, t.endDate)}
                </p>

                <p className="mb-2">
                  <strong>Location:</strong> {t.location ?? "TBD"}
                </p>

                {t.description && (
                  <p className="mb-3 text-sm text-muted-foreground">
                    {t.description}
                  </p>
                )}

                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div>
                    <div className="text-xs">Status</div>
                    <div className="font-medium">{t.status ?? "unknown"}</div>
                  </div>

                  <div>
                    <div className="text-xs">Participants</div>
                    <div className="font-medium">{participantCount}</div>
                  </div>

                  <div>
                    <div className="text-xs">Round</div>
                    <div className="font-medium">{t.currentRound ?? "-"}</div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-end gap-2">
                {/* <Link href={`/tournaments/${t._id}`} className="text-sm">
                  View
                </Link> */}

                {/* Join button goes to a join route — adjust path as needed */}
                <Button asChild>
                  <Link href={`/coordinator/tournaments/join-tournament/${t._id}`}>Join</Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default joinTournamentPage
