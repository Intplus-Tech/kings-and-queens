import { fetchPlayerSchedules } from "@/lib/actions/schedules";
import { getPlayer } from "@/lib/actions/user/user.action";
import { ScheduledMatchesTable } from "../_components/scheduled-matches-table";
import { redirect } from "next/navigation";
import { Match } from "@/types/schedule";

interface GameData {
  _id: string;
  startTime?: string;
  players?: {
    white: string;
    black: string;
  };
  [key: string]: any;
}

interface MatchWithGame extends Match {
  gameData?: GameData;
  game?: GameData;
  startTime?: string;
}

export default async function PlayerMatchesPage() {
  const playerRes = await getPlayer();

  const player = Array.isArray(playerRes.data)
    ? playerRes.data[0]
    : playerRes.data;

  const schedulesData = await fetchPlayerSchedules().catch((err) => {
    console.error("Failed to fetch schedules:", err);
    return {
      schedules: [],
      upcomingMatch: null,
      allMatches: [],
    };
  });

  const typedMatches = schedulesData.allMatches as MatchWithGame[];

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6">All Scheduled Matches</h1>
      <ScheduledMatchesTable
        schedules={schedulesData.schedules}
        allMatches={typedMatches}
        currentUserId={player._id}
        compact={false}
      />
    </div>
  );
}
