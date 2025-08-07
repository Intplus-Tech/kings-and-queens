"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { createPlayerPasswordAction } from "@/lib/actions/players/create-password.action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "../../_components/auth_layouts"

const formSchema = z.object({
  alias: z.string().min(2, "Alias is required"),
  playerId: z.string().min(2, "Player ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export default function JoinTeamPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      alias: "",
      playerId: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)
    console.log("Form submitted with values:", values)

    const result = await createPlayerPasswordAction({
      alias: values.alias,
      playerId: values.playerId,
      password: values.password,
    })
    setIsSubmitting(false)
    if (result.success) {
      setSuccess(result.message || "Password set successfully!")
      setTimeout(() => router.push("/auth/player-signin"), 2000)
    } else {
      setError(result.error || "Failed to set password")
    }
  }

  return (
    <AuthLayout>
      <div className="bg-muted/20 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">Join Your Team</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-white mb-1">Alias</label>
            <Input
              {...form.register("alias")}
              placeholder="Enter your alias"
              className="bg-[#18181b] text-white"
            />
            {form.formState.errors.alias && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.alias.message}</p>
            )}
          </div>
          <div>
            <label className="block text-white mb-1">Player ID</label>
            <Input
              {...form.register("playerId")}
              placeholder="Enter your Player ID"
              className="bg-[#18181b] text-white"
            />
            {form.formState.errors.playerId && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.playerId.message}</p>
            )}
          </div>
          <div>
            <label className="block text-white mb-1">Create Password</label>
            <Input
              {...form.register("password")}
              type="password"
              placeholder="New Password"
              className="bg-[#18181b] text-white"
            />
            {form.formState.errors.password && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="block text-white mb-1">Re-Enter Password</label>
            <Input
              {...form.register("confirmPassword")}
              type="password"
              placeholder="New Password"
              className="bg-[#18181b] text-white"
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <Button
            type="submit"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Joining..." : "Join Team"}
          </Button>
        </form>
        <button
          className="mt-4 text-yellow-400 hover:underline text-sm"
          onClick={() => router.push("/auth/player-signin")}
        >
          Sign In
        </button>
      </div>
    </AuthLayout>

  )
}