export interface GroupPlayer {
  id: string
  name: string
  avatar: string
  school: string
  wins: number
  draws: number
  losses: number
  points: number
  playerPoints: number
  lastMatches: ("win" | "loss" | "draw")[]
  rank: number
}

export interface Fixture {
  id: string
  homeTeam: {
    name: string
    logo: string
    school: string
  }
  awayTeam: {
    name: string
    logo: string
    school: string
  }
  time: string
  date: string
  score?: {
    home: number
    away: number
  }
  venue: string
  status: "upcoming" | "live" | "completed"
}

export interface Group {
  id: string
  name: string
  players: GroupPlayer[]
}

export const mockGroups: Group[] = [
  {
    id: "A",
    name: "Group A",
    players: [
      {
        id: "1",
        name: "Anna",
        avatar: "/placeholder.svg?height=32&width=32&text=A",
        school: "Wesley College, Ibadan",
        wins: 14,
        draws: 3,
        losses: 1,
        points: 35,
        playerPoints: 335,
        lastMatches: ["win", "win", "win", "win", "win"],
        rank: 1,
      },
      {
        id: "2",
        name: "Disha",
        avatar: "/placeholder.svg?height=32&width=32&text=D",
        school: "Wesley College, Ibadan",
        wins: 13,
        draws: 3,
        losses: 2,
        points: 32,
        playerPoints: 644,
        lastMatches: ["win", "win", "win", "loss", "win"],
        rank: 2,
      },
      {
        id: "3",
        name: "Condo",
        avatar: "/placeholder.svg?height=32&width=32&text=C",
        school: "Wesley College, Ibadan",
        wins: 13,
        draws: 3,
        losses: 3,
        points: 30,
        playerPoints: 643,
        lastMatches: ["loss", "win", "win", "win", "win"],
        rank: 3,
      },
      {
        id: "4",
        name: "Shatter",
        avatar: "/placeholder.svg?height=32&width=32&text=S",
        school: "Wesley College, Ibadan",
        wins: 12,
        draws: 4,
        losses: 3,
        points: 28,
        playerPoints: 234,
        lastMatches: ["loss", "win", "win", "win", "win"],
        rank: 4,
      },
      {
        id: "5",
        name: "Kubo",
        avatar: "/placeholder.svg?height=32&width=32&text=K",
        school: "Wesley College, Ibadan",
        wins: 11,
        draws: 4,
        losses: 4,
        points: 27,
        playerPoints: 123,
        lastMatches: ["win", "win", "win", "loss", "win"],
        rank: 5,
      },
      {
        id: "6",
        name: "Kraven",
        avatar: "/placeholder.svg?height=32&width=32&text=Kr",
        school: "Wesley College, Ibadan",
        wins: 11,
        draws: 4,
        losses: 6,
        points: 25,
        playerPoints: 231,
        lastMatches: ["loss", "win", "win", "loss", "win"],
        rank: 6,
      },
    ],
  },
  {
    id: "B",
    name: "Group B",
    players: [
      {
        id: "7",
        name: "Tommy",
        avatar: "/placeholder.svg?height=32&width=32&text=T",
        school: "British Int'l College, Lagos",
        wins: 15,
        draws: 2,
        losses: 1,
        points: 38,
        playerPoints: 445,
        lastMatches: ["win", "win", "win", "win", "draw"],
        rank: 1,
      },
      {
        id: "8",
        name: "Riley",
        avatar: "/placeholder.svg?height=32&width=32&text=R",
        school: "Wesley College, Ibadan",
        wins: 12,
        draws: 4,
        losses: 2,
        points: 32,
        playerPoints: 334,
        lastMatches: ["win", "draw", "win", "win", "win"],
        rank: 2,
      },
    ],
  },
]

export const mockFixtures: Fixture[] = [
  {
    id: "1",
    homeTeam: {
      name: "Tolu",
      logo: "/placeholder.svg?height=24&width=24&text=T",
      school: "Wesley College Yenetu, Ibadan",
    },
    awayTeam: {
      name: "Anna",
      logo: "/placeholder.svg?height=24&width=24&text=A",
      school: "British Int'l College, Lagos",
    },
    time: "18:56",
    date: "Today",
    score: { home: 12, away: 42 },
    venue: "Wesley College Yenetu, Ibadan",
    status: "completed",
  },
  {
    id: "2",
    homeTeam: {
      name: "Tolu",
      logo: "/placeholder.svg?height=24&width=24&text=T",
      school: "Wesley College Yenetu, Ibadan",
    },
    awayTeam: {
      name: "Anna",
      logo: "/placeholder.svg?height=24&width=24&text=A",
      school: "British Int'l College, Lagos",
    },
    time: "18:56",
    date: "Tomorrow",
    venue: "British Int'l College, Lagos",
    status: "upcoming",
  },
  {
    id: "3",
    homeTeam: {
      name: "Riley",
      logo: "/placeholder.svg?height=24&width=24&text=R",
      school: "Wesley College Yenetu, Ibadan",
    },
    awayTeam: {
      name: "Kubo",
      logo: "/placeholder.svg?height=24&width=24&text=K",
      school: "British Int'l College, Lagos",
    },
    time: "16:30",
    date: "Wednesday",
    venue: "Wesley College Yenetu, Ibadan",
    status: "upcoming",
  },
  {
    id: "4",
    homeTeam: {
      name: "Disha",
      logo: "/placeholder.svg?height=24&width=24&text=D",
      school: "Wesley College Yenetu, Ibadan",
    },
    awayTeam: {
      name: "Condo",
      logo: "/placeholder.svg?height=24&width=24&text=C",
      school: "British Int'l College, Lagos",
    },
    time: "14:45",
    date: "Yesterday",
    score: { home: 8, away: 15 },
    venue: "British Int'l College, Lagos",
    status: "completed",
  },
]
