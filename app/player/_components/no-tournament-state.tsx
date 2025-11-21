import { Card, CardContent } from "@/components/ui/card";
import { Trophy, CalendarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function NoTournamentState() {
  return (
    <Card className="bg-secondary/20 border-dashed border-2 border-gray-700">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="h-20 w-20 rounded-full bg-gray-800/50 flex items-center justify-center mb-2">
          <Trophy className="h-10 w-10 text-gray-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">
            No Active Tournament
          </h3>
          <p className="text-gray-400 max-w-md mx-auto">
            There are currently no active tournaments in progress. Check back
            later for upcoming events or improve your skills in the Learn
            section.
          </p>
        </div>
        <div className="pt-4">
          <Button
            asChild
            variant="outline"
            className="border-gray-600 hover:bg-gray-700"
          >
            <Link href="/player/learn">Go to Learn</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
