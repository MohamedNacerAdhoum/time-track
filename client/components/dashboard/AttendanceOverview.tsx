import { useState } from "react";

type ViewType = "week" | "month";

export function AttendanceOverview() {
  const [selectedView, setSelectedView] = useState<ViewType>("week");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Week data from Figma - exact bar heights and dates
  const weekData = [
    { date: "26 Dec", value: 7, maxValue: 8 },
    { date: "27 Dec", value: 4, maxValue: 8 },
    { date: "28 Dec", value: 2.5, maxValue: 8 },
    { date: "29 Dec", value: 6, maxValue: 8 },
    { date: "30 Dec", value: 7.5, maxValue: 8 },
    { date: "31 Dec", value: 5, maxValue: 8 },
  ];

  // Month data from Figma - all 31 days of December
  const monthData = [
    { date: "1", value: 3.5, maxValue: 8 },
    { date: "2", value: 6, maxValue: 8 },
    { date: "3", value: 7.5, maxValue: 8 },
    { date: "4", value: 6.5, maxValue: 8 },
    { date: "5", value: 6.8, maxValue: 8 },
    { date: "6", value: 7.2, maxValue: 8 },
    { date: "7", value: 6.5, maxValue: 8 },
    { date: "8", value: 8, maxValue: 8 },
    { date: "9", value: 1.5, maxValue: 8 },
    { date: "10", value: 0, maxValue: 8 },
    { date: "11", value: 6.8, maxValue: 8 },
    { date: "12", value: 6.2, maxValue: 8 },
    { date: "13", value: 6.5, maxValue: 8 },
    { date: "14", value: 7.5, maxValue: 8 },
    { date: "15", value: 5.5, maxValue: 8 },
    { date: "16", value: 6.8, maxValue: 8 },
    { date: "17", value: 7.2, maxValue: 8 },
    { date: "18", value: 4.5, maxValue: 8 },
    { date: "19", value: 7.8, maxValue: 8 },
    { date: "20", value: 7.6, maxValue: 8 },
    { date: "21", value: 6.8, maxValue: 8 },
    { date: "22", value: 6.5, maxValue: 8 },
    { date: "23", value: 8, maxValue: 8 },
    { date: "24", value: 6.2, maxValue: 8 },
    { date: "25", value: 6.8, maxValue: 8 },
    { date: "26", value: 2.5, maxValue: 8 },
    { date: "27", value: 7.8, maxValue: 8 },
    { date: "28", value: 6.8, maxValue: 8 },
    { date: "29", value: 6.2, maxValue: 8 },
    { date: "30", value: 5.2, maxValue: 8 },
    { date: "31", value: 0, maxValue: 8 },
  ];

  const currentData = selectedView === "week" ? weekData : monthData;
  const dateRange = selectedView === "week" ? "26 Dec - 31 Dec" : "Dec 2023";

  const handleViewChange = (view: ViewType) => {
    setSelectedView(view);
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full max-w-full flex flex-col items-end gap-5 relative bg-white rounded-lg overflow-hidden"
         style={{ fontFamily: 'inherit' }}
    >
      {/* Dropdown Section */}
      <div
        className="flex px-7 py-4 justify-center items-center gap-5 rounded-2xl bg-gray-100 relative cursor-pointer select-none"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span className="text-gray-400 text-base font-semibold leading-7">
          {selectedView === "week" ? "Week" : "Month"}
        </span>
        <svg
          width="25"
          height="26"
          viewBox="0 0 25 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gray-500"
        >
          <path
            d="M19.8553 8.68114C19.7102 8.53595 19.5379 8.42076 19.3483 8.34218C19.1587 8.26359 18.9554 8.22314 18.7501 8.22314C18.5449 8.22314 18.3416 8.26359 18.152 8.34218C17.9623 8.42076 17.79 8.53595 17.6449 8.68114L12.8678 13.4572C12.7702 13.5548 12.6377 13.6097 12.4996 13.6097C12.3615 13.6097 12.2291 13.5548 12.1314 13.4572L7.35534 8.68114C7.06236 8.38802 6.66494 8.2233 6.2505 8.2232C5.83606 8.2231 5.43856 8.38764 5.14544 8.68062C4.85233 8.9736 4.6876 9.37103 4.6875 9.78546C4.6874 10.1999 4.85194 10.5974 5.14492 10.8905L9.92201 15.6676C10.2606 16.0062 10.6625 16.2748 11.1048 16.458C11.5472 16.6413 12.0213 16.7356 12.5001 16.7356C12.9789 16.7356 13.4531 16.6413 13.8954 16.458C14.3378 16.2748 14.7397 16.0062 15.0783 15.6676L19.8553 10.8905C20.1483 10.5975 20.3128 10.2002 20.3128 9.78583C20.3128 9.37151 20.1483 8.97416 19.8553 8.68114Z"
            fill="currentColor"
          />
        </svg>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0 bg-white rounded-2xl shadow-lg z-10 mt-1 border border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewChange("week");
              }}
              className={`w-full px-7 py-4 rounded-t-2xl text-base font-semibold cursor-pointer border-b border-gray-200 ${
                selectedView === "week" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              Week
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleViewChange("month");
              }}
              className={`w-full px-7 py-4 rounded-b-2xl text-base font-semibold cursor-pointer ${
                selectedView === "month" ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              Month
            </button>
          </div>
        )}
      </div>

      {/* Header Section */}
      <div className="flex justify-between items-start gap-2.5 w-full">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-black">
            Attendance Overview
          </h2>
        </div>
        <div className="flex justify-center items-center gap-2.5 bg-white px-2.5 py-2">
          <span className="text-[#77838F] text-center text-base font-bold tracking-wide">
            {dateRange}
          </span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="flex px-4 py-5 justify-center items-center gap-7 flex-1 w-full rounded-3xl bg-white relative">
        {/* Y-axis Labels */}
        <div className="flex flex-col justify-end items-center gap-2.5 h-44">
          {[8, 6, 4, 2, 0].map((value) => (
            <div
              key={value}
              className="flex-1 flex items-center justify-center text-[#77838F] text-center text-xl font-semibold tracking-wider"
              style={{ minWidth: '20px' }}
            >
              {value}
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="flex flex-col items-end gap-2.5 flex-1">
          {/* Bars Container */}
          <div
            className={`flex h-44 justify-center items-end w-full relative ${
              selectedView === "week" ? "gap-12" : "gap-1"
            }`}
          >
            {currentData.map((item, index) => {
              const heightPercentage = (item.value / item.maxValue) * 100;
              const dataBarHeight = (176 * heightPercentage) / 100;

              return (
                <div
                  key={index}
                  className="flex-1 h-full relative flex items-end justify-center"
                  style={{ maxWidth: selectedView === "week" ? "60px" : "15px" }}
                >
                  {/* Background bar */}
                  <div
                    className={`absolute bottom-0 bg-[#E6EEF5] ${
                      selectedView === "week" ? "rounded-t-lg" : "rounded-t-sm"
                    }`}
                    style={{
                      width: selectedView === "week" ? "60px" : "15px",
                      height: "176px",
                    }}
                  />
                  {/* Data bar */}
                  {item.value > 0 && (
                    <div
                      className={`absolute bottom-0 bg-[#63CDFA] ${
                        selectedView === "week" ? "rounded-t-lg" : "rounded-t-sm"
                      }`}
                      style={{
                        width: selectedView === "week" ? "60px" : "15px",
                        height: `${dataBarHeight}px`,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* X-axis Labels */}
          <div
            className={`flex justify-center items-center w-full ${
              selectedView === "week" ? "gap-7" : "gap-1"
            }`}
          >
            {currentData.map((item, index) => (
              <div
                key={index}
                className={`text-[#77838F] text-center font-semibold tracking-wide flex-1 ${
                  selectedView === "week" ? "text-sm" : "text-xs"
                }`}
                style={{
                  maxWidth: selectedView === "week" ? "60px" : "15px",
                  fontSize: selectedView === "week" ? "14px" : "11px"
                }}
              >
                {item.date}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div
        style={{
          display: "flex",
          width: "682px",
          alignItems: "center",
          gap: "10px",
          position: "relative",
        }}
      >
        {/* Left Arrow */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: "1 0 0",
            boxShadow: "0 4px 12px 0 rgba(24, 24, 24, 0.04)",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "8px",
              alignItems: "flex-start",
              gap: "10px",
              borderRadius: "400px",
              background: "#63CDFA",
              position: "absolute",
              left: "148px",
              top: "0px",
              width: "40px",
              height: "40px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "24px",
                height: "24px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "200px",
                position: "relative",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.5002 12.8L14.2002 18.4C14.6002 18.8 15.2002 18.8 15.6002 18.4C16.0002 18 16.0002 17.4 15.6002 17L10.7002 12L15.6002 7.00005C16.0002 6.60005 16.0002 6.00005 15.6002 5.60005C15.4002 5.40005 15.2002 5.30005 14.9002 5.30005C14.6002 5.30005 14.4002 5.40005 14.2002 5.60005L8.5002 11.2C8.1002 11.7 8.1002 12.3 8.5002 12.8C8.5002 12.7 8.5002 12.7 8.5002 12.8Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Right Arrow */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: "1 0 0",
            boxShadow: "0 4px 12px 0 rgba(24, 24, 24, 0.04)",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "8px",
              alignItems: "flex-start",
              gap: "10px",
              borderRadius: "400px",
              background: "#63CDFA",
              position: "absolute",
              left: "148px",
              top: "0px",
              width: "40px",
              height: "40px",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "24px",
                height: "24px",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "200px",
                position: "relative",
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.5397 11.29L9.87974 5.64004C9.78677 5.54631 9.67617 5.47191 9.55431 5.42115C9.43246 5.37038 9.30175 5.34424 9.16974 5.34424C9.03773 5.34424 8.90702 5.37038 8.78516 5.42115C8.6633 5.47191 8.5527 5.54631 8.45974 5.64004C8.27349 5.8274 8.16895 6.08085 8.16895 6.34504C8.16895 6.60922 8.27349 6.86267 8.45974 7.05004L13.4097 12.05L8.45974 17C8.27349 17.1874 8.16895 17.4409 8.16895 17.705C8.16895 17.9692 8.27349 18.2227 8.45974 18.41C8.55235 18.5045 8.6628 18.5797 8.78467 18.6312C8.90655 18.6827 9.03743 18.7095 9.16974 18.71C9.30204 18.7095 9.43293 18.6827 9.5548 18.6312C9.67668 18.5797 9.78712 18.5045 9.87974 18.41L15.5397 12.76C15.6412 12.6664 15.7223 12.5527 15.7777 12.4262C15.8331 12.2997 15.8617 12.1631 15.8617 12.025C15.8617 11.8869 15.8331 11.7503 15.7777 11.6238C15.7223 11.4973 15.6412 11.3837 15.5397 11.29Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
