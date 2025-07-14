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
          <Crown className="h-8 w-8 text-green-600" />
          <div>
            <h2 className="text-lg font-bold">Kings & Queens</h2>
            <p className="text-sm text-muted-foreground">Coordinator Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                  <a href="/coordinator" className="flex items-center gap-3">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Team Management">
                  <a href="/coordinator/teams" className="flex items-center gap-3">
                    <Users className="h-4 w-4" />
                    <span>Team Management</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Tournaments">
                  <a href="/coordinator/tournaments" className="flex items-center gap-3">
                    <Calendar className="h-4 w-4" />
                    <span>Tournaments</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Reports">
                  <a href="/coordinator/reports" className="flex items-center gap-3">
                    <BarChart3 className="h-4 w-4" />
                    <span>Reports</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <a href="/coordinator/settings" className="flex items-center gap-3">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
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
