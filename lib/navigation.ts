import type { NavItem } from "@/types/navigation"

export const playerNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/player",
    icon: "Home",
  },
  {
    title: "My Matches",
    href: "/player/matches",
    icon: "Calendar",
  },
  {
    title: "Profile",
    href: "/player/profile",
    icon: "Users",
  },
  {
    title: "Settings",
    href: "/player/settings",
    icon: "Settings",
  },
]

export const coordinatorNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/coordinator",
    icon: "Home",
  },
  {
    title: "Team Management",
    href: "/coordinator/teams",
    icon: "Users",
  },
  {
    title: "Tournaments",
    href: "/coordinator/tournaments",
    icon: "Calendar",
  },
  {
    title: "Reports",
    href: "/coordinator/reports",
    icon: "BarChart3",
  },
  {
    title: "Settings",
    href: "/coordinator/settings",
    icon: "Settings",
  },
]

export const adminNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: "Home",
  },
  {
    title: "Schools Management",
    href: "/admin/schools",
    icon: "School",
  },
  {
    title: "Tournament Schedule",
    href: "/admin/tournaments",
    icon: "Calendar",
  },
  {
    title: "Live Games Monitor",
    href: "/admin/games",
    icon: "BarChart3",
  },
  {
    title: "Fair Play Reports",
    href: "/admin/reports",
    icon: "Shield",
  },
  {
    title: "Resources Hub",
    href: "/admin/resources",
    icon: "FileText",
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: "Settings",
  },
]
