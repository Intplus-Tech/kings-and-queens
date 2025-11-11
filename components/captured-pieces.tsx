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
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader className="py-2">
        <CardTitle className="text-lg">Captured Pieces</CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2 text-2xl">
        <div className="flex flex-col">
          <span className="text-gray-400 text-sm">By White</span>
          <div className="min-h-[30px] font-serif text-white">
            {whiteCapturedPieces || (
              <span className="text-gray-600 text-sm">None</span>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-gray-400 text-sm">By Black</span>
          <div className="min-h-[30px] font-serif text-white">
            {blackCapturedPieces || (
              <span className="text-gray-600 text-sm">None</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
