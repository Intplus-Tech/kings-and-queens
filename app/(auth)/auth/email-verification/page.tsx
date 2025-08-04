"use client"

import { useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { emailVerificationSchema, type EmailVerificationForm } from "@/lib/validations"
import { AuthLayout } from "../../_components/auth_layouts"
import { resendVerificationAction, verifyEmailAction } from "@/lib/actions/auth/verify-email.action"

const TIMER_DURATION = 300 // 5 minutes in seconds
const TIMER_KEY = "email_verification_timer_start"

export default function EmailVerificationPage() {
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const [mainResendMessage, setMainResendMessage] = useState<string | null>(null)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [resendEmail, setResendEmail] = useState("")
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)
  const [cookieEmail, setCookieEmail] = useState<string | null | undefined>(undefined)

  // Get verification_email from cookies on mount (client-side) using js-cookie for reliability
  useEffect(() => {
    const email = Cookies.get("verification_email")
    setCookieEmail(email ?? null)

    // Timer persistence logic
    const timerStart = localStorage.getItem(TIMER_KEY)
    let secondsLeft = TIMER_DURATION
    if (timerStart) {
      const elapsed = Math.floor((Date.now() - Number(timerStart)) / 1000)
      secondsLeft = Math.max(TIMER_DURATION - elapsed, 0)
    } else {
      localStorage.setItem(TIMER_KEY, Date.now().toString())
    }
    setTimeLeft(secondsLeft)
  }, [])

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(TIMER_KEY)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmailVerificationForm>({
    resolver: zodResolver(emailVerificationSchema),
    defaultValues: {
      otp: "",
    },
  })

  const otp = watch("otp")

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const onSubmit = async (data: EmailVerificationForm) => {
    setError(null)
    startTransition(async () => {
      const result = await verifyEmailAction(data.otp)
      if (result.success && result.redirectTo) {
        router.push(result.redirectTo)
      } else {
        setError(result.error || "Verification failed. Please try again.")
      }
    })
  }

  const resendOtp = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setTimeLeft(TIMER_DURATION)
    localStorage.setItem(TIMER_KEY, Date.now().toString())
    setValue("otp", "")
  }

  // Resend verification handler for modal
  const handleResendVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setResendLoading(true)
    setResendMessage(null)
    const result = await resendVerificationAction(resendEmail)
    setResendLoading(false)
    setResendMessage(result.success ? "Verification email sent!" : result.error || "Failed to resend verification email.")
    if (result.success) {
      setTimeout(() => {
        setShowModal(false)
        setResendEmail("")
        setResendMessage(null)
      }, 2000)
      setTimeLeft(TIMER_DURATION)
      localStorage.setItem(TIMER_KEY, Date.now().toString())
    }
  }

  // Resend verification button logic
  const handleResendVerificationButton = async () => {
    setMainResendMessage(null)
    if (cookieEmail === undefined) return
    if (cookieEmail) {
      setResendLoading(true)
      const result = await resendVerificationAction(cookieEmail)
      setResendLoading(false)
      setMainResendMessage(result.success ? "Verification email sent!" : result.error || "Failed to resend verification email.")
      setTimeout(() => setMainResendMessage(null), 4000)
      setTimeLeft(TIMER_DURATION)
      localStorage.setItem(TIMER_KEY, Date.now().toString())
    } else {
      setShowModal(true)
    }
  }

  return (
    <AuthLayout>
      <div className="bg-muted/20 backdrop-blur-sm rounded-lg p-8 border">
        <h1 className="text-2xl font-bold text-center mb-2">Email Verification</h1>
        <p className="text-center text-xs text-muted-foreground mb-6">
          Enter the code sent to your email
          <br />
          <span className="text-primary">
            {cookieEmail ? cookieEmail : "your@email.com"}
          </span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setValue("otp", value)}
              disabled={isSubmitting || isPending}
              autoFocus
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, i) => (
                  <InputOTPSlot key={i} index={i} className="w-12 h-12 text-xl font-bold" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {(errors.otp || error) && (
            <p className="text-red-400 text-sm text-center">
              {errors.otp?.message || error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting || isPending || otp.length !== 6}
            className="w-full"
          >
            {(isSubmitting || isPending) ? "Verifying..." : "Verify OTP"}
          </Button>

          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">
              {timeLeft > 0 ? `${formatTime(timeLeft)} Remaining` : "Code expired"}
            </p>
            <button
              type="button"
              onClick={resendOtp}
              disabled={timeLeft > 0}
              className="text-orange-400 hover:text-orange-300 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed mr-2"
            >
              Resend Code
            </button>
            <button
              type="button"
              onClick={handleResendVerificationButton}
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={resendLoading || cookieEmail === undefined || timeLeft > 0}
            >
              Resend Verification Email
            </button>
            {mainResendMessage && (
              <p className={`mt-2 text-sm ${mainResendMessage.includes("sent") ? "text-green-600" : "text-red-500"}`}>
                {mainResendMessage}
              </p>
            )}
          </div>
        </form>
      </div>

      {/* Modal */}
      <Dialog open={showModal} onOpenChange={(open) => {
        setShowModal(open)
        if (!open) {
          setResendEmail("")
          setResendMessage(null)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resend Verification Email</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleResendVerification} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={resendEmail}
              onChange={e => setResendEmail(e.target.value)}
              required
              disabled={resendLoading}
            />
            <DialogFooter className="flex gap-2">
              <Button type="submit" disabled={resendLoading}>
                {resendLoading ? "Sending..." : "Send"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowModal(false)
                  setResendEmail("")
                  setResendMessage(null)
                }}
                disabled={resendLoading}
              >
                Cancel
              </Button>
            </DialogFooter>
            {resendMessage && (
              <p className={`text-sm ${resendMessage.includes("sent") ? "text-green-600" : "text-red-500"}`}>
                {resendMessage}
              </p>
            )}
          </form>
        </DialogContent>
      </Dialog>
    </AuthLayout>
  )
}