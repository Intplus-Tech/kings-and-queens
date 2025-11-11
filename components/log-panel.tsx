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
    <Card className="mt-4 bg-gray-800 border-gray-700">
      <CardHeader className="py-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm text-gray-400">Real-Time Log</CardTitle>
        <Button
          onClick={onClear}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:bg-gray-700 hover:text-white h-8 px-2"
        >
          Clear Log
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px] p-3">
          <div className="space-y-1 text-xs font-mono">
            {mounted &&
              logs.map((entry, idx) => (
                <p
                  key={entry.id ?? idx}
                  style={{ color: entry.color ?? "#fff" }}
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
