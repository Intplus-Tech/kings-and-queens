import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import AddPlayerModal from "../components/AddTeamMembers"
import { getPlayersAction } from "@/lib/actions/players/get-palyer.action"
import TeamManagementTable from "../components/TeamManagementTable"

export default async function CoordinatorTeams() {
  const response = await getPlayersAction()
  const players = response.players

  console.log("Fetched players:", players)

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <AddPlayerModal />
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="border-none focus:outline-none">
              <Button variant="ghost" size="icon" className="border-none">
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Excel (CSV)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <TeamManagementTable players={players} />
      </div>
    </div>
  )
}