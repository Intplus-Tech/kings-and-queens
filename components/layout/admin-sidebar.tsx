import { Crown, Home, School, Calendar, BarChart3, Shield, FileText, Settings } from "lucide-react"
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

export function AdminSidebar() {
  return (
    <Sidebar collapsible="icon" className="bg-background text-foreground">
      <SidebarHeader className="border-b p-6">
        <div className="flex items-center gap-3">
          <Crown className="h-8 w-8 text-red-600" />
          <div>
            <h2 className="text-lg font-bold">Kings & Queens</h2>
            <p className="text-sm text-gray-500">Admin Portal</p>
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
                  <a href="/admin" className="flex items-center gap-3">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Schools Management">
                  <a href="/admin/schools" className="flex items-center gap-3">
                    <School className="h-4 w-4" />
                    <span>Schools Management</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Tournament Schedule">
                  <a href="/admin/tournaments" className="flex items-center gap-3">
                    <Calendar className="h-4 w-4" />
                    <span>Tournament Schedule</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Live Games Monitor">
                  <a href="/admin/games" className="flex items-center gap-3">
                    <BarChart3 className="h-4 w-4" />
                    <span>Live Games Monitor</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Fair Play Reports">
                  <a href="/admin/reports" className="flex items-center gap-3">
                    <Shield className="h-4 w-4" />
                    <span>Fair Play Reports</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Resources Hub">
                  <a href="/admin/resources" className="flex items-center gap-3">
                    <FileText className="h-4 w-4" />
                    <span>Resources Hub</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <a href="/admin/settings" className="flex items-center gap-3">
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
