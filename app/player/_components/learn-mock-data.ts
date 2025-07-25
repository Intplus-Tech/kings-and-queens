export interface ChessPuzzle {
  id: string
  title: string
  difficulty: "beginner" | "intermediate" | "advanced" | "expert"
  category: string
  description: string
  fen: string // Chess position in FEN notation
  thumbnail: string
  completed: boolean
  rating: number
}

export interface PuzzleSection {
  id: string
  title: string
  description: string
  puzzles: ChessPuzzle[]
}

export const mockPuzzleSections: PuzzleSection[] = [
  {
    id: "tactics-1",
    title: "Puzzles",
    description: "Basic tactical patterns",
    puzzles: [
      {
        id: "puzzle-1",
        title: "Puzzle 1",
        difficulty: "beginner",
        category: "Pin",
        description: "Find the winning move",
        fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        thumbnail: "/images/puzzle.png",
        completed: false,
        rating: 1200,
      },
      {
        id: "puzzle-2",
        title: "Puzzle 2",
        difficulty: "beginner",
        category: "Fork",
        description: "Knight fork opportunity",
        fen: "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2",
        thumbnail: "/images/puzzle.png",
        completed: true,
        rating: 1250,
      },
      {
        id: "puzzle-3",
        title: "Puzzle 3",
        difficulty: "intermediate",
        category: "Skewer",
        description: "Skewer the king and queen",
        fen: "rnbqkb1r/pppp1ppp/5n2/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 2 3",
        thumbnail: "/images/puzzle.png",
        completed: false,
        rating: 1400,
      },
      {
        id: "puzzle-4",
        title: "Puzzle 4",
        difficulty: "intermediate",
        category: "Discovery",
        description: "Discovered attack",
        fen: "rnbqkbnr/ppp1pppp/8/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 2",
        thumbnail: "/images/puzzle.png",
        completed: false,
        rating: 1350,
      },
    ],
  },
  {
    id: "tactics-2",
    title: "Puzzles",
    description: "Intermediate tactical patterns",
    puzzles: [
      {
        id: "puzzle-5",
        title: "Puzzle 1",
        difficulty: "intermediate",
        category: "Deflection",
        description: "Deflect the defender",
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        thumbnail: "/images/puzzle.png",
        completed: true,
        rating: 1500,
      },
      {
        id: "puzzle-6",
        title: "Puzzle 2",
        difficulty: "intermediate",
        category: "Decoy",
        description: "Decoy the king",
        fen: "rnbqkb1r/ppp1pppp/5n2/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 2 3",
        thumbnail: "/images/puzzle.png",
        completed: false,
        rating: 1450,
      },
      {
        id: "puzzle-7",
        title: "Puzzle 3",
        difficulty: "advanced",
        category: "Clearance",
        description: "Clear the line",
        fen: "rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6 0 2",
        thumbnail: "/images/puzzle.png",
        completed: false,
        rating: 1600,
      },
      {
        id: "puzzle-8",
        title: "Puzzle 4",
        difficulty: "advanced",
        category: "Interference",
        description: "Block the defense",
        fen: "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/3P4/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        thumbnail: "/images/puzzle.png",
        completed: true,
        rating: 1550,
      },
    ],
  },
  {
    id: "tactics-3",
    title: "Puzzles",
    description: "Advanced tactical patterns",
    puzzles: [
      {
        id: "puzzle-9",
        title: "Puzzle 1",
        difficulty: "advanced",
        category: "Sacrifice",
        description: "Sacrificial attack",
        fen: "rnbqk2r/pppp1ppp/5n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 3 4",
        thumbnail: "/images/puzzle.png",
        completed: false,
        rating: 1700,
      },
      {
        id: "puzzle-10",
        title: "Puzzle 2",
        difficulty: "advanced",
        category: "Combination",
        description: "Multi-move combination",
        fen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 4 4",
        thumbnail: "/images/puzzle.png",
        completed: false,
        rating: 1750,
      },
      {
        id: "puzzle-11",
        title: "Puzzle 3",
        difficulty: "expert",
        category: "Endgame",
        description: "Complex endgame",
        fen: "8/8/8/8/8/8/8/4K3 w - - 0 1",
        thumbnail: "/images/puzzle.png",
        completed: false,
        rating: 1800,
      },
      {
        id: "puzzle-12",
        title: "Puzzle 4",
        difficulty: "expert",
        category: "Study",
        description: "Composition study",
        fen: "8/8/8/8/8/8/8/4K3 w - - 0 1",
        thumbnail: "/images/puzzle.png",
        completed: true,
        rating: 1850,
      },
    ],
  },
]

export const getDifficultyColor = (difficulty: ChessPuzzle["difficulty"]) => {
  switch (difficulty) {
    case "beginner":
      return "text-green-400"
    case "intermediate":
      return "text-yellow-400"
    case "advanced":
      return "text-orange-400"
    case "expert":
      return "text-red-400"
    default:
      return "text-gray-400"
  }
}

export const getDifficultyDots = (difficulty: ChessPuzzle["difficulty"]) => {
  switch (difficulty) {
    case "beginner":
      return 1
    case "intermediate":
      return 2
    case "advanced":
      return 3
    case "expert":
      return 4
    default:
      return 1
  }
}
