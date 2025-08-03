'use server'

import { SignInForm } from '@/lib/validations'
import { cookies } from 'next/headers'

export async function logInAction(values: SignInForm) {
  try {
    if (!process.env.BASE_URL) {
      throw new Error('Base URL is not set in environment variables.')
    }

    const url = `${process.env.BASE_URL}/auth/login`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error(
        'Error response status:',
        response.status,
        'Error body:',
        error
      )
      return { error: error.message || 'An error occurred during login.' }
    }

    const authData = await response.json()
    const token = authData?.data?.token

    console.log('auth data', authData);
    // console.log(token);

    if (!token) {
      return { error: 'Failed to retrieve token from server.' }
    }

    // Set the cookie using the cookies() API
    const cookieStore = await cookies()
    cookieStore.set('k_n_q_auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: 'strict',
      path: '/',
    });

    // console.log('Auth Token successfully stored in cookie.')
    return { success: true, user: authData.user || null }
  } catch (error) {
    console.error('Error in log-in action:', error)
    return { error: 'An unexpected error occurred while trying to log in.' }
  }
}