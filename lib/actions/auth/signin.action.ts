"use server"

import type { SignInForm } from "@/lib/validations"
import { cookies } from "next/headers"
import type { AuthResponse } from "@/types/auth"
import { redirect } from "next/navigation"

export async function logInAction(values: SignInForm) {
  try {
    if (!process.env.BASE_URL) {
      throw new Error("BASE_URL environment variable is missing. Please configure it in .env.local.")
    }

    const url = `${process.env.BASE_URL}/auth/login`
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Server error" }))
      console.error("Login failed:", {
        status: response.status,
        error: errorData.message || "No error details available",
      })
      return { error: errorData.message || "Login failed. Please check your credentials." }
    }

    const authData: AuthResponse = await response.json()

    if (!authData.success || !authData.data?.token) {
      console.error("Invalid authentication response:", authData)
      return { error: "Authentication failed: Invalid response from server." }
    }

    const cookieStore = await cookies()
    cookieStore.set("k_n_q_auth_token", authData.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "strict",
      path: "/",
    })


    const userRole = authData.data.user.role
    const redirectPath = userRole === "coordinator" ? "/coordinator" : "/player"

    return {
      success: true,
      user: authData.data.user,
      redirectTo: redirectPath,
    }


  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error during login"
    console.error("Unexpected error in log-in action:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    })
    return { error: "An unexpected error occurred. Please try again later." }
  }
}


export async function logOutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('k_n_q_auth_token')

  redirect('/sign-in')
}
