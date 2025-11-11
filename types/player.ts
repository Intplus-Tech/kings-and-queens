
export interface Player {
  _id: string
  schoolId: string
  alias: string
  name: string
  dob: string
  playerClass: string
  phoneNumber: string
  isCaptain: boolean
  isViceCaptain: boolean
  token: string
  elo: number
  rating: number
  ratingDeviation: number
  ratingVolatility: number
  type: string
  createdAt: string
  updatedAt: string
  // password: string
}