import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { PlayerSidebar } from "@/components/layout/player-sidebar"
import { PlayerHeader } from "@/components/layout/player-header"

export default function PlayerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <PlayerSidebar />
      <SidebarInset>
        <PlayerHeader userRole="player" />
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
