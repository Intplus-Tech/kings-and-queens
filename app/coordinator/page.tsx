export default function CoordinatorDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Coordinator Dashboard</h1>
        <p className="text-gray-600">Manage tournaments and team coordination</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Tournament Progress</h3>
          <p className="text-gray-600">Track ongoing tournaments</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Team Management</h3>
          <p className="text-gray-600">Manage team rosters</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Match Centre</h3>
          <p className="text-gray-600">Coordinate matches</p>
        </div>
      </div>
    </div>
  )
}
