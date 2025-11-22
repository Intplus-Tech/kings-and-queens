"use client";

import { type FC, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MoveHistoryPanelProps {
  moveHistory: string[];
}

/**
 * Displays move history in algebraic notation
 * Auto-scrolls to latest move when history updates
 */
export const MoveHistoryPanel: FC<MoveHistoryPanelProps> = ({
  moveHistory,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      // Use rAF to avoid layout thrashing during render and prevent
      // potential nested update loops caused by synchronous scrolling.
      const el = scrollRef.current;
      const id = requestAnimationFrame(() => {
        try {
          el.scrollTop = el.scrollHeight;
        } catch (e) {
          /* ignore */
        }
      });

      return () => cancelAnimationFrame(id);
    }
  }, [moveHistory]);

  // Group moves into turns (White move + Black move)
  const turns = moveHistory.reduce((acc, move, index) => {
    const turnNumber = Math.floor(index / 2);
    if (index % 2 === 0) {
      acc.push({ turn: turnNumber + 1, white: move, black: "" });
    } else {
      acc[turnNumber].black = move;
    }
    return acc;
  }, [] as { turn: number; white: string; black: string }[]);

  return (
    <Card className="bg-[#1c1814] border-[#3b3027] text-white shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
      <CardHeader className="py-3">
        <CardTitle className="text-sm uppercase tracking-[0.4em] text-[#bba98f]">
          Move History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[220px] px-4 pb-4">
          <div ref={scrollRef} className="text-sm">
            <table className="w-full table-fixed text-left">
              <thead className="sticky top-0 bg-[#221d18] text-[11px] uppercase tracking-[0.3em] text-[#8f8579]">
                <tr>
                  <th className="w-1/5 py-2">#</th>
                  <th className="w-2/5 py-2">White</th>
                  <th className="w-2/5 py-2">Black</th>
                </tr>
              </thead>
              <tbody>
                {turns.map((turn, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-[#1e1915]" : "bg-[#201b16]"
                    } border-b border-[#2d251f]/50`}
                  >
                    <td className="py-2 text-[#7a6f63]">{turn.turn}.</td>
                    <td className="py-2 font-semibold text-[#f4e9d0]">
                      {turn.white}
                    </td>
                    <td className="py-2 text-[#d8c9b0]">{turn.black}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
