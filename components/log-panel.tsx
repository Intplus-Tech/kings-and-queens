"use client";

import React, { useEffect, useState } from "react";
import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { LogEntry } from "@/lib/chess-types";

interface LogPanelProps {
  logs: LogEntry[];
  onClear: () => void;
}

/**
 * Displays real-time event log with color-coded messages
 */
export const LogPanel: FC<LogPanelProps> = ({ logs, onClear }) => {
  // Avoid rendering logs until after client mount to prevent
  // hydration mismatches between server and client markup.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card className="mt-4 bg-[#1d1814] border-[#3a2f27] text-white shadow-[0_10px_25px_rgba(0,0,0,0.35)]">
      <CardHeader className="py-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xs uppercase tracking-[0.4em] text-[#b8a48d]">
          Real-Time Log
        </CardTitle>
        <Button
          onClick={onClear}
          variant="ghost"
          size="sm"
          className="text-[#f5d6a5] hover:bg-[#2a241f] hover:text-white h-8 px-3"
        >
          Clear
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[180px] px-4 pb-4">
          <div className="space-y-1 text-[11px] font-mono">
            {mounted &&
              logs.map((entry, idx) => (
                <p
                  key={entry.id ?? idx}
                  style={{ color: entry.color ?? "#f4e9d0" }}
                  className="break-all whitespace-pre-wrap"
                >
                  {entry.message}
                </p>
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
