import { Button } from "@/components/ui/button";
import TeamManagementTable from "../components/TeamManagementTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddPlayerModal from "../components/AddTeamMembers";
import { CoordinatorHeader } from "@/components/layout/coordinator-header";
export default function CoordinatorTeams() {
  return (
    <div>
        <CoordinatorHeader userRole="Team Management"  />

      <div className='flex mt-11 flex-col'>
        <div className='flex justify-between'>
          <AddPlayerModal />
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              className='border-none focus:outline-none'
            >
              <Button variant='ghost' size='icon' className='border-none'>
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuItem>Excel (CSV)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <TeamManagementTable />
      </div>
    </div>
  );
}
