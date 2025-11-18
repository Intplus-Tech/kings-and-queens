import type React from "react";
import { getPlayerProfileWithSchool } from "@/lib/actions/user/user.action";
import { PlayerHeader } from "@/components/layout/player-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getPlayerProfileWithSchool();
  return (
    <div className="container mx-auto">
      <PlayerHeader user={user} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
