"use client";

import React, { createContext, useContext } from "react";

interface TournamentContextType {
  isParticipant: boolean;
  tournamentId: string | null;
  tournamentName: string | null;
}

const TournamentContext = createContext<TournamentContextType>({
  isParticipant: false,
  tournamentId: null,
  tournamentName: null,
});

export const useTournament = () => useContext(TournamentContext);

export const TournamentProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: TournamentContextType;
}) => {
  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
};
