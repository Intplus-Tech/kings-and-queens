'use server'
import { signUpData } from "@/types/auth"

export async function signUpAction(formData: signUpData) {
  try {
    const url = `${process.env.BASE_URL}/auth/register`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })

    // console.log('Response Status:', response.status)

    if (!response.ok) {
      const error = await response.json()
      console.error('Error response:', error)

      return {
        error: error.message || 'An error occurred during registration.',
      }
    }

    // If everything goes well, return a success response
    return { success: true }
  } catch (error) {
    console.error('Error in sign-up action:', error)
    return { error: 'An unexpected error occurred while trying to register.' }
  }
}
