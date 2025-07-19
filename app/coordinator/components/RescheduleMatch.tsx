"use client"

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function CreateTeamModal() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <p className="text-yellow-400 py-2  cursor-pointer">Request Match Reschedule</p>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-7 overflow-auto h-full bg-[#1C1C1E] text-white rounded-xl border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-left text-3xl font-bold">Reschedule Match</DialogTitle>
        </DialogHeader>
        <p className="text-left text-md ] mb-4">
          This form allows school coordinators to request a change in match dates/times for the Kings & Queens: Naija
          Chess Competition. Reschedules are subject to opponent availability and admin approval.
        </p>
        <div className="space-y-4">
          {/* Two-column layout for Player and Match Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="player" className="text-sm text-white">
                Player
              </Label>
              <Input id="player" placeholder="Select your player" className="bg-[#2C2C2E] text-white border-gray-600" />
            </div>
            <div>
              <Label htmlFor="matchDate" className="text-sm text-white">
                Select Match Date
              </Label>
              <Input id="matchDate" type="date" className="bg-[#2C2C2E] text-white border-gray-600" />
            </div>
          </div>

          {/* Full-width fields */}
          <div>
            <Label htmlFor="reason" className="text-sm text-white">
              Reason
            </Label>
            <Input id="reason" placeholder="Select your reason" className="bg-[#2C2C2E] text-white border-gray-600" />
          </div>
          <div>
            <Label htmlFor="additionalInfo" className="text-sm text-white">
              Additional Information about your request
            </Label>
            <Textarea
              id="additionalInfo"
              placeholder="Enter your Message"
              className="bg-[#2C2C2E] text-white border-gray-600 min-h-[100px]"
            />
          </div>
          <div>
            <Label htmlFor="evidence" className="text-sm text-white">
              Upload Evidence
            </Label>
            <Input
              id="evidence"
              type="file"
              placeholder="+ Upload Evidence"
              className="bg-[#2C2C2E] text-white border-gray-600 "
            />
          </div>
        </div>
        <DialogFooter className="mt-6 w-[100px]">
          <Button className="bg-yellow-400 text-black w-full hover:bg-yellow-500">Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
