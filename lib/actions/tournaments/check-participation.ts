"use server";

import { getActiveTournamentParticipantsAction } from "./get-active-tournament-participants";
import { getPlayer } from "@/lib/actions/user/user.action";

export async function checkPlayerParticipation() {
  try {
    const [playerRes, participantsRes] = await Promise.all([
      getPlayer(),
      getActiveTournamentParticipantsAction(),
    ]);

    if (!playerRes.success || !playerRes.data) {
      return { isParticipant: false, tournamentId: null, tournamentName: null };
    }

    const player = Array.isArray(playerRes.data)
      ? playerRes.data[0]
      : playerRes.data;
    const playerId = player._id;

    const isParticipant = participantsRes.participants.some(
      (p) => p._id === playerId
    );

    return {
      isParticipant,
      tournamentId: participantsRes.tournamentId,
      tournamentName: participantsRes.tournamentName,
    };
  } catch (error) {
    console.error("Error checking player participation:", error);
    return { isParticipant: false, tournamentId: null, tournamentName: null };
  }
}
