"use client"

import { useState } from "react"
import { mockFixtures, mockGroups } from "../_components/points-mock-data"
import { GroupTabs } from "../_components/group-tabs"
import { PointsLeagueTable } from "../_components/points-league-table"
import { Fixtures } from "../_components/fixtures"


export default function PointsPage() {
  const [activeGroup, setActiveGroup] = useState("A")
  const [activeFixtureTab, setActiveFixtureTab] = useState<"live" | "coming" | "past">("live")

  const currentGroup = mockGroups.find((group) => group.id === activeGroup)
  const groupIds = mockGroups.map((group) => group.id)

  return (

    <div className="container mx-auto">
      <GroupTabs groups={groupIds} activeGroup={activeGroup} onGroupChange={setActiveGroup} />

      <div className="">
        <div className="col-span-8">
          {currentGroup && <PointsLeagueTable players={currentGroup.players} groupName={currentGroup.name} />}
        </div>
        <div className="col-span-4">
          <Fixtures fixtures={mockFixtures} activeTab={activeFixtureTab} onTabChange={setActiveFixtureTab} />
        </div>
      </div>
    </div>
  )
}
