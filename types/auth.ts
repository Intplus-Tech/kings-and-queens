import { CombinedRegistrationForm, SignInForm } from "@/lib/validations"

export interface signIn {
  email: string
  password: string
}

export interface SignInFormProps {
  onSubmit: (data: SignInForm) => void
  isLoading: boolean
}


export interface CombinedRegistrationFormProps {
  onsubmit: (data: CombinedRegistrationForm) => void
  onback: () => void
  isLoading: boolean
}


export interface AuthResponse {
  token: string
  user?: {
    _id: string
    email: string
    password: string
    isVerified: boolean
    verificationToken: string
    verificationTokenExpiresAt: string
    status: string
    role: string
    coordinatorId: string
    createdAt: string
    updatedAt: string
  }
}

export interface UserSettings {
  pushNotification: boolean
  mode: string
}

export interface LoggedInUser {
  settings: UserSettings
  isProfileComplete: boolean
  _id: string
  fullName: string
  email: string
  phoneNumber: string
  userType: string
  companyName: string
  address: string
  industry: string
  createdAt: string
  updatedAt: string
}

export interface signUpData {
  email: string
  fullName: string
  password: string
  confirmPassword: string
  industry: string
  address: string
  companyName: string
  city: string
  state: string
  country: string
  zipCode: string
  termsAccepted: boolean
}
