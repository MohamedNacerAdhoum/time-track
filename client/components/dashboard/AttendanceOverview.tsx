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

  // Month data - representing 30 days with realistic hours data
  const monthData = [
    { day: "1", hours: 5.5, maxHours: 8 },
    { day: "2", hours: 8, maxHours: 8 },
    { day: "3", hours: 6, maxHours: 8 },
    { day: "4", hours: 8, maxHours: 8 },
    { day: "5", hours: 6.5, maxHours: 8 },
    { day: "6", hours: 5.8, maxHours: 8 },
    { day: "7", hours: 0, maxHours: 8 },
    { day: "8", hours: 1.2, maxHours: 8 },
    { day: "9", hours: 0, maxHours: 8 },
    { day: "10", hours: 6.4, maxHours: 8 },
    { day: "11", hours: 7.2, maxHours: 8 },
    { day: "12", hours: 6.8, maxHours: 8 },
    { day: "13", hours: 5.9, maxHours: 8 },
    { day: "14", hours: 6.1, maxHours: 8 },
    { day: "15", hours: 4.2, maxHours: 8 },
    { day: "16", hours: 6.8, maxHours: 8 },
    { day: "17", hours: 4.4, maxHours: 8 },
    { day: "18", hours: 2.8, maxHours: 8 },
    { day: "19", hours: 7.7, maxHours: 8 },
    { day: "20", hours: 7.5, maxHours: 8 },
    { day: "21", hours: 6.5, maxHours: 8 },
    { day: "22", hours: 6.4, maxHours: 8 },
    { day: "23", hours: 7.9, maxHours: 8 },
    { day: "24", hours: 6.2, maxHours: 8 },
    { day: "25", hours: 6.4, maxHours: 8 },
    { day: "26", hours: 7.6, maxHours: 8 },
    { day: "27", hours: 5.9, maxHours: 8 },
    { day: "28", hours: 7.2, maxHours: 8 },
    { day: "29", hours: 6.9, maxHours: 8 },
    { day: "30", hours: 3.1, maxHours: 8 },
  ];

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
    <div className="inline-flex flex-col items-end gap-5 w-full max-w-[682px] relative">
      {/* Header Section with Dropdown */}
      <div className="flex items-center w-full relative">
        {/* Dropdown positioned absolutely to match Figma */}
        <div className="absolute -left-[60px] -top-2.5 z-20">
          <div className="flex flex-col items-end gap-2.5">
            {/* Dropdown Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex px-7 py-[15px] justify-center items-center gap-5 rounded-[15px] bg-[#F6F6F6] transition-colors"
            >
              <span className="text-[#B7B9C7] font-[Poppins] text-base font-semibold leading-7 capitalize">
                {selectedView}
              </span>
              <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.14466 17.3189C5.28976 17.4641 5.46206 17.5792 5.65169 17.6578C5.84133 17.7364 6.04459 17.7769 6.24987 17.7769C6.45514 17.7769 6.65841 17.7364 6.84804 17.6578C7.03768 17.5792 7.20997 17.4641 7.35508 17.3189L12.1322 12.5428C12.2298 12.4452 12.3623 12.3903 12.5004 12.3903C12.6385 12.3903 12.7709 12.4452 12.8686 12.5428L17.6447 17.3189C17.9376 17.612 18.3351 17.7767 18.7495 17.7768C19.1639 17.7769 19.5614 17.6124 19.8546 17.3194C20.1477 17.0264 20.3124 16.629 20.3125 16.2145C20.3126 15.8001 20.1481 15.4026 19.8551 15.1095L15.078 10.3324C14.7394 9.99381 14.3375 9.72523 13.8952 9.54198C13.4528 9.35874 12.9787 9.26443 12.4999 9.26443C12.0211 9.26443 11.5469 9.35874 11.1046 9.54198C10.6622 9.72523 10.2603 9.99381 9.92174 10.3324L5.14466 15.1095C4.85174 15.4025 4.68718 15.7998 4.68718 16.2142C4.68718 16.6285 4.85174 17.0258 5.14466 17.3189Z" fill="#7F7F7F"/>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="flex w-[201px] flex-col items-start shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] rounded-[15px] overflow-hidden">
                <button
                  onClick={() => handleViewChange("week")}
                  className="flex px-7 py-[15px] justify-center items-center gap-5 self-stretch rounded-t-[15px] border-b-[0.5px] border-[#D9D9D9] bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-[#B7B9C7] font-[Poppins] text-base font-semibold leading-7">
                    Week
                  </span>
                </button>
                <button
                  onClick={() => handleViewChange("month")}
                  className="flex px-7 py-[15px] justify-center items-center gap-5 self-stretch rounded-b-[15px] bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="text-[#B7B9C7] font-[Poppins] text-base font-semibold leading-7">
                    Month
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title and Date Section */}
        <div className="flex justify-end items-start gap-2.5 self-stretch w-full">
          <div className="flex items-center gap-2.5 flex-1">
            <h2 className="text-black font-[Poppins] text-2xl font-semibold leading-normal flex-1">
              Attendance Overview
            </h2>
          </div>
          <div className="flex px-2.5 py-2.5 justify-center items-center bg-white">
            <span className="text-[#77838F] text-center font-[Poppins] text-base font-semibold leading-normal tracking-[1px]">
              {dateRange}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex px-[15px] py-5 justify-center items-center gap-7 flex-1 self-stretch rounded-[20px] bg-white">
        {/* Y-axis Labels */}
        <div className="flex flex-col justify-end items-center gap-2.5 self-stretch">
          <div className="flex w-2.5 flex-col justify-end flex-1 text-[#77838F] text-center font-[Poppins] text-xl font-semibold leading-normal tracking-[1px]">
            8
          </div>
          <div className="flex w-2.5 flex-col justify-end flex-1 text-[#77838F] text-center font-[Poppins] text-xl font-semibold leading-normal tracking-[1px]">
            6
          </div>
          <div className="flex w-2.5 flex-col justify-end flex-1 text-[#77838F] text-center font-[Poppins] text-xl font-semibold leading-normal tracking-[1px]">
            4
          </div>
          <div className="flex w-2.5 flex-col justify-end flex-1 text-[#77838F] text-center font-[Poppins] text-xl font-semibold leading-normal tracking-[1px]">
            2
          </div>
          <div className="flex w-2.5 flex-col justify-end flex-1 text-[#77838F] text-center font-[Poppins] text-xl font-semibold leading-normal tracking-[1px]">
            0
          </div>
        </div>

        {/* Chart Container */}
        <div className="flex flex-col items-end gap-2.5 flex-1">
          {/* Bars Container */}
          <div className={`flex h-44 justify-center items-center self-stretch ${selectedView === "week" ? "gap-[50px]" : "gap-[5px]"}`}>
            {currentData.map((item, index) => (
              <div key={index} className="flex-1 self-stretch relative">
                {/* Background bar */}
                <div 
                  className={`w-full h-full ${selectedView === "week" ? "rounded-[10px]" : "rounded-[5px]"} bg-[#E6EEF5] absolute bottom-0`}
                  style={{
                    width: selectedView === "week" ? "60px" : "16px"
                  }}
                />
                {/* Data bar */}
                <div
                  className={`${selectedView === "week" ? "rounded-[10px]" : "rounded-[5px]"} bg-[#63CDFA] absolute bottom-0 transition-all duration-300`}
                  style={{ 
                    height: getBarHeight(item.hours, item.maxHours),
                    width: selectedView === "week" ? "60px" : "16px"
                  }}
                />
              </div>
            ))}
          </div>

          {/* X-axis Labels */}
          <div className={`flex items-center self-stretch ${selectedView === "week" ? "gap-7" : "gap-[5px]"}`}>
            {currentData.map((item, index) => (
              <div key={index} className="flex justify-center items-center flex-1">
                <span className={`text-[#77838F] text-center font-[Poppins] font-semibold leading-normal tracking-[1px] ${selectedView === "week" ? "text-sm" : "text-[11px]"}`}>
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
          <button className="flex w-10 h-10 p-2 items-start gap-2.5 rounded-full bg-[#63CDFA] transition-transform hover:scale-105 active:scale-95">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5002 12.7998L14.2002 18.3998C14.6002 18.7998 15.2002 18.7998 15.6002 18.3998C16.0002 17.9998 16.0002 17.3998 15.6002 16.9998L10.7002 11.9998L15.6002 6.9998C16.0002 6.5998 16.0002 5.9998 15.6002 5.5998C15.4002 5.3998 15.2002 5.2998 14.9002 5.2998C14.6002 5.2998 14.4002 5.3998 14.2002 5.5998L8.5002 11.1998C8.1002 11.6998 8.1002 12.2998 8.5002 12.7998C8.5002 12.6998 8.5002 12.6998 8.5002 12.7998Z" fill="white"/>
            </svg>
          </button>
        </div>

        <div className="flex justify-center items-center flex-1 shadow-[0_4px_12px_0_rgba(24,24,24,0.04)]">
          <button className="flex p-2 items-start gap-2.5 rounded-full bg-[#9295AB] transition-transform hover:scale-105 active:scale-95 w-10 h-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.5397 11.29L9.87974 5.64004C9.78677 5.54631 9.67617 5.47191 9.55431 5.42115C9.43246 5.37038 9.30175 5.34424 9.16974 5.34424C9.03773 5.34424 8.90702 5.37038 8.78516 5.42115C8.6633 5.47191 8.5527 5.54631 8.45974 5.64004C8.27349 5.8274 8.16895 6.08085 8.16895 6.34504C8.16895 6.60922 8.27349 6.86267 8.45974 7.05004L13.4097 12.05L8.45974 17C8.27349 17.1874 8.16895 17.4409 8.16895 17.705C8.16895 17.9692 8.27349 18.2227 8.45974 18.41C8.55235 18.5045 8.6628 18.5797 8.78467 18.6312C8.90655 18.6827 9.03743 18.7095 9.16974 18.71C9.30204 18.7095 9.43293 18.6827 9.5548 18.6312C9.67668 18.5797 9.78712 18.5045 9.87974 18.41L15.5397 12.76C15.6412 12.6664 15.7223 12.5527 15.7777 12.4262C15.8331 12.2997 15.8617 12.1631 15.8617 12.025C15.8617 11.8869 15.8331 11.7503 15.7777 11.6238C15.7223 11.4973 15.6412 11.3837 15.5397 11.29Z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
