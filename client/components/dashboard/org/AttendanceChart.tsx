import { useTimeSheets } from "@/contexts/TimeSheetsContext";
import { Loader2 } from "lucide-react";

export function AttendanceChart() {
  const { employeesStatus, loading } = useTimeSheets();
  
  // Calculate present employees by subtracting absent from total
  const totalEmployees = employeesStatus?.TOTAL || 1; // Avoid division by zero
  const absentEmployees = employeesStatus?.ABSENT || 0;
  const presentEmployees = totalEmployees - absentEmployees;
  const presentPercentage = (presentEmployees / totalEmployees) * 100;
  
  // Calculate dasharray values for the donut chart
  const dashArray = 2 * Math.PI * 80; // 2 * π * radius
  const dashOffset = dashArray * (1 - (presentPercentage / 100));
  
  return (
    <div className="bg-white border border-[#B7B9C7] rounded-2xl p-6">
      {/* Header */}
      <h3 className="text-base font-bold text-[#1F1F25] mb-6">
        Employees attendance
      </h3>
      
      {/* Chart Container */}
      <div className="flex justify-center items-center mb-6">
        <div className="relative w-48 h-48">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#63CDFA]" />
            </div>
          ) : (
            <>
              {/* SVG Donut Chart */}
              <svg 
                width="194" 
                height="194" 
                viewBox="0 0 194 194" 
                className="transform -rotate-90"
              >
                {/* Background Circle (Absent) */}
                <circle
                  cx="97"
                  cy="97"
                  r="80"
                  fill="none"
                  stroke="#E6EEF5"
                  strokeWidth="24"
                />
                
                {/* Active Arc (Present) */}
                <circle
                  cx="97"
                  cy="97"
                  r="80"
                  fill="none"
                  stroke="#63CDFA"
                  strokeWidth="24"
                  strokeDasharray={`${dashArray - dashOffset} ${dashOffset}`}
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Center Text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-black">
                  {presentEmployees} / {totalEmployees}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#63CDFA]" />
          <span className="text-sm text-[#404040]">At work</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#E6EEF5]" />
          <span className="text-sm text-[#404040]">Absent</span>
        </div>
      </div>
    </div>
  );
}
