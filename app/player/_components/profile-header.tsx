"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit3, SwitchCamera } from "lucide-react"
import Image from "next/image"
import { AliasEditModal } from "./alias-edit-modal"
import { UserProfile } from "./profile-mock-data"
import { ProfilePhotoModal } from "./profile-photo-modal"

interface ProfileHeaderProps {
  profile: UserProfile
  onProfileUpdate: (updates: Partial<UserProfile>) => void
}

export function ProfileHeader({ profile, onProfileUpdate }: ProfileHeaderProps) {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [isAliasModalOpen, setIsAliasModalOpen] = useState(false)

  return (
    <div className="flex items-start gap-6 mb-8">
      {/* Profile Avatar */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-700">
          <Image
            src={profile.avatar || "/placeholder.svg"}
            alt={profile.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="absolute -top-3 -right-3 w-6 h-6  p-0"
          onClick={() => setIsPhotoModalOpen(true)}
        >
          <SwitchCamera className="h-3 w-3 text-white" />
        </Button>
      </div>

      {/* Profile Info */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text text-2xl font-bold">
            {profile.name} ({profile.age} yrs)
          </h1>
          <Button variant="ghost" size="sm" className="p-1 h-auto" onClick={() => setIsAliasModalOpen(true)}>
            <Edit3 className="h-3 w-3 text-gray-400" />
          </Button>
        </div>
        <p className="text-muted-foreground text-sm mb-1">{profile.title}</p>
        <p className="text-muted-foreground text-sm mb-3">{profile.school}</p>

        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-muted-foreground">Player ID: </span>
            <span className="text-primary">{profile.playerId}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Member since </span>
            <span className="text-primary">{profile.memberSince}</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentAvatar={profile.avatar}
        onAvatarUpdate={(newAvatar) => onProfileUpdate({ avatar: newAvatar })}
      />

      <AliasEditModal
        isOpen={isAliasModalOpen}
        onClose={() => setIsAliasModalOpen(false)}
        currentName={profile.name}
        onNameUpdate={(newName) => onProfileUpdate({ name: newName })}
      />
    </div>
  )
}
