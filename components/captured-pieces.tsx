"use client";

import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CapturedPieces } from "@/lib/chess-types";
import { getSymbol, sortPieces } from "@/lib/chess-utils";

interface CapturedPiecesDisplayProps {
  captured: CapturedPieces;
}

/**
 * Displays captured pieces for both sides using Unicode symbols
 * Grouped by the side that captured them
 */
export const CapturedPiecesDisplay: FC<CapturedPiecesDisplayProps> = ({
  captured,
}) => {
  const blackCapturedPieces = sortPieces(captured.black)
    .map((p) => getSymbol(p.toLowerCase()))
    .join(" ");
  const whiteCapturedPieces = sortPieces(captured.white)
    .map((p) => getSymbol(p.toUpperCase()))
    .join(" ");

  return (
    <Card className="bg-[#1d1814] border-[#3a2f27] text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
      <CardHeader className="py-3">
        <CardTitle className="text-sm uppercase tracking-[0.4em] text-[#bba98f]">
          Captured Pieces
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4 text-2xl">
        <div className="flex flex-col">
          <span className="text-xs text-[#8c8174] uppercase tracking-[0.3em]">
            By White
          </span>
          <div className="min-h-[30px] font-serif text-white">
            {whiteCapturedPieces || (
              <span className="text-sm text-[#4d433a]">None</span>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-[#8c8174] uppercase tracking-[0.3em]">
            By Black
          </span>
          <div className="min-h-[30px] font-serif text-white">
            {blackCapturedPieces || (
              <span className="text-sm text-[#4d433a]">None</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
