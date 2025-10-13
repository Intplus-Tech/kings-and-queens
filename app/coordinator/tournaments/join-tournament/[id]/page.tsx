// app/tournaments/[id]/page.tsx
import Link from "next/link"
import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getTournamentAction } from "@/lib/actions/tournaments/tournaments"
import JoinTournamentModal from "@/app/coordinator/components/JoinTournamentModal"

type PageProps = {
  params: { id: string }
}

const fmtDateRange = (start?: string, end?: string) => {
  if (!start && !end) return "No dates"
  const opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" }
  const s = start ? new Date(start) : null
  const e = end ? new Date(end) : null
  if (s && e) {
    if (s.getUTCFullYear() === e.getUTCFullYear() && s.getUTCMonth() === e.getUTCMonth() && s.getUTCDate() === e.getUTCDate()) {
      return s.toLocaleDateString(undefined, opts)
    }
    return `${s.toLocaleDateString(undefined, opts)} — ${e.toLocaleDateString(undefined, opts)}`
  }
  return s ? s.toLocaleDateString(undefined, opts) : e?.toLocaleDateString(undefined, opts) ?? "No dates"
}

const page = async ({ params }: PageProps) => {
  const { id } = await params
  const res = await getTournamentAction(id)

  if (!res.success || !res.tournament) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Tournament not found</h2>
          <p className="text-sm text-muted-foreground mt-2">{res.message ?? "Could not retrieve tournament."}</p>
          <div className="mt-4">
            <Link href="/tournaments">
              <Button>Back to tournaments</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const t = res.tournament
  const participantCount = Array.isArray(t.participants) ? t.participants.length : 0

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t.name}</h1>
          <p className="text-sm text-muted-foreground">{fmtDateRange(t.startDate, t.endDate)}</p>
          <p className="text-sm text-muted-foreground">{t.location ?? "TBD"}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-sm text-muted-foreground">Status</div>
          <div className="px-3 py-1 rounded-md bg-gray-100 text-sm font-medium">{t.status}</div>
          <div className="text-sm text-muted-foreground mt-2">Participants</div>
          <div className="font-medium">{participantCount}</div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{t.description ?? "No description provided."}</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Type</div>
              <div className="font-medium">{t.type ?? "-"}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Current Round</div>
              <div className="font-medium">{t.currentRound ?? "-"}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Created</div>
              <div className="font-medium">{t.createdAt ? new Date(t.createdAt).toLocaleString() : "-"}</div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          {/* JOIN MODAL - Client component */}
          <JoinTournamentModal tournamentId={t._id} />

          <Link href="/tournaments">
            <Button variant="ghost">Back</Button>
          </Link>
        </CardFooter>
      </Card>

      {Array.isArray(t.participants) && t.participants.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">Participants ({participantCount})</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {t.participants.map((p: any) => (
              <div key={p._id ?? p.id ?? p} className="flex items-center gap-3 p-3 border rounded">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium">{(p.name || p.alias || "P").charAt(0)}</span>
                </div>
                <div>
                  <div className="font-medium">{p.name ?? p.alias ?? "Unknown"}</div>
                  <div className="text-sm text-muted-foreground">{p.alias ?? ""}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default page
