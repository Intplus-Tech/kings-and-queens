"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import Image from "next/image"
import { ChessPuzzle, getDifficultyColor, getDifficultyDots } from "./learn-mock-data"

interface PuzzleCardProps {
  puzzle: ChessPuzzle
  onClick?: () => void
}

export function PuzzleCard({ puzzle, onClick }: PuzzleCardProps) {
  const difficultyDots = getDifficultyDots(puzzle.difficulty)
  const difficultyColor = getDifficultyColor(puzzle.difficulty)

  return (
    <Card
      className="bg-background border-none hover:bg-gray-750 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="relative mb-3">
          <div className="aspect-square bg-amber-100 rounded-lg overflow-hidden">
            <Image
              src={puzzle.thumbnail || "/images/puzzle.png"}
              alt={`${puzzle.title} - ${puzzle.category}`}
              width={120}
              height={120}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Completion indicator */}
          {puzzle.completed && (
            <div className="absolute top-2 right-2">
              <CheckCircle className="h-5 w-5 text-green-400 bg-gray-900 rounded-full" />
            </div>
          )}

          {/* Difficulty dots
          <div className="absolute bottom-2 left-2 flex gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${i < difficultyDots ? difficultyColor.replace("text-", "bg-") : "bg-gray-600"
                  }`}
              />
            ))}
          </div> */}
        </div>

        <div className="space-y-1">
          <h3 className=" font-medium text-sm">{puzzle.title}</h3>
          {/* <p className="text-muted-foreground text-xs">{puzzle.category}</p> */}
          <div className="flex items-center justify-between text-xs">
            <p>Difficulty</p>
            <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
              {puzzle.difficulty}
            </Badge>
            {/* <span className="text-secondary text-xs">{puzzle.rating}</span> */}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
