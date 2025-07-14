import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import { DashboardHeader } from "@/components/layout/dashboard-header"

export default function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex">
        <CoordinatorSidebar />
        <SidebarInset>
          <DashboardHeader userRole="coordinator" />
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
