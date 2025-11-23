import type React from "react";
import { getPlayerProfileWithSchool } from "@/lib/actions/user/user.action";
import { PlayerHeader } from "@/components/layout/player-header";
import { checkPlayerParticipation } from "@/lib/actions/tournaments/check-participation";
import { TournamentProvider } from "@/context/tournament-context";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, participation] = await Promise.all([
    getPlayerProfileWithSchool(),
    checkPlayerParticipation(),
  ]);

  return (
    <TournamentProvider value={participation}>
      <div className="container mx-auto">
        <PlayerHeader user={user} />
        <main className="flex-1">{children}</main>
      </div>
    </TournamentProvider>
  );
}
