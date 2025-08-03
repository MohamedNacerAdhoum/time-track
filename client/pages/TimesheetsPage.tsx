export default function TimesheetsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-black mb-6">
        Timesheets
      </h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <p className="text-gray-600">
          Timesheets functionality will be implemented here. This page will allow users to:
        </p>
        <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
          <li>View and manage employee timesheets</li>
          <li>Track working hours and attendance</li>
          <li>Generate timesheet reports</li>
          <li>Export timesheet data</li>
        </ul>
      </div>
    </div>
  );
}
