"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { signInSchema, type SignInForm } from "@/lib/validations"
import { AuthLayout } from "../../_components/auth_layouts"
import { ToastAction } from "@/components/ui/toast"
import { useState } from "react"
import { logInAction } from "@/lib/actions/auth/signin.action"
import { CheckCircle, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleSignIn = async (data: SignInForm) => {
    try {
      setIsLoading(true)
      const result = await logInAction(data)

      if (result.success) {
        toast({
          title: "Welcome Back",
          description: "Sign in successful",
          action: (
            <ToastAction
              disabled
              altText="success"
              className="h-[60px] w-[60px] border-none disabled:opacity-100"
            >
              <CheckCircle className="h-20 w-20 text-green-500" />
            </ToastAction>
          ),
        })
        const callbackUrl = new URLSearchParams(window.location.search).get('callbackUrl') || '/'
        window.location.href = callbackUrl
      } else {
        console.log("Sign in error:", result.error);
        // Show error toast
        toast({
          title: "Error",
          description: result.error || "An unexpected error occurred.",
          variant: "destructive",
          action: (
            <ToastAction
              disabled
              altText="error"
              className="h-[60px] w-[60px] border-none disabled:opacity-100"
            >
              <XCircle className="h-20 w-20 text-red-500" />
            </ToastAction>
          ),
        })
      }
    } catch (error: any) {
      console.error("Error during sign in:", error)
      // Show error toast
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
        action: (
          <ToastAction
            disabled
            altText="error"
            className="h-[60px] w-[60px] border-none disabled:opacity-100"
          >
            <XCircle className="h-20 w-20 text-red-500" />
          </ToastAction>
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="bg-muted/20 backdrop-blur-sm rounded-lg p-8 border">
        <div className="flex items-center justify-center mb-6">
          <div className="text-4xl mr-3">♔</div>
          <div>
            <h1 className="text-xl font-bold">Kings & Queens</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email/Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email or username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="text-right text-xs">
              <Link href="/auth/forgot-password" className="text-primary">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading || form.formState.isSubmitting}
              className="w-full"
            >
              {isLoading || form.formState.isSubmitting ? "Signing In..." : "Sign In"}
            </Button>

            <div className="text-center text-xs">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Register here
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </AuthLayout>
  )
}