"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { playerSignInAction } from "@/lib/actions/players/player-signin.action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "../../_components/auth_layouts"

const formSchema = z.object({
  alias: z.string().min(2, "Alias is required"),
  password: z.string().min(6, "Password is required"),
})

export default function PlayerSignInPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      alias: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null)
    setIsSubmitting(true)
    const result = await playerSignInAction(values)
    setIsSubmitting(false)
    if (result.success) {
      router.push("/player")
    } else {
      setError(result.error || "Login failed")
    }
  }

  return (
    <AuthLayout>
      <div className="bg-muted/40 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-white mb-1">Alias</label>
            <Input
              {...form.register("alias")}
              placeholder="Sign in with your Alias"
              className="bg-[#18181b] text-white"
            />
            {form.formState.errors.alias && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.alias.message}</p>
            )}
          </div>
          <div>
            <label className="block text-white mb-1">Password</label>
            <Input
              {...form.register("password")}
              type="password"
              placeholder="Enter your Password"
              className="bg-[#18181b] text-white"
            />
            {form.formState.errors.password && (
              <p className="text-red-400 text-xs mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <Button
            type="submit"
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>
        </form>
        <button
          className="mt-4 text-yellow-400 hover:underline text-sm"
          onClick={() => router.push("/auth/join-team")}
        >
          Join A team
        </button>
      </div>
    </AuthLayout>
  )
}