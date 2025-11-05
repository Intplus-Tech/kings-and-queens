"use client";

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  FC,
  ReactNode,
} from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

// --- ShadCN/UI Imports ---
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
import { ScrollArea } from "@/components/ui/scroll-area";

// --- Lucide Icon Imports ---
import {
  Undo,
  RotateCcw,
  Download,
  FlipVertical,
  Flag,
  Handshake,
  Circle,
  Clock,
  RefreshCw,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";

// --- Utility Imports ---
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// --- Type Definitions ---

type Player = {
  name: string;
  rating: number;
};

type TimeControl = {
  name: string;
  time: number; // in seconds
};

type Move = {
  san: string;
  from: string;
  to: string;
  promotion?: string;
  fenAfterMove: string;
  check: boolean;
  checkmate: boolean;
};

type MovePair = {
  moveNumber: number;
  white: Move;
  black?: Move;
};

// --- Component from GameSetup.tsx (Modified) ---

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
    whitePlayer: Player,
    blackPlayer: Player,
    timeControl: TimeControl
  ) => void;
}

export const GameSetup: FC<GameSetupProps> = ({ onStartGame }) => {
  const [whitePlayer, setWhitePlayer] = useState("White");
  const [whiteRating, setWhiteRating] = useState("1500");
  const [blackPlayer, setBlackPlayer] = useState("Black");
  const [blackRating, setBlackRating] = useState("1500");
  const [selectedTime, setSelectedTime] = useState(TIME_CONTROLS[5]); // Default to Rapid 10+0

  const handleStart = () => {
    onStartGame(
      { name: whitePlayer, rating: parseInt(whiteRating) || 1500 },
      { name: blackPlayer, rating: parseInt(blackRating) || 1500 },
      selectedTime
    );
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>New Game Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            <Label htmlFor="white-rating">Rating</Label>
            <Input
              id="white-rating"
              value={whiteRating}
              onChange={(e) => setWhiteRating(e.target.value)}
              placeholder="1500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            <Label htmlFor="black-rating">Rating</Label>
            <Input
              id="black-rating"
              value={blackRating}
              onChange={(e) => setBlackRating(e.target.value)}
              placeholder="1500"
            />
          </div>
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
              <SelectValue placeholder="Select time control" />
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

// --- Component from ChessTimer.tsx (Modified) ---

interface ChessTimerProps {
  initialTime: number; // in seconds
  isActive: boolean;
  onTimeUp: () => void;
  isCurrentTurn: boolean;
}

export const ChessTimer: FC<ChessTimerProps> = ({
  initialTime,
  isActive,
  onTimeUp,
  isCurrentTurn,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (isActive && isCurrentTurn) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current as NodeJS.Timeout);
    }

    return () => clearInterval(timerRef.current as NodeJS.Timeout);
  }, [isActive, isCurrentTurn, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeLeft < 60 && timeLeft > 0;

  return (
    <div
      className={cn(
        "font-mono text-3xl font-bold p-2 rounded-lg",
        isCurrentTurn && isActive ? "bg-yellow-300 text-black" : "bg-gray-700",
        isLowTime && isActive && "bg-red-500 text-white"
      )}
    >
      {formatTime(timeLeft)}
    </div>
  );
};

// --- New PlayerInfo Component ---

interface PlayerInfoProps {
  player: Player;
  isCurrentTurn: boolean;
  isActive: boolean;
  onTimeUp: () => void;
  initialTime: number;
  capturedPieces: string[];
}

const PlayerInfo: FC<PlayerInfoProps> = ({
  player,
  isCurrentTurn,
  isActive,
  onTimeUp,
  initialTime,
  capturedPieces,
}) => {
  return (
    <div className="flex items-center justify-between p-2">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Circle
            className={cn(
              "h-3 w-3",
              isCurrentTurn ? "text-green-500" : "text-gray-600"
            )}
          />
          <span className="font-semibold">{player.name}</span>
          <span className="text-sm text-gray-400">{player.rating}</span>
        </div>
        <div className="text-xl h-8 text-gray-300 mt-1">
          {capturedPieces.join(" ") || ""}
        </div>
      </div>
      <ChessTimer
        initialTime={initialTime}
        isActive={isActive}
        onTimeUp={onTimeUp}
        isCurrentTurn={isCurrentTurn}
      />
    </div>
  );
};

// --- New MoveHistory Component (Refactored) ---

interface MoveHistoryProps {
  history: MovePair[];
  currentFen: string;
  onMoveSelect: (fen: string) => void;
}

const MoveHistory: FC<MoveHistoryProps> = ({
  history,
  currentFen,
  onMoveSelect,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the active move
  useEffect(() => {
    if (scrollRef.current) {
      // Find the element for the current FEN
      const activeMoveEl = scrollRef.current.querySelector<HTMLElement>(
        `[data-fen="${currentFen}"]`
      );

      if (activeMoveEl) {
        // Scroll it into view if it exists
        activeMoveEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      } else if (history.length === 0) {
        // Or scroll to top if history is empty
        scrollRef.current.scrollTop = 0;
      }
    }
  }, [currentFen, history]); // Re-run whenever the displayed FEN changes

  return (
    <ScrollArea className="flex-1 bg-gray-800 text-sm">
      <div
        ref={scrollRef}
        className="p-2"
        style={{ maxHeight: "calc(100% - 8px)" }} // Ensure scroll area works
      >
        <div className="grid grid-cols-3 gap-x-2 gap-y-1">
          {history.length === 0 ? (
            <span className="col-span-3 text-center text-gray-400">
              No moves yet
            </span>
          ) : (
            history.map((movePair) => (
              <React.Fragment key={movePair.moveNumber}>
                <span className="text-right text-gray-400">
                  {movePair.moveNumber}.
                </span>
                {movePair.white ? (
                  <span
                    data-fen={movePair.white.fenAfterMove}
                    className={cn(
                      "font-semibold text-gray-200 rounded px-1 cursor-pointer hover:bg-gray-600",
                      currentFen === movePair.white.fenAfterMove &&
                        "bg-blue-600"
                    )}
                    onClick={() => onMoveSelect(movePair.white.fenAfterMove)}
                  >
                    {movePair.white.san}
                  </span>
                ) : (
                  <span></span>
                )}
                {movePair.black ? (
                  <span
                    data-fen={movePair.black.fenAfterMove}
                    className={cn(
                      "font-semibold text-gray-200 rounded px-1 cursor-pointer hover:bg-gray-600",
                      currentFen === movePair.black.fenAfterMove &&
                        "bg-blue-600"
                    )}
                    onClick={() => onMoveSelect(movePair.black.fenAfterMove)}
                  >
                    {movePair.black.san}
                  </span>
                ) : (
                  <span></span>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

// --- New GameResultDisplay Component ---

interface GameResultDisplayProps {
  result: string;
  onReset: () => void;
}

const GameResultDisplay: FC<GameResultDisplayProps> = ({ result, onReset }) => (
  <div className="absolute inset-0 z-10 bg-black/70 flex flex-col items-center justify-center space-y-4">
    <h3 className="text-2xl font-bold text-white">{result}</h3>
    <Button onClick={onReset} variant="secondary" size="lg">
      <RefreshCw className="mr-2 h-5 w-5" />
      Rematch
    </Button>
  </div>
);

// --- Component from ChessGame.tsx (as main App) ---

const START_FEN = new Chess().fen();
const AUTOPLAY_SPEEDS: Record<string, number> = {
  "0.5x": 3000,
  "1x": 1500,
  "1.5x": 1000,
  "2x": 750,
};
const SPEED_LABELS = Object.keys(AUTOPLAY_SPEEDS); // ["0.5x", "1x", "1.5x", "2x"]

const ChessGame: FC = () => {
  const [game, setGame] = useState<Chess>(new Chess());
  // 'fen' is the LIVE game state
  const [fen, setFen] = useState<string>(START_FEN);
  // 'displayedFen' is what the user is currently viewing (can be in the past)
  const [displayedFen, setDisplayedFen] = useState<string>(START_FEN);

  // New structured move history
  const [moveHistory, setMoveHistory] = useState<MovePair[] | []>([]);

  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [players, setPlayers] = useState<Record<"white" | "black", Player>>({
    white: { name: "White", rating: 1500 },
    black: { name: "Black", rating: 1500 },
  });
  const [timeControl, setTimeControl] = useState<TimeControl>({
    name: "Rapid (10+0)",
    time: 600,
  });
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
    "white"
  );
  const [gameResult, setGameResult] = useState<string | null>(null);

  // New state for autoplay
  const [isAutoplaying, setIsAutoplaying] = useState<boolean>(false);
  const [currentSpeedIdx, setCurrentSpeedIdx] = useState<number>(1); // "1x"

  const { toast } = useToast();

  const handleStartGame = (white: Player, black: Player, tc: TimeControl) => {
    setPlayers({ white, black });
    setTimeControl(tc);
    setGameStarted(true);
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setDisplayedFen(newGame.fen());
    setMoveHistory([]);
    setGameResult(null);
    setBoardOrientation("white");
    setIsAutoplaying(false);
  };

  const onPieceDrop = useCallback(
    (sourceSquare: string, targetSquare: string): boolean => {
      // Don't allow moves if game is over OR if user is viewing a past move
      if (gameResult || fen !== displayedFen) return false;

      // Stop autoplay on manual move
      setIsAutoplaying(false);

      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // always promote to a queen for simplicity
      });

      if (move === null) return false; // illegal move

      // --- New History Logic ---
      const fenAfterMove = gameCopy.fen();
      const lastMove = gameCopy.history({ verbose: true }).slice(-1)[0];

      const newMove: Move = {
        san: lastMove.san,
        from: lastMove.from,
        to: lastMove.to,
        promotion: lastMove.promotion,
        fenAfterMove: fenAfterMove,
        check: lastMove.flags.includes("c"),
        checkmate: lastMove.flags.includes("m"),
      };

      setMoveHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        if (lastMove.color === "w") {
          // New move pair
          newHistory.push({
            moveNumber: prevHistory.length + 1,
            white: newMove,
          });
        } else {
          // Add to existing move pair
          if (newHistory.length > 0) {
            newHistory[newHistory.length - 1].black = newMove;
          }
        }
        return newHistory;
      });
      // --- End New History Logic ---

      setGame(gameCopy);
      setFen(fenAfterMove); // Update live FEN
      setDisplayedFen(fenAfterMove); // Update displayed FEN

      // ... (rest of game state logic)
      if (gameCopy.isCheckmate()) {
        const winner =
          gameCopy.turn() === "w" ? players.black.name : players.white.name;
        setGameResult(`${winner} wins by checkmate!`);
        toast({ title: "Checkmate!", description: `${winner} wins!` });
      } else if (gameCopy.isDraw()) {
        setGameResult("Game drawn");
        toast({ title: "Draw", description: "Game is a draw" });
      }

      return true;
    },
    [game, gameResult, players, toast, fen, displayedFen]
  );

  const handleUndo = () => {
    if (gameResult || moveHistory.length === 0) return;
    setIsAutoplaying(false);

    const gameCopy = new Chess(fen); // Use the *live* FEN
    const moveUndone = gameCopy.undo();
    if (!moveUndone) return; // Should not happen if history is not empty

    const newFen = gameCopy.fen();
    setGame(gameCopy);
    setFen(newFen);
    setDisplayedFen(newFen);

    // Update structured history
    const newHistory = [...moveHistory];
    const lastPair = newHistory[newHistory.length - 1];

    if (lastPair.black) {
      // Remove black's move
      lastPair.black = undefined;
    } else {
      // Remove white's move (the whole pair)
      newHistory.pop();
    }
    setMoveHistory(newHistory);
  };

  const handleReset = () => {
    // This now serves as "Rematch"
    const newGame = new Chess();
    setGame(newGame);
    setFen(newGame.fen());
    setDisplayedFen(newGame.fen());
    setMoveHistory([]);
    setGameResult(null);
    setBoardOrientation("white");
    setIsAutoplaying(false);
    // We keep the same players and time control
  };

  const handleNewGame = () => {
    // This goes back to setup
    setGameStarted(false);
    setGameResult(null);
    setIsAutoplaying(false);
  };

  const handleExportPGN = () => {
    // We use the 'game' object which is already in sync with the latest move
    const pgn = game.pgn();
    const blob = new Blob([pgn], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chess-game-${Date.now()}.pgn`;
    a.click();
    toast({ title: "PGN Exported", description: "Game saved successfully" });
  };

  const handleResign = () => {
    if (gameResult) return;
    setIsAutoplaying(false);
    const winner =
      game.turn() === "w" ? players.black.name : players.white.name;
    setGameResult(`${winner} wins by resignation`);
    toast({ title: "Game Over", description: `${winner} wins by resignation` });
  };

  const handleOfferDraw = () => {
    if (gameResult) return;
    setIsAutoplaying(false);
    // In a real app, this would send an offer. Here, we'll just accept it.
    setGameResult("Game drawn by agreement");
    toast({ title: "Draw Accepted", description: "Game drawn by agreement" });
  };

  const handleTimeUp = (color: "white" | "black") => {
    if (gameResult) return;
    setIsAutoplaying(false);
    const winner = color === "white" ? players.black.name : players.white.name;
    setGameResult(`${winner} wins on time`);
    toast({ title: "Time's Up!", description: `${winner} wins on time` });
  };

  const getCapturedPieces = (): { white: string[]; black: string[] } => {
    const gameForCapture = new Chess(displayedFen); // Use displayed FEN for captures
    const captured: { white: string[]; black: string[] } = {
      white: [],
      black: [],
    };
    const pieceValues: Record<string, string> = {
      p: "♟",
      r: "♜",
      n: "♞",
      b: "♝",
      q: "♛",
      P: "♙",
      R: "♖",
      N: "♘",
      B: "♗",
      Q: "♕",
    };

    const allPieces = gameForCapture
      .board()
      .flat()
      .filter((p) => p !== null);
    const pieceCount: Record<string, number> = {};

    allPieces.forEach((piece) => {
      if (piece) {
        const key = piece.color + piece.type;
        pieceCount[key] = (pieceCount[key] || 0) + 1;
      }
    });

    const starting: Record<string, number> = {
      wp: 8,
      wr: 2,
      wn: 2,
      wb: 2,
      wq: 1,
      bp: 8,
      br: 2,
      bn: 2,
      bb: 2,
      bq: 1,
    };

    for (const [key, count] of Object.entries(starting)) {
      const missing = count - (pieceCount[key] || 0);
      const piece = key[1];
      const symbol =
        key[0] === "w" ? pieceValues[piece.toUpperCase()] : pieceValues[piece];

      for (let i = 0; i < missing; i++) {
        if (key[0] === "w") captured.white.push(symbol);
        else captured.black.push(symbol);
      }
    }

    // Sort to show more valuable pieces first (approx)
    const sortOrder = ["♛", "♕", "♜", "♖", "♝", "♗", "♞", "♘", "♟", "♙"];
    captured.white.sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b));
    captured.black.sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b));

    return captured;
  };

  // --- Move Navigation Logic ---
  const flatMoves = useMemo(
    () =>
      moveHistory
        .flatMap((pair) => [pair.white, pair.black])
        .filter((move): move is Move => !!move),
    [moveHistory]
  );

  const currentMoveIndex = useMemo(() => {
    if (displayedFen === START_FEN) return -1;
    return flatMoves.findIndex((move) => move.fenAfterMove === displayedFen);
  }, [flatMoves, displayedFen]);

  const handleMoveSelect = (fen: string) => {
    setIsAutoplaying(false);
    setDisplayedFen(fen);
  };

  const handleNavFirst = () => {
    setIsAutoplaying(false);
    setDisplayedFen(START_FEN);
  };
  const handleNavPrev = () => {
    setIsAutoplaying(false);
    if (currentMoveIndex > 0) {
      setDisplayedFen(flatMoves[currentMoveIndex - 1].fenAfterMove);
    } else if (currentMoveIndex === 0) {
      setDisplayedFen(START_FEN);
    }
  };
  const handleNavNext = () => {
    setIsAutoplaying(false);
    if (currentMoveIndex < flatMoves.length - 1) {
      setDisplayedFen(flatMoves[currentMoveIndex + 1].fenAfterMove);
    }
  };
  const handleNavLast = () => {
    setIsAutoplaying(false);
    setDisplayedFen(fen); // Jump to live FEN
  };

  const isLastMove = currentMoveIndex === flatMoves.length - 1;
  const isFirstMove = currentMoveIndex < 0;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't navigate if user is typing in an input
      if (e.target instanceof HTMLElement && e.target.tagName === "INPUT")
        return;

      if (e.key === "ArrowLeft") {
        handleNavPrev();
      } else if (e.key === "ArrowRight") {
        if (isAutoplaying) return; // Don't fight autoplay
        if (isLastMove) {
          // If on last move, do nothing
        } else {
          handleNavNext();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentMoveIndex, isLastMove, isAutoplaying]); // Re-bind when index changes

  // Autoplay logic
  useEffect(() => {
    if (isAutoplaying && !isLastMove) {
      const speed = AUTOPLAY_SPEEDS[SPEED_LABELS[currentSpeedIdx]];
      const timer = setTimeout(() => {
        // handleNavNext() stops autoplay, so we do it manually
        if (currentMoveIndex < flatMoves.length - 1) {
          setDisplayedFen(flatMoves[currentMoveIndex + 1].fenAfterMove);
        } else {
          setIsAutoplaying(false); // Stop at the end
        }
      }, speed);
      return () => clearTimeout(timer);
    } else if (isAutoplaying && isLastMove) {
      setIsAutoplaying(false); // Stop at the end
    }
  }, [
    isAutoplaying,
    displayedFen,
    currentMoveIndex,
    flatMoves,
    isLastMove,
    currentSpeedIdx,
  ]);

  const toggleAutoplay = () => {
    const newIsAutoplaying = !isAutoplaying;
    setIsAutoplaying(newIsAutoplaying);

    // If starting play from the end, restart from the beginning
    if (newIsAutoplaying && isLastMove) {
      setDisplayedFen(START_FEN);
    }
  };

  const cycleSpeed = () => {
    setCurrentSpeedIdx((prevIdx) => (prevIdx + 1) % SPEED_LABELS.length);
  };
  // --- End Navigation Logic ---

  const currentTurn = game.turn() === "w" ? "white" : "black";
  const captured = getCapturedPieces();

  if (!gameStarted) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-800">
        <GameSetup onStartGame={handleStartGame} />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-start justify-center gap-4 p-4 bg-gray-800 min-h-screen text-white">
      {/* Mobile-first: Black Player Info (hidden on desktop) */}
      <div className="w-full md:hidden">
        <PlayerInfo
          player={players.black}
          isCurrentTurn={currentTurn === "black"}
          isActive={gameStarted && !gameResult}
          onTimeUp={() => handleTimeUp("black")}
          initialTime={timeControl.time}
          capturedPieces={captured.white} // Black captures white pieces
        />
      </div>

      {/* Left Column / Mobile Main: Board */}
      <div className="w-full md:flex-1 md:max-w-[70vh] aspect-square shadow-lg rounded-lg overflow-hidden">
        <Chessboard
          position={displayedFen} // Board now shows the displayed FEN
          onPieceDrop={onPieceDrop}
          boardOrientation={boardOrientation}
          customBoardStyle={{
            borderRadius: "0.5rem",
            boxShadow: "0 8px 24px -4px rgba(0,0,0,0.1)",
          }}
          // Disable piece drag if viewing history
          arePiecesDraggable={displayedFen === fen && !gameResult}
        />
      </div>

      {/* Mobile-first: White Player Info (hidden on desktop) */}
      <div className="w-full md:hidden">
        <PlayerInfo
          player={players.white}
          isCurrentTurn={currentTurn === "white"}
          isActive={gameStarted && !gameResult}
          onTimeUp={() => handleTimeUp("white")}
          initialTime={timeControl.time}
          capturedPieces={captured.black} // White captures black pieces
        />
      </div>

      {/* Right Column (Desktop) / Bottom Panel (Mobile) */}
      <div className="flex flex-col w-full md:w-[350px] lg:w-[400px] md:h-[70vh] bg-gray-900 shadow-lg rounded-lg overflow-hidden">
        {/* Desktop-only: Black Player Info */}
        <div className="hidden md:block">
          <PlayerInfo
            player={players.black}
            isCurrentTurn={currentTurn === "black"}
            isActive={gameStarted && !gameResult}
            onTimeUp={() => handleTimeUp("black")}
            initialTime={timeControl.time}
            capturedPieces={captured.white} // Black captures white pieces
          />
        </div>

        {/* Move History & Nav - This needs to be shorter on mobile */}
        <div className="relative flex-1 bg-gray-800 flex flex-col h-[40vh] md:h-auto">
          {gameResult && (
            <GameResultDisplay result={gameResult} onReset={handleReset} />
          )}
          <MoveHistory
            history={moveHistory}
            currentFen={displayedFen}
            onMoveSelect={handleMoveSelect}
          />
          {/* --- New Navigation Controls --- */}
          <div className="flex items-center justify-center gap-1 p-1 bg-gray-700">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNavFirst}
              disabled={isFirstMove}
              className="w-8 h-8 hover:bg-gray-600"
            >
              <ChevronFirst className="h-5 w-5 m-0" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNavPrev}
              disabled={isFirstMove}
              className="w-8 h-8 hover:bg-gray-600"
            >
              <ChevronLeft className="h-5 w-5 m-0" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleAutoplay}
              className="w-8 h-8 hover:bg-gray-600"
            >
              {isAutoplaying ? (
                <Pause className="h-5 w-5 m-0" />
              ) : (
                <Play className="h-5 w-5 m-0" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleNavNext}
              disabled={isLastMove}
              className="w-8 h-8 hover:bg-gray-600"
            >
              <ChevronRight className="h-5 w-5 m-0" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNavLast}
              disabled={isLastMove}
              className="w-8 h-8 hover:bg-gray-600"
            >
              <ChevronLast className="h-5 w-5 m-0" />
            </Button>

            <Button
              variant="ghost"
              onClick={cycleSpeed}
              className="w-12 h-8 hover:bg-gray-600 text-xs px-1"
            >
              {SPEED_LABELS[currentSpeedIdx]}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleExportPGN}
              title="Export PGN"
              className="w-8 h-8 hover:bg-gray-600"
            >
              <Download className="h-5 w-5 m-0" />
            </Button>
          </div>
        </div>

        {/* Desktop-only: White Player Info */}
        <div className="hidden md:block">
          <PlayerInfo
            player={players.white}
            isCurrentTurn={currentTurn === "white"}
            isActive={gameStarted && !gameResult}
            onTimeUp={() => handleTimeUp("white")}
            initialTime={timeControl.time}
            capturedPieces={captured.black} // White captures black pieces
          />
        </div>

        {/* Game Controls */}
        <div className="flex items-center justify-between p-2 bg-gray-700">
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 hover:bg-gray-600"
                  disabled={!!gameResult}
                  title="Offer Draw"
                >
                  <Handshake className="h-5 w-5 m-0" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Offer Draw</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to offer a draw?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleOfferDraw}>
                    Offer Draw
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-10 h-10 hover:bg-gray-600"
                  disabled={!!gameResult}
                  title="Resign"
                >
                  <Flag className="h-5 w-5 m-0" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Resign Game</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to resign?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResign}>
                    Resign
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 hover:bg-gray-600"
              onClick={handleUndo}
              disabled={
                moveHistory.length === 0 || !!gameResult || displayedFen !== fen
              }
              title="Undo Move"
            >
              <Undo className="h-5 w-5 m-0" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 hover:bg-gray-600"
              onClick={() =>
                setBoardOrientation((prev) =>
                  prev === "white" ? "black" : "white"
                )
              }
              title="Flip Board"
            >
              <FlipVertical className="h-5 w-5 m-0" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 hover:bg-gray-600"
              onClick={handleNewGame}
              title="New Game"
            >
              <RotateCcw className="h-5 w-5 m-0" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChessGame;
