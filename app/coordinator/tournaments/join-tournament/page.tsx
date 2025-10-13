import Link from "next/link"
import React from "react"
import { getTournamentsAction } from "@/lib/actions/tournaments/tournaments"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { fmtDateRange } from "@/lib/utils"



const joinTournamentPage = async () => {
  const tournamentsResponse = await getTournamentsAction()
  const tournaments = tournamentsResponse.tournaments || []

  // sort soonest first by startDate
  tournaments.sort((a: any, b: any) => {
    const da = a.startDate ? new Date(a.startDate).getTime() : 0
    const db = b.startDate ? new Date(b.startDate).getTime() : 0
    return da - db
  })

  return (
    <div className="space-y-6">
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
