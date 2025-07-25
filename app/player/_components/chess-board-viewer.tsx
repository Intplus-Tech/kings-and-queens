import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, SkipBack, SkipForward, Maximize2, Settings } from 'lucide-react'

interface ChessBoardViewerProps {
  opponentName: string
}

export function ChessBoardViewer({ opponentName }: ChessBoardViewerProps) {
  return (
    <Card className="bg-secondary">
      <CardHeader>
        <CardTitle className="text-center text-lg font-semibold">
          Watch {opponentName} (Your Next Opponent) Last Game
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Chess Board */}
          <div className="bg-amber-100 p-4 rounded-lg mb-4 aspect-square max-w-md mx-auto">
            <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
              {Array.from({ length: 64 }).map((_, i) => {
                const row = Math.floor(i / 8)
                const col = i % 8
                const isLight = (row + col) % 2 === 0
                return (
                  <div
                    key={i}
                    className={`${isLight ? 'bg-amber-100' : 'bg-amber-800'
                      } flex items-center justify-center text-2xl`}
                  >
                    {/* Chess pieces would go here */}
                    {i === 0 && '♜'}
                    {i === 1 && '♞'}
                    {i === 2 && '♝'}
                    {i === 3 && '♛'}
                    {i === 4 && '♚'}
                    {i === 5 && '♝'}
                    {i === 6 && '♞'}
                    {i === 7 && '♜'}
                    {i >= 8 && i <= 15 && '♟'}
                    {i >= 48 && i <= 55 && '♙'}
                    {i === 56 && '♖'}
                    {i === 57 && '♘'}
                    {i === 58 && '♗'}
                    {i === 59 && '♕'}
                    {i === 60 && '♔'}
                    {i === 61 && '♗'}
                    {i === 62 && '♘'}
                    {i === 63 && '♖'}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Game Timer */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
            00:07
          </div>

          <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
            00:24
          </div>

          {/* Video Controls */}
          <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
                <Play className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 mx-4">
              <div className="bg-gray-600 h-1 rounded-full">
                <div className="bg-green-500 h-1 rounded-full w-1/3"></div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
                <Maximize2 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" className="text-white hover:bg-gray-700">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
