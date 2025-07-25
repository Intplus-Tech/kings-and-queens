import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy } from 'lucide-react'
import Image from "next/image"
import { Player } from "./mock-data"
// import { Player } from "@/lib/mock-data"

interface LeagueTableProps {
  players: Player[]
}

export function LeagueTable({ players }: LeagueTableProps) {
  return (
    <Card className="bg-[#00000033] p-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 rounded-md bg-secondary">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <p className="text-2xl"> 🏆 </p>
          League Table
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        {players.map((player, index) => (
          <div key={player.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <span className="text-gray-400 w-4 text-sm">{index + 1}</span>
            <Image
              src={player.avatar || "/placeholder.svg"}
              alt={player.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div className="flex-1">
              <p className="">{player.name}</p>
              <p className="text-muted-foreground text-xs">{player.school}</p>
            </div>
            <span className="text-sm">{player.points} pts</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
