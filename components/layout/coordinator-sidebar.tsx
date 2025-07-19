import { Crown, Home, Users, Calendar, BarChart3, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function CoordinatorSidebar() {
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b p-6">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-2xl font-bold text-primary">Kings & Queens</h2>
            <p className="text-sm text-muted-foreground">Maryland Int’l School</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="">
                <SidebarMenuButton asChild tooltip="Dashboard" className="h-[60px] bg-[#010B11]">
                  <a href="/coordinator" className="flex items-center gap-3">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Team Management" className="h-[60px] bg-[#010B11]">
                  <a href="/coordinator/teams" className="flex items-center gap-3">
                    {/* <Users className="h-4 w-4" /> */}
                    <img src="/team-icon.svg" alt="Team Icon" className="h-4 w-4" />
                    <span>Team Management</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Tournaments" className="h-[60px] bg-[#010B11]">
                  <a href="/coordinator/tournaments" className="flex items-center gap-3">
                    <Calendar className="h-4 w-4" />
                    <span>Match Center</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Reports" className="h-[60px] bg-[#010B11]">
                  <a href="/coordinator/reports" className="flex items-center gap-3">
                    <BarChart3 className="h-4 w-4" />
                    <span>Resources & Tools</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings" className="h-[60px] bg-[#010B11]">
                  <a href="/coordinator/settings" className="flex items-center gap-3">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings" className="h-[60px]">
                  <a href="/coordinator/settings" className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-red-500" />
                    <span className="text-red-500 font-bold">Logout</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
