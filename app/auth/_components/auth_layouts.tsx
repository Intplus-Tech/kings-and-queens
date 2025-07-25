import Image from "next/image"
import type { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
  backgroundImage?: string
}

export function AuthLayout({ children, backgroundImage }: AuthLayoutProps) {
  return (
    <div className="min-h-screen text-white relative overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src='/images/bg-image.png'
          alt="Chess pieces background"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">{children}</div>
    </div>
  )
}
