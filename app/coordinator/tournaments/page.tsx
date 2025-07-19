"use client";
import { Button } from "@/components/ui/button";
import MatchesTable from "../components/MatchesTable";
import { useState } from "react";
import PastResults from "../components/pastResults";
import { CoordinatorHeader } from "@/components/layout/coordinator-header";

export default function CoordinatorTournaments() {
  const [Fixtures, SetFixtures] = useState(true);

  return (
    <div className='space-y-6'>
      <CoordinatorHeader userRole='Match Center' />

      <div className='flex gap-2  justify-center items-center bg-gray-600'>
        <button
          className={
            ` w-1/2 bg-gray-600 hover:bg-none p-2 border rounded border-transparent ` +
            (Fixtures ? "bg-[#E3A53B]" : "")
          }
          onClick={() => SetFixtures(true)}
        >
          Fixtures
        </button>
        <button
          className={
            `w-1/2 bg-gray-600 hover:bg-none p-2 border rounded border-transparent ` +
            (!Fixtures ? "bg-[#E3A53B]" : "")
          }
          onClick={() => SetFixtures(false)}
        >
          Past results
        </button>
      </div>
      <div>{Fixtures ? <MatchesTable /> : <PastResults />}</div>
    </div>
  );
}
