"use client";

import {
  Home,
  Users,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
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
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logOutAction } from "@/lib/actions/auth/signin.action";

interface CoordinatorSidebarProps {
  schoolName?: string;
}

export function CoordinatorSidebar({
  schoolName = "Your School",
}: CoordinatorSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logOutAction();
    router.refresh();
  };
  const menuItems = [
    {
      title: "Dashboard",
      href: "/coordinator",
      icon: Home,
      tooltip: "View dashboard overview",
    },
    {
      title: "Team Management",
      href: "/coordinator/teams",
      icon: Users,
      tooltip: "Manage teams and members",
    },
    {
      title: "Tournaments",
      href: "/coordinator/tournaments",
      icon: Calendar,
      tooltip: "Manage tournaments",
    },
    {
      title: "Reports",
      href: "/coordinator/reports",
      icon: BarChart3,
      tooltip: "View analytics and reports",
    },
    {
      title: "Settings",
      href: "/coordinator/settings",
      icon: Settings,
      tooltip: "Configure settings",
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r bg-background">
      {/* Sidebar Header */}
      <SidebarHeader className="border-b bg-background  px-4 py-6 h-20">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-600 font-bold text-slate-900 text-lg">
            ♔
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-white leading-tight">
              Kings & Queens
            </h2>
            <p className="text-xs text-slate-400 truncate">{schoolName}</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="pr-10 bg-background">
        <SidebarGroup className="gap-0">
          <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/coordinator" &&
                    pathname.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.tooltip}
                      className={`mx-2 rounded-lg h-10 px-3 transition-all duration-200 group ${
                        isActive
                          ? "bg-yellow-400/10 text-yellow-400"
                          : "text-slate-300 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 font-medium"
                      >
                        <Icon
                          className={`h-5 w-5 flex-shrink-0 transition-colors ${
                            isActive
                              ? "text-yellow-400"
                              : "group-hover:text-yellow-400"
                          }`}
                        />
                        <span className="group-data-[state=collapsed]:hidden">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Section */}
        <SidebarGroup className="mt-auto gap-0 border-t ">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Log out of your account"
                  onClick={handleLogout}
                  className="mx-2 rounded-lg h-10 px-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 font-medium w-full">
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                    <span className="group-data-[state=collapsed]:hidden">
                      Logout
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
