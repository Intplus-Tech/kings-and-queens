"use client";
import { useState, useEffect } from "react";
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
  playerPoint: string;
  leaguePoint: string;
  group: string;
  leaguePosition: string;
  stats: string;
  name: string;
}
const data: Transaction[] = [
  {
    id: 1,
    name: "Adebayo Taiwo",
    group: "A",
    leaguePosition: "#3",
    leaguePoint: "53",
    playerPoint: "443",
    stats: "0/1/1"
  },
  {
    id: 2,
    name: "Disha Taiwo",
    group: "B",
    leaguePosition: "#3",
    leaguePoint: "53",
    playerPoint: "143",
    stats: "1/1/1"
  },
  {
    id: 3,
    name: "Fisha Adex",
    group: "A",
    leaguePosition: "#12",
    leaguePoint: "33",
    playerPoint: "443",
    stats: "0/1/1"
  },
  {
    id: 4,
    name: "Rachel Tope",
    group: "F",
    leaguePosition: "#3",
    leaguePoint: "53",
    playerPoint: "443",
    stats: "4/1/1"
  },
  {
    id: 5,
    name: "Adebayo Shisha",
    group: "C",
    leaguePosition: "#3",
    leaguePoint: "53",
    playerPoint: "443",
    stats: "0/1/1"
  },
];
const TournamentTable = () => {
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
              <TableHead className='text-white'>Team</TableHead>
              <TableHead className='text-white'>Group</TableHead>
              <TableHead className='text-white'>League Position</TableHead>
              <TableHead className='text-white'>League Point</TableHead>
              <TableHead className='text-white'>Player Points</TableHead>
              <TableHead className='text-white'>W/D/L</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className='bg-[#00000066] text-[#A3ABB2]'>
            {data.map((item) => (
              <TableRow key={item.id} className='h-14 border border-gray-600 '>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.group}</TableCell>
                <TableCell>{item.leaguePosition}</TableCell>
                <TableCell>{item.leaguePoint}</TableCell>
                <TableCell>{item.playerPoint}</TableCell>
                <TableCell>{item.stats}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TournamentTable;
