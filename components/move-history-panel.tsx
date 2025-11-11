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
    <Card className="bg-gray-800 border-gray-700 text-white">
      <CardHeader className="py-2">
        <CardTitle className="text-lg">Move History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px] p-3">
          <div ref={scrollRef} className="text-sm">
            <table className="w-full text-left table-fixed">
              <thead className="sticky top-0 bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="w-1/5 text-gray-400 py-1">#</th>
                  <th className="w-2/5 text-white py-1">White</th>
                  <th className="w-2/5 text-white py-1">Black</th>
                </tr>
              </thead>
              <tbody>
                {turns.map((turn, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                    } hover:bg-indigo-900 transition-colors duration-150`}
                  >
                    <td className="py-1">{turn.turn}.</td>
                    <td className="py-1 font-semibold">{turn.white}</td>
                    <td className="py-1">{turn.black}</td>
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
