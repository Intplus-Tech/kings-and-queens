import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Advertisement } from "./_components/advertisement";
import { ChessBoardViewer } from "./_components/chess-board-viewer";
import { LeagueTable } from "./_components/league-table";
import { currentUser, mockPlayers, mockQuickStats, mockUpcomingMatch } from "./_components/mock-data";
import { QuickStats } from "./_components/quick-stats";
import { UpcomingMatch } from "./_components/upcoming-match";

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Sidebar - League Table */}
      <div className="col-span-3">
        <div className="sticky top-6">
          <LeagueTable players={mockPlayers} />
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
  )
}
