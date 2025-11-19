import { UpcomingMatch } from "./_components/upcoming-match";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PlayerSchedulePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <UpcomingMatch
        currentUserId={session.user.id}
        currentUserName={session.user.name || "Player"}
        authToken={session.user.token}
      />
    </div>
  );
}
