"use client"

import { useState } from "react"
import { mockUserProfile, UserProfile } from "../_components/profile-mock-data"
import { ProfileHeader } from "../_components/profile-header"
import { StatsOverview } from "../_components/stats-overview"
import { RecentGames } from "../_components/recent-games"


export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile)

  const handleProfileUpdate = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }))
  }

  return (

    <div className="p-6 max-w-6xl mx-auto">
      <ProfileHeader profile={profile} onProfileUpdate={handleProfileUpdate} />
      <StatsOverview stats={profile.stats} />
      <RecentGames games={profile.recentGames} />
    </div>
  )
}
