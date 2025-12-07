import React from "react";
import { cookies } from "next/headers";
import { ChessGameProvider } from "@/context/chess-game-context";
import { ChessApp } from "@/components/chess-app";

type PlayPageProps = {
  searchParams?: Promise<{
    gameId?: string;
    [key: string]: string | string[] | undefined;
  }>;
};

const PlayPage = async ({ searchParams }: PlayPageProps) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("k_n_q_auth_token")?.value || null;
  const resolvedSearchParams = (await searchParams) ?? {};
  const gameIdFromSearch =
    typeof resolvedSearchParams?.gameId === "string"
      ? resolvedSearchParams.gameId
      : undefined;

  return (
    <ChessGameProvider
      token={token || undefined}
      initialGameId={gameIdFromSearch}
    >
      <ChessApp />
    </ChessGameProvider>
  );
};

export default PlayPage;
