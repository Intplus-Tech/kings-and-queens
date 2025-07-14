import { AuthForm } from "@/components/auth/auth-form"

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold">Kings & Queens</h2>
          <p className="mt-2 text-center text-sm">Sign in to your account</p>
        </div>
        <AuthForm />
      </div>
    </div>
  )
}
