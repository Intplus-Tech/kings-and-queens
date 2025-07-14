export default function PlayerMatches() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Matches</h1>
        <p className="text-gray-600">View and manage your chess matches</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Match Schedule</h2>
          <p className="text-gray-600">Your upcoming and completed matches will appear here</p>
        </div>
      </div>
    </div>
  )
}
