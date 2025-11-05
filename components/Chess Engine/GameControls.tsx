import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Undo,
  RotateCcw,
  Download,
  FlipVertical,
  Flag,
  Handshake,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GameControlsProps {
  onUndo: () => void;
  onReset: () => void;
  onExportPGN: () => void;
  onFlipBoard: () => void;
  onResign: () => void;
  onOfferDraw: () => void;
  canUndo: boolean;
  isGameActive: boolean;
}

export const GameControls = ({
  onUndo,
  onReset,
  onExportPGN,
  onFlipBoard,
  onResign,
  onOfferDraw,
  canUndo,
  isGameActive,
}: GameControlsProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo || !isGameActive}
          >
            <Undo className="mr-2 h-4 w-4" />
            Undo
          </Button>
          <Button variant="outline" size="sm" onClick={onFlipBoard}>
            <FlipVertical className="mr-2 h-4 w-4" />
            Flip
          </Button>
          <Button variant="outline" size="sm" onClick={onExportPGN}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        {isGameActive && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Handshake className="mr-2 h-4 w-4" />
                  Draw
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Offer Draw</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to offer a draw to your opponent?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onOfferDraw}>
                    Offer Draw
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Flag className="mr-2 h-4 w-4" />
                  Resign
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Resign Game</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to resign? This will end the game.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onResign}>
                    Resign
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
