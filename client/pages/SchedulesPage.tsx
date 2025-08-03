export default function SchedulesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-black mb-6">
        Schedules
      </h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <p className="text-gray-600">
          Schedules management functionality will be implemented here. This page will allow users to:
        </p>
        <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
          <li>Create and manage work schedules</li>
          <li>Assign shifts to employees</li>
          <li>View calendar-based schedule overview</li>
          <li>Handle schedule conflicts and adjustments</li>
          <li>Set recurring schedule patterns</li>
        </ul>
      </div>
    </div>
  );
}
