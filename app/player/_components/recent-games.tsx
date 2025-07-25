"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play } from "lucide-react"
import Image from "next/image"
import { RecentGame } from "./profile-mock-data"

interface RecentGamesProps {
  games: RecentGame[]
}

export function RecentGames({ games }: RecentGamesProps) {
  const [filter, setFilter] = useState<"all" | "win" | "loss" | "draw">("all")

  const filteredGames = games.filter((game) => {
    if (filter === "all") return true
    return game.result.toLowerCase() === filter
  })

  const getResultColor = (result: string) => {
    switch (result.toLowerCase()) {
      case "win":
        return "text-green-400"
      case "loss":
        return "text-red-400"
      case "draw":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div>
      <CardTitle className="text-xl mb-2">Recent Games</CardTitle>

      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-32 ml-auto text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="all">All Games</SelectItem>
              <SelectItem value="win">Wins</SelectItem>
              <SelectItem value="loss">Losses</SelectItem>
              <SelectItem value="draw">Draws</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Opponent</th>
                  <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Result</th>
                  <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Moves</th>
                  <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Point Earned</th>
                  <th className="text-left py-3 px-4 text-muted-foreground text-sm font-medium">Watch Match</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.map((game) => (
                  <tr key={game.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={game.opponentAvatar || "/placeholder.svg"}
                          alt={game.opponent}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span className="text-primary text-sm">{game.opponent}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${getResultColor(game.result)}`}>{game.result}</span>
                    </td>
                    <td className="py-3 px-4 text-primary text-sm">{game.moves}</td>
                    <td className="py-3 px-4 text-primary text-sm">{game.pointEarned}</td>
                    <td className="py-3 px-4">
                      <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white p-2 h-8 w-8">
                        <Play className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No games found for the selected filter.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
