import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { GroupPlayer } from "./points-mock-data"

interface PointsLeagueTableProps {
  players: GroupPlayer[]
  groupName: string
}

const getMatchResultColor = (result: "win" | "loss" | "draw") => {
  switch (result) {
    case "win":
      return "bg-green-500"
    case "loss":
      return "bg-red-500"
    case "draw":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

export function PointsLeagueTable({ players, groupName }: PointsLeagueTableProps) {
  return (
    <Card className="mb-6 bg-background border-none p-0">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="w-full">
            <div>
              <div className="text-muted-foreground grid grid-cols-9">
                {/* <div className="text-left py-3 px-2">#</div> */}
                <div className="text-left py-3 px-2 col-span-3">Player</div>
                <div className="text-center py-3 px-2">W</div>
                <div className="text-center py-3 px-2">D</div>
                <div className="text-center py-3 px-2">L</div>
                <div className="text-center py-3 px-2">Points</div>
                <div className="text-center py-3 px-2">Player Points</div>
                <div className="text-center py-3 px-2">Last Match</div>
              </div>
            </div>
            <div>
              {players.map((player, index) => (
                <div key={player.id} className="bg-[#49406966] grid grid-cols-9 mb-2 rounded-md">
                  {/* <div className="py-4 px-2">
                    <span className="text-gray-400 text-sm">{index + 1}</span>
                  </div> */}
                  <div className="py-4 px-2 col-span-3">
                    <div className="flex items-center gap-3">
                      <p className="ml-4">{index + 1}</p>
                      <Image
                        src={player.avatar || "/placeholder.svg"}
                        alt={player.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-white font-medium text-sm">{player.name}</p>
                        {/* <p className="text-gray-400 text-xs">{player.school}</p> */}
                      </div>
                    </div>
                  </div>
                  <div className="text-center py-4 px-2">
                    <span className="text-white text-sm">{player.wins}</span>
                  </div>
                  <div className="text-center py-4 px-2">
                    <span className="text-white text-sm">{player.draws}</span>
                  </div>
                  <div className="text-center py-4 px-2">
                    <span className="text-white text-sm">{player.losses}</span>
                  </div>
                  <div className="text-center py-4 px-2">
                    <span className="text-white font-bold text-sm">{player.points}</span>
                  </div>
                  <div className="text-center py-4 px-2">
                    <span className="text-white text-sm">{player.playerPoints}</span>
                  </div>
                  <div className="text-center py-4 px-2">
                    <div className="flex items-center justify-center gap-1">
                      {player.lastMatches.map((result, i) => (
                        <div key={i} className={`w-3 h-3 rounded-full ${getMatchResultColor(result)}`} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
