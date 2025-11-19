import Link from "next/link";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTournamentAction } from "@/lib/actions/tournaments/tournaments";
import { getPlayerByIdAction } from "@/lib/actions/players/get-palyer.action";
import JoinTournamentModal from "@/app/coordinator/components/JoinTournamentModal";
import { fmtDateRange } from "@/lib/utils";

type PageProps = {
  params: { id: string };
};

export default async function TournamentPage({ params }: PageProps) {
  const { id } = await params;
  const res = await getTournamentAction(id);

  if (!res.success || !res.tournament) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Tournament not found</h2>
          <p className="text-sm text-muted-foreground mt-2">
            {res.message ?? "Could not retrieve tournament."}
          </p>
          <div className="mt-4">
            <Link href="/tournaments">
              <Button>Back to tournaments</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const t = res.tournament;
  const rawParticipants = Array.isArray(t.participants) ? t.participants : [];

  const resolvedParticipants = await Promise.all(
    rawParticipants.map(async (p: any) => {
      try {
        if (!p) return null;
        if (typeof p === "string") {
          const r = await getPlayerByIdAction(p);
          return r.success && r.player
            ? r.player
            : { _id: p, name: "Unknown", alias: "" };
        }
        if (typeof p === "object") {
          const id = p._id ?? p.id ?? null;
          return {
            _id: id,
            name: p.name ?? p.alias ?? "Unknown",
            alias: p.alias ?? "",
          };
        }
        return null;
      } catch {
        return null;
      }
    })
  );

  const participants = resolvedParticipants.filter(Boolean) as any[];
  const participantCount = participants.length;

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t.name}</h1>
          <p className="text-sm text-muted-foreground">
            {fmtDateRange(t.startDate, t.endDate)}
          </p>
          <p className="text-sm text-muted-foreground">{t.location ?? "TBD"}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-sm text-muted-foreground">Status</div>
          <div className="px-3 py-1 rounded-md bg-gray-100 text-sm font-medium">
            {t.status}
          </div>
          <div className="text-sm text-muted-foreground mt-2">Participants</div>
          <div className="font-medium">{participantCount}</div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {t.description ?? "No description provided."}
          </p>

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
              <div className="font-medium">
                {t.createdAt ? new Date(t.createdAt).toLocaleString() : "-"}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          {t.status === "active" && (
            <JoinTournamentModal tournamentId={t._id} />
          )}

          <Link href="/coordinator/tournaments">
            <Button variant="ghost">Back</Button>
          </Link>
        </CardFooter>
      </Card>

      {participants.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-2">
            Participants ({participantCount})
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {participants.map((p: any) => (
              <div
                key={p._id ?? p.id ?? JSON.stringify(p)}
                className="flex items-center gap-3 p-3 border rounded"
              >
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {(p.name || p.alias || "P").charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-medium">
                    {p.name ?? p.alias ?? "Unknown"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {p.alias ?? ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
