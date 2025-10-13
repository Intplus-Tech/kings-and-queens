import CreateTeamModal from "@/app/coordinator/components/CreateTeamModal";
import TournamentTable from "./components/TournamentTable";
import { getPlayersAction } from "@/lib/actions/players/get-palyer.action";
import { getTournamentsAction } from "@/lib/actions/tournaments/tournaments";
import { ClientJoinTournamentSection } from "./components/ClientJoinTournamentSection";

export default async function CoordinatorDashboard() {
  const playersResponse = await getPlayersAction();
  const players = playersResponse.players || [];

  const tournamentsResponse = await getTournamentsAction();
  const tournaments = tournamentsResponse.tournaments || [];

  return (
    // <ClientJoinTournamentSection players={players} tournaments={tournaments}>
    // </ClientJoinTournamentSection>
    <div >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-[#5F7183] p-4 rounded-lg shadow text-white w-full max-w-xs">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-semibold">Adeboye Gabriel</h3>
            <button className="text-white text-xl leading-none">⋯</button>
          </div>
          <div className="flex justify-between text-sm text-gray-200 mt-1">
            <span>vs. Greensprings School</span>
            <span>Tue 4PM</span>
          </div>
          <p className="text-sm italic mt-4 text-gray-300">
            <span className="not-italic text-white font-medium">
              Countdown:
            </span>
            <br />2 days 14hrs left
          </p>
        </div>

        <div className="bg-[#5F7183] p-4 rounded-lg shadow text-white w-full max-w-xs">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-semibold">Disha Fish</h3>
            <button className="text-white text-xl leading-none">⋯</button>
          </div>
          <div className="flex justify-between text-sm text-gray-200 mt-1">
            <span>vs. Oxford School</span>
            <span>Tue 4PM</span>
          </div>
          <p className="text-sm italic mt-4 text-gray-300">
            <span className="not-italic text-white font-medium">
              Countdown:
            </span>
            <br />2 days 14hrs left
          </p>
        </div>

        <div className="bg-[#5F7183] p-4 rounded-lg shadow text-white w-full max-w-xs">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-semibold">Tinu Fish</h3>
            <button className="text-white text-xl leading-none">⋯</button>
          </div>
          <div className="flex justify-between text-sm text-gray-200 mt-1">
            <span>vs. Maryland int'l School</span>
            <span>Tue 4PM</span>
          </div>
          <p className="text-sm italic mt-4 text-gray-300">
            <span className="not-italic text-white font-medium">
              Countdown:
            </span>
            <br />2 days 14hrs left
          </p>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between">
          <p className="text-xl font-semibold">Tournament Progress</p>
          <p>View Tournament</p>
        </div>
        <TournamentTable />
      </div>

      <div className="flex flex-col">
        <div className="flex justify-between mb-4">
          <p className="text-xl font-semibold">Annoucement</p>
        </div>
        <div className="relative w-full  h-[270px] rounded-xl  shadow-lg">
          <img
            src="/chess.svg"
            alt="League Matches"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 " />
          <div className="relative z-10 p-6 text-white flex flex-col justify-center h-full">
            <p className="text-sm w-[390px] text-white mt-9">
              The final match of the league season will be held on the July 7th
              at 5:30 pm WAT. All team and spectators are welcome.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

