import { Clock, UserX } from "lucide-react";
import { useTimeSheets } from "@/contexts/TimeSheetsContext";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

export function StatsCardsOrg() {
  const { employeesStatus, loading, timeSheets } = useTimeSheets();

  // Calculate total worked hours from timesheets
  const totalWorkedHours = useMemo(() => {
    if (!timeSheets) return 0;
    
    return timeSheets.reduce((total, ts) => {
      if (!ts.clock_in || !ts.clock_out) return total;
      
      const start = new Date(ts.clock_in);
      const end = new Date(ts.clock_out);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      
      // Subtract break time if any
      if (ts.break_start && ts.break_end) {
        const breakStart = new Date(ts.break_start);
        const breakEnd = new Date(ts.break_end);
        const breakMs = breakEnd.getTime() - breakStart.getTime();
        const breakHours = breakMs / (1000 * 60 * 60);
        return total + (diffHours - breakHours);
      }
      
      return total + diffHours;
    }, 0);
  }, [timeSheets]);
  
  const absentEmployees = employeesStatus?.ABSENT || 0;

  return (
    <div className="grid grid-cols-1 gap-5 lg:col-span-2">
      {/* Worked Hours Card */}
      <div className="bg-white border border-[#B7B9C7] rounded-2xl p-6 flex items-center justify-between">
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : (
            <>
              <div className="text-4xl font-normal text-black">
                {Math.round(totalWorkedHours)}h
              </div>
              <div className="text-2xl font-light text-[#252C58]">
                Worked hours
              </div>
            </>
          )}
        </div>
        <div className="bg-[#E6EAF5] rounded-full p-3">
          <Clock className="w-7 h-7 text-[#63CDFA]" />
        </div>
      </div>

      {/* Absent Workers Card */}
      <div className="bg-white border border-[#B7B9C7] rounded-2xl p-6 flex items-center justify-between">
        <div className="flex flex-col gap-6">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : (
            <>
              <div className="text-4xl font-normal text-black">
                {absentEmployees}
              </div>
              <div className="text-2xl font-light text-[#252C58]">
                Absent workers
              </div>
            </>
          )}
        </div>
        <div className="bg-[#E6EAF5] rounded-full p-3">
          <UserX className="w-7 h-7 text-[#63CDFA]" />
        </div>
      </div>
    </div>
  );
}
