export default function DemandsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-black mb-6">Demands</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <p className="text-gray-600">
          Demands management functionality will be implemented here. This page
          will allow users to:
        </p>
        <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
          <li>Submit time-off requests and leave applications</li>
          <li>View pending and approved demands</li>
          <li>Track request status and approvals</li>
          <li>Manage employee requests (admin view)</li>
          <li>Set approval workflows</li>
        </ul>
      </div>
    </div>
  );
}
