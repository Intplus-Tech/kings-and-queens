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