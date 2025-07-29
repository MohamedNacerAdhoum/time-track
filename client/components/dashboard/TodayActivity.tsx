import { Clock, Check } from "lucide-react";

const TodayActivity = () => {
  const activities = [
    { label: "Punch in at", time: "hh:mm:ss" },
    { label: "Punch break at", time: "hh:mm:ss" },
    { label: "Punch out at", time: "hh:mm:ss" },
  ];

  return (
    <div className="flex w-full max-w-[351px] mx-auto p-[30px_30px_40px_30px] flex-col items-start gap-5 rounded-[20px] bg-white shadow-sm">
      <h2 className="text-black font-semibold text-[25px] leading-[143%] tracking-[0.5px]">
        Today activity
      </h2>
      
      <div className="flex items-start gap-[17px] w-full">
        {/* Timeline */}
        <div className="flex flex-col items-center gap-0">
          {activities.map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Circle with checkmark */}
              <div className="relative">
                <div className="w-[29px] h-[29px] rounded-full bg-timeline flex items-center justify-center">
                  <Check className="w-[17px] h-[17px] text-white stroke-[1.24]" />
                </div>
              </div>
              
              {/* Connecting line (except for last item) */}
              {index < activities.length - 1 && (
                <div className="w-px h-[60px] bg-timeline"></div>
              )}
            </div>
          ))}
        </div>
        
        {/* Activity List */}
        <div className="flex flex-col items-start gap-[30px] flex-1">
          {activities.map((activity, index) => (
            <div key={index} className="flex flex-col items-start gap-[5px]">
              <h3 className="text-black font-semibold text-lg">
                {activity.label}
              </h3>
              <div className="flex items-center gap-[6px]">
                <Clock className="w-[15px] h-[15px] text-[#77838F]" />
                <span className="text-[#77838F] font-semibold text-sm">
                  {activity.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodayActivity;
