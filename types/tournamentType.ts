export interface Tournament {
  _id: string
  name: string
  startDate: string
  endDate: string
  location: string
  description: string
  participants: string[]
  games: any[]
  status: string
  type: string
  currentRound: number
  rounds: any[]
  scores: any[]
  createdAt: string
  updatedAt: string
}