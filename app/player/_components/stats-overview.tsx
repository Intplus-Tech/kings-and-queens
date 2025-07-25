import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserStats } from "./profile-mock-data"

interface StatsOverviewProps {
  stats: UserStats
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div>
      <p className="text-xl font-bold mb-2">Your Stat Overview</p>
      <Card className=" mb-6">
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Stat</th>
                  <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Display</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4 text-muted-foreground text-sm">Sample</td>
                  <td className="py-3 px-4 text-primary text-sm">{stats.sample.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4 text-muted-foreground text-sm">Wins</td>
                  <td className="py-3 px-4 text-primary text-sm">{stats.wins}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-muted-foreground text-sm">Piece Points</td>
                  <td className="py-3 px-4 text-primary text-sm">{stats.piecePoints}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
