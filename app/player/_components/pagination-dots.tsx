"use client"

import { Button } from "@/components/ui/button"

interface PaginationDotsProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function PaginationDots({ currentPage, totalPages, onPageChange }: PaginationDotsProps) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {Array.from({ length: totalPages }).map((_, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(index)}
          className={`w-3 h-3 rounded-full p-0 ${currentPage === index ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-600 hover:bg-gray-500"
            }`}
        />
      ))}
    </div>
  )
}
