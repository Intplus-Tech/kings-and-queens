import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Match } from "./mock-data"
// import { Match } from "@/lib/mock-data"

interface UpcomingMatchProps {
  match: Match
  currentUserName: string
}

export function UpcomingMatch({ match, currentUserName }: UpcomingMatchProps) {
  return (
    <Card className="bg-[url('/upcoming.jpg')] bg-center bg-cover">
      <CardHeader>
        <CardTitle className="text-white font-normal text-lg">Your Upcoming Match</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold">
              {match.date} @ {match.time} vs. {match.opponent.name}
            </h3>
            <p className="text-muted-foreground">{match.venue}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Image
                  src="/placeholder.svg?height=40&width=40&text=T"
                  alt="Tommy"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm">TOMMY</p>
                  <p className="text-muted-foreground text-xs">White</p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm">VS</p>
                <Badge className="bg-white text-black text-xs font-medium">
                  MATCH {match.matchNumber}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Image
                  src="/placeholder.svg?height=40&width=40&text=Y"
                  alt="You"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm">YOU</p>
                  <p className="text-muted-foreground text-xs">Black</p>
                </div>
              </div>
            </div>

            <Button >
              Join Game
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
