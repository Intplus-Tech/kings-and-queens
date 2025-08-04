import { z } from "zod"

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const schoolRegistrationSchema = z.object({
  schoolName: z.string().min(1, "School name is required"),
  schoolType: z.string().min(1, "Please select a school type"),
  fullAddress: z.string().min(1, "Full address is required"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  schoolEmail: z.string().email("Please enter a valid email address"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  logo: z.any().optional(),
})

export const coordinatorRegistrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  whatsappNumber: z.string().min(10, "Please enter a valid WhatsApp number"),
  position: z.string().min(1, "Please select a position"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const combinedRegistrationSchema = z.object({
  // School Information (Step 1)
  schoolName: z.string().min(1, "School name is required"),
  schoolType: z.string().min(1, "Please select a school type"),
  fullAddress: z.string().min(1, "Full address is required"),
  addressLine2: z.string().optional(),
  phone: z.string().min(10, "Please enter a valid phone number"),
  schoolEmail: z.string().email("Please enter a valid email address"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  logo: z.any().optional(),

  // Coordinator Information (Step 2)
  coordinatorName: z.string().min(1, "Full name is required"),
  coordinatorEmail: z.string().email("Please enter a valid email address"),
  coordinatorPhone: z.string().min(10, "Please enter a valid phone number"),
  whatsappNumber: z.string().min(10, "Please enter a valid WhatsApp number"),
  position: z.string().min(1, "Please select a position"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const emailVerificationSchema = z.object({
  otp: z.string().length(6, "Please enter the complete 6-digit code"),
})

export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>
export type SignInForm = z.infer<typeof signInSchema>
export type SchoolRegistrationForm = z.infer<typeof schoolRegistrationSchema>
export type CoordinatorRegistrationForm = z.infer<typeof coordinatorRegistrationSchema>
export type CombinedRegistrationForm = z.infer<typeof combinedRegistrationSchema>
export type EmailVerificationForm = z.infer<typeof emailVerificationSchema>
