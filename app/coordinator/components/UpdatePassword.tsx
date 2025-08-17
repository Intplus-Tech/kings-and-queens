"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Loader2, CheckCircle, XCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Enhanced password validation schema
const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type PasswordFormData = z.infer<typeof passwordSchema>

// Mock server action - replace with actual implementation
async function updatePassword(data: PasswordFormData) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))
  console.log("Updating password for user")
  // Simulate potential errors
  // throw new Error("Current password is incorrect");
  return { success: true }
}

export default function UpdatePassword() {
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  const {
    formState: { errors, isDirty, isValid },
    watch,
  } = form
  const newPassword = watch("newPassword")

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[@$!%*?&]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(newPassword || "")
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]

  const handleSubmit = async (data: PasswordFormData) => {
    startTransition(async () => {
      try {
        const result = await updatePassword(data)

        if (result.success) {
          toast({
            title: "Success",
            description: "Password updated successfully",
          })
          form.reset() // Clear form after successful update
        } else {
          throw new Error("Failed to update password")
        }
      } catch (error) {
        console.error("Failed to update password:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to update password",
          variant: "destructive",
        })
      }
    })
  }

  const handleReset = () => {
    form.reset()
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Update Password</h2>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="oldPassword" className="text-sm text-white mb-2 block">
            Current Password *
          </Label>
          <div className="relative">
            <Input
              id="oldPassword"
              {...form.register("oldPassword")}
              type={showOldPassword ? "text" : "password"}
              placeholder="Enter current password"
              className="bg-[#2C2C2E] text-white border-gray-600 pr-10"
              disabled={isPending}
              aria-invalid={errors.oldPassword ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              disabled={isPending}
            >
              {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.oldPassword && (
            <p className="text-sm text-destructive mt-1" role="alert">
              {errors.oldPassword.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="newPassword" className="text-sm text-white mb-2 block">
            New Password *
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              {...form.register("newPassword")}
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              className="bg-[#2C2C2E] text-white border-gray-600 pr-10"
              disabled={isPending}
              aria-invalid={errors.newPassword ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              disabled={isPending}
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-destructive mt-1" role="alert">
              {errors.newPassword.message}
            </p>
          )}

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 w-4 rounded ${level <= passwordStrength ? strengthColors[passwordStrength - 1] : "bg-gray-600"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">{strengthLabels[passwordStrength - 1] || "Very Weak"}</span>
              </div>

              {/* Password Requirements */}
              <div className="text-xs space-y-1">
                <div
                  className={`flex items-center gap-1 ${newPassword.length >= 8 ? "text-green-400" : "text-gray-400"}`}
                >
                  {newPassword.length >= 8 ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  At least 8 characters
                </div>
                <div
                  className={`flex items-center gap-1 ${/[a-z]/.test(newPassword) ? "text-green-400" : "text-gray-400"}`}
                >
                  {/[a-z]/.test(newPassword) ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  One lowercase letter
                </div>
                <div
                  className={`flex items-center gap-1 ${/[A-Z]/.test(newPassword) ? "text-green-400" : "text-gray-400"}`}
                >
                  {/[A-Z]/.test(newPassword) ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  One uppercase letter
                </div>
                <div
                  className={`flex items-center gap-1 ${/\d/.test(newPassword) ? "text-green-400" : "text-gray-400"}`}
                >
                  {/\d/.test(newPassword) ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                  One number
                </div>
                <div
                  className={`flex items-center gap-1 ${/[@$!%*?&]/.test(newPassword) ? "text-green-400" : "text-gray-400"}`}
                >
                  {/[@$!%*?&]/.test(newPassword) ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <XCircle className="h-3 w-3" />
                  )}
                  One special character (@$!%*?&)
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-sm text-white mb-2 block">
            Confirm New Password *
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              {...form.register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your new password"
              className="bg-[#2C2C2E] text-white border-gray-600 pr-10"
              disabled={isPending}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              disabled={isPending}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive mt-1" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button
            type="submit"
            disabled={isPending || !isDirty || !isValid}
            className="bg-yellow-400 text-black hover:bg-yellow-500 w-[180px] mt-8"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>

          {isDirty && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isPending}
              className="mt-8 bg-transparent"
            >
              Reset
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
