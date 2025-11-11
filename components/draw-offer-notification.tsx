"use client";

import type { FC } from "react";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useChessGameContext } from "@/context/chess-game-context";

/**
 * Toast-style notification for draw offer feedback
 * Displays when player initiates draw offer or receives response
 * New component for real-time draw offer feedback
 */
export const DrawOfferNotification: FC = () => {
  const { drawOffer, drawResponse } = useChessGameContext();
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"pending" | "accepted" | "rejected" | null>(
    null
  );

  useEffect(() => {
    // Show notification when draw is offered by me
    if (drawOffer.isPending && drawOffer.isOfferedByMe) {
      setMessage("Draw offer sent. Waiting for response...");
      setType("pending");
      setIsVisible(true);

      const timer = setTimeout(() => {
        // Keep showing if still pending
        if (drawOffer.isPending && drawOffer.isOfferedByMe) {
          return;
        }
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }

    // Show notification for response
    if (drawResponse === "accepted") {
      setMessage("Draw offer accepted! Game drawn.");
      setType("accepted");
      setIsVisible(true);

      const timer = setTimeout(() => setIsVisible(false), 4000);
      return () => clearTimeout(timer);
    }

    if (drawResponse === "rejected") {
      setMessage("Draw offer rejected by opponent.");
      setType("rejected");
      setIsVisible(true);

      const timer = setTimeout(() => setIsVisible(false), 4000);
      return () => clearTimeout(timer);
    }

    setIsVisible(false);
  }, [drawOffer, drawResponse]);

  if (!isVisible) return null;

  const colors = {
    pending: "bg-blue-900/80 border-blue-700 text-blue-200",
    accepted: "bg-green-900/80 border-green-700 text-green-200",
    rejected: "bg-red-900/80 border-red-700 text-red-200",
  };

  const icons = {
    pending: <AlertCircle className="h-5 w-5" />,
    accepted: <CheckCircle className="h-5 w-5" />,
    rejected: <XCircle className="h-5 w-5" />,
  };

  return (
    <div
      className={`
        fixed bottom-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border
        ${type ? colors[type] : "bg-gray-800 border-gray-700"}
        animate-in fade-in slide-in-from-bottom-2 duration-300
      `}
    >
      {type && icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};
