"use client"

import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

import { Bell, Home, User, Gamepad2, Trophy, GraduationCap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AdminHeaderProps {
  userRole: "player" | "coordinator" | "admin"
}

const navLinks = [
  { name: "Home", href: "/player", icon: Home },
  { name: "Play", href: "/player/play", icon: Gamepad2 },
  { name: "Points", href: "/player/points", icon: Trophy },
  { name: "Learn", href: "/player/learn", icon: GraduationCap },
]

export function AdminHeader({ userRole }: AdminHeaderProps) {
  const pathname = usePathname()

  return (
    <header className="flex items-center justify-between border-b py-4 px-8 bg-background">
      {/* Left side - Logo and title */}
      <div className="flex items-center gap-3 whitespace-nowrap w-[30%]">
        <Image
          src="/chess-pieces-2.png"
          alt="Chess Pieces"
          width={40}
          height={40}
        />
        <div>
          <h1 className="font-bold text-2xl">Kings & Queens</h1>
          <p className="text-muted-foreground text-sm">Wesley College, Ibadan</p>
        </div>
      </div>

      <div className='flex items-center justify-between w-full'>
        {/* Center - User greeting */}
        <div className="flex flex-col items-center">
          <h2 className="font-bold text-xl">Hello, Kayode</h2>
          <p className="text-muted-foreground text-sm">British Int&apos;l School, Lagos</p>
        </div>

        {/* Right side - Navigation */}
        <div className="flex items-center gap-6">
          {navLinks.map(({ name, href, icon: Icon }) => {
            const isActive = pathname === href

            return (
              <Link href={href} key={name}>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-1 h-auto py-2 px-3 text-base ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive ? 
                  (
                    <Icon className="h-5 w-5" fill={"#E3A43A"} stroke={"#E3A43A"}/> 
                  ) : (
                    <Icon className="h-5 w-5"/> 
                  )
                  }
                  <span>{name}</span>
                </Button>
              </Link>
            )
          })}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 h-auto py-2 px-3 text-muted-foreground hover:text-foreground">
                <User className="h-5 w-5" fill={"#E3A43A"} />
                <span className="text-xs">Me</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
