import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChessTimerProps {
  initialTime: number; // in seconds
  isActive: boolean;
  onTimeUp: () => void;
  playerName: string;
  isCurrentTurn: boolean;
}

export const ChessTimer = ({
  initialTime,
  isActive,
  onTimeUp,
  playerName,
  isCurrentTurn,
}: ChessTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (!isActive || !isCurrentTurn) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isCurrentTurn, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeLeft < 60;

  return (
    <Card
      className={cn(
        "transition-all",
        isCurrentTurn && isActive && "ring-2 ring-primary",
        isLowTime && isActive && "ring-destructive"
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold">{playerName}</span>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span
              className={cn(
                "font-mono text-lg font-bold",
                isLowTime && isActive && "text-destructive"
              )}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
