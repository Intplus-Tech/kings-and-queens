"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPasswordSchema, type ForgotPasswordForm } from "@/lib/validations"
import { AuthLayout } from "../_components/auth_layouts"

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Reset password email sent to:", data.email)
    setIsSubmitted(true)
  }

  return (
    <AuthLayout>
      <div className="bg-muted/20 backdrop-blur-sm rounded-lg p-8 border">
        <h1 className="text-2xl font-bold text-center mb-6">{isSubmitted ? "Check Your Email" : "Forgot Password"}</h1>

        {isSubmitted ? (
          <div className="text-center">
            <p className="text-gray-300 mb-6">We've sent a password reset link to your email address.</p>
            <Link href="/auth/sign-in" className="text-orange-400 hover:text-orange-300 transition-colors">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email to reset your password"
                {...register("email")}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Sending..." : "Reset Password"}
            </Button>

            <div className="text-center">
              <Link href="/auth/sign-in" className="text-primary text-sm">
                Go Back
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}
