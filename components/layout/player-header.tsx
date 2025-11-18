"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import {
  Bell,
  Home,
  User,
  Gamepad2,
  Trophy,
  GraduationCap,
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { logOutAction } from "@/lib/actions/auth/signin.action";
import { SchoolData } from "@/types/school";
import { PlayerData } from "@/types/user";

interface PlayProps {
  user?: {
    success: boolean;
    status: number;
    message: string;
    data?: PlayerData;
    school?: SchoolData;
    error?: string;
  };
}

const navLinks = [
  { name: "Home", href: "/player", icon: Home },
  { name: "Play", href: "/player/play", icon: Gamepad2 },
  { name: "Points", href: "/player/points", icon: Trophy },
  { name: "Learn", href: "/player/learn", icon: GraduationCap },
];

export function PlayerHeader({ user }: PlayProps) {
  const pathname = usePathname();
  const router = useRouter();

  const player =
    user?.data && Array.isArray(user.data) ? user.data[0] : user?.data;

  const schoolName = user?.school?.name || "Wesley College, Ibadan";
  const playerName = player?.name || "Kayode";

  const handleLogout = async () => {
    await logOutAction();
    router.refresh();
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="bg-background border-b">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* LEFT: LOGO */}
        <Link href="/player" className="flex items-center gap-3">
          <Image
            src="/chess-pieces-2.png"
            alt="Chess Pieces"
            width={40}
            height={40}
          />
          <div className="hidden sm:block">
            <h1 className="font-bold text-lg">Kings & Queens</h1>
            <p className="text-muted-foreground text-xs">{schoolName}</p>
          </div>
        </Link>

        {/* CENTER: DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map(({ name, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link key={name} href={href}>
                <Button
                  variant="ghost"
                  className={`flex items-center gap-1 ${
                    active
                      ? "text-primary shadow-sm ring-1 ring-primary/20"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon
                    className="h-5 w-5"
                    {...(active ? { fill: "#E3A43A", stroke: "#E3A43A" } : {})}
                  />
                  <span>{name}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: USER & NOTIFICATIONS */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-10 w-10 p-0">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline text-sm">{playerName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/player/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/player/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* MOBILE NAV */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden h-10 w-10 p-0">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="w-64 p-0">
              {/* SHEET HEADER */}
              <div className="flex items-center gap-3 px-4 py-4 border-b">
                <Image
                  src="/chess-pieces-2.png"
                  alt="Chess"
                  width={32}
                  height={32}
                />
                <div>
                  <h1 className="font-semibold text-base">Kings & Queens</h1>
                  <p className="text-xs text-muted-foreground">{schoolName}</p>
                </div>
              </div>

              {/* MOBILE NAV LINKS */}
              <nav className="flex flex-col gap-1 p-4">
                {navLinks.map(({ name, href, icon: Icon }) => {
                  const active = isActive(href);
                  return (
                    <Link key={name} href={href}>
                      <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 py-2 ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {name}
                      </Button>
                    </Link>
                  );
                })}
              </nav>

              {/* SHEET FOOTER */}
              <div className="border-t p-4 flex flex-col gap-2">
                <Link href="/player/profile">
                  <Button variant="outline" className="w-full">
                    Profile
                  </Button>
                </Link>

                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
