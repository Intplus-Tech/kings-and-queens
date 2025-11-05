import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type TimeControl = {
  name: string;
  time: number; // in seconds
};

export const TIME_CONTROLS: TimeControl[] = [
  { name: "Bullet (1+0)", time: 60 },
  { name: "Bullet (2+1)", time: 120 },
  { name: "Blitz (3+0)", time: 180 },
  { name: "Blitz (3+2)", time: 180 },
  { name: "Blitz (5+0)", time: 300 },
  { name: "Rapid (10+0)", time: 600 },
  { name: "Rapid (15+10)", time: 900 },
  { name: "Classical (30+0)", time: 1800 },
];

interface GameSetupProps {
  onStartGame: (
    whitePlayer: string,
    blackPlayer: string,
    timeControl: TimeControl
  ) => void;
}

export const GameSetup = ({ onStartGame }: GameSetupProps) => {
  const [whitePlayer, setWhitePlayer] = useState("White");
  const [blackPlayer, setBlackPlayer] = useState("Black");
  const [selectedTime, setSelectedTime] = useState(TIME_CONTROLS[2]);

  const handleStart = () => {
    onStartGame(whitePlayer, blackPlayer, selectedTime);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>New Game Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="white-player">White Player</Label>
          <Input
            id="white-player"
            value={whitePlayer}
            onChange={(e) => setWhitePlayer(e.target.value)}
            placeholder="Enter white player name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="black-player">Black Player</Label>
          <Input
            id="black-player"
            value={blackPlayer}
            onChange={(e) => setBlackPlayer(e.target.value)}
            placeholder="Enter black player name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time-control">Time Control</Label>
          <Select
            value={selectedTime.name}
            onValueChange={(value) => {
              const control = TIME_CONTROLS.find((tc) => tc.name === value);
              if (control) setSelectedTime(control);
            }}
          >
            <SelectTrigger id="time-control">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_CONTROLS.map((tc) => (
                <SelectItem key={tc.name} value={tc.name}>
                  {tc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleStart} className="w-full" size="lg">
          Start Game
        </Button>
      </CardContent>
    </Card>
  );
};
