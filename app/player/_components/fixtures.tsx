"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"
import { FixturesModal } from "./fixtures-modal"
import { Fixture } from "./points-mock-data"

interface FixturesProps {
  fixtures: Fixture[]
  activeTab: "live" | "coming" | "past"
  onTabChange: (tab: "live" | "coming" | "past") => void
}

export function Fixtures({ fixtures, activeTab, onTabChange }: FixturesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredFixtures = fixtures.filter((fixture) => {
    switch (activeTab) {
      case "live":
        return fixture.status === "live"
      case "coming":
        return fixture.status === "upcoming"
      case "past":
        return fixture.status === "completed"
      default:
        return true
    }
  })

  return (
    <Card className="bg-background border-none p-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-0">
        <CardTitle className="text-white flex items-center gap-2 px-0">
          <p> 🗓️</p>
          Fixtures
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
          onClick={() => setIsModalOpen(true)}
        >
          <div className="grid grid-cols-2 gap-1">
            <div className="w-1 h-1 bg-current rounded"></div>
            <div className="w-1 h-1 bg-current rounded"></div>
            <div className="w-1 h-1 bg-current rounded"></div>
            <div className="w-1 h-1 bg-current rounded"></div>
          </div>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-gray-700">
          {[
            { key: "live", label: "Live Games" },
            { key: "coming", label: "Coming Match" },
            { key: "past", label: "Past Matches" },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant="ghost"
              size="sm"
              onClick={() => onTabChange(tab.key as any)}
              className={`${activeTab === tab.key
                ? "rounded-none text-primary border-b-2 border-primary"
                : "text-gray-400 hover:text-white"
                }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Fixtures List */}
        <div className="space-y-3">
          {filteredFixtures.length === 0 ? (
            <div className="text-center text-muted-foreground py-4 text-sm">
              {activeTab === "live" && "No live games at the moment"}
              {activeTab === "coming" && "No upcoming matches"}
              {activeTab === "past" && "No past matches"}
            </div>
          ) : (
            filteredFixtures.map((fixture) => (
              <div
                key={fixture.id}
                className="flex items-center justify-between p-3 transition-colors bg-[#49406966] hover:bg-[#49406988] rounded-md even:bg-transparent"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={fixture.homeTeam.logo || "/placeholder.svg"}
                    alt={fixture.homeTeam.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <div className="text-sm">
                    <p className="text-white">{fixture.homeTeam.school}</p>
                    <p className="text-gray-400 text-xs">{fixture.homeTeam.name}</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-gray-400 text-xs">{fixture.time}</p>
                  {fixture.score ? (
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500 font-bold">{fixture.score.home}</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-yellow-500 font-bold">{fixture.score.away}</span>
                    </div>
                  ) : (
                    <p className="text-gray-400 text-xs">{fixture.date}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm text-right">
                    <p className="text-white">{fixture.awayTeam.name}</p>
                    <p className="text-gray-400 text-xs">{fixture.awayTeam.school}</p>
                  </div>
                  <Image
                    src={fixture.awayTeam.logo || "/placeholder.svg"}
                    alt={fixture.awayTeam.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
      <FixturesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fixtures={fixtures}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </Card>
  )
}
