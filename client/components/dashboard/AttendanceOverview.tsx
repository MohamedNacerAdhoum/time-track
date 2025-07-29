import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

type ViewType = "week" | "month";

export function AttendanceOverview() {

  const [selectedView, setSelectedView] = useState<ViewType>("week");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Week data - hours worked each day (0-8 scale)
  const weekData = [
    { day: "Mon", hours: 3, maxHours: 8 },
    { day: "Tue", hours: 2, maxHours: 8 },
    { day: "Wed", hours: 5.5, maxHours: 8 },
    { day: "Thu", hours: 8, maxHours: 8 },
    { day: "Fri", hours: 3, maxHours: 8 },
    { day: "Sat", hours: 0, maxHours: 8 },
  ];

  // Month data - simplified representation for 30 days
  const monthData = Array.from({ length: 30 }, (_, i) => ({
    day: (i + 1).toString(),
    hours: Math.random() * 8, // Random data for demonstration
    maxHours: 8,
  }));

  const currentData = selectedView === "week" ? weekData : monthData;
  const dateRange = selectedView === "week" ? "01 Jan - 07 Jan" : "Jan 2024";

  const handleViewChange = (view: ViewType) => {
    setSelectedView(view);
    setIsDropdownOpen(false);
  };

  const getBarHeight = (hours: number, maxHours: number) => {
    const percentage = (hours / maxHours) * 100;
    return `${percentage}%`;
  };
  return (
    <div className="flex flex-col items-end gap-5 w-full max-w-[700px] mx-auto relative">
      {/* Header Section */}
      <div className="flex justify-between items-start gap-2.5 w-full">
        <div className="flex items-center gap-2.5 flex-1">
          <h2 className="text-black font-semibold text-2xl">
            Attendance Overview
          </h2>
        </div>

        {/* Date Display */}
        <div className="flex px-2.5 py-2.5 justify-center items-center bg-white">
          <span className="text-[#77838F] text-center font-semibold text-base tracking-wider">
            {dateRange}
          </span>
        </div>
      </div>

      {/* Custom Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex px-7 py-4 justify-center items-center gap-5 rounded-[15px] bg-[#F6F6F6] transition-colors"
        >
          <span className="text-[#B7B9C7] font-semibold text-base leading-7 capitalize">
            {selectedView}
          </span>
          <ChevronDown className="w-6 h-6 text-[#7F7F7F]" />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-[201px] bg-white rounded-[15px] shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] overflow-hidden z-10">
            <button
              onClick={() => handleViewChange("week")}
              className={`w-full px-7 py-4 text-center border-b-[0.5px] border-[#D9D9D9] transition-colors ${selectedView === "week"
                ? "bg-timeline text-white"
                : "text-[#B7B9C7] hover:bg-gray-50"
                }`}
            >
              <span className="font-semibold text-base leading-7">Week</span>
            </button>
            <button
              onClick={() => handleViewChange("month")}
              className={`w-full px-7 py-4 text-center transition-colors ${selectedView === "month"
                ? "bg-timeline text-white"
                : "text-[#B7B9C7] hover:bg-gray-50"
                }`}
            >
              <span className="font-semibold text-base leading-7">Month</span>
            </button>
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div className="flex px-5 py-5 justify-center items-center gap-7 flex-1 w-full rounded-[20px] bg-white">
        {/* Y-axis Labels */}
        <div className="flex flex-col justify-end items-center gap-2.5 h-44">
          <div className="flex flex-col justify-end flex-1 text-[#77838F] text-center font-semibold text-xl tracking-wider">
            8
          </div>
          <div className="flex flex-col justify-end flex-1 text-[#77838F] text-center font-semibold text-xl tracking-wider">
            6
          </div>
          <div className="flex flex-col justify-end flex-1 text-[#77838F] text-center font-semibold text-xl tracking-wider">
            4
          </div>
          <div className="flex flex-col justify-end flex-1 text-[#77838F] text-center font-semibold text-xl tracking-wider">
            2
          </div>
          <div className="flex flex-col justify-end flex-1 text-[#77838F] text-center font-semibold text-xl tracking-wider">
            0
          </div>
        </div>

        {/* Chart Bars */}
        <div className="flex flex-col items-end gap-2.5 flex-1">
          <div className={`flex h-44 justify-center items-center ${selectedView === "week" ? "gap-12" : "gap-1"} w-full`}>
            {currentData.map((item, index) => (
              <div key={index} className="flex-1 h-full relative">
                {/* Background bar */}
                <div className={`w-full h-full ${selectedView === "week" ? "rounded-[10px]" : "rounded-[5px]"} bg-[#E6EEF5] absolute bottom-0`} />

                {/* Data bar */}
                <div
                  className={`w-full ${selectedView === "week" ? "rounded-[10px]" : "rounded-[5px]"} bg-timeline absolute bottom-0 transition-all duration-300`}
                  style={{ height: getBarHeight(item.hours, item.maxHours) }}
                />
              </div>
            ))}
          </div>

          {/* X-axis Labels */}
          <div className={`flex items-center ${selectedView === "week" ? "gap-7" : "gap-1"} w-full`}>
            {currentData.map((item, index) => (
              <div key={index} className="flex justify-center items-center flex-1">
                <span className={`text-[#77838F] text-center font-semibold ${selectedView === "week" ? "text-sm" : "text-xs"} tracking-wider`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex w-full items-center gap-2.5">
        <div className="flex h-10 justify-center items-center flex-1 shadow-[0_4px_12px_0_rgba(24,24,24,0.04)]">
          <button className="flex w-10 h-10 p-2 items-start gap-2.5 rounded-full bg-timeline transition-transform hover:scale-105 active:scale-95">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex justify-center items-center flex-1 shadow-[0_4px_12px_0_rgba(24,24,24,0.04)]">
          <button className="flex p-2 items-start gap-2.5 rounded-full bg-[#9295AB] transition-transform hover:scale-105 active:scale-95 w-10 h-10">
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

