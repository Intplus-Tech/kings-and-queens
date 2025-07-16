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

export default function AddPlayerModal() {
  const [open, setOpen] = useState(false);
  const currentPlayers = 2;
  const maxPlayers = 5;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default' className="text-black">+ Add Player</Button>
      </DialogTrigger>

      <DialogContent className='max-w-3xl bg-[#1C1C1E] overflow-auto h-full text-white rounded-xl border border-gray-700 p-10'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-center hidden'>
            Create Team
          </DialogTitle>
        </DialogHeader>

        <div className='flex w-[630px]  justify-center items-center  gap-4'>
          <img
            src='/chess-pieces.png'
            alt=''
            className='w-[119px] h-[170px] object-cover bg-transparent'
          />
          <div className='flex flex-col gap-8'>
            <p className='mt-4 text-center text-3xl font-bold'>
              Add To team
            </p>{" "}
            <p className=' text-[17px] text-yellow-400 mb-2'>
              Add players to your team. You can add up to 3 players, and the
              rest will be reserved for your school.
            </p>
          </div>
        </div>

        <div className='space-y-3 w-[339px] flex flex-col justify-center  mx-auto'>
          <div className='w-full bg-white rounded-full h-1.5 mb-1'>
            <div
              className='bg-yellow-400 h-1.5 rounded-full'
              style={{ width: `${(currentPlayers / maxPlayers) * 100}%` }}
            ></div>
          </div>
          <p className='text-xs text-gray-300 mb-4'>
            No of players{" "}
            <span className='float-right'>
              {currentPlayers} / {maxPlayers}
            </span>
          </p>
          <div>
            <Label htmlFor='fullName' className='text-sm text-white'>
              Player Full Name
            </Label>
            <Input
              id='fullName'
              placeholder='Enter the player legal name'
              className='bg-[#2C2C2E] text-white border-gray-600'
            />
          </div>

          <div>
            <Label htmlFor='alias' className='text-sm text-white'>
              Alias
            </Label>
            <Input
              id='alias'
              placeholder='Enter player game name'
              className='bg-[#2C2C2E] text-white border-gray-600'
            />
          </div>

          <div>
            <Label htmlFor='dob' className='text-sm text-white'>
              Date of Birth
            </Label>
            <Input
              id='dob'
              type='text'
              className='bg-[#2C2C2E] text-white border-gray-600'
              placeholder='Select appropriate date'
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
            />
          </div>

          <div>
            <Label htmlFor='class' className='text-sm text-white'>
              Class
            </Label>
            <Input
              id='class'
              placeholder='What class is the player'
              className='bg-[#2C2C2E] text-white border-gray-600'
            />
          </div>

          <div>
            <Label htmlFor='phone' className='text-sm text-white'>
              Player's Phone Number
            </Label>
            <Input
              id='phone'
              type='tel'
              placeholder='Enter phone number'
              className='bg-[#2C2C2E] text-white border-gray-600'
            />
          </div>
        </div>

        <DialogFooter className='mt-6  gap-2 '>
          <div className='flex flex-col justify-center items-center gap-4 mx-auto w-[339px]'>
            <Button className='bg-gradient-to-r  from-yellow-400 to-orange-500 text-black w-full'>
              Add Player
            </Button>
            <button
              onClick={() => setOpen(false)}
              className='text-sm bg-gradient-to-r text-transparent  from-yellow-400 to-orange-500 bg-clip-text hover:underline w-full'
            >
              Skip
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
