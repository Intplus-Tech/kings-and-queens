"use server"

interface CreatePasswordResponse {
  success: boolean
  status: number
  message: string
  data?: any
  error?: string
}

export async function createPlayerPasswordAction(values: {
  playerId: string
  password: string
  alias: string
}): Promise<CreatePasswordResponse> {
  try {
    console.log("Creating player password with values:", values);

    if (!values.playerId || !values.password || !values.alias) {
      return {
        success: false,
        status: 400,
        message: "Player ID, password, and alias are required",
        error: "Missing required fields",
      }
    }

    const response = await fetch(`${process.env.BASE_URL}/auth/player/create-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })

    const result = await response.json()

    console.log("Create Password Response:", result);


    if (!response.ok || !result.success) {
      return {
        success: false,
        status: response.status,
        message: result.message || "Failed to set password",
        error: result.error || result.message,
      }
    }

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