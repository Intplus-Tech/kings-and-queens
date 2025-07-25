"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface AliasEditModalProps {
  isOpen: boolean
  onClose: () => void
  currentName: string
  onNameUpdate: (newName: string) => void
}

export function AliasEditModal({ isOpen, onClose, currentName, onNameUpdate }: AliasEditModalProps) {
  const [newName, setNewName] = useState(currentName)

  const handleSave = () => {
    if (newName.trim()) {
      onNameUpdate(newName.trim())
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-gray-900 border-gray-800 text-white">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-primary">Alias Name Edit</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="py-6">
          <div className="mb-4">
            <label className="text-secondary text-sm mb-2 block">Alias Name</label>
            <p className="text-secondary text-xs mb-4">Write your New Alias Name</p>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new name"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={!newName.trim()}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
