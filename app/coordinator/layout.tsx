import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar"
import { CoordinatorHeader } from "@/components/layout/coordinator-header"

export default function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <CoordinatorSidebar />
      <SidebarInset>
        <main className="flex-1 p-4  bg-[#1F2124]">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
