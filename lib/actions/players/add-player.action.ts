"use server"

import { cookies } from "next/headers"

interface AddPlayerResponse {
  success: boolean
  status: number
  message: string
  data?: any
  error?: string
}

export async function addPlayerAction(values: {
  fullName: string
  alias: string
  dob: string
  playerClass: string
  phone: string
}): Promise<AddPlayerResponse> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("k_n_q_auth_token")?.value

    if (!token) {
      return {
        success: false,
        status: 401,
        message: "Unauthorized: No token found",
        error: "No authentication token found",
      }
    }
    console.log(values)

    const response = await fetch(`${process.env.BASE_URL}/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        alias: values.alias,
        name: values.fullName,
        dob: values.dob,
        playerClass: values.playerClass,
        phoneNumber: values.phone,
      }),
    })

    const result = await response.json()

    console.log(result)

    if (!response.ok || !result.success) {
      return {
        success: false,
        status: response.status,
        message: result.message || "Failed to add player",
        error: result.error || result.message,
      }
    }

    console.log("Player added successfully:", result.data)

    return {
      success: true,
      status: result.status,
      message: result.message,
      data: result.data,
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