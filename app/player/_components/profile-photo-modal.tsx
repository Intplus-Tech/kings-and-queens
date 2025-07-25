
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, X } from "lucide-react"
import Image from "next/image"

interface ProfilePhotoModalProps {
  isOpen: boolean
  onClose: () => void
  currentAvatar: string
  onAvatarUpdate: (newAvatar: string) => void
}

export function ProfilePhotoModal({ isOpen, onClose, currentAvatar, onAvatarUpdate }: ProfilePhotoModalProps) {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

  const handleChange = () => {
    // In a real app, this would open a file picker
    const newAvatar = "/placeholder.svg?height=80&width=80&text=New"
    onAvatarUpdate(newAvatar)
    onClose()
  }

  const handleRemove = () => {
    setShowRemoveConfirm(true)
  }

  const confirmRemove = () => {
    onAvatarUpdate("/placeholder.svg?height=80&width=80&text=?")
    setShowRemoveConfirm(false)
    onClose()
  }

  if (showRemoveConfirm) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-sm bg-gray-900 border-gray-800 text-white">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowRemoveConfirm(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white p-1">
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>

          <div className="text-center py-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={currentAvatar || "/placeholder.svg"}
                  alt="Current"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-2xl text-gray-400">→</div>
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400 text-xl">?</span>
              </div>
            </div>

            <h3 className="text-primary font-semibold mb-2">Remove profile picture?</h3>
            <p className="text-secondary text-sm mb-6">This will remove your profile picture from your account.</p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRemoveConfirm(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button onClick={confirmRemove} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                Remove
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-gray-900 border-gray-800 text-white">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-primary">Profile Picture</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="text-center py-6">
          <p className="text-secondary text-sm mb-6">
            A profile picture helps your teammates recognize you and lets you express your personality.
          </p>

          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-6 bg-gray-700">
            <Image
              src={currentAvatar || "/placeholder.svg"}
              alt="Profile"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleChange} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
              Change
            </Button>
            <Button
              variant="outline"
              onClick={handleRemove}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              Remove
            </Button>
          </div>

          <p className="text-secondary text-xs mt-4">Remove profile photo</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
