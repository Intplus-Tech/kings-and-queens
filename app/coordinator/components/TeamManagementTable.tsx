"use client";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Player } from "@/types/player";

const TournamentManagementTable = ({ players }: { players: Player[] }) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <div className='w-full lg:h-[80vh]flex flex-col rounded-lg shadow-sm mt-3 border border-gray-700 '>
      {/* Table */}
      <div className='overflow-auto flex-grow'>
        <Table className='w-full h-full'>
          <TableHeader className='text-center  '>
            <TableRow className='border border-gray-700 '>
              <TableHead className='text-white'>Player ID</TableHead>
              <TableHead className='text-white'>Name</TableHead>
              <TableHead className='text-white'>Alias</TableHead>
              <TableHead className='text-white'>Date of Birth</TableHead>
              <TableHead className='text-white'>Class</TableHead>
              <TableHead className='text-white'>Phone Number</TableHead>
              <TableHead className='text-white'>Status</TableHead>
              <TableHead className='w-10'></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className='bg-[#00000066] text-[#A3ABB2]'>
            {players.map((item) => (
              <TableRow key={item._id} className='h-14 border border-gray-600 '>
                <TableCell>{item._id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.alias}</TableCell>
                <TableCell>{item.dob}</TableCell>
                <TableCell>{item.playerClass}</TableCell>
                <TableCell>{item.phoneNumber}</TableCell>
                {/* <TableCell>{item.status}</TableCell> */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      className='border-none focus:outline-none'
                    >
                      <img src='/info.svg' alt='' className='w-5 h-5' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-48'>
                      <DropdownMenuItem>Assign As Captain</DropdownMenuItem>
                      <DropdownMenuItem>View Player Fixture</DropdownMenuItem>
                      <DropdownMenuItem>View Match History</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TournamentManagementTable;
