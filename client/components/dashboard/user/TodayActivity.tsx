import { Check, Clock, Timer } from "lucide-react";
import { useTimeSheets } from "@/contexts/TimeSheetsContext";
import { format, parseISO } from "date-fns";

const TodayActivity = () => {
  const { todayTimeSheet } = useTimeSheets();
  const timeSheet = todayTimeSheet?.time_sheet;
  const states = todayTimeSheet?.states;

  const formatTime = (dateString: string | null) => {
    if (!dateString) return '--:--:--';
    try {
      return format(parseISO(dateString), 'HH:mm:ss');
    } catch (e) {
      return '--:--:--';
    }
  };

  const activities = [
    {
      label: "Punch in at",
      time: timeSheet?.clock_in ? formatTime(timeSheet.clock_in) : '--:--:--',
      completed: states?.clock_in === 'DONE',
      active: !timeSheet?.clock_out && !timeSheet?.break_start
    },
    {
      label: "Punch break at",
      time: timeSheet?.break_start
        ? `${formatTime(timeSheet.break_start)} | ${timeSheet?.break_end ? formatTime(timeSheet.break_end) : '--:--:--'}`
        : '--:--:-- | --:--:--',
      completed: states?.break === 'DONE',
      active: timeSheet?.status === 'IN BREAK'
    },
    {
      label: "Punch out at",
      time: timeSheet?.clock_out ? formatTime(timeSheet.clock_out) : '--:--:--',
      completed: states?.clock_out === 'DONE',
      active: false
    },
  ];

  return (
    <div className="flex w-full max-w-[351px] mx-auto p-[30px_30px_40px_30px] flex-col items-start gap-5 rounded-[20px] bg-white shadow-sm">
      <h2 className="text-black font-semibold text-[25px] leading-[143%] tracking-[0.5px] font-poppins">
        Today activity
      </h2>

      <div className="flex items-start gap-[17px] w-full">
        {/* Timeline */}
        <div className="flex flex-col items-center gap-0 pt-1">
          {activities.map((activity, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Circle with checkmark */}
              <div className="relative">
                <div className={`w-[29px] h-[29px] rounded-full flex items-center justify-center ${activity.completed ? 'bg-[#63CDFA]' : activity.active ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                  {activity.completed ? (
                    <Check className="w-[17px] h-[17px] text-white stroke-[1.24]" />
                  ) : activity.active ? (
                    <Clock className="w-[17px] h-[17px] text-white stroke-[1.24] animate-pulse" />
                  ) : null}
                </div>
              </div>

              {/* Connecting line (except for last item) */}
              {index < activities.length - 1 && (
                <div className="w-px h-[60px] bg-[#63CDFA] my-1"></div>
              )}
            </div>
          ))}
        </div>

        {/* Activity List */}
        <div className="flex flex-col items-start gap-[30px] flex-1">
          {activities.map((activity, index) => (
            <div key={index} className="flex flex-col items-start gap-[5px]">
              <h3 className="text-black font-semibold text-lg font-poppins">
                {activity.label}
              </h3>
              <div className="flex items-center gap-[6px]">
                <Timer className="w-[17px] h-[17px] text-[#77838F]" />
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-sm font-poppins ${activity.completed ? 'text-[#63CDFA]' : activity.active ? 'text-green-500' : 'text-[#77838F]'
                    }`}>
                    {activity.time}
                  </span>
                  {activity.active && (
                    <span className="text-xs text-green-500 animate-pulse">
                      In progress...
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodayActivity;
