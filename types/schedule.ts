export interface Tournament {
  _id: string
  name: string
  startDate: string
  endDate: string
  location: string
  description: string
  participants: string[]
  games: string[]
  status: "active" | "completed" | "upcoming"
  type: "round-robin" | "knockout" | "swiss"
  currentRound: number
  rounds: any[]
  scores: any[]
  createdAt: string
  updatedAt: string
}

export interface Group {
  _id: string
  name: string
  tournamentId: string
  players: string[]
  stage: number
  maxPlayers: number
  status: "forming" | "active" | "completed"
  matches: string[]
  standings: any[]
  createdAt: string
  updatedAt: string
}

export interface Match {
  player1: string
  player2: string
  gameId: string
  scheduled: boolean
  _id: string
}

export interface Schedule {
  _id: string
  tournament: Tournament
  group: Group
  round: number
  matches: Match[]
  createdAt: string
  updatedAt: string
}
