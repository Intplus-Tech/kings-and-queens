"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { emailVerificationSchema, type EmailVerificationForm } from "@/lib/validations"
import { AuthLayout } from "../_components/auth_layouts"

export default function EmailVerificationPage() {
  const [otp, setOtp] = useState(["", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EmailVerificationForm>({
    resolver: zodResolver(emailVerificationSchema),
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Update form value
    setValue("otp", newOtp.join(""))

    // Move to next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const onSubmit = async (data: EmailVerificationForm) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("OTP verified:", data.otp)
    // Redirect to dashboard or success page
  }

  const resendOtp = async () => {
    // Simulate resend API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setTimeLeft(300)
    setOtp(["", "", "", "", ""])
    inputRefs.current[0]?.focus()
  }

  return (
    <AuthLayout>
      <div className="bg-muted/20 backdrop-blur-sm rounded-lg p-8 border">
        <h1 className="text-2xl font-bold text-center mb-2">Email Verification</h1>
        <p className="text-center text-xs text-muted-foreground mb-6">
          Enter the code sent to your email
          <br />
          <span className="text-primary">user@example.com</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold"
              />
            ))}
          </div>

          {errors.otp && <p className="text-red-400 text-sm text-center">{errors.otp.message}</p>}

          <Button
            type="submit"
            disabled={isSubmitting || otp.join("").length !== 5}
            className="w-full"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">
              {timeLeft > 0 ? `${formatTime(timeLeft)} Remaining` : "Code expired"}
            </p>
            <button
              type="button"
              onClick={resendOtp}
              disabled={timeLeft > 0}
              className="text-orange-400 hover:text-orange-300 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend Code
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}
