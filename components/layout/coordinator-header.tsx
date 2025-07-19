import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface CoordinatorHeaderProps {
  userRole?: String;
}

export function CoordinatorHeader({ userRole }: CoordinatorHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b   bg-[#1F2124]">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold capitalize mb-1 mt-3">{userRole}</h1>
          <p>Welcome Back joe! | Ojada English School</p>
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
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
