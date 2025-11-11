"use client";

import type { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Handshake, X } from "lucide-react";
import { useChessGameContext } from "@/context/chess-game-context";

/**
 * Persistent modal for draw offer notifications
 * Displays only to the player who RECEIVED the draw offer (not the sender)
 * New component for draw offer UX
 */
export const DrawOfferModal: FC = () => {
  const { drawOffer, drawResponse, acceptDraw, rejectDraw, authUserId } =
    useChessGameContext();

  // This prevents the modal from appearing on both sender and receiver
  const isVisible =
    drawOffer.isPending && drawOffer.offererPlayerId !== authUserId;

  return (
    <Dialog open={isVisible}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Handshake className="h-5 w-5 text-blue-400" />
            Draw Offer
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Your opponent has offered a draw. Do you accept?
          </DialogDescription>
        </DialogHeader>

        {drawResponse === "accepted" && (
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 text-sm text-green-300">
            ✓ Draw accepted. Game ended in a draw.
          </div>
        )}

        {drawResponse === "rejected" && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-3 text-sm text-red-300">
            ✗ Draw offer rejected. Game continues.
          </div>
        )}

        {!drawResponse && (
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={rejectDraw}
              className="bg-gray-700 border-gray-600 hover:bg-gray-600"
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              onClick={acceptDraw}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Handshake className="mr-2 h-4 w-4" />
              Accept Draw
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
