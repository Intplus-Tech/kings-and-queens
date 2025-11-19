import { getActiveTournamentParticipantsAction } from "@/lib/actions/tournaments/get-active-tournament-participants";
import { fetchPlayerSchedules } from "@/lib/actions/schedules";
import { getPlayer } from "@/lib/actions/user/user.action";
import { Advertisement } from "./_components/advertisement";
import { ChessBoardViewer } from "./_components/chess-board-viewer";
import { LeagueTable } from "./_components/league-table";
import { mockQuickStats } from "./_components/mock-data";
import { QuickStats } from "./_components/quick-stats";
import { UpcomingMatch } from "./_components/upcoming-match";
import { redirect } from "next/navigation";

export default async function PlayerDashboard() {
  const playerRes = await getPlayer();

  if (!playerRes.success || !playerRes.data) {
    redirect("/auth/login");
  }

  const player = Array.isArray(playerRes.data)
    ? playerRes.data[0]
    : playerRes.data;

  const [participantsRes, schedulesData] = await Promise.all([
    getActiveTournamentParticipantsAction(),
    fetchPlayerSchedules().catch((err) => {
      console.error("Failed to fetch schedules:", err);
      return {
        schedules: [],
        upcomingMatch: null,
        allMatches: [],
      };
    }),
  ]);

  const participants = participantsRes.success
    ? participantsRes.participants
    : [];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Sidebar - League Table */}
      <div className="col-span-3">
        <div className="sticky top-6">
          <LeagueTable
            players={participants}
            tournamentName={participantsRes.tournamentName}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="col-span-6 space-y-6">
        <QuickStats stats={mockQuickStats} />
        <UpcomingMatch
          currentUserId={player._id}
          currentUserName={player.name || player.alias || "Player"}
          schedules={schedulesData.schedules}
          allMatches={schedulesData.allMatches}
        />
        <ChessBoardViewer opponentName="Amina" />
      </div>

      {/* Right Sidebar - Advertisement (Now Sticky) */}
      <div className="col-span-3">
        <Advertisement />
      </div>
    </div>
  );
}
