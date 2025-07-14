export default function PlayerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Player Dashboard</h1>
        <p className="text-gray-600">Welcome to your chess player dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">League Table</h3>
          <p className="text-gray-600">View your current standings</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Upcoming Matches</h3>
          <p className="text-gray-600">Your scheduled games</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Game History</h3>
          <p className="text-gray-600">Review past games</p>
        </div>
      </div>
    </div>
  )
}
