"use server"

import { combinedRegistrationSchema } from "@/lib/validations"
import { cookies } from "next/headers"

interface RegistrationResponse {
  success: boolean
  status: number
  message: string
  data: {
    newUser: {
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
    school: {
      name: string
      type: string
      address: string
      address2: string
      websiteUrl: string
      socialMedia: {
        twitter: string
        facebook: string
        instagram: string
      }
      status: string
      _id: string
      createdAt: string
      updatedAt: string
      logoUrl: string
    }
    coordinator: {
      schoolId: string
      name: string
      phoneNumber: string
      whatsAppNumber: string
      position: string
      termsAccepted: boolean
      _id: string
      createdAt: string
      updatedAt: string
    }
  }
}

// Simulate image upload - returns a placeholder URL
async function simulateImageUpload(file: File | null): Promise<string> {
  if (!file) {
    return "https://placeholder-logo-url.com/default-school-logo.png"
  }

  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return a placeholder URL based on file name
  return `https://placeholder-logo-url.com/${file.name.replace(/\s+/g, "-").toLowerCase()}`
}

export async function registerAction(formData: FormData) {
  try {
    // Extract and validate form data
    const rawData = {
      schoolName: formData.get("schoolName") as string,
      schoolType: formData.get("schoolType") as string,
      fullAddress: formData.get("fullAddress") as string,
      addressLine2: (formData.get("addressLine2") as string) || "",
      phone: formData.get("phone") as string,
      schoolEmail: formData.get("schoolEmail") as string,
      website: (formData.get("website") as string) || "",
      facebook: (formData.get("facebook") as string) || "",
      instagram: (formData.get("instagram") as string) || "",
      twitter: (formData.get("twitter") as string) || "",
      coordinatorName: formData.get("coordinatorName") as string,
      coordinatorEmail: formData.get("coordinatorEmail") as string,
      coordinatorPhone: formData.get("coordinatorPhone") as string,
      whatsappNumber: formData.get("whatsappNumber") as string,
      position: formData.get("position") as string,
      password: formData.get("password") as string,
      logo: formData.get("logo") as File,
    }

    // Validate the data
    const validatedData = combinedRegistrationSchema.parse(rawData)

    // Simulate logo upload
    const logoUrl = await simulateImageUpload(validatedData.logo as File)

    // Prepare API request body to match expected structure
    const requestBody = {
      schoolEmail: validatedData.schoolEmail,
      schoolName: validatedData.schoolName,
      schoolPhoneNumber: validatedData.phone,
      type: validatedData.schoolType,
      address: validatedData.fullAddress,
      address2: validatedData.addressLine2 || "",
      websiteUrl: validatedData.website || "",
      socialMedia: {
        twitter: validatedData.twitter || "",
        facebook: validatedData.facebook || "",
        instagram: validatedData.instagram || "",
      },
      coordinatorEmail: validatedData.coordinatorEmail,
      password: validatedData.password,
      coordinatorName: validatedData.coordinatorName,
      position: validatedData.position,
      coordinatorPhoneNumber: validatedData.coordinatorPhone,
      coordinatorWhatsAppNumber: validatedData.whatsappNumber,
      logoUrl: logoUrl,
      role: "coordinator",
      termsAccepted: true,
    }

    console.log("Registration request body:", requestBody)

    // Make API call
    if (!process.env.BASE_URL) {
      throw new Error("BASE_URL environment variable is missing")
    }

    const response = await fetch(`${process.env.BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Registration failed" }))
      console.error("Registration failed:", {
        status: response.status,
        error: errorData.message,
      })
      return {
        success: false,
        error: errorData.message || "Registration failed. Please try again.",
      }
    }

    const registrationData: RegistrationResponse = await response.json()

    if (!registrationData.success) {
      return {
        success: false,
        error: registrationData.message || "Registration failed",
      }
    }

    console.log("Registration successful:", {
      message: registrationData.message,
      // userId: registrationData.data.newUser._id,
      // schoolId: registrationData.data.school._id,
      // coordinatorId: registrationData.data.coordinator._id,
      data: registrationData.data,
    })

    // Store verification email for the next step
    const cookieStore = await cookies()
    cookieStore.set("verification_email", registrationData.data.newUser.email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 15, // 15 minutes
      sameSite: "strict",
      path: "/",
    })

    return {
      success: true,
      message: registrationData.message,
      data: registrationData.data,
      redirectTo: "/auth/email-verification",
    }
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof Error) {
      // Handle validation errors
      if (error.message.includes("validation")) {
        return {
          success: false,
          error: "Please check all required fields and try again.",
        }
      }
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}
