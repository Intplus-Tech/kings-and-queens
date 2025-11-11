import React from "react";
import { cookies } from "next/headers";
// import MultiplayerChess from "@/components/ChessEngine";
import { ChessGameProvider } from "@/context/chess-game-context";
import { ChessApp } from "@/components/chess-app";

const page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("k_n_q_auth_token")?.value;

  console.log("token:", token);

  return (
    <ChessGameProvider token={token}>
      <ChessApp />
    </ChessGameProvider>
  );
};

export default page;
