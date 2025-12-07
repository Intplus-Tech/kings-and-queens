"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
  type FC,
} from "react";
import { Chess } from "chess.js";
import type { Square } from "chess.js";
import { useChessGame } from "@/hooks/use-chess-game";
import { useGameLogs } from "@/hooks/use-game-logs";
import { useCapturedPieces } from "@/hooks/use-captured-pieces";
import { useGameTimer } from "@/hooks/use-game-timer";
import { useSocket } from "@/hooks/use-socket";
import {
  SOCKET_EVENTS,
  LS_KEY_GAME_ID,
  LS_KEY_LAST_GAME_STATE,
} from "@/lib/chess-constants";
import type {
  GameState,
  PlayerInfo,
  CapturedPieces,
  LogEntry,
  DrawOfferState,
} from "@/lib/chess-types";
import {
  getLocalStorageItem,
  setLocalStorageItem,
  readJson,
  writeJson,
} from "@/lib/chess-utils";
import { Player } from "@/types/player";

// ====================================================================
// Context Type Definition
// ====================================================================

interface ChessGameContextValue {
  // Game State
  fen: string;
  moveHistory: string[];
  gameResult: string | null;
  gameWinner: "white" | "black" | null;
  isGameActive: boolean;

  // Multiplayer State
  gameId: string;
  myColor: "white" | "black" | "observer" | null;
  players: PlayerInfo;
  playersInfo: Record<string, Player | null>;
  drawOffer: DrawOfferState;
  drawResponse: "accepted" | "rejected" | null;
  isMovePending: boolean;

  // Timers (in ms)
  whiteTime: number;
  blackTime: number;
  isWhiteTimeLow: boolean;
  isBlackTimeLow: boolean;

  // Captured Pieces
  capturedPieces: CapturedPieces;

  // Logs
  logs: LogEntry[];

  // Board
  boardOrientation: "white" | "black";

  // Auth
  authUserId: string | null;
  isConnected: boolean;

  // Setters
  setGameId: (id: string) => void;
  setBoardOrientation: (orientation: "white" | "black") => void;

  // Game Actions
  makeMove: (from: Square, to: Square, promotion?: string) => boolean;
  resign: () => void;
  offerDraw: () => void;
  acceptDraw: () => void;
  rejectDraw: () => void;
  joinGame: (gameId: string) => void;

  // State Mutators (for socket updates)
  updateGameState: (newState: Partial<GameState>) => void;
  addLog: (msg: string, color?: string) => void;
  clearLogs: () => void;

  game: Chess;
}

// ====================================================================
// Create Context
// ====================================================================

const ChessGameContext = createContext<ChessGameContextValue | undefined>(
  undefined
);

// ====================================================================
// Provider Component
// ====================================================================

interface ChessGameProviderProps {
  children: ReactNode;
  token?: string;
  initialGameId?: string | null;
}

export const ChessGameProvider: FC<ChessGameProviderProps> = ({
  children,
  token,
  initialGameId,
}) => {
  // --- Game Logic Hooks ---
  const chessGame = useChessGame();
  const { loadGameFromFen, applyServerMove } = chessGame;

  // ====================================================================
  // Fetch player info on client
  // ====================================================================

  const playerCache = new Map<string, Player | null>();

  async function fetchPlayerById(
    id: string,
    token?: string
  ): Promise<Player | null> {
    if (!id) return null;

    if (playerCache.has(id)) return playerCache.get(id) || null;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/players/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        console.warn("Failed to fetch player", id, res.status);
        playerCache.set(id, null);
        return null;
      }

      const json = await res.json();
      const player: Player | null = json?.data ?? null;

      playerCache.set(id, player);
      return player;
    } catch (err) {
      console.error("Error fetching player", id, err);
      playerCache.set(id, null);
      return null;
    }
  }
  // ====================================================================

  // --- State Hooks ---
  const [gameIdSource, setGameIdSource] = React.useState<"auto" | "manual">(
    () => (initialGameId ? "auto" : "manual")
  );
  const [gameId, setGameIdState] = React.useState<string>(
    () => initialGameId || getLocalStorageItem(LS_KEY_GAME_ID) || ""
  );
  const [myColor, setMyColor] = React.useState<
    "white" | "black" | "observer" | null
  >(null);
  const [players, setPlayers] = React.useState<PlayerInfo>({
    white: null,
    black: null,
  });
  const [isGameActive, setIsGameActive] = React.useState(false);
  const [gameResult, setGameResult] = React.useState<string | null>(null);
  const [gameWinner, setGameWinner] = React.useState<"white" | "black" | null>(
    null
  );
  const [drawOffer, setDrawOffer] = React.useState<DrawOfferState>({
    isPending: false,
    isOfferedByMe: false,
    offererPlayerId: null,
    offeredAt: null,
  });
  const [drawResponse, setDrawResponse] = React.useState<
    "accepted" | "rejected" | null
  >(null);
  const [boardOrientation, setBoardOrientation] = React.useState<
    "white" | "black"
  >("white");
  const [authUserId, setAuthUserId] = React.useState<string | null>(null);
  const [playersInfo, setPlayersInfo] = React.useState<
    Record<string, Player | null>
  >({});
  const [isMovePending, setIsMovePending] = React.useState(false);
  const pendingMoveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const isGameActiveRef = React.useRef(isGameActive);

  React.useEffect(() => {
    isGameActiveRef.current = isGameActive;
  }, [isGameActive]);

  const gracefulServerErrorPatterns = React.useMemo(
    () => [
      /already completed/i,
      /cannot join/i,
      /already been completed/i,
      /no active game/i,
      /not found/i,
    ],
    []
  );

  const clearPendingMove = useCallback(() => {
    setIsMovePending(false);
    if (pendingMoveTimeoutRef.current) {
      clearTimeout(pendingMoveTimeoutRef.current);
      pendingMoveTimeoutRef.current = null;
    }
  }, []);

  const reflectTerminalServerError = React.useCallback(
    (message: string) => {
      setGameResult(message);
      setGameWinner(null);
      setIsGameActive(false);
      clearPendingMove();
      setDrawOffer({
        isPending: false,
        isOfferedByMe: false,
        offererPlayerId: null,
        offeredAt: null,
      });
      setDrawResponse(null);
    },
    [clearPendingMove]
  );

  // --- Utility Hooks ---
  const { logs, addLog, clearLogs } = useGameLogs();
  const capturedPieces = useCapturedPieces(chessGame.game, chessGame.fen);
  const currentTurn = React.useMemo(
    () => (chessGame.game.turn() === "w" ? "white" : "black"),
    [chessGame.game]
  );
  const {
    whiteTime,
    blackTime,
    isWhiteTimeLow,
    isBlackTimeLow,
    updateTimersFromServer,
    stopTimer,
  } = useGameTimer(isGameActive, gameResult, currentTurn);

  // --- Socket Hook ---
  const { socket, isConnected } = useSocket(token);
  const lastJoinAttemptRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!initialGameId) return;
    setGameIdSource("auto");
    setGameIdState(initialGameId);
  }, [initialGameId]);

  // Soft-hydrate from the last stored snapshot so the board + history are not blank on refresh
  React.useEffect(() => {
    const saved = readJson<{
      gameId: string;
      fen: string;
      moveHistory?: string[];
    }>(LS_KEY_LAST_GAME_STATE);
    if (!saved) return;

    if (!gameId && saved.gameId) {
      setGameIdState(saved.gameId);
    }

    if (saved.fen) {
      try {
        loadGameFromFen(saved.fen, saved.moveHistory);
      } catch (err) {
        console.warn("Failed to hydrate saved chess state", err);
      }
    }
  }, [gameId, loadGameFromFen]);

  React.useEffect(() => {
    if (!isConnected) {
      lastJoinAttemptRef.current = null;
    }
  }, [isConnected]);

  // ====================================================================
  // Resolver: Fetch and cache Player objects from IDs
  // ====================================================================

  const resolveAndCachePlayers = useCallback(
    async (ids: { white: string | null; black: string | null }) => {
      if (!ids.white && !ids.black) return;
      try {
        const [whitePlayer, blackPlayer] = await Promise.all([
          ids.white ? fetchPlayerById(ids.white, token) : Promise.resolve(null),
          ids.black ? fetchPlayerById(ids.black, token) : Promise.resolve(null),
        ]);
        setPlayersInfo((prev) => ({
          ...prev,
          ...(ids.white && whitePlayer ? { [ids.white]: whitePlayer } : {}),
          ...(ids.black && blackPlayer ? { [ids.black]: blackPlayer } : {}),
        }));
      } catch (err) {
        console.error("Failed to resolve players", err);
      }
    },
    [token]
  );

  // playersInfo cache is maintained for UI lookups; avoid noisy logging in render

  // ====================================================================
  // Game State Updater
  // ====================================================================

  const updateGameState = useCallback(
    (newState: Partial<GameState>) => {
      if (newState.fen) {
        const historyToUse = newState.moveHistory ?? chessGame.moveHistory;
        loadGameFromFen(newState.fen, historyToUse);
        clearPendingMove();
      }
      if (newState.moveHistory) {
        // moveHistory is read-only, synced from fen
      }
      if (newState.players) {
        setPlayers(newState.players);
      }
      if (newState.myColor !== undefined) {
        setMyColor(newState.myColor);
      }
      if (
        newState.whiteTime !== undefined ||
        newState.blackTime !== undefined
      ) {
        updateTimersFromServer(
          (newState.whiteTime || whiteTime) / 1000,
          (newState.blackTime || blackTime) / 1000
        );
      }
      if (newState.isGameActive !== undefined) {
        setIsGameActive(newState.isGameActive);
      }
      if (newState.gameResult !== undefined) {
        setGameResult(newState.gameResult);
      }
      if (newState.gameWinner !== undefined) {
        setGameWinner(newState.gameWinner ?? null);
      }
      if (newState.drawOffer) {
        setDrawOffer(newState.drawOffer);
      }
    },
    [
      loadGameFromFen,
      whiteTime,
      blackTime,
      updateTimersFromServer,
      clearPendingMove,
    ]
  );

  // ====================================================================
  // Game Actions
  // ====================================================================

  const makeMove = useCallback(
    (from: Square, to: Square, promotion?: string): boolean => {
      if (drawOffer.isPending) {
        addLog("Cannot move while draw offer is pending", "red");
        return false;
      }

      if (!isGameActive || !myColor || gameResult) {
        addLog("Cannot make move: game not active or already ended", "red");
        return false;
      }

      if (isMovePending) {
        addLog("Waiting for previous move confirmation", "#ffaa00");
        return false;
      }

      // Guard turn order
      const turn = chessGame.game.turn();
      if (
        (turn === "w" && myColor !== "white") ||
        (turn === "b" && myColor !== "black")
      ) {
        addLog("It's not your turn", "red");
        return false;
      }

      // Validate locally before mutating state
      if (!chessGame.isMoveLegal(from, to, promotion)) {
        addLog("Illegal move", "red");
        return false;
      }

      const move = chessGame.makeMove(from, to, promotion);
      if (!move) {
        addLog("Illegal move", "red");
        return false;
      }

      // Stop timer when move is made
      stopTimer();

      // Prevent double-sends until server confirms
      setIsMovePending(true);
      if (pendingMoveTimeoutRef.current) {
        clearTimeout(pendingMoveTimeoutRef.current);
      }
      pendingMoveTimeoutRef.current = setTimeout(() => {
        setIsMovePending(false);
        addLog(
          "Move confirmation delayed. Awaiting server state...",
          "#ffaa00"
        );
      }, 8000);

      addLog(`Sent move: ${move.from}-${move.to}`, "#dddddd");
      socket?.emit(SOCKET_EVENTS.C2S_MAKE_MOVE, {
        gameId,
        from: move.from,
        to: move.to,
        promotion: move.promotion,
      });

      return true;
    },
    [
      isGameActive,
      myColor,
      gameResult,
      chessGame,
      gameId,
      addLog,
      socket,
      stopTimer,
      drawOffer.isPending,
      isMovePending,
    ]
  );

  const resign = useCallback(() => {
    if (!isGameActive) return;
    socket?.emit(SOCKET_EVENTS.C2S_RESIGN, { gameId });
    addLog("Sent resign", "#ff4444");
  }, [isGameActive, gameId, socket, addLog]);

  const offerDraw = useCallback(() => {
    if (!isGameActive || drawOffer.isPending) return;
    socket?.emit(SOCKET_EVENTS.C2S_OFFER_DRAW, { gameId });
    addLog("Draw offer sent. Waiting for response...", "#66aaff");
    setDrawOffer({
      isPending: true,
      isOfferedByMe: true,
      offererPlayerId: authUserId,
      offeredAt: Date.now(),
    });
  }, [isGameActive, gameId, socket, addLog, drawOffer.isPending, authUserId]);

  const acceptDraw = useCallback(() => {
    if (!isGameActive || !drawOffer.isPending) return;
    socket?.emit(SOCKET_EVENTS.C2S_ACCEPT_DRAW, { gameId });
    addLog("Draw offer accepted", "#66aaff");
    setDrawResponse("accepted");
  }, [isGameActive, gameId, socket, addLog, drawOffer.isPending]);

  const rejectDraw = useCallback(() => {
    if (!isGameActive || !drawOffer.isPending) return;
    socket?.emit(SOCKET_EVENTS.C2S_REJECT_DRAW, { gameId });
    addLog("Draw offer rejected", "#ff6666");
    setDrawOffer({
      isPending: false,
      isOfferedByMe: false,
      offererPlayerId: null,
      offeredAt: null,
    });
    setDrawResponse("rejected");
  }, [isGameActive, gameId, socket, addLog, drawOffer.isPending]);

  const joinGame = useCallback(
    (id: string) => {
      if (!isConnected || !authUserId) {
        addLog("Not authenticated or connected", "red");
        return;
      }

      clearPendingMove();
      setGameIdSource("manual");
      setGameIdState(id);

      socket?.emit(SOCKET_EVENTS.C2S_JOIN_GAME, { gameId: id });
      addLog(`Sent join game: ${id}`, "#ffaa00");
    },
    [isConnected, authUserId, socket, addLog, clearPendingMove]
  );

  React.useEffect(() => {
    if (gameIdSource !== "auto") return;
    if (!gameId || !isConnected || !authUserId) return;
    if (lastJoinAttemptRef.current === gameId) return;

    joinGame(gameId);
    lastJoinAttemptRef.current = gameId;
  }, [gameId, gameIdSource, isConnected, authUserId, joinGame]);

  // ====================================================================
  // Socket Event Listeners Setup
  // ====================================================================

  React.useEffect(() => {
    if (!socket) {
      console.log("Context: Socket not ready");
      return;
    }

    console.log("Context: Setting up socket connection listeners");

    const handleConnect = () => {
      console.log("Context: Socket connected:", socket.id);
      if (token) {
        console.log("Context: Authenticating with token");
        socket.emit(SOCKET_EVENTS.C2S_AUTHENTICATE, { token });
      }
    };

    const handleDisconnect = () => {
      console.log("Context: Socket disconnected");
      addLog("Disconnected", "red");
      setGameResult("Connection lost. Please refresh.");
      setGameWinner(null);
      setIsGameActive(false);
      clearPendingMove();
      // Reset game state on disconnect to prevent stale data
      setPlayers({ white: null, black: null });
      setMyColor(null);
    };

    const handleError = (error: any) => {
      console.error("Context: Socket error:", error);
      addLog(`Connection error: ${error?.message || "Unknown error"}`, "red");
    };

    // If socket is already connected, handle immediately
    if (socket.connected) {
      console.log("Context: Socket already connected, authenticating now");
      handleConnect();
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
    };
  }, [socket, token, addLog, clearPendingMove]);

  // Auth listeners
  React.useEffect(() => {
    if (!socket) return;

    console.log("Context: Setting up auth listeners");

    const handleAuthSuccess = (d: { message: string; userId: string }) => {
      console.log("Context: Auth success:", d.userId);
      addLog(`Authenticated as ${d.userId}`, "#00ff88");
      setAuthUserId(d.userId);
    };

    const handleError = (d: { message: string }) => {
      const message = d?.message ?? "Unknown error";
      const isGraceful = gracefulServerErrorPatterns.some((pattern) =>
        pattern.test(message)
      );

      if (isGraceful) {
        console.warn("Context: Server notice:", message);
        reflectTerminalServerError(message);
      } else {
        console.error("Context: Server error:", message);
      }

      clearPendingMove();

      addLog(`Server Error: ${message}`, "#ff4444");
    };

    const handleSocketError = (d: { context: string; message: string }) => {
      console.error("Context: Socket error:", d);
      addLog(`Socket Error [${d.context}]: ${d.message}`, "#ff4444");
    };

    socket.on(SOCKET_EVENTS.S2C_AUTH_SUCCESS, handleAuthSuccess);
    socket.on(SOCKET_EVENTS.S2C_ERROR, handleError);
    socket.on(SOCKET_EVENTS.SOCKET_ERROR, handleSocketError);

    return () => {
      socket.off(SOCKET_EVENTS.S2C_AUTH_SUCCESS, handleAuthSuccess);
      socket.off(SOCKET_EVENTS.S2C_ERROR, handleError);
      socket.off(SOCKET_EVENTS.SOCKET_ERROR, handleSocketError);
    };
  }, [
    socket,
    addLog,
    gracefulServerErrorPatterns,
    reflectTerminalServerError,
    clearPendingMove,
  ]);

  // Game logic listeners
  React.useEffect(() => {
    if (!socket) return;

    console.log("Context: Setting up game logic listeners");

    const handleGameState = (d: {
      fen: string;
      yourColor: "white" | "black" | "observer";
      players: { white: string | null; black: string | null };
      whiteTime: number;
      blackTime: number;
    }) => {
      console.log("Context: Game state received:", d.yourColor);
      addLog(`Joined game. You are ${d.yourColor}`, "#00ccff");
      clearPendingMove();
      loadGameFromFen(d.fen, chessGame.moveHistory);
      setPlayers(d.players);
      void resolveAndCachePlayers(d.players);
      setMyColor(d.yourColor);
      setBoardOrientation(d.yourColor === "black" ? "black" : "white");
      updateTimersFromServer(d.whiteTime, d.blackTime);
      setIsGameActive(true);
      setGameResult(null);
      setGameWinner(null);
      setDrawOffer({
        isPending: false,
        isOfferedByMe: false,
        offererPlayerId: null,
        offeredAt: null,
      });
      setDrawResponse(null);
    };

    const handlePlayerJoined = (d: {
      message: string;
      players: { white: string | null; black: string | null };
    }) => {
      console.log("Context: Player joined:", d.message);
      addLog(`${d.message}`, "#ffaa00");
      setPlayers(d.players);
      void resolveAndCachePlayers(d.players);
    };

    const handleMoveMade = (d: {
      from: string;
      to: string;
      newFen: string;
      whiteTime: number;
      blackTime: number;
      promotion?: string;
    }) => {
      console.log("Context: Move received:", d.from, d.to);
      addLog(`Move: ${d.from}-${d.to}`, "#dddddd");
      clearPendingMove();
      const applied = applyServerMove(
        d.from as Square,
        d.to as Square,
        d.promotion
      );

      if (!applied) {
        // Fallback: derive SAN manually before loading FEN so history stays consistent
        try {
          const temp = new Chess(chessGame.fen);
          const move = temp.move({
            from: d.from as Square,
            to: d.to as Square,
            promotion: d.promotion || "q",
          });
          const history = move
            ? [...chessGame.moveHistory, move.san]
            : chessGame.moveHistory;
          loadGameFromFen(d.newFen, history);
        } catch (err) {
          loadGameFromFen(d.newFen, chessGame.moveHistory);
        }
      }
      updateTimersFromServer(d.whiteTime, d.blackTime);
      setDrawOffer({
        isPending: false,
        isOfferedByMe: false,
        offererPlayerId: null,
        offeredAt: null,
      });
      setDrawResponse(null);
    };

    const handleGameOver = (d: {
      reason: string;
      winner?: "white" | "black";
    }) => {
      const reason = d.reason?.trim() ?? "";
      const isSoftCheck = /check/i.test(reason) && !/mate/i.test(reason);

      if (isSoftCheck) {
        console.log(
          "Context: Check warning received, keeping game active:",
          reason
        );
        addLog(`Warning: ${reason}`, "#ffcc00");
        return;
      }

      if (!isGameActiveRef.current) {
        console.log(
          "Context: Game over received but no active game, suppressing toast/log:",
          reason
        );
        return;
      }

      console.log("Context: Game over:", reason);
      addLog(`Game Over: ${reason}`, "#ff4444");
      clearPendingMove();
      setGameResult(reason);
      setGameWinner(d.winner ?? null);
      setIsGameActive(false);
    };

    const handleDrawOffered = (d: any) => {
      console.log("Context: Draw offered from:", d);

      // normalize payload: some events may use `fromPlayerId`, others `from`
      const fromPlayerId: string | null = d?.fromPlayerId ?? d?.from ?? null;
      const offererUserId =
        fromPlayerId === "white" ? players.white : players.black;

      addLog(`Draw offer from opponent`, "#66aaff");
      setDrawOffer({
        isPending: true,
        isOfferedByMe: false,
        offererPlayerId: offererUserId,
        offeredAt: Date.now(),
      });
      setDrawResponse(null);
    };

    const handleDrawAccepted = (d: any) => {
      console.log("Context: Draw accepted from:", d);
      addLog(`Draw offer accepted! Game drawn.`, "#00ff88");
      setDrawOffer({
        isPending: false,
        isOfferedByMe: false,
        offererPlayerId: null,
        offeredAt: null,
      });
      setDrawResponse("accepted");
      setGameResult("Draw by agreement");
      setGameWinner(null);
      setIsGameActive(false);
    };

    const handleDrawRejected = (d: any) => {
      console.log("Context: Draw rejected from:", d);
      addLog(`Draw offer rejected by opponent`, "#ff6666");
      setDrawOffer({
        isPending: false,
        isOfferedByMe: false,
        offererPlayerId: null,
        offeredAt: null,
      });
      setDrawResponse("rejected");
    };

    socket.on(SOCKET_EVENTS.S2C_GAME_STATE, handleGameState);
    socket.on(SOCKET_EVENTS.S2C_PLAYER_JOINED, handlePlayerJoined);
    socket.on(SOCKET_EVENTS.S2C_MOVE_MADE, handleMoveMade);
    socket.on(SOCKET_EVENTS.S2C_GAME_OVER, handleGameOver);
    socket.on(SOCKET_EVENTS.S2C_DRAW_OFFERED, handleDrawOffered);
    socket.on(SOCKET_EVENTS.S2C_DRAW_ACCEPTED, handleDrawAccepted);
    socket.on(SOCKET_EVENTS.S2C_DRAW_REJECTED, handleDrawRejected);

    return () => {
      socket.off(SOCKET_EVENTS.S2C_GAME_STATE, handleGameState);
      socket.off(SOCKET_EVENTS.S2C_PLAYER_JOINED, handlePlayerJoined);
      socket.off(SOCKET_EVENTS.S2C_MOVE_MADE, handleMoveMade);
      socket.off(SOCKET_EVENTS.S2C_GAME_OVER, handleGameOver);
      socket.off(SOCKET_EVENTS.S2C_DRAW_OFFERED, handleDrawOffered);
      socket.off(SOCKET_EVENTS.S2C_DRAW_ACCEPTED, handleDrawAccepted);
      socket.off(SOCKET_EVENTS.S2C_DRAW_REJECTED, handleDrawRejected);
    };
  }, [
    socket,
    addLog,
    updateTimersFromServer,
    clearPendingMove,
    resolveAndCachePlayers,
    loadGameFromFen,
    applyServerMove,
    chessGame.fen,
  ]);

  // Check detection
  const lastCheckFenRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const kingInCheck = chessGame.isInCheck();

    if (!kingInCheck) {
      lastCheckFenRef.current = null;
      return;
    }

    const kingColor = chessGame.getCurrentTurn();
    const isMyKingInCheck =
      (myColor === "white" && kingColor === "white") ||
      (myColor === "black" && kingColor === "black");

    if (isMyKingInCheck && lastCheckFenRef.current !== chessGame.fen) {
      addLog("You are in check!", "#ffcc00");
      lastCheckFenRef.current = chessGame.fen;
    }
  }, [
    chessGame.fen,
    myColor,
    chessGame.isInCheck,
    chessGame.getCurrentTurn,
    addLog,
  ]);

  // Resolve player info whenever players state updates
  React.useEffect(() => {
    if (players?.white || players?.black) {
      void resolveAndCachePlayers(players);
    }
  }, [players, resolveAndCachePlayers]);

  // Persist gameId
  React.useEffect(() => {
    setLocalStorageItem(LS_KEY_GAME_ID, gameId);
  }, [gameId]);

  // Persist last known board + history for quick reloads
  React.useEffect(() => {
    if (!gameId) return;
    writeJson(LS_KEY_LAST_GAME_STATE, {
      gameId,
      fen: chessGame.fen,
      moveHistory: chessGame.moveHistory,
    });
  }, [gameId, chessGame.fen, chessGame.moveHistory]);

  // ====================================================================
  // Context Value
  // ====================================================================

  const value: ChessGameContextValue = {
    // Game State
    fen: chessGame.fen,
    moveHistory: chessGame.moveHistory,
    gameResult,
    gameWinner,
    isGameActive,

    // Multiplayer State
    gameId,
    myColor,
    players,
    playersInfo,
    drawOffer,
    drawResponse,
    isMovePending,

    // Timers
    whiteTime,
    blackTime,
    isWhiteTimeLow,
    isBlackTimeLow,

    // Captured Pieces
    capturedPieces,

    // Logs
    logs,

    // Board
    boardOrientation,

    // Auth
    authUserId,
    isConnected,

    game: chessGame.game,

    // Setters
    setGameId: (id: string) => {
      setGameIdSource("manual");
      setGameIdState(id);
    },
    setBoardOrientation,

    // Game Actions
    makeMove,
    resign,
    offerDraw,
    acceptDraw,
    rejectDraw,
    joinGame,

    // State Mutators
    updateGameState,
    addLog,
    clearLogs,
  };

  return (
    <ChessGameContext.Provider value={value}>
      {children}
    </ChessGameContext.Provider>
  );
};

// ====================================================================
// Context Hook
// ====================================================================

export const useChessGameContext = (): ChessGameContextValue => {
  const context = useContext(ChessGameContext);
  if (!context) {
    throw new Error(
      "useChessGameContext must be used within ChessGameProvider"
    );
  }
  return context;
};
