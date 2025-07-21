"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CreateTeamModal() {
  const [open, setOpen] = useState(false);
  const currentPlayers = 2;
  const maxPlayers = 5;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Create Team</Button>
      </DialogTrigger>

      <DialogContent
        className="w-full max-w-[90vw] sm:max-w-2xl bg-[#1C1C1E] text-white rounded-xl border border-gray-700 p-4 sm:p-6 md:p-8 md:max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center hidden">
            Create Team
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <img
            src="/chess-pieces.png"
            alt="Chess Pieces"
            className="w-20 sm:w-24 md:w-[119px] h-auto object-contain bg-transparent"
          />
          <div className="flex flex-col gap-4 sm:gap-6 text-center sm:text-left">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold">
              Create your team
            </p>
            <p className="text-sm sm:text-base text-yellow-400">
              Add players to your team. You can add up to 3 players, and the rest
              will be reserved for your school.
            </p>
          </div>
        </div>

        <div className="space-y-4 w-full max-w-[339px] mx-auto">
          <div className="w-full bg-white rounded-full h-1.5">
            <div
              className="bg-yellow-400 h-1.5 rounded-full"
              style={{ width: `${(currentPlayers / maxPlayers) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-300">
            No of players{" "}
            <span className="float-right">
              {currentPlayers} / {maxPlayers}
            </span>
          </p>
          <div>
            <Label htmlFor="fullName" className="text-sm text-white">
              Player Full Name
            </Label>
            <Input
              id="fullName"
              placeholder="Enter the player legal name"
              className="bg-[#2C2C2E] text-white border-gray-600"
            />
          </div>

          <div>
            <Label htmlFor="alias" className="text-sm text-white">
              Alias
            </Label>
            <Input
              id="alias"
              placeholder="Enter player game name"
              className="bg-[#2C2C2E] text-white border-gray-600"
            />
          </div>

          <div>
            <Label htmlFor="dob" className="text-sm text-white">
              Date of Birth
            </Label>
            <Input
              id="dob"
              type="text"
              className="bg-[#2C2C2E] text-white border-gray-600"
              placeholder="Select appropriate date"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
            />
          </div>

          <div>
            <Label htmlFor="class" className="text-sm text-white">
              Class
            </Label>
            <Input
              id="class"
              placeholder="What class is the player"
              className="bg-[#2C2C2E] text-white border-gray-600"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm text-white">
              Player's Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              className="bg-[#2C2C2E] text-white border-gray-600"
            />
          </div>
        </div>

        <DialogFooter className="mt-4 sm:mt-6  w-full max-w-[339px] mx-auto flex flex-col gap-2 justify-center">
          <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black w-full max-w-[339px]">
            Add Player
          </Button>
          <button
            onClick={() => setOpen(false)}
            className="text-sm bg-gradient-to-r text-transparent from-yellow-400 to-orange-500 bg-clip-text hover:underline w-full max-w-[339px]"
          >
            Skip
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}