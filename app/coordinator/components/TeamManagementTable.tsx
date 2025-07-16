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
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
interface Transaction {
  id: number;
  playerId: string;
  alias: string;
  dob: string;
  class: string;
  phoneno: string;
  name: string;
  status?: string;
}
const data: Transaction[] = [
  {
    id: 1,
    name: "Ahmed shisha",
    playerId: "127",
    alias: "shisha",
    dob: "23/04/2005",
    class: "ss1",
    phoneno: "0999911111",
    status: "active",
  },
  {
    id: 2,
    name: "Laminie shisha",
    playerId: "7237",
    alias: "shisha",
    dob: "23/04/2107",
    class: "ss3",
    phoneno: "0999911111",
    status: "inactive",
  },
  {
    id: 3,
    name: "Diaha shisha",
    playerId: "7227",
    alias: "shisha",
    dob: "23/04/2007",
    class: "ss3",
    phoneno: "0999911111",
    status: "Suspended",
  },
  {
    id: 4,
    name: "Adebayo gabriel",
    playerId: "7227",
    alias: "hfs",
    dob: "23/04/2300",
    class: "ss3",
    phoneno: "0999911111",
    status: "susspended",
  },
  {
    id: 5,
    name: "Adebayo Shisha",
    playerId: "7777",
    alias: "annnie",
    dob: "23/04/2000",
    class: "jss3",
    phoneno: "0999999999",
    status: "inactive",
  },
];
const TournamentManagementTable = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
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
            {data.map((item) => (
              <TableRow key={item.id} className='h-14 border border-gray-600 '>
                <TableCell>{item.playerId}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.alias}</TableCell>
                <TableCell>{item.dob}</TableCell>
                <TableCell>{item.class}</TableCell>
                <TableCell>{item.phoneno}</TableCell>
                <TableCell>{item.status}</TableCell>
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
