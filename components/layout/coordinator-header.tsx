"use client";

import { Bell, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { logOutAction } from "@/lib/actions/auth/signin.action";
import type { UserData } from "@/types/user";
import type { SchoolData } from "@/types/school";
import { useState } from "react";
import { useSidebar } from "@/components/ui/sidebar";

interface CoordinatorHeaderProps {
  userRole?: "player" | "coordinator" | "admin" | "Dashboard";
  userData?: UserData | null;
  schoolData?: SchoolData | null;
}

export function CoordinatorHeader({
  userRole,
  userData,
  schoolData,
}: CoordinatorHeaderProps) {
  const router = useRouter();
  const { toggleSidebar } = useSidebar();
  const [notificationCount] = useState(3);

  const coordinatorName = userData?.coordinatorId?.name || "Coordinator";
  const schoolName = schoolData?.name || "Your School";

  const handleLogout = async () => {
    await logOutAction();
    router.refresh();
  };

  const handleProfileClick = () => {
    router.push("/coordinator/settings");
  };

  return (
    <header className="sticky top-0 z-40 border-b backdrop-blur-md h-20">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section - Sidebar Trigger & Welcome Message */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Mobile Sidebar Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors flex-shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Welcome Message */}
          <div className="flex flex-col min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-bold text-white capitalize truncate">
              {userRole}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 truncate">
              Welcome back{" "}
              <span className="font-semibold text-slate-300">
                {coordinatorName}
              </span>{" "}
              • <span className="hidden sm:inline">{schoolName}</span>
            </p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 sm:gap-4 ml-4">
          {/* Notification Bell */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-yellow-400 rounded-full animate-pulse" />
              )}
            </Button>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-slate-800 border-slate-700"
            >
              <div className="px-2 py-1.5 text-sm border-b border-slate-700">
                <p className="font-semibold text-slate-100">
                  {coordinatorName}
                </p>
                <p className="text-xs text-slate-400">{userData?.email}</p>
              </div>
              <DropdownMenuItem
                onClick={handleProfileClick}
                className="cursor-pointer text-slate-300 hover:text-white hover:bg-slate-700"
              >
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-slate-300 hover:text-white hover:bg-slate-700">
                Preferences
              </DropdownMenuItem>
              <div className="border-t border-slate-700 my-1" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
