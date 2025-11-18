import { getActiveTournamentParticipantsAction } from "@/lib/actions/tournaments/get-active-tournament-participants";
import { Advertisement } from "./_components/advertisement";
import { ChessBoardViewer } from "./_components/chess-board-viewer";
import { LeagueTable } from "./_components/league-table";
import {
  currentUser,
  mockQuickStats,
  mockUpcomingMatch,
} from "./_components/mock-data";
import { QuickStats } from "./_components/quick-stats";
import { UpcomingMatch } from "./_components/upcoming-match";

export default async function AdminDashboard() {
  const participantsRes = await getActiveTournamentParticipantsAction();
  const participants = participantsRes.success
    ? participantsRes.participants
    : [];

  console.log(participants);

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
          match={mockUpcomingMatch}
          currentUserName={currentUser.name}
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
