"use client"

import { useState } from "react"
import { PuzzleSectionComponent } from "../_components/puzzle-section"
import { mockPuzzleSections } from "../_components/learn-mock-data"
import { PaginationDots } from "../_components/pagination-dots"


export default function LearnPage() {
  const [currentPage, setCurrentPage] = useState(0)
  const sectionsPerPage = 3
  const totalPages = Math.ceil(mockPuzzleSections.length / sectionsPerPage)

  const currentSections = mockPuzzleSections.slice(currentPage * sectionsPerPage, (currentPage + 1) * sectionsPerPage)

  const handlePuzzleClick = (puzzleId: string) => {
    console.log("Opening puzzle:", puzzleId)
    // Here you would typically navigate to the puzzle or open a modal
  }

  return (

    <div className="container mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className=" text-3xl font-bold mb-2">Training</h1>
        <p className="text-muted-foreground text-lg">Improve your chess skills with puzzles, lessons, and mini-games.</p>
      </div>

      {/* Puzzle Sections */}
      <div className="space-y-8">
        {currentSections.map((section) => (
          <PuzzleSectionComponent key={section.id} section={section} onPuzzleClick={handlePuzzleClick} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationDots currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </div>
  )
}
