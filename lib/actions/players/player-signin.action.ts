"use server"

import { cookies } from "next/headers"

interface PlayerSignInResponse {
  success: boolean
  status: number
  message?: string
  data?: {
    token?: string
    player: {
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
      password: string
    }
  }
  error?: string
}

export async function playerSignInAction(values: {
  alias: string
  password: string
}) {

  // console.log("Player Sign-In Action Invoked", values);

  // // normalize alias to lowercase and trim before sending
  // if (typeof values.alias === "string") {
  //   values.alias = values.alias.trim().toLowerCase()
  // }


  // console.log(values);

  try {
    const response = await fetch(`${process.env.BASE_URL}/auth/player/login`, {
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

    const authData: PlayerSignInResponse = await response.json()

    if (!authData.success || !authData.data?.token) {
      console.error("Invalid authentication response:", authData)
      return { error: "Authentication failed: Invalid response from server." }
    }


    // Set the authentication token cookie
    const cookieStore = await cookies()
    cookieStore.set("k_n_q_auth_token", authData.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day in seconds
      sameSite: "strict",
      path: "/",
    })

    console.log("Login successful:", {
      message: authData.message,
      user: { ...authData.data.player, password: "***REDACTED***" },
    })
    // Return success with redirect path instead of redirecting here
    const redirectPath = "/player"

    return {
      success: true,
      user: authData.data.player,
      redirectTo: redirectPath,
    }


  } catch (error) {
    return {
      success: false,
      status: 500,
      message: "An error occurred",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}