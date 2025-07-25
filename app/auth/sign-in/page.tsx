"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInSchema, type SignInForm } from "@/lib/validations"
import { AuthLayout } from "../_components/auth_layouts"

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInForm) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Sign in:", data)
    // Redirect to dashboard
  }

  return (
    <AuthLayout >
      <div className="bg-muted/20 backdrop-blur-sm rounded-lg p-8 border">
        <div className="flex items-center justify-center mb-6">
          <div className="text-4xl mr-3">♔</div>
          <div>
            <h1 className="text-xl font-bold">Kings & Queens</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="emailOrUsername" className="text-white">
              Email/Username
            </Label>
            <Input
              id="emailOrUsername"
              placeholder="Enter your email or username"
              className=""
              {...register("emailOrUsername")}
            />
            {errors.emailOrUsername && <p className="text-red-400 text-sm mt-1">{errors.emailOrUsername.message}</p>}
          </div>

          <div>
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              className=""
              {...register("password")}
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="text-right text-xs">
            <Link
              href="/auth/forgot-password"
              className="text-primary"
            >
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>

          <div className="text-center text-xs">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}
