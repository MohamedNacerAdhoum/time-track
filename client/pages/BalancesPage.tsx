export default function BalancesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-black mb-6">
        Balances
      </h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <p className="text-gray-600">
          Balances management functionality will be implemented here. This page will allow users to:
        </p>
        <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2">
          <li>View vacation and sick leave balances</li>
          <li>Track overtime and comp time</li>
          <li>Monitor PTO accruals and usage</li>
          <li>Generate balance reports</li>
          <li>Manage employee leave balances (admin view)</li>
        </ul>
      </div>
    </div>
  );
}
