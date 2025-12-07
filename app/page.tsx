"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  Menu,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/public/logo.svg";
import bgImage from "@/public/bg-image.jpg";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/register", label: "Join a League" },
  { href: "/rules", label: "Tournament Rules" },
  { href: "/leaderboard", label: "Leaderboard" },
];

const socials = [
  {
    href: "https://instagram.com",
    icon: Instagram,
    label: "Instagram",
    bg: "bg-pink-600",
  },
  {
    href: "https://linkedin.com",
    icon: Linkedin,
    label: "LinkedIn",
    bg: "bg-blue-600",
  },
  {
    href: "https://facebook.com",
    icon: Facebook,
    label: "Facebook",
    bg: "bg-blue-800",
  },
];

export default function HomePage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioMuted, setAudioMuted] = useState(true);

  // Kick off background audio after user interaction
  useEffect(() => {
    const audio = new Audio("/videos/bg-video.mp4");
    audio.loop = true;
    audio.volume = 0.35;
    audio.muted = audioMuted;
    audioRef.current = audio;

    const enableAudio = () => {
      if (!audioRef.current) return;
      audioRef.current.muted = audioMuted;
      audioRef.current.play().catch(() => undefined);
      window.removeEventListener("click", enableAudio);
    };

    window.addEventListener("click", enableAudio);

    return () => {
      window.removeEventListener("click", enableAudio);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioMuted]);

  // React to mute state changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = audioMuted;
    if (!audioMuted) {
      audioRef.current.play().catch(() => undefined);
    }
  }, [audioMuted]);

  const playClickSound = () => {
    const audio = new Audio("/audio/mixkit-classic-click-1117.wav");
    audio.volume = 0.8;
    void audio.play();
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt="Battle of the Knights background"
          priority
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0" />
        <div className="absolute inset-0" />
      </div>

      <button
        onClick={() => setAudioMuted((prev) => !prev)}
        className="fixed bottom-4 left-6 z-40 bg-black/65 hover:bg-black/80 text-white rounded-full p-3 shadow-lg transition-colors"
        aria-label={
          audioMuted ? "Unmute background audio" : "Mute background audio"
        }
        style={{ backdropFilter: "blur(4px)" }}
      >
        {audioMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </button>

      <div className="relative z-10 flex flex-col min-h-screen px-4 sm:px-6">
        <header className="w-full max-w-6xl mx-auto pt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={logo}
              alt="Battle of the Knights logo"
              width={68}
              height={88}
              className="drop-shadow-lg"
              priority
            />
            <div className="leading-tight">
              <p className="text-[11px] uppercase tracking-[0.22em] text-amber-200">
                Battle of the
              </p>
              <p className="text-xl font-semibold text-amber-300 hero-display">
                Knights
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-sm font-semibold">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-amber-100 hover:text-amber-300 transition-colors tracking-wide"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
            <Link
              href="/live-games"
              className="rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 px-5 py-3 text-sm font-semibold text-gray-900 shadow-lg shadow-amber-500/25 transition-transform hover:-translate-y-0.5"
            >
              Watch Live
            </Link>
          </div>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-black/85 backdrop-blur-md border-amber-500/30 text-white"
              >
                <div className="flex flex-col gap-4 mt-8">
                  {navItems
                    .concat({ href: "/live-games", label: "Watch Live" })
                    .map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-lg font-semibold text-amber-100 hover:text-amber-300 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center py-12">
          <div className="relative max-w-4xl text-center space-y-6">
            <p className="hero-subtitle text-lg sm:text-xl text-amber-100/95">
              Nigeria’s Premier Chess Championship
            </p>
            <h1 className="hero-display text-4xl sm:text-6xl md:text-7xl font-semibold text-amber-300 drop-shadow-[0_10px_35px_rgba(0,0,0,0.55)]">
              Where Strategy Becomes Legend
            </h1>

            <div className="flex items-center justify-center gap-4 pt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    onClick={playClickSound}
                    className="golden-btn group inline-flex items-center gap-2 px-8 py-3 text-lg font-semibold"
                    aria-label="Sign in options"
                  >
                    Sign In
                    <ChevronDown className="h-5 w-5 text-white transition group-hover:translate-y-[1px]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-2 w-56 bg-black/90 backdrop-blur-md border border-amber-500/40 text-amber-50">
                  <DropdownMenuItem
                    className="hover:bg-amber-500/20 cursor-pointer"
                    onClick={playClickSound}
                  >
                    <Link href="/auth/player-signin" className="w-full">
                      Sign in as Player
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="hover:bg-amber-500/20 cursor-pointer"
                    onClick={playClickSound}
                  >
                    <Link href="/auth/sign-in" className="w-full">
                      Sign in as Coordinator
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </main>

        <div className="hidden md:flex flex-col gap-3 items-center absolute left-6 top-1/2 -translate-y-1/2">
          {socials.map((social) => {
            const Icon = social.icon;
            return (
              <Link
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className={`${social.bg} w-9 h-9 rounded-lg flex items-center justify-center hover:brightness-110 transition shadow-lg shadow-black/40`}
                target="_blank"
                rel="noreferrer"
              >
                <Icon className="w-4 h-4 text-white" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
