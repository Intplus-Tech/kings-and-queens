import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { PlayerSidebar } from "@/components/layout/player-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"

export default function PlayerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex">
        <PlayerSidebar />
        <SidebarInset>
          <DashboardHeader userRole="player" />
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
