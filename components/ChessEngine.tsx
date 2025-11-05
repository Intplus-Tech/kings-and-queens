"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  FC,
  useMemo,
} from "react";
import { io, Socket } from "socket.io-client";
import { Chess, Square, Move } from "chess.js";
import { Chessboard } from "react-chessboard";

// --- ShadCN/UI Imports ---
// Assuming these are available from your component library (e.g., shadcn/ui)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// --- Lucide Icon Imports ---
import { FlipVertical, Flag, Handshake, Clock, Download } from "lucide-react";

// --- Piece Symbols for Display ---
const PIECE_SYMBOLS: { [key: string]: string } = {
  K: "♔",
  Q: "♕",
  R: "♖",
  B: "♗",
  N: "♘",
  P: "♙",
  k: "♚",
  q: "♛",
  r: "♜",
  b: "♝",
  n: "♞",
  p: "♟︎",
  // Simple map for capturing logic
  Q_w: "♕",
  R_w: "♖",
  B_w: "♗",
  N_w: "♘",
  P_w: "♙",
  Q_b: "♛",
  R_b: "♜",
  B_b: "♝",
  N_b: "♞",
  P_b: "♟︎",
};

// --- SOCKET EVENTS (from backend/events.ts) ---
export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",
  C2S_AUTHENTICATE: "c2s-authenticate",
  S2C_AUTH_SUCCESS: "s2c-auth-success",
  S2C_ERROR: "s2c-error",
  C2S_JOIN_GAME: "c2s-join-game",
  S2C_GAME_STATE: "s2c-game-state",
  S2C_PLAYER_JOINED: "s2c-player-joined",
  C2S_MAKE_MOVE: "c2s-make-move",
  S2C_MOVE_MADE: "s2c-move-made",
  C2S_RESIGN: "c2s-resign",
  C2S_OFFER_DRAW: "c2s-offer-draw",
  C2S_ACCEPT_DRAW: "c2s-accept-draw",
  S2C_GAME_OVER: "s2c-game-over",
  S2C_DRAW_OFFERED: "s2c-draw-offered",
  SOCKET_ERROR: "socket-error",
} as const;

// --- LOCALSTORAGE & TIME CONTROLS ---
const LS_KEY_GAME_ID = "multiplayer_chess_gameId";
const LS_KEY_LOGS = "multiplayer_chess_logs";
const SERVER_URL = "https://knq-be.onrender.com/";

export type TimeControl = {
  name: string;
  time: number; // Time in *milliseconds* for the server
  increment: number; // Increment in *milliseconds*
};

export const TIME_CONTROLS: TimeControl[] = [
  { name: "Bullet (1+0)", time: 60000, increment: 0 },
  { name: "Blitz (3+0)", time: 180000, increment: 0 },
  { name: "Blitz (3+2)", time: 180000, increment: 2000 },
  { name: "Rapid (10+0)", time: 600000, increment: 0 },
];

// --- HELPER FUNCTIONS ---
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

// --- TYPES ---
type LogEntry = {
  id: string;
  message: string;
  color: string;
  timestamp: string;
};

interface ServerToClientEvents {
  [SOCKET_EVENTS.S2C_AUTH_SUCCESS]: (d: {
    message: string;
    userId: string;
  }) => void;
  [SOCKET_EVENTS.S2C_ERROR]: (d: { message: string }) => void;
  [SOCKET_EVENTS.S2C_GAME_STATE]: (d: {
    fen: string;
    yourColor: "white" | "black" | "observer";
    players: { white: string | null; black: string | null };
    whiteTime: number; // in ms
    blackTime: number; // in ms
  }) => void;
  [SOCKET_EVENTS.S2C_PLAYER_JOINED]: (d: {
    message: string;
    players: { white: string | null; black: string | null };
  }) => void;
  [SOCKET_EVENTS.S2C_MOVE_MADE]: (d: {
    from: string;
    to: string;
    newFen: string;
    whiteTime: number; // in ms
    blackTime: number; // in ms
  }) => void;
  [SOCKET_EVENTS.S2C_GAME_OVER]: (d: {
    reason: string;
    winner?: "white" | "black";
  }) => void;
  [SOCKET_EVENTS.S2C_DRAW_OFFERED]: (d: { fromPlayerId: string }) => void;
  [SOCKET_EVENTS.SOCKET_ERROR]: (d: {
    context: string;
    message: string;
  }) => void;
}

interface ClientToServerEvents {
  [SOCKET_EVENTS.C2S_AUTHENTICATE]: (d: { token: string }) => void;
  [SOCKET_EVENTS.C2S_JOIN_GAME]: (d: {
    gameId: string;
    timeControl: TimeControl;
  }) => void;
  [SOCKET_EVENTS.C2S_MAKE_MOVE]: (d: {
    gameId: string;
    from: string;
    to: string;
    promotion?: string;
  }) => void;
  [SOCKET_EVENTS.C2S_RESIGN]: (d: { gameId: string }) => void;
  [SOCKET_EVENTS.C2S_OFFER_DRAW]: (d: { gameId: string }) => void;
  [SOCKET_EVENTS.C2S_ACCEPT_DRAW]: (d: { gameId: string }) => void;
}

// ====================================================================
// --- NEW UI COMPONENTS ---
// ====================================================================

/**
 * Renders the list of captured pieces using Unicode symbols.
 */
interface CapturedPiecesDisplayProps {
  captured: { white: string[]; black: string[] };
}
const CapturedPiecesDisplay: FC<CapturedPiecesDisplayProps> = ({
  captured,
}) => {
  // Map internal piece identifiers ('Q', 'p', etc.) to Unicode symbols
  const getSymbol = (pieceId: string): string => {
    // If it's a lowercase piece ID, map to the black unicode symbol
    if (pieceId.length === 1 && pieceId === pieceId.toLowerCase()) {
      return PIECE_SYMBOLS[pieceId] || "";
    }
    // If it's an uppercase piece ID, map to the white unicode symbol
    if (pieceId.length === 1 && pieceId === pieceId.toUpperCase()) {
      return PIECE_SYMBOLS[pieceId] || "";
    }
    return ""; // Should not happen with current logic
  };

  // Sort and display non-pawn pieces first, then pawns
  const sortPieces = (pieces: string[]): string[] => {
    const pieceOrder = ["Q", "R", "B", "N", "P", "q", "r", "b", "n", "p"];
    return pieces.sort((a, b) => {
      const aIndex = pieceOrder.indexOf(a);
      const bIndex = pieceOrder.indexOf(b);
      return aIndex - bIndex;
    });
  };

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

/**
 * Renders the move history in algebraic notation.
 */
interface MoveHistoryPanelProps {
  moveHistory: string[];
}
const MoveHistoryPanel: FC<MoveHistoryPanelProps> = ({ moveHistory }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to the latest move whenever history changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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

// ====================================================================
// --- ORIGINAL UI COMPONENTS (simplified) ---
// ====================================================================

/**
 * Renders the player's info box, including their name (ID) and timer.
 */
interface PlayerTimerProps {
  playerName: string | null;
  time: number; // in ms
  isCurrentTurn: boolean;
  isMyInfo: boolean;
}
const PlayerTimer: FC<PlayerTimerProps> = ({
  playerName,
  time,
  isCurrentTurn,
  isMyInfo,
}) => {
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const isLowTime = time < 30000; // 30 seconds

  return (
    <Card
      className={`transition-all duration-300 ${
        isCurrentTurn
          ? "ring-2 ring-indigo-500 shadow-lg"
          : "ring-1 ring-gray-700"
      }`}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <span
            className={`font-semibold ${
              isMyInfo ? "text-indigo-400" : "text-white"
            }`}
          >
            {playerName ? playerName.slice(0, 12) : "Waiting..."}
            {isMyInfo && " (You)"}
          </span>
          <div
            className={`flex items-center gap-2 font-mono text-lg font-bold p-2 rounded ${
              isCurrentTurn
                ? "bg-indigo-600 text-white"
                : "bg-gray-700 text-gray-300"
            } ${isLowTime ? "text-red-400" : ""}`}
          >
            <Clock className="h-4 w-4" />
            {formatTime(time)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Game Setup (omitted for brevity, assume imported or defined) ---
interface GameSetupProps {
  onJoinGame: (gameId: string, timeControl: TimeControl) => void;
  gameId: string;
  setGameId: (id: string) => void;
  disabled: boolean;
}
const GameSetup: FC<GameSetupProps> = ({
  onJoinGame,
  gameId,
  setGameId,
  disabled,
}) => {
  const [selectedTime, setSelectedTime] = useState(TIME_CONTROLS[1]); // Default to Blitz (3+0)

  const handleJoin = () => {
    onJoinGame(gameId, selectedTime);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Join or Create Game</CardTitle>
        <CardDescription>
          Enter a Game ID. If it exists, you'll join. If not, a new game will be
          created with this ID.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="gameId">Game ID</Label>
          <Input
            id="gameId"
            placeholder="Enter Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="flex-1 bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time-control">Time Control (for new games)</Label>
          <Select
            value={selectedTime.name}
            onValueChange={(value) => {
              const control = TIME_CONTROLS.find((tc) => tc.name === value);
              if (control) setSelectedTime(control);
            }}
          >
            <SelectTrigger
              id="time-control"
              className="bg-gray-700 border-gray-600 text-white"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              {TIME_CONTROLS.map((tc) => (
                <SelectItem key={tc.name} value={tc.name}>
                  {tc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleJoin}
          disabled={!gameId.trim() || disabled}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          size="lg"
        >
          {disabled ? "Connecting..." : "Join / Create Game"}
        </Button>
      </CardContent>
    </Card>
  );
};

/**
 * Renders the real-time event log.
 */
interface LogPanelProps {
  logs: LogEntry[];
  scrollRef?: React.RefObject<HTMLDivElement>;
  onClear: () => void;
}
const LogPanel: FC<LogPanelProps> = ({ logs, scrollRef, onClear }) => (
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
        <div ref={scrollRef} className="space-y-1 text-xs font-mono">
          {logs.map((entry) => (
            <p
              key={entry.id}
              style={{ color: entry.color }}
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

// ====================================================================
// --- MAIN MULTIPLAYER CHESS COMPONENT ---
// ====================================================================

const MultiplayerChess: FC<{ token?: string }> = ({ token }) => {
  // --- Socket & Auth State ---
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>(() => {
    const saved = getLocalStorageItem(LS_KEY_LOGS);
    return saved ? (JSON.parse(saved) as LogEntry[]) : [];
  });

  // --- Game State ---
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState(game.fen());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(
    "white"
  );
  const [gameResult, setGameResult] = useState<string | null>(null);

  // --- Multiplayer State ---
  const [gameId, setGameId] = useState<string>(
    () => getLocalStorageItem(LS_KEY_GAME_ID) || ""
  );
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [players, setPlayers] = useState<{
    white: string | null;
    black: string | null;
  }>({ white: null, black: null });
  const [myColor, setMyColor] = useState<"white" | "black" | "observer" | null>(
    null
  );
  const [whiteTime, setWhiteTime] = useState(0); // in ms
  const [blackTime, setBlackTime] = useState(0); // in ms
  const [isDrawOffered, setIsDrawOffered] = useState<boolean>(false);

  // --- Refs ---
  const logScrollRef = useRef<HTMLDivElement>(null);
  const clientTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastMoveTimeRef = useRef<number>(Date.now());

  // --- Logging Utility ---
  const addLog = useCallback((msg: string, color: string = "#00ff88") => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString();
    const newEntry: LogEntry = {
      id: crypto.randomUUID(),
      message: `[${formattedTime}] ${msg}`,
      color,
      timestamp: formattedTime,
    };
    setLogs((prev) => [...prev, newEntry].slice(-100)); // Keep last 100 logs
  }, []);

  // --- Captured Pieces Calculation ---
  const capturedPieces = useMemo(() => {
    const piecesOnBoard = {
      w: { Q: 0, R: 0, B: 0, N: 0, P: 0 },
      b: { q: 0, r: 0, b: 0, n: 0, p: 0 },
    };
    const initialCounts = {
      w: { Q: 1, R: 2, B: 2, N: 2, P: 8 },
      b: { q: 1, r: 2, b: 2, n: 2, p: 8 },
    };

    // 1. Count pieces currently on the board
    game.board().forEach((row) => {
      row.forEach((piece) => {
        if (piece) {
          const type = piece.type.toUpperCase();
          if (piece.color === "w") {
            piecesOnBoard.w[type as keyof typeof piecesOnBoard.w] =
              (piecesOnBoard.w[type as keyof typeof piecesOnBoard.w] || 0) + 1;
          } else {
            piecesOnBoard.b[
              piece.type.toLowerCase() as keyof typeof piecesOnBoard.b
            ] =
              (piecesOnBoard.b[
                piece.type.toLowerCase() as keyof typeof piecesOnBoard.b
              ] || 0) + 1;
          }
        }
      });
    });

    const captured = { white: [] as string[], black: [] as string[] }; // Pieces captured *by* white/black

    // 2. Determine pieces captured by Black (White's missing pieces)
    (
      Object.keys(initialCounts.w) as Array<keyof typeof initialCounts.w>
    ).forEach((type) => {
      const char = type as "Q" | "R" | "B" | "N" | "P";
      const initial = initialCounts.w[char];
      const current = piecesOnBoard.w[char];
      for (let i = 0; i < initial - current; i++) {
        captured.black.push(char); // Storing char: 'Q', 'R', etc.
      }
    });

    // 3. Determine pieces captured by White (Black's missing pieces)
    (
      Object.keys(initialCounts.b) as Array<keyof typeof initialCounts.b>
    ).forEach((type) => {
      const char = type as "q" | "r" | "b" | "n" | "p";
      const initial = initialCounts.b[char];
      const current = piecesOnBoard.b[char];
      for (let i = 0; i < initial - current; i++) {
        captured.white.push(char); // Storing char: 'q', 'r', etc.
      }
    });

    return captured;
  }, [fen, game]);

  // --- State Persistence Effects ---
  useEffect(() => {
    if (logScrollRef.current) {
      const viewport = logScrollRef.current.parentElement;
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
    localStorage.setItem(LS_KEY_LOGS, JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem(LS_KEY_GAME_ID, gameId);
  }, [gameId]);

  // --- Client-Side Cosmetic Timer ---
  useEffect(() => {
    if (clientTimerRef.current) clearInterval(clientTimerRef.current);

    if (isGameActive && !gameResult) {
      lastMoveTimeRef.current = Date.now();
      clientTimerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - lastMoveTimeRef.current;
        lastMoveTimeRef.current = now;

        const turn = game.turn();
        if (turn === "w") {
          setWhiteTime((t) => Math.max(0, t - elapsed));
        } else {
          setBlackTime((t) => Math.max(0, t - elapsed));
        }
      }, 500); // Update cosmetic timer every 500ms
    }

    return () => {
      if (clientTimerRef.current) clearInterval(clientTimerRef.current);
    };
  }, [isGameActive, gameResult, game.turn()]);

  // --- Socket Connection & Auth ---
  useEffect(() => {
    if (!token) {
      addLog("❌ Error: Auth token was not provided.", "red");
      return;
    }

    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      SERVER_URL,
      { transports: ["websocket"] }
    );
    setSocket(newSocket);

    newSocket.on("connect", () => {
      addLog(`✅ Connected. Socket ID: ${newSocket.id}`, "#00ff88");
      addLog(`🔐 Sending ${SOCKET_EVENTS.C2S_AUTHENTICATE}...`, "#ffaa00");
      newSocket.emit(SOCKET_EVENTS.C2S_AUTHENTICATE, { token: token });
    });

    newSocket.on("disconnect", () => {
      addLog("❌ Disconnected", "red");
      setGameResult("Connection lost. Please refresh.");
      setIsGameActive(false);
    });

    // --- Auth Listeners ---
    newSocket.on(SOCKET_EVENTS.S2C_AUTH_SUCCESS, (d) => {
      addLog(`✅ Authenticated as ${d.userId}`, "#00ff88");
      setAuthUserId(d.userId);
    });

    newSocket.on(SOCKET_EVENTS.S2C_ERROR, (d) => {
      addLog(`❌ Server Error: ${d.message}`, "#ff4444");
    });

    newSocket.on(SOCKET_EVENTS.SOCKET_ERROR, (d) => {
      addLog(`❌ Socket Error [${d.context}]: ${d.message}`, "#ff4444");
    });

    // --- Game Logic Listeners ---
    newSocket.on(SOCKET_EVENTS.S2C_GAME_STATE, (d) => {
      addLog(`✅ Joined game. You are ${d.yourColor}.`, "#00ccff");
      const newGame = new Chess(d.fen);
      setGame(newGame);
      setFen(d.fen);
      setMoveHistory(newGame.history());
      setPlayers(d.players);
      setMyColor(d.yourColor);
      setBoardOrientation(d.yourColor === "black" ? "black" : "white");
      setWhiteTime(d.whiteTime);
      setBlackTime(d.blackTime);
      lastMoveTimeRef.current = Date.now();
      setIsGameActive(true);
      setGameResult(null);
      setIsDrawOffered(false);
    });

    newSocket.on(SOCKET_EVENTS.S2C_PLAYER_JOINED, (d) => {
      addLog(`👥 ${d.message}`, "#ffaa00");
      setPlayers(d.players);
    });

    newSocket.on(SOCKET_EVENTS.S2C_MOVE_MADE, (d) => {
      addLog(`♟ Move: ${d.from}-${d.to}`, "#dddddd");
      const newGame = new Chess(d.newFen);
      setGame(newGame);
      setFen(d.newFen);
      setMoveHistory(newGame.history());
      setWhiteTime(d.whiteTime);
      setBlackTime(d.blackTime);
      lastMoveTimeRef.current = Date.now();
      setIsDrawOffered(false);
    });

    newSocket.on(SOCKET_EVENTS.S2C_GAME_OVER, (d) => {
      addLog(`🏁 Game Over: ${d.reason}.`, "#ff4444");
      setGameResult(d.reason);
      setIsGameActive(false);
    });

    newSocket.on(SOCKET_EVENTS.S2C_DRAW_OFFERED, (d) => {
      addLog(`🤝 Draw offer from: ${d.fromPlayerId}`, "#66aaff");
      setIsDrawOffered(true);
    });

    // Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, [token, addLog]);

  // --- Game Action Emitters ---
  const handleJoinGame = (gameId: string, timeControl: TimeControl) => {
    if (!socket || !authUserId)
      return addLog("❌ Not authenticated or connected.", "red");
    socket.emit(SOCKET_EVENTS.C2S_JOIN_GAME, { gameId, timeControl });
    addLog(`🎮 Sent ${SOCKET_EVENTS.C2S_JOIN_GAME} for ${gameId}`, "#ffaa00");
  };

  const onDrop = (sourceSquare: Square, targetSquare: Square): boolean => {
    if (!socket || !isGameActive || !myColor || gameResult) return false;

    // Check if it's my turn
    const turn = game.turn();
    if (
      (turn === "w" && myColor !== "white") ||
      (turn === "b" && myColor !== "black")
    ) {
      addLog("❌ It's not your turn.", "red");
      return false;
    }

    // Optimistic local move
    const gameCopy = new Chess(fen);
    let move: Move | null = null;
    try {
      move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // Always promote to queen for simplicity
      });
    } catch (e) {
      return false; // Invalid move
    }

    if (move === null) {
      addLog("❌ Illegal move.", "red");
      return false;
    }

    // Optimistic UI update
    setFen(gameCopy.fen());
    setGame(gameCopy);

    // Emit the move to the server
    addLog(
      `🕹 Sent ${SOCKET_EVENTS.C2S_MAKE_MOVE}: ${move.from}-${move.to}`,
      "#dddddd"
    );
    socket.emit(SOCKET_EVENTS.C2S_MAKE_MOVE, {
      gameId: gameId,
      from: move.from,
      to: move.to,
      promotion: move.promotion,
    });

    return true;
  };

  const handleResign = () => {
    if (!socket || !isGameActive) return;
    socket.emit(SOCKET_EVENTS.C2S_RESIGN, { gameId: gameId });
    addLog(`🏳️ Sent ${SOCKET_EVENTS.C2S_RESIGN}`, "#ff4444");
  };

  const handleOfferDraw = () => {
    if (!socket || !isGameActive) return;
    socket.emit(SOCKET_EVENTS.C2S_OFFER_DRAW, { gameId: gameId });
    addLog(`🤝 Sent ${SOCKET_EVENTS.C2S_OFFER_DRAW}`, "#66aaff");
  };

  const handleAcceptDraw = () => {
    if (!socket || !isGameActive) return;
    socket.emit(SOCKET_EVENTS.C2S_ACCEPT_DRAW, { gameId: gameId });
    addLog(`🤝 Sent ${SOCKET_EVENTS.C2S_ACCEPT_DRAW}`, "#66aaff");
  };

  // --- RENDER LOGIC ---

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <Card className="w-full max-w-md mx-auto bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-destructive">
              Authentication Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              No authentication token was provided. Unable to connect to the
              game server.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isGameActive) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <GameSetup
          onJoinGame={handleJoinGame}
          gameId={gameId}
          setGameId={setGameId}
          disabled={!socket || !authUserId}
        />
        <LogPanel
          logs={logs}
          // scrollRef={logScrollRef}
          onClear={() => setLogs([])}
        />
      </div>
    );
  }

  const turn = game.turn();
  const isMyTurn =
    (myColor === "white" && turn === "w") ||
    (myColor === "black" && turn === "b");

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4 font-sans">
      <div className="w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-center mb-4 text-indigo-400">
          Multiplayer Chess: Game ID - {gameId}
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
          {/* --- Left Column: Board & Timers --- */}
          <div className="flex flex-col space-y-4">
            <PlayerTimer
              playerName={players.black}
              time={blackTime}
              isCurrentTurn={turn === "b"}
              isMyInfo={myColor === "black"}
            />

            <Chessboard
              position={fen}
              onPieceDrop={onDrop}
              boardOrientation={boardOrientation}
              arePiecesDraggable={!gameResult && isMyTurn}
              // Custom piece styles for better visibility of Unicode pieces
              customBoardStyle={{
                borderRadius: "4px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
              }}
            />

            <PlayerTimer
              playerName={players.white}
              time={whiteTime}
              isCurrentTurn={turn === "w"}
              isMyInfo={myColor === "white"}
            />
          </div>

          {/* --- Right Column: Info, History, Logs --- */}
          <div className="space-y-4">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader className="py-2">
                <CardTitle className="text-lg">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="bg-indigo-600 hover:bg-indigo-700">
                  You are playing as:{" "}
                  <strong className="ml-1 capitalize">{myColor}</strong>
                </Badge>
                {gameResult && (
                  <div className="mt-4 p-4 bg-red-800 text-white rounded-lg">
                    <h3 className="font-bold text-lg">Game Over</h3>
                    <p>{gameResult}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <CapturedPiecesDisplay captured={capturedPieces} />

            <MoveHistoryPanel moveHistory={moveHistory} />

            {/* --- Game Controls --- */}
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setBoardOrientation((o) =>
                        o === "white" ? "black" : "white"
                      )
                    }
                    className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                  >
                    <FlipVertical className="mr-2 h-4 w-4" />
                    Flip Board
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Logic to save PGN
                    }}
                    className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                    disabled={moveHistory.length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export PGN
                  </Button>
                </div>

                {isGameActive && !gameResult && myColor !== "observer" && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-700">
                    {isDrawOffered && !isMyTurn ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleAcceptDraw}
                      >
                        <Handshake className="mr-2 h-4 w-4" />
                        Accept Draw
                      </Button>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={!isMyTurn || isDrawOffered}
                            className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                          >
                            <Handshake className="mr-2 h-4 w-4" />
                            {isDrawOffered ? "Draw Offered" : "Offer Draw"}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Offer Draw</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to offer a draw to your
                              opponent?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-gray-700 border-gray-600 hover:bg-gray-600">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleOfferDraw}
                              className="bg-indigo-600 hover:bg-indigo-700"
                            >
                              Offer Draw
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Flag className="mr-2 h-4 w-4" />
                          Resign
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Resign Game</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to resign? This will end the
                            game immediately.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-700 border-gray-600 hover:bg-gray-600">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleResign}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Resign
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>

            <LogPanel
              logs={logs}
              // scrollRef={logScrollRef}
              onClear={() => setLogs([])}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerChess;
