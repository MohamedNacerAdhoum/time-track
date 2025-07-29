import { useState } from "react";

type ViewType = "week" | "month";

export function AttendanceOverview() {
  const [selectedView, setSelectedView] = useState<ViewType>("week");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Week data - exact values from Figma
  const weekData = [
    { day: "Mon", hours: 3, maxHours: 8 },
    { day: "Tue", hours: 2, maxHours: 8 },
    { day: "Wed", hours: 5.5, maxHours: 8 },
    { day: "Thu", hours: 8, maxHours: 8 },
    { day: "Fri", hours: 3, maxHours: 8 },
    { day: "Sat", hours: 0, maxHours: 8 },
  ];

  // Month data - 30 days
  const monthData = Array.from({ length: 30 }, (_, i) => {
    const hours = [5.5, 8, 6, 8, 6.5, 5.8, 0, 1.2, 0, 6.4, 7.2, 6.8, 5.9, 6.1, 4.2, 6.8, 4.4, 2.8, 7.7, 7.5, 6.5, 6.4, 7.9, 6.2, 6.4, 7.6, 5.9, 7.2, 6.9, 3.1][i] || 0;
    return { day: (i + 1).toString(), hours, maxHours: 8 };
  });

  const currentData = selectedView === "week" ? weekData : monthData;
  const dateRange = selectedView === "week" ? "01 Jan - 07 Jan" : "Jan 2024";

  const handleViewChange = (view: ViewType) => {
    setSelectedView(view);
    setIsDropdownOpen(false);
  };

  return (
    <div 
      className="inline-flex flex-col items-end gap-5 flex-shrink-0 relative"
      style={{ 
        height: '449px',
        width: '682px'
      }}
    >
      {/* Header Section with Dropdown */}
      <div className="flex items-center relative w-full">
        {/* Dropdown positioned absolutely to match Figma */}
        <div 
          className="flex flex-col items-end gap-2.5 absolute z-20"
          style={{
            left: '-60px',
            top: '-10px',
            width: '221px',
            height: '272px',
            padding: '10px'
          }}
        >
          {/* Dropdown Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex justify-center items-center gap-5 bg-[#F6F6F6] transition-colors relative"
            style={{
              padding: '15px 30px',
              borderRadius: '15px'
            }}
          >
            <span className="text-[#B7B9C7] font-semibold text-base leading-7 capitalize" style={{ fontFamily: 'Poppins' }}>
              {selectedView}
            </span>
            <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.14466 17.3189C5.28976 17.4641 5.46206 17.5792 5.65169 17.6578C5.84133 17.7364 6.04459 17.7769 6.24987 17.7769C6.45514 17.7769 6.65841 17.7364 6.84804 17.6578C7.03768 17.5792 7.20997 17.4641 7.35508 17.3189L12.1322 12.5428C12.2298 12.4452 12.3623 12.3903 12.5004 12.3903C12.6385 12.3903 12.7709 12.4452 12.8686 12.5428L17.6447 17.3189C17.9376 17.612 18.3351 17.7767 18.7495 17.7768C19.1639 17.7769 19.5614 17.6124 19.8546 17.3194C20.1477 17.0264 20.3124 16.629 20.3125 16.2145C20.3126 15.8001 20.1481 15.4026 19.8551 15.1095L15.078 10.3324C14.7394 9.99381 14.3375 9.72523 13.8952 9.54198C13.4528 9.35874 12.9787 9.26443 12.4999 9.26443C12.0211 9.26443 11.5469 9.35874 11.1046 9.54198C10.6622 9.72523 10.2603 9.99381 9.92174 10.3324L5.14466 15.1095C4.85174 15.4025 4.68718 15.7998 4.68718 16.2142C4.68718 16.6285 4.85174 17.0258 5.14466 17.3189Z" fill="#7F7F7F"/>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div 
              className="flex flex-col items-start relative"
              style={{
                width: '201px',
                boxShadow: '-4px 4px 12px 0 rgba(0, 0, 0, 0.25)'
              }}
            >
              <button
                onClick={() => handleViewChange("week")}
                className="flex justify-center items-center gap-5 self-stretch bg-white hover:bg-gray-50 transition-colors relative"
                style={{
                  padding: '15px 30px',
                  borderRadius: '15px 15px 0 0',
                  borderBottom: '0.5px solid #D9D9D9'
                }}
              >
                <span className="text-[#B7B9C7] font-semibold text-base leading-7" style={{ fontFamily: 'Poppins' }}>
                  Week
                </span>
              </button>
              <button
                onClick={() => handleViewChange("month")}
                className="flex justify-center items-center gap-5 self-stretch bg-white hover:bg-gray-50 transition-colors relative"
                style={{
                  padding: '15px 30px',
                  borderRadius: '0 0 15px 15px'
                }}
              >
                <span className="text-[#B7B9C7] font-semibold text-base leading-7" style={{ fontFamily: 'Poppins' }}>
                  Month
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Title and Date Section */}
        <div className="flex justify-end items-start gap-2.5 self-stretch w-full relative">
          <div className="flex items-center gap-2.5 flex-1 self-stretch relative">
            <div 
              className="self-stretch text-black font-semibold leading-normal relative"
              style={{ 
                width: '264px',
                fontSize: '24px',
                fontFamily: 'Poppins'
              }}
            >
              Attendance Overview
            </div>
          </div>
          <div 
            className="flex justify-center items-center gap-2.5 bg-white relative"
            style={{ padding: '10px' }}
          >
            <div 
              className="text-[#77838F] text-center font-semibold leading-normal"
              style={{ 
                fontSize: '16px',
                letterSpacing: '1px',
                fontFamily: 'Poppins'
              }}
            >
              {dateRange}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div 
        className="flex justify-center items-center gap-7 flex-1 self-stretch bg-white relative"
        style={{
          padding: '20px 15px',
          borderRadius: '20px'
        }}
      >
        {/* Y-axis Labels */}
        <div className="flex flex-col justify-end items-center gap-2.5 self-stretch relative">
          {[8, 6, 4, 2, 0].map((value) => (
            <div 
              key={value} 
              className="flex flex-col justify-end flex-1 text-[#77838F] text-center font-semibold leading-normal relative"
              style={{ 
                width: selectedView === "week" ? '9px' : '10px',
                fontSize: '20px',
                letterSpacing: '1px',
                fontFamily: 'Poppins'
              }}
            >
              {value}
            </div>
          ))}
        </div>

        {/* Chart Container */}
        <div className="flex flex-col items-end gap-2.5 flex-1 self-stretch relative">
          {/* Bars Container */}
          <div 
            className="flex justify-center items-center flex-1 self-stretch relative"
            style={{ 
              gap: selectedView === "week" ? '50px' : '5px'
            }}
          >
            {currentData.map((item, index) => {
              const heightPercentage = (item.hours / item.maxHours) * 100;
              const barHeight = selectedView === "week" ? (176 * heightPercentage / 100) : (176 * heightPercentage / 100);
              
              return (
                <div key={index} className="flex-1 self-stretch relative">
                  {/* Background bar */}
                  <div 
                    className="absolute left-0 top-0"
                    style={{
                      width: selectedView === "week" ? '60px' : '16px',
                      height: '176px',
                      borderRadius: selectedView === "week" ? '10px 10px 0 0' : '5px 5px 0 0',
                      background: '#E6EEF5'
                    }}
                  />
                  {/* Data bar with gradient */}
                  {item.hours > 0 && (
                    <div
                      className="absolute left-0"
                      style={{ 
                        width: selectedView === "week" ? '60px' : '16px',
                        height: `${barHeight}px`,
                        bottom: 0,
                        borderRadius: selectedView === "week" ? '10px 10px 0 0' : '5px 5px 0 0',
                        background: 'linear-gradient(180deg, #46F1FF 0%, #63CDFA 100%)'
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* X-axis Labels */}
          <div 
            className="flex items-center self-stretch relative"
            style={{ 
              gap: selectedView === "week" ? '30px' : '5px'
            }}
          >
            {currentData.map((item, index) => (
              <div key={index} className="flex justify-center items-center gap-2.5 flex-1 relative">
                <div 
                  className="text-[#77838F] text-center font-semibold leading-normal"
                  style={{ 
                    fontSize: selectedView === "week" ? '14px' : '11px',
                    letterSpacing: '1px',
                    fontFamily: 'Poppins'
                  }}
                >
                  {item.day}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div 
        className="flex items-center gap-2.5 relative"
        style={{ width: '682px' }}
      >
        <div 
          className="flex justify-center items-center flex-1 relative"
          style={{
            height: '40px',
            boxShadow: '0 4px 12px 0 rgba(24, 24, 24, 0.04)'
          }}
        >
          <div 
            className="flex items-start gap-2.5 absolute"
            style={{
              width: '40px',
              height: '40px',
              padding: '8px',
              borderRadius: '400px',
              background: '#63CDFA',
              left: '148px',
              top: '0px'
            }}
          >
            <div 
              className="flex justify-center items-center flex-shrink-0 relative"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '200px'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.5002 12.7998L14.2002 18.3998C14.6002 18.7998 15.2002 18.7998 15.6002 18.3998C16.0002 17.9998 16.0002 17.3998 15.6002 16.9998L10.7002 11.9998L15.6002 6.9998C16.0002 6.5998 16.0002 5.9998 15.6002 5.5998C15.4002 5.3998 15.2002 5.2998 14.9002 5.2998C14.6002 5.2998 14.4002 5.3998 14.2002 5.5998L8.5002 11.1998C8.1002 11.6998 8.1002 12.2998 8.5002 12.7998C8.5002 12.6998 8.5002 12.6998 8.5002 12.7998Z" fill="white"/>
              </svg>
            </div>
          </div>
        </div>

        <div 
          className="flex justify-center items-center flex-1 relative"
          style={{
            boxShadow: '0 4px 12px 0 rgba(24, 24, 24, 0.04)'
          }}
        >
          <div 
            className="flex items-start gap-2.5 absolute"
            style={{
              padding: '8px',
              borderRadius: '400px',
              background: '#9295AB',
              left: '148px',
              top: '0px',
              width: '40px',
              height: '40px'
            }}
          >
            <div 
              className="flex justify-center items-center relative"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '200px'
              }}
            >
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
