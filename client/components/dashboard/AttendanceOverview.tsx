import { useState } from "react";

type ViewType = "week" | "month";

export function AttendanceOverview() {
  const [selectedView, setSelectedView] = useState<ViewType>("week");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Week data - exact values to match Figma
  const weekData = [
    { day: "Mon", hours: 3, maxHours: 8 },
    { day: "Tue", hours: 2, maxHours: 8 },
    { day: "Wed", hours: 5.5, maxHours: 8 },
    { day: "Thu", hours: 8, maxHours: 8 },
    { day: "Fri", hours: 3, maxHours: 8 },
    { day: "Sat", hours: 0, maxHours: 8 },
  ];

  // Month data - 30 days with varied data
  const monthData = Array.from({ length: 30 }, (_, i) => ({
    day: (i + 1).toString(),
    hours: [5.5, 8, 6, 8, 6.5, 5.8, 0, 1.2, 0, 6.4, 7.2, 6.8, 5.9, 6.1, 4.2, 6.8, 4.4, 2.8, 7.7, 7.5, 6.5, 6.4, 7.9, 6.2, 6.4, 7.6, 5.9, 7.2, 6.9, 3.1][i] || Math.random() * 8,
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
    return Math.max(percentage, 0);
  };

  const isWeekView = selectedView === "week";

  return (
    <div className="inline-flex h-[449px] flex-col items-end gap-5 flex-shrink-0 w-full max-w-[682px] relative">
      {/* Header Section with Dropdown */}
      <div className="flex items-center relative w-full">
        {/* Dropdown positioned absolutely to match Figma */}
        <div className="absolute -left-[60px] -top-2.5 z-20">
          <div className="flex h-[272px] p-2.5 flex-col items-end gap-2.5 w-[221px]">
            {/* Dropdown Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex px-7 py-[15px] justify-center items-center gap-5 rounded-[15px] bg-[#F6F6F6] transition-colors relative"
            >
              <span className="text-[#B7B9C7] font-semibold text-base leading-7 capitalize">
                {selectedView}
              </span>
              <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.14466 17.3189C5.28976 17.4641 5.46206 17.5792 5.65169 17.6578C5.84133 17.7364 6.04459 17.7769 6.24987 17.7769C6.45514 17.7769 6.65841 17.7364 6.84804 17.6578C7.03768 17.5792 7.20997 17.4641 7.35508 17.3189L12.1322 12.5428C12.2298 12.4452 12.3623 12.3903 12.5004 12.3903C12.6385 12.3903 12.7709 12.4452 12.8686 12.5428L17.6447 17.3189C17.9376 17.612 18.3351 17.7767 18.7495 17.7768C19.1639 17.7769 19.5614 17.6124 19.8546 17.3194C20.1477 17.0264 20.3124 16.629 20.3125 16.2145C20.3126 15.8001 20.1481 15.4026 19.8551 15.1095L15.078 10.3324C14.7394 9.99381 14.3375 9.72523 13.8952 9.54198C13.4528 9.35874 12.9787 9.26443 12.4999 9.26443C12.0211 9.26443 11.5469 9.35874 11.1046 9.54198C10.6622 9.72523 10.2603 9.99381 9.92174 10.3324L5.14466 15.1095C4.85174 15.4025 4.68718 15.7998 4.68718 16.2142C4.68718 16.6285 4.85174 17.0258 5.14466 17.3189Z" fill="#7F7F7F"/>
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="flex w-[201px] flex-col items-start shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] relative">
                <button
                  onClick={() => handleViewChange("week")}
                  className="flex px-7 py-[15px] justify-center items-center gap-5 self-stretch rounded-t-[15px] border-b-[0.5px] border-[#D9D9D9] bg-white hover:bg-gray-50 transition-colors relative"
                >
                  <span className="text-[#B7B9C7] font-semibold text-base leading-7">
                    Week
                  </span>
                </button>
                <button
                  onClick={() => handleViewChange("month")}
                  className="flex px-7 py-[15px] justify-center items-center gap-5 self-stretch rounded-b-[15px] bg-white hover:bg-gray-50 transition-colors relative"
                >
                  <span className="text-[#B7B9C7] font-semibold text-base leading-7">
                    Month
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title and Date Section */}
        <div className="flex justify-end items-start gap-2.5 self-stretch w-full relative">
          <div className="flex items-center gap-2.5 flex-1 self-stretch relative">
            <h2 className="w-[264px] self-stretch text-black font-semibold text-2xl leading-normal">
              Attendance Overview
            </h2>
          </div>
          <div className="flex px-2.5 py-2.5 justify-center items-center gap-2.5 bg-white relative">
            <span className="text-[#77838F] text-center font-semibold text-base leading-normal tracking-[1px]">
              {dateRange}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex px-[15px] py-5 justify-center items-center gap-7 flex-1 self-stretch rounded-[20px] bg-white relative">
        {/* Y-axis Labels */}
        <div className="flex flex-col justify-end items-center gap-2.5 self-stretch relative">
          {[8, 6, 4, 2, 0].map((value) => (
            <div key={value} className="flex w-2.5 flex-col justify-end flex-1 text-[#77838F] text-center font-semibold text-xl leading-normal tracking-[1px] relative">
              {value}
            </div>
          ))}
        </div>

        {/* Chart Container */}
        <div className="flex flex-col items-end gap-2.5 flex-1 self-stretch relative">
          {/* Bars Container */}
          <div className={`flex ${isWeekView ? 'h-[198px]' : 'h-44'} justify-center items-center ${isWeekView ? 'gap-[50px]' : 'gap-[5px]'} flex-1 self-stretch relative`}>
            {currentData.map((item, index) => (
              <div key={index} className="flex-1 self-stretch relative">
                {/* Background bar */}
                <div 
                  className={`${isWeekView ? 'w-[69px] h-[198px]' : 'w-4 h-44'} ${isWeekView ? 'rounded-[10px]' : 'rounded-[5px]'} bg-[#E6EEF5] absolute left-0 top-0`}
                />
                {/* Data bar with gradient */}
                <div
                  className={`${isWeekView ? 'w-[69px]' : 'w-4'} ${isWeekView ? 'rounded-[10px]' : 'rounded-[5px]'} absolute left-0 transition-all duration-300`}
                  style={{ 
                    height: `${getBarHeight(item.hours, item.maxHours)}%`,
                    bottom: 0,
                    background: 'linear-gradient(180deg, #46F1FF 0%, #63CDFA 100%)'
                  }}
                />
              </div>
            ))}
          </div>

          {/* X-axis Labels */}
          <div className={`flex items-center ${isWeekView ? 'gap-7' : 'gap-[5px]'} self-stretch relative`}>
            {currentData.map((item, index) => (
              <div key={index} className="flex justify-center items-center gap-2.5 flex-1 relative">
                <span className={`text-[#77838F] text-center font-semibold leading-normal tracking-[1px] ${isWeekView ? 'text-sm' : 'text-[11px]'}`}>
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex w-[682px] items-center gap-2.5 relative">
        <div className="flex h-10 justify-center items-center flex-1 shadow-[0_4px_12px_0_rgba(24,24,24,0.04)] relative">
          <div className="flex w-10 h-10 p-2 items-start gap-2.5 rounded-full bg-[#63CDFA] absolute left-[148px] top-0">
            <div className="flex w-6 h-6 justify-center items-center flex-shrink-0 rounded-full relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5002 12.7998L14.2002 18.3998C14.6002 18.7998 15.2002 18.7998 15.6002 18.3998C16.0002 17.9998 16.0002 17.3998 15.6002 16.9998L10.7002 11.9998L15.6002 6.9998C16.0002 6.5998 16.0002 5.9998 15.6002 5.5998C15.4002 5.3998 15.2002 5.2998 14.9002 5.2998C14.6002 5.2998 14.4002 5.3998 14.2002 5.5998L8.5002 11.1998C8.1002 11.6998 8.1002 12.2998 8.5002 12.7998C8.5002 12.6998 8.5002 12.6998 8.5002 12.7998Z" fill="white"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center flex-1 shadow-[0_4px_12px_0_rgba(24,24,24,0.04)] relative">
          <div className="flex p-2 items-start gap-2.5 rounded-full bg-[#9295AB] absolute left-[148px] top-0 w-10 h-10">
            <div className="flex w-6 h-6 justify-center items-center rounded-full relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.5397 11.29L9.87974 5.64004C9.78677 5.54631 9.67617 5.47191 9.55431 5.42115C9.43246 5.37038 9.30175 5.34424 9.16974 5.34424C9.03773 5.34424 8.90702 5.37038 8.78516 5.42115C8.6633 5.47191 8.5527 5.54631 8.45974 5.64004C8.27349 5.8274 8.16895 6.08085 8.16895 6.34504C8.16895 6.60922 8.27349 6.86267 8.45974 7.05004L13.4097 12.05L8.45974 17C8.27349 17.1874 8.16895 17.4409 8.16895 17.705C8.16895 17.9692 8.27349 18.2227 8.45974 18.41C8.55235 18.5045 8.6628 18.5797 8.78467 18.6312C8.90655 18.6827 9.03743 18.7095 9.16974 18.71C9.30204 18.7095 9.43293 18.6827 9.5548 18.6312C9.67668 18.5797 9.78712 18.5045 9.87974 18.41L15.5397 12.76C15.6412 12.6664 15.7223 12.5527 15.7777 12.4262C15.8331 12.2997 15.8617 12.1631 15.8617 12.025C15.8617 11.8869 15.8331 11.7503 15.7777 11.6238C15.7223 11.4973 15.6412 11.3837 15.5397 11.29Z" fill="white"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
