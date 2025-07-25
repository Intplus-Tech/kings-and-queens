"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Fixture } from "./points-mock-data"
// import type { Fixture } from "@/lib/points-mock-data"

interface FixturesModalProps {
  isOpen: boolean
  onClose: () => void
  fixtures: Fixture[]
  activeTab: "live" | "coming" | "past"
  onTabChange: (tab: "live" | "coming" | "past") => void
}

export function FixturesModal({ isOpen, onClose, fixtures, activeTab, onTabChange }: FixturesModalProps) {
  // Extended mock data for modal
  const extendedFixtures = [
    ...fixtures,
    {
      id: "3",
      homeTeam: {
        name: "Wesley College Yenetu, Ibadan",
        logo: "/placeholder.svg?height=24&width=24&text=W",
        school: "Wesley College Yenetu, Ibadan",
      },
      awayTeam: {
        name: "Anna",
        logo: "/placeholder.svg?height=24&width=24&text=A",
        school: "British Int'l College, Lagos",
      },
      time: "18:56",
      date: "Tuesday, 13th June 2023",
      score: { home: 12, away: 42 },
      venue: "British Int'l College, Lagos",
      status: "completed" as const,
    },
    {
      id: "4",
      homeTeam: {
        name: "Wesley College Yenetu, Ibadan",
        logo: "/placeholder.svg?height=24&width=24&text=W",
        school: "Wesley College Yenetu, Ibadan",
      },
      awayTeam: {
        name: "Anna",
        logo: "/placeholder.svg?height=24&width=24&text=A",
        school: "British Int'l College, Lagos",
      },
      time: "18:56",
      date: "Thursday, 15th June 2023",
      venue: "Wesley College Yenetu, Ibadan",
      status: "upcoming" as const,
    },
    {
      id: "5",
      homeTeam: {
        name: "Tommy",
        logo: "/placeholder.svg?height=24&width=24&text=T",
        school: "British Int'l College, Lagos",
      },
      awayTeam: {
        name: "Riley",
        logo: "/placeholder.svg?height=24&width=24&text=R",
        school: "Wesley College, Ibadan",
      },
      time: "15:30",
      date: "Friday, 16th June 2023",
      venue: "Wesley College, Ibadan",
      status: "upcoming" as const,
    },
  ]

  const modalFilteredFixtures = extendedFixtures.filter((fixture) => {
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

  // Group fixtures by date for better organization
  const groupedFixtures = modalFilteredFixtures.reduce(
    (acc, fixture) => {
      const date = fixture.date
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(fixture)
      return acc
    },
    {} as Record<string, typeof modalFilteredFixtures>,
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-4">
          {/* Header with Fixtures title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              🗓️
              <DialogTitle className="text-white text-lg">Fixtures</DialogTitle>
            </div>
            <div className="text-primary text-sm">Find My Matches</div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-gray-700">
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
                  ? "text-primary rounded-none"
                  : "text-gray-400 hover:text-white"
                  }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Content based on active tab */}
          <div className="space-y-6">
            {modalFilteredFixtures.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                {activeTab === "live" && "No live games at the moment"}
                {activeTab === "coming" && "No upcoming matches"}
                {activeTab === "past" && "No past matches"}
              </div>
            ) : (
              Object.entries(groupedFixtures).map(([date, fixtures]) => (
                <div key={date}>
                  <h3 className="text-primary text-sm font-semibold mb-3">{date}</h3>
                  <div className="space-y-2">
                    {fixtures.map((fixture) => (
                      <FixtureRow key={fixture.id} fixture={fixture} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FixtureRow({ fixture }: { fixture: Fixture }) {
  return (
    <div className="flex items-center justify-between p-4  rounded-lg bg-[#1B1C21]  transition-colors ">
      <div className="flex items-center gap-4">
        <Image
          src={fixture.homeTeam.logo || "/placeholder.svg"}
          alt={fixture.homeTeam.name}
          width={32}
          height={32}
          className="rounded-full"
        />
        <div>
          <p className="text-white text-sm font-medium">{fixture.homeTeam.school}</p>
          <p className="text-gray-400 text-xs">{fixture.homeTeam.name}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-gray-400 text-xs">{fixture.time}</p>
          {fixture.score ? (
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 font-bold text-lg">{fixture.score.home}</span>
              <span className="text-gray-400">-</span>
              <span className="text-yellow-500 font-bold text-lg">{fixture.score.away}</span>
            </div>
          ) : (
            <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
              {fixture.date}
            </Badge>
          )}
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-xs">{fixture.time}</p>
          <p className="text-white text-sm">{fixture.awayTeam.name}</p>
          <p className="text-gray-400 text-xs">{fixture.awayTeam.school}</p>
        </div>

        <Image
          src={fixture.awayTeam.logo || "/placeholder.svg"}
          alt={fixture.awayTeam.name}
          width={32}
          height={32}
          className="rounded-full"
        />
      </div>

      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
        <div className="grid grid-cols-2 gap-1">
          <div className="w-1 h-1 bg-current rounded"></div>
          <div className="w-1 h-1 bg-current rounded"></div>
          <div className="w-1 h-1 bg-current rounded"></div>
          <div className="w-1 h-1 bg-current rounded"></div>
        </div>
      </Button>
    </div>
  )
}
