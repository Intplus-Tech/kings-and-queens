"use server"

import { cookies } from "next/headers"

interface VerifyEmailResponse {
  success: boolean
  status: number
  message: string
  data?: any
}

export async function verifyEmailAction(verificationToken: string) {
  try {
    if (!process.env.BASE_URL) {
      throw new Error("BASE_URL environment variable is missing")
    }

    const response = await fetch(`${process.env.BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ verificationToken }),
    })

    const result: VerifyEmailResponse = await response.json()

    if (!response.ok || !result.success) {
      return {
        success: false,
        error: result.message || "Verification failed. Please try again.",
      }
    }

    return {
      success: true,
      message: result.message,
      data: result.data,
      redirectTo: "/auth/sign-in", // Add redirect path
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred.",
    }
  }
}




interface ResendVerificationResponse {
  success: boolean
  message: string
  error?: string
}

export async function resendVerificationAction(email: string): Promise<ResendVerificationResponse> {
  try {
    if (!process.env.BASE_URL) {
      throw new Error("BASE_URL environment variable is missing")
    }

    const response = await fetch(`${process.env.BASE_URL}/auth/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: "",
        error: result.message || "Failed to resend verification email.",
      }
    }

    return {
      success: true,
      message: result.message || "Verification email sent!",
    }
  } catch (error) {
    return {
      success: false,
      message: "",
      error: error instanceof Error ? error.message : "An unexpected error occurred.",
    }
  }
}