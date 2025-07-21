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
        follow us:
        <img src="/instagram.png" alt="" className="w-6 h-6 border rounded-[60px] object-cover " />
        <img src="/in.png" alt="" className="w-6 h-6 border rounded-[60px] object-cover " />
        <img src="/youtubes.png" alt="" className="w-6 h-6 border rounded-[60px] object-cover " />
        <img src="/x.png" alt="" className="w-6 h-6 border rounded-[60px] object-cover " />
        <img src="/face.png" alt="" className="w-6 h-6 border rounded-[60px] object-cover bg-blue-500" />
        </div>
      </div>
    </header>
  )
}
