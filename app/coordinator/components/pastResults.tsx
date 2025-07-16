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
interface Transaction {
  id: number;
  Date: string;
  Name: string;
  opponent: string;
  Rank: string;
  opponentStat: string;
}
const data: Transaction[] = [
  {
    id: 1,
    Date: "4th June, 2025 4PM",
    opponent: "Kubo - Greensprings School",
    Rank: "W",
    Name: "Ayinla Gbenga",
    opponentStat: "WWWLD",
  },
  {
    id: 2,
    Date: "4th June, 2025 4PM",
    opponent: "Kubo - Greensprings School",
    Rank: "L",
    Name: "Ayinla Gbenga",
    opponentStat: "WWWLD",
  },
  {
    id: 3,
    Date: "4th June, 2025 4PM",
    opponent: "Kubo - Greensprings School",
    Rank: "W",
    Name: "Ayinla Gbenga",
    opponentStat: "WWWLD",
  },
  {
    id: 4,
    Date: "4th June, 2025 4PM",
    opponent: "Kubo - Greensprings School",
    Rank: "D",
    Name: "Ayinla Gbenga",
    opponentStat: "WWWLD",
  },
  {
    id: 5,
    Date: "4th June, 2025 4PM",
    opponent: "Kubo - Greensprings School",
    Rank: "L",
    Name: "Ayinla Gbenga",
    opponentStat: "WWWLD",
  },
  {
    id: 6,
    Date: "4th June, 2025 4PM",
    opponent: "Kubo - Greensprings School",
    Rank: "W",
    Name: "David johnson ",
    opponentStat: "WWWLD",
  },
  {
    id: 7,
    Date: "4th June, 2025 4PM",
    opponent: "Kubo - Greensprings School",
    Rank: "D",
    Name: "David johnson ",
    opponentStat: "WWWLD",
  },
];
const ITEMS_PER_PAGE = 6;
const PastResults = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState("All");
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredData =
    filter === "All"
      ? data
      : data.filter((item) => item.Name === filter || item.opponent === filter);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  if (!isMounted) return null;
  return (
    <div className='w-full lg:h-[80vh] flex flex-col rounded-lg shadow-sm'>
      {/* Table */}
      <div className='overflow-auto flex-grow'>
        <div className='flex w-full gap-9 '>
          <select
            name=''
            id=''
            className='bg-gray-600 text-white px-4 py-2 rounded-md mb-4'
            onChange={(e) => {
              setFilter(e.target.value);
              setCurrentPage(1); // reset to first page on filter
            }}
          >
            <option value='All'>All Players</option>
            <option value='David johnson '>David johnson</option>
            <option value='All'>Competition</option>
          </select>

        </div>

        <Table className='w-full h-full'>
          <TableHeader className='text-center'>
            <TableRow className='border border-gray-700 '>
              <TableHead className='text-white'>Date</TableHead>
              <TableHead className='text-white'>Player</TableHead>
              <TableHead className='text-white'>vs Opponent</TableHead>
              <TableHead className='text-white'>Result</TableHead>
              <TableHead className='text-white'>Result</TableHead>
              <TableHead className='w-10 '></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='bg-[#00000066] text-[#A3ABB2] border border-gray-700 '>
            {paginatedData.map((item) => (
              <TableRow key={item.id} className='h-14 border border-gray-600 '>
                <TableCell>{item.Date}</TableCell>
                <TableCell>{item.Name}</TableCell>
                <TableCell>{item.opponent}</TableCell>
                <TableCell>{item.Rank}</TableCell>
                <TableCell>{item.opponentStat}</TableCell>

                <TableCell>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-6 h-6 text-red-600'
                  >
                    <path d='M23.498 6.186a2.974 2.974 0 00-2.096-2.104C19.526 3.5 12 3.5 12 3.5s-7.526 0-9.402.582A2.974 2.974 0 00.502 6.186 30.427 30.427 0 000 12c0 1.992.187 3.929.502 5.814a2.974 2.974 0 002.096 2.104C4.474 20.5 12 20.5 12 20.5s7.526 0 9.402-.582a2.974 2.974 0 002.096-2.104C23.813 15.929 24 13.992 24 12c0-1.992-.187-3.929-.502-5.814zM9.75 15.25v-6.5l6 3.25-6 3.25z' />
                  </svg>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Controls */}
      <div className='flex text-center mx-auto p-4 '>
        <div className='flex items-center mx-auto text-center gap-2'>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className='p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === page
                  ? "bg-white border border-blue-500 text-blue-600"
                  : "text-black bg-white hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className='p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PastResults;
