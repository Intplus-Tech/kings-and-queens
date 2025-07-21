import CreateTeamModal from "@/app/coordinator/components/CreateTeamModal";
import TournamentTable from "./components/TournamentTable";
import { CoordinatorHeader } from "@/components/layout/coordinator-header";

export default function CoordinatorDashboard() {
  return (
    <>
      <CoordinatorHeader userRole="Dashboard" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 mt-4">
        <div>
          <a href="/coordinator/teams" className="flex items-center gap-3">
            <img
              src="/calendar.png"
              alt="Team Icon"
              className="h-6 w-6 sm:h-8 sm:w-9 object-contain"
            />
            <span className="text-lg sm:text-xl font-semibold">Next Match</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              name: "Adeboye Gabriel",
              opponent: "Greensprings School",
              time: "Tue 4PM",
              countdown: "2 days 14hrs left",
            },
            {
              name: "Disha Fish",
              opponent: "Oxford School",
              time: "Tue 4PM",
              countdown: "2 days 14hrs left",
            },
            {
              name: "Tinu Fish",
              opponent: "Maryland int'l School",
              time: "Tue 4PM",
              countdown: "2 days 14hrs left",
            },
          ].map((match, index) => (
            <div
              key={index}
              className="bg-[#5F7183] p-4 rounded-lg shadow text-white w-full"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-base sm:text-lg font-semibold">{match.name}</h3>
                <button className="text-white text-lg sm:text-xl leading-none">
                  ⋯
                </button>
              </div>
              <div className="flex justify-between text-xs sm:text-sm text-gray-200 mt-1">
                <span>{match.opponent}</span>
                <span>{match.time}</span>
              </div>
              <p className="text-xs sm:text-sm italic mt-4 text-gray-300">
                <span className="not-italic text-white font-medium">Countdown:</span>
                <br />
                {match.countdown}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="text-lg sm:text-xl font-semibold">Tournament Progress</p>
            <p className="text-sm sm:text-base">View Tournament</p>
          </div>
          <TournamentTable />
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between mb-4">
            <p className="text-lg sm:text-xl font-semibold">Announcement</p>
          </div>
          <div className="relative w-full h-48 sm:h-64 md:h-[270px] rounded-xl shadow-lg overflow-hidden">
            <img
              src="/chess.svg"
              alt="League Matches"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 p-4 sm:p-6 text-white flex flex-col justify-center h-full">
              <p className="text-xs sm:text-sm md:text-base max-w-[390px] md:max-w-full">
                The final match of the league season will be held on July 7th at
                5:30 pm WAT. All team and spectators are welcome.
              </p>
            </div>
          </div>
        </div>
        <CreateTeamModal />
      </div>
    </>
  );
}