import { ReactNode } from "react"

export interface Player {
  id: string
  name: string
  school: string
  points: number
  avatar: string
  rank: number
}

export interface Match {
  id: string
  opponent: Player
  date: string
  time: string
  venue: string
  matchNumber: number
}

export interface QuickStat {
  id: string
  title: string
  value: string | number
  icon: string
  color: string
  tooltip: ReactNode
}
export const mockPlayers: Player[] = [
  {
    id: "1",
    name: "Condo",
    school: "Wesley College, Ibadan",
    points: 65,
    avatar: "/placeholder.svg?height=40&width=40&text=C",
    rank: 1
  },
  {
    id: "2",
    name: "Christi",
    school: "Wesley College, Ibadan",
    points: 64,
    avatar: "/placeholder.svg?height=40&width=40&text=Ch",
    rank: 2
  },
  {
    id: "3",
    name: "Kubo",
    school: "Wesley College, Ibadan",
    points: 58,
    avatar: "/placeholder.svg?height=40&width=40&text=K",
    rank: 3
  },
  {
    id: "4",
    name: "Riley",
    school: "Wesley College, Ibadan",
    points: 42,
    avatar: "/placeholder.svg?height=40&width=40&text=R",
    rank: 4
  },
  {
    id: "5",
    name: "Roster",
    school: "Wesley College, Ibadan",
    points: 41,
    avatar: "/placeholder.svg?height=40&width=40&text=Ro",
    rank: 5
  },
  {
    id: "6",
    name: "Eva",
    school: "Wesley College, Ibadan",
    points: 32,
    avatar: "/placeholder.svg?height=40&width=40&text=E",
    rank: 6
  }
]

export const mockUpcomingMatch: Match = {
  id: "match-1",
  opponent: mockPlayers[0], // Condo
  date: "Tuesday",
  time: "4PM",
  venue: "British Int'l College, Lagos",
  matchNumber: 4
}


export const currentUser = {
  name: "Kayode",
  school: "British Int'l School, Lagos"
}


export const mockQuickStats: QuickStat[] = [
  {
    id: "player-rank",
    title: "Player Rank",
    value: "#2",
    icon: "star",
    color: "text-orange-500",
    tooltip: (
      <div className="text-[10px] font-normal text-[#334155]">
        <span className="flex items-end font-bold text-lg">
          <p className="text-2xl">👑</p>
          <p>Your Rank: #3</p>
        </span>
        <p className="mb-1">This shows how you compare to others!</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Higher rank = More wins & smart moves</li>
          <li>Goes up when you beat higher-rated players</li>
        </ul>
      </div>
    )
  },
  {
    id: "league-points",
    title: "League Points",
    value: 64,
    icon: "trophy",
    color: "text-yellow-500",
    tooltip: (
      <div className="text-[10px] font-normal text-[#334155]">
        <span className="flex items-end font-bold text-lg">
          <p className="text-2xl">🏆</p>
          <p>League Points</p>
        </span>
        <p className="my-2">Ponts from  games</p>
        <ul className="flex gap-2 items-center whitespace-nowrap">
          <li>✅ WIN = 3 points</li>
          <li>🤝 DRAW = 1 point</li>
          <li>❌ LOSE = 0 points</li>
        </ul>
      </div>
    )
  },
  {
    id: "piece-points",
    title: "Piece Points",
    value: 128,
    icon: "users",
    color: "text-blue-500",
    tooltip: (
      <div className="text-[10px] font-normal text-[#334155]">
        <span className="flex items-end font-bold text-lg">
          <p className="text-2xl">♟️</p>
          <p>Piece Points</p>
        </span>
        <ul className="flex gap-2 items-center whitespace-nowrap">
          <li>♕ Queen = 3 pts <span className="text-xs">(Don’t lose her!)</span></li>
          <li>♖ Rook = 2 pts</li>
          <li>♗ Bishop/Knight = 1 pt</li>
          <li>♙ Pawn = 0.5 pts</li>
        </ul>
      </div>
    )
  },
  {
    id: "school-rank",
    title: "School Rank",
    value: "#1",
    icon: "school",
    color: "text-green-500",
    tooltip: (
      <div className="text-[10px] font-normal text-[#334155]">
        <span className="flex items-end font-bold text-lg">
          <p className="text-2xl">🏫</p>
          <p>School Rank: #2</p>
        </span>
        <p className="my-2">Your schools total score:</p>
        <ul className="flex gap-4 items-center">
          <li>Sum of all player points</li>
          <li>Your contribution</li>
        </ul>
      </div>
    )
  }
]
