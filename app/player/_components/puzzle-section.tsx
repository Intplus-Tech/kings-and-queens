"use client"

import { PuzzleSection } from "./learn-mock-data"
import { PuzzleCard } from "./puzzle-card"


interface PuzzleSectionProps {
  section: PuzzleSection
  onPuzzleClick?: (puzzleId: string) => void
}

export function PuzzleSectionComponent({ section, onPuzzleClick }: PuzzleSectionProps) {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-1">{section.title}</h2>
        <p className="text-muted-foreground text-sm">{section.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {section.puzzles.map((puzzle) => (
          <PuzzleCard key={puzzle.id} puzzle={puzzle} onClick={() => onPuzzleClick?.(puzzle.id)} />
        ))}
      </div>
    </div>
  )
}
