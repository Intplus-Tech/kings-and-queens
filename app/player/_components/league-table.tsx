"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { TournamentParticipant } from "@/lib/actions/tournaments/get-active-tournament-participants";

interface LeagueTableProps {
  players: TournamentParticipant[];
  tournamentName?: string | null;
}

export function LeagueTable({ players, tournamentName }: LeagueTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="bg-[#00000033] p-2">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 p-4 rounded-md bg-secondary">
        <CardTitle className="text-white flex items-center gap-2 text-lg">
          <p className="text-2xl"> 🏆 </p>
          <div className="flex flex-col">
            <span>League Table</span>
            {tournamentName && (
              <span className="text-xs font-normal text-gray-300">
                {tournamentName}
              </span>
            )}
          </div>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hidden md:flex"
          >
            View All
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-400 hover:text-white h-8 w-8"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>
      </CardHeader>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr] md:grid-rows-[1fr]"
        }`}
      >
        <div className="overflow-hidden">
          <CardContent className="space-y-3 p-0 mt-2">
            {players.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No participants found.
              </div>
            ) : (
              players.map((player) => (
                <div
                  key={player._id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <span className="text-gray-400 w-4 text-sm font-semibold">
                    {player.rank}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-white">
                      {(player.name || player.alias || "P")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{player.name || player.alias}</p>
                  </div>
                  <span className="text-sm font-semibold whitespace-nowrap">
                    {Math.round(player.rating || 0)}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
