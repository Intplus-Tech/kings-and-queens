"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import MatchesTable from "../components/MatchesTable"
import PastResults from "../components/pastResults"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CoordinatorTournaments() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="fixtures" className="w-full">
        {/* Tabs Navigation */}
        <div className="flex items-center justify-between gap-10">

          <TabsList className="grid w-full grid-cols-2 bg-gray-600">
            <TabsTrigger
              value="fixtures"
              className="data-[state=active]:bg-primary text-white"
            >
              Fixtures
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="data-[state=active]:bg-primary text-white"
            >
              Past results
            </TabsTrigger>
          </TabsList>

          <Button size={"sm"} asChild>
            <Link href="/coordinator/tournaments/join-tournament">
              Join Tournament
            </Link>
          </Button>
        </div>

        {/* Tab Content */}
        <TabsContent value="fixtures">
          <MatchesTable />
        </TabsContent>
        <TabsContent value="results">
          <PastResults />
        </TabsContent>
      </Tabs>
    </div>
  )
}
