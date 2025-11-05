import React from "react";
import { cookies } from "next/headers";
import MultiplayerChess from "@/components/ChessEngine";
import ChessGame from "@/components/ChessGame";

const page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("k_n_q_auth_token")?.value;

  console.log("token:", token);

  return (
    <div>
      {/* <ChessEngine token={token} /> */}
      <MultiplayerChess token={token} />
      {/* <ChessGame /> */}
    </div>
  );
};

export default page;
