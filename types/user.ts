export interface UserData {
  _id: string
  email: string
  isVerified: boolean
  verificationToken: string
  verificationTokenExpiresAt: string
  status: string
  role: string
  coordinatorId?: {
    _id: string
    schoolId: string
    name: string
    phoneNumber: string
    whatsAppNumber: string
    position: string
    termsAccepted: boolean
    createdAt: string
    updatedAt: string
  }
  createdAt: string
  updatedAt: string
}

export interface PlayerData {
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
  ratingDeviation: number
  ratingVolatility: number
  type: string
  createdAt: string
  updatedAt: string
  // password: string
}
