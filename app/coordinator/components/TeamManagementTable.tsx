"use client"

import { useState, useEffect, useTransition } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Player } from "@/types/player"
import { Button } from "@/components/ui/button"
import { updatePlayerAction, deletePlayerAction } from "@/lib/actions/players/player-management.action"

const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mr-2" />
)

interface TeamManagementTableProps {
  players: Player[]
}

const TeamManagementTable = ({ players }: TeamManagementTableProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [localPlayers, setLocalPlayers] = useState<Player[]>(players)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [loadingType, setLoadingType] = useState<"captain" | "vice" | "delete" | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setIsMounted(true)
    setLocalPlayers(players)
  }, [players])

  if (!isMounted) return null

  const handleAssign = async (player: Player, type: "captain" | "vice") => {
    setLoadingId(player._id)
    setLoadingType(type)

    startTransition(async () => {
      try {
        const result = await updatePlayerAction(player._id, {
          isCaptain: type === "captain",
          isViceCaptain: type === "vice",
        })
        if (result.success) {
          setLocalPlayers((prev) =>
            prev.map((p) =>
              p._id === player._id
                ? {
                  ...p,
                  isCaptain: type === "captain" ? true : p.isCaptain,
                  isViceCaptain: type === "vice" ? true : p.isViceCaptain,
                }
                : p,
            ),
          )
        }
      } catch (error) {
        console.error("Error assigning player:", error)
      } finally {
        setLoadingId(null)
        setLoadingType(null)
      }
    })
  }

  const handleDeletePlayer = async (playerId: string) => {
    setLoadingId(playerId)
    setLoadingType("delete")

    startTransition(async () => {
      try {
        const result = await deletePlayerAction(playerId)
        if (result.success) {
          setLocalPlayers((prev) => prev.filter((p) => p._id !== playerId))
        }
      } catch (error) {
        console.error("Error deleting player:", error)
      } finally {
        setLoadingId(null)
        setLoadingType(null)
      }
    })
  }

  return (
    <div className="w-full lg:h-[80vh] flex flex-col rounded-lg shadow-sm mt-3 border border-gray-700 ">
      <div className="overflow-auto flex-grow">
        <Table className="w-full h-full">
          <TableHeader className="text-center">
            <TableRow className="border border-gray-700 ">
              <TableHead className="text-white">Player ID</TableHead>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Alias</TableHead>
              <TableHead className="text-white">Date of Birth</TableHead>
              <TableHead className="text-white">Class</TableHead>
              <TableHead className="text-white">Phone Number</TableHead>
              <TableHead className="text-white">Vice Captain</TableHead>
              <TableHead className="text-white">Captain</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="bg-[#00000066] text-[#A3ABB2]">
            {localPlayers.map((item) => (
              <TableRow key={item._id} className="h-14 border border-gray-600 ">
                <TableCell>{item._id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.alias}</TableCell>
                <TableCell>{item.dob}</TableCell>
                <TableCell>{item.playerClass}</TableCell>
                <TableCell>{item.phoneNumber}</TableCell>
                <TableCell>{item.isViceCaptain ? "Yes" : "No"}</TableCell>
                <TableCell>{item.isCaptain ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="border-none focus:outline-none">
                      <img src="/info.svg" alt="" className="w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => handleAssign(item, "captain")}
                        disabled={loadingId === item._id || isPending}
                      >
                        {loadingId === item._id && loadingType === "captain" && <Spinner />}
                        Assign As Captain
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleAssign(item, "vice")}
                        disabled={loadingId === item._id || isPending}
                      >
                        {loadingId === item._id && loadingType === "vice" && <Spinner />}
                        Assign As Vice Captain
                      </DropdownMenuItem>
                      <DropdownMenuItem>View Player Fixture</DropdownMenuItem>
                      <DropdownMenuItem>View Match History</DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Button
                          onClick={() => handleDeletePlayer(item._id)}
                          disabled={loadingId === item._id || isPending}
                          className="text-red-500"
                        >
                          {loadingId === item._id && loadingType === "delete" && <Spinner />}
                          Delete Player
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default TeamManagementTable