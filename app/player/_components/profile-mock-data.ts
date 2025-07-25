export interface UserProfile {
  id: string
  name: string
  age: number
  title: string
  school: string
  playerId: string
  memberSince: string
  avatar: string
  stats: UserStats
  recentGames: RecentGame[]
}

export interface UserStats {
  sample: number
  wins: string
  piecePoints: number
}

export interface RecentGame {
  id: string
  opponent: string
  opponentAvatar: string
  result: "Win" | "Loss" | "Draw"
  moves: number
  pointEarned: number
  date: string
}

export const mockUserProfile: UserProfile = {
  id: "user-1",
  name: "Alex",
  age: 14,
  title: "Advanced Chess",
  school: "Command Secondary, Abuja",
  playerId: "2231018",
  memberSince: "2021",
  avatar: "/placeholder.svg?height=80&width=80&text=Alex",
  stats: {
    sample: 1500,
    wins: "8/15 games",
    piecePoints: 22,
  },
  recentGames: [
    {
      id: "game-1",
      opponent: "Anna",
      opponentAvatar: "/placeholder.svg?height=32&width=32&text=A",
      result: "Win",
      moves: 1500,
      pointEarned: 3,
      date: "2024-01-15",
    },
    {
      id: "game-2",
      opponent: "Chloe",
      opponentAvatar: "/placeholder.svg?height=32&width=32&text=C",
      result: "Loss",
      moves: 1200,
      pointEarned: 0,
      date: "2024-01-14",
    },
    {
      id: "game-3",
      opponent: "Emeka",
      opponentAvatar: "/placeholder.svg?height=32&width=32&text=E",
      result: "Draw",
      moves: 30,
      pointEarned: 1,
      date: "2024-01-13",
    },
  ],
}
