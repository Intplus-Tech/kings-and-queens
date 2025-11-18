import Link from "next/link";
import React from "react";
import { getTournamentsAction } from "@/lib/actions/tournaments/tournaments";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fmtDateRange } from "@/lib/utils";

const tournamentsPage = async () => {
  const tournamentsResponse = await getTournamentsAction();
  let tournaments = tournamentsResponse.tournaments || [];

  // Filter out completed tournaments
  tournaments = tournaments.filter((t: any) => t.status !== "completed");

  // sort soonest first by startDate
  tournaments.sort((a: any, b: any) => {
    const da = a.startDate ? new Date(a.startDate).getTime() : 0;
    const db = b.startDate ? new Date(b.startDate).getTime() : 0;
    return da - db;
  });

  // Separate active and upcoming tournaments
  const activeTournaments = tournaments.filter(
    (t: any) => t.status === "active"
  );
  const upcomingTournaments = tournaments.filter(
    (t: any) => t.status !== "active"
  );

  return (
    <div className="space-y-6">
      {/* Active Tournaments Section */}
      {activeTournaments.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Active Tournaments</h2>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {activeTournaments.map((t: any) => {
              const participantCount = Array.isArray(t.participants)
                ? t.participants.length
                : 0;

              return (
                <Card key={t._id} className="md:col-span-1 lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-3xl flex items-center justify-between">
                      <span>{t.name}</span>
                      <span className="text-lg font-normal text-muted-foreground">
                        {t.type ?? "—"}
                      </span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-base text-muted-foreground mb-3">
                      {fmtDateRange(t.startDate, t.endDate)}
                    </p>

                    <p className="mb-3 text-base">
                      <strong>Location:</strong> {t.location ?? "TBD"}
                    </p>

                    {t.description && (
                      <p className="mb-4 text-base text-muted-foreground">
                        {t.description}
                      </p>
                    )}

                    <div className="flex gap-6 text-base text-muted-foreground">
                      <div>
                        <div className="text-xs">Status</div>
                        <div className="font-medium text-lg">
                          {t.status ?? "unknown"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs">Participants</div>
                        <div className="font-medium text-lg">
                          {participantCount}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs">Round</div>
                        <div className="font-medium text-lg">
                          {t.currentRound ?? "-"}
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-end gap-2">
                    <Button size="lg" asChild>
                      <Link href={`/coordinator/tournaments/${t._id}`}>
                        View
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Tournaments Section */}
      {upcomingTournaments.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Upcoming Tournaments</h2>
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {upcomingTournaments.map((t: any) => {
              const participantCount = Array.isArray(t.participants)
                ? t.participants.length
                : 0;

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
                        <div className="font-medium">
                          {t.status ?? "unknown"}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs">Participants</div>
                        <div className="font-medium">{participantCount}</div>
                      </div>

                      <div>
                        <div className="text-xs">Round</div>
                        <div className="font-medium">
                          {t.currentRound ?? "-"}
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex items-center justify-end gap-2">
                    <Button asChild>
                      <Link href={`/coordinator/tournaments/${t._id}`}>
                        View
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* No Tournaments Message */}
      {tournaments.length === 0 && (
        <div className="col-span-full text-center py-8 text-sm text-muted-foreground">
          No tournaments found.
        </div>
      )}
    </div>
  );
};

export default tournamentsPage;
