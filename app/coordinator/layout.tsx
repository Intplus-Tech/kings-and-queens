import type React from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CoordinatorSidebar } from "@/components/layout/coordinator-sidebar";
import { CoordinatorHeader } from "@/components/layout/coordinator-header";
import { getUser } from "@/lib/actions/user/user.action";
import { getSchoolInfo } from "@/lib/actions/school/schoolManagement.action";

export default async function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userResponse = await getUser();
  const userData = userResponse?.data;

  const schoolResponse = userData?.coordinatorId?.schoolId
    ? await getSchoolInfo()
    : null;
  const schoolData = schoolResponse?.data;

  return (
    <SidebarProvider>
      <CoordinatorSidebar schoolName={schoolData?.name} />
      <SidebarInset>
        <CoordinatorHeader
          userRole="Dashboard"
          userData={userData}
          schoolData={schoolData}
        />
        <main className="flex-1 p-4 sm:p-6 min-h-screen">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
