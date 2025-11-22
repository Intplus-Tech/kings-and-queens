"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
  type FC,
} from "react";
import type { Square, Chess } from "chess.js";
import { useChessGame } from "@/hooks/use-chess-game";
import { useGameLogs } from "@/hooks/use-game-logs";
import { useCapturedPieces } from "@/hooks/use-captured-pieces";
import { useGameTimer } from "@/hooks/use-game-timer";
import { useSocket } from "@/hooks/use-socket";
import { SOCKET_EVENTS, LS_KEY_GAME_ID } from "@/lib/chess-constants";
import type {
  GameState,
  PlayerInfo,
  CapturedPieces,
  LogEntry,
  DrawOfferState,
} from "@/lib/chess-types";
import { getLocalStorageItem, setLocalStorageItem } from "@/lib/chess-utils";
import { Player } from "@/types/player";

// ====================================================================
// Context Type Definition
// ====================================================================

interface ChessGameContextValue {
  // Game State
  fen: string;
  moveHistory: string[];
  gameResult: string | null;
  isGameActive: boolean;

  // Multiplayer State
  gameId: string;
  myColor: "white" | "black" | "observer" | null;
  players: PlayerInfo;
  playersInfo: Record<string, Player | null>;
  drawOffer: DrawOfferState;
  drawResponse: "accepted" | "rejected" | null;

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
}

export const ChessGameProvider: FC<ChessGameProviderProps> = ({
  children,
  token,
}) => {
  // --- Game Logic Hooks ---
  const chessGame = useChessGame();

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
  const [gameId, setGameIdState] = React.useState<string>(
    () => getLocalStorageItem(LS_KEY_GAME_ID) || ""
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
        chessGame.loadGameFromFen(newState.fen);
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
      if (newState.drawOffer) {
        setDrawOffer(newState.drawOffer);
      }
    },
    [chessGame, whiteTime, blackTime, updateTimersFromServer]
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

      // Check if it's my turn
      const turn = chessGame.game.turn();
      if (
        (turn === "w" && myColor !== "white") ||
        (turn === "b" && myColor !== "black")
      ) {
        addLog("It's not your turn", "red");
        return false;
      }

      const move = chessGame.makeMove(from, to, promotion);
      if (!move) {
        addLog("Illegal move", "red");
        return false;
      }

      // Stop timer when move is made
      stopTimer();

      // Emit to server
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

      socket?.emit(SOCKET_EVENTS.C2S_JOIN_GAME, { gameId: id });
      addLog(`Sent join game: ${id}`, "#ffaa00");
    },
    [isConnected, authUserId, socket, addLog]
  );

  // ====================================================================
  // Socket Event Listeners Setup
  // ====================================================================

  React.useEffect(() => {
    if (!socket) {
      console.log("[v0] Context: Socket not ready");
      return;
    }

    console.log("[v0] Context: Setting up socket connection listeners");

    const handleConnect = () => {
      console.log("[v0] Context: Socket connected:", socket.id);
      if (token) {
        console.log("[v0] Context: Authenticating with token");
        socket.emit(SOCKET_EVENTS.C2S_AUTHENTICATE, { token });
      }
    };

    const handleDisconnect = () => {
      console.log("[v0] Context: Socket disconnected");
      addLog("Disconnected", "red");
      setGameResult("Connection lost. Please refresh.");
      setIsGameActive(false);
      // Reset game state on disconnect to prevent stale data
      setPlayers({ white: null, black: null });
      setMyColor(null);
    };

    const handleError = (error: any) => {
      console.error("[v0] Context: Socket error:", error);
      addLog(`Connection error: ${error?.message || "Unknown error"}`, "red");
    };

    // If socket is already connected, handle immediately
    if (socket.connected) {
      console.log("[v0] Context: Socket already connected, authenticating now");
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
  }, [socket, token, addLog]);

  // Auth listeners
  React.useEffect(() => {
    if (!socket) return;

    console.log("[v0] Context: Setting up auth listeners");

    const handleAuthSuccess = (d: { message: string; userId: string }) => {
      console.log("[v0] Context: Auth success:", d.userId);
      addLog(`Authenticated as ${d.userId}`, "#00ff88");
      setAuthUserId(d.userId);
    };

    const handleError = (d: { message: string }) => {
      console.error("[v0] Context: Server error:", d.message);
      addLog(`Server Error: ${d.message}`, "#ff4444");
    };

    const handleSocketError = (d: { context: string; message: string }) => {
      console.error("[v0] Context: Socket error:", d);
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
  }, [socket, addLog]);

  // Game logic listeners
  React.useEffect(() => {
    if (!socket) return;

    console.log("[v0] Context: Setting up game logic listeners");

    const handleGameState = (d: {
      fen: string;
      yourColor: "white" | "black" | "observer";
      players: { white: string | null; black: string | null };
      whiteTime: number;
      blackTime: number;
    }) => {
      console.log("[v0] Context: Game state received:", d.yourColor);
      addLog(`Joined game. You are ${d.yourColor}`, "#00ccff");
      chessGame.loadGameFromFen(d.fen);
      setPlayers(d.players);
      void resolveAndCachePlayers(d.players);
      setMyColor(d.yourColor);
      setBoardOrientation(d.yourColor === "black" ? "black" : "white");
      updateTimersFromServer(d.whiteTime, d.blackTime);
      setIsGameActive(true);
      setGameResult(null);
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
      console.log("[v0] Context: Player joined:", d.message);
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
    }) => {
      console.log("[v0] Context: Move received:", d.from, d.to);
      addLog(`Move: ${d.from}-${d.to}`, "#dddddd");
      chessGame.loadGameFromFen(d.newFen);
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
          "[v0] Context: Check warning received, keeping game active:",
          reason
        );
        addLog(`Warning: ${reason}`, "#ffcc00");
        return;
      }

      console.log("[v0] Context: Game over:", reason);
      addLog(`Game Over: ${reason}`, "#ff4444");
      setGameResult(reason);
      setIsGameActive(false);
    };

    const handleDrawOffered = (d: any) => {
      console.log("[v0] Context: Draw offered from:", d);

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
      console.log("[v0] Context: Draw accepted from:", d);
      addLog(`Draw offer accepted! Game drawn.`, "#00ff88");
      setDrawOffer({
        isPending: false,
        isOfferedByMe: false,
        offererPlayerId: null,
        offeredAt: null,
      });
      setDrawResponse("accepted");
      setGameResult("Draw by agreement");
      setIsGameActive(false);
    };

    const handleDrawRejected = (d: any) => {
      console.log("[v0] Context: Draw rejected from:", d);
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
  }, [socket, chessGame, addLog, updateTimersFromServer]);

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
  }, [chessGame.fen, myColor, chessGame, addLog]);

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

  // ====================================================================
  // Context Value
  // ====================================================================

  const value: ChessGameContextValue = {
    // Game State
    fen: chessGame.fen,
    moveHistory: chessGame.moveHistory,
    gameResult,
    isGameActive,

    // Multiplayer State
    gameId,
    myColor,
    players,
    playersInfo,
    drawOffer,
    drawResponse,

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
