"use client";

import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logOutAction } from "@/lib/actions/auth/signin.action";
import { useRouter } from "next/navigation";

interface PlayerHeaderProps {
  userRole: "player" | "coordinator" | "admin";
}

export function PlayerHeader({ userRole }: PlayerHeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await logOutAction();
    router.refresh(); // Refresh the current route
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-xl font-semibold capitalize">
            {userRole} Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
