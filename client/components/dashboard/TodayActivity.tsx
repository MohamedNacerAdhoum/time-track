import { Check } from "lucide-react";

const TodayActivity = () => {
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const activities = [
    { label: "Punch in at", time: getCurrentTime() },
    { label: "Punch break at", time: getCurrentTime() },
    { label: "Punch out at", time: getCurrentTime() },
  ];

  return (
    <div className="flex w-full max-w-[351px] mx-auto p-[30px_30px_40px_30px] flex-col items-start gap-5 rounded-[20px] bg-white shadow-sm">
      <h2 className="text-black font-semibold text-[25px] leading-[143%] tracking-[0.5px] font-poppins">
        Today activity
      </h2>
      
      <div className="flex items-start gap-[17px] w-full">
        {/* Timeline */}
        <div className="flex flex-col items-center gap-0 pt-1">
          {activities.map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Circle with checkmark */}
              <div className="relative">
                <div className="w-[29px] h-[29px] rounded-full bg-[#63CDFA] flex items-center justify-center">
                  <Check className="w-[17px] h-[17px] text-white stroke-[1.24]" />
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
                <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_1025_12197)">
                    <path d="M13.2488 3.58255L13.7988 4.13255L14.6826 3.2488L12.6907 1.2563L11.8063 2.14067L12.3638 2.69755L11.7088 3.42505C10.6949 2.66232 9.48857 2.19721 8.22508 2.08192V0.800049H6.97508V2.08192C5.71158 2.19721 4.50521 2.66232 3.49133 3.42505L2.83633 2.69755L3.43258 2.1013L2.54883 1.21755L0.517578 3.2488L1.40133 4.13255L1.95133 3.58255L2.56258 4.26192C1.65195 5.24241 1.04725 6.46734 0.822627 7.78649C0.598009 9.10563 0.76324 10.4617 1.29806 11.6883C1.83287 12.9149 2.71403 13.9588 3.83346 14.6919C4.95289 15.425 6.26194 15.8155 7.60008 15.8155C8.93821 15.8155 10.2473 15.425 11.3667 14.6919C12.4861 13.9588 13.3673 12.9149 13.9021 11.6883C14.4369 10.4617 14.6021 9.10563 14.3775 7.78649C14.1529 6.46734 13.5482 5.24241 12.6376 4.26192L13.2488 3.58255ZM7.60008 10.175C7.32515 10.176 7.05762 10.086 6.83917 9.91903C6.62071 9.7521 6.46359 9.51761 6.39227 9.25209C6.32095 8.98657 6.33944 8.70491 6.44485 8.45099C6.55026 8.19706 6.73668 7.98513 6.97508 7.84817V4.55005H8.22508V7.84817C8.46348 7.98513 8.6499 8.19706 8.75531 8.45099C8.86072 8.70491 8.8792 8.98657 8.80788 9.25209C8.73656 9.51761 8.57944 9.7521 8.36099 9.91903C8.14254 10.086 7.87501 10.176 7.60008 10.175Z" fill="#77838F"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_1025_12197">
                      <rect width="15" height="15" fill="white" transform="translate(0.100098 0.800049)"/>
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-[#77838F] font-semibold text-sm font-poppins">
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
