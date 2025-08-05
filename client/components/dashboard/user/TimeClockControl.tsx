import { useState } from "react";
import { NotebookPen } from "lucide-react";

const TimeClockControl = () => {
  const [notes, setNotes] = useState({
    clockin: "",
    break: "",
    clockout: "",
  });

  const handleNoteChange = (
    type: "clockin" | "break" | "clockout",
    value: string,
  ) => {
    setNotes((prev) => ({ ...prev, [type]: value }));
  };

  return (
    <div className="w-full px-4 py-2">
      {/* Mobile: Horizontal buttons only, Desktop: Full layout with notes */}

      {/* Mobile-only: Horizontal buttons without notes */}
      <div className="flex md:hidden justify-center items-center gap-6 w-full">
        {/* Clock In - Mobile */}
        <button className="flex w-[140px] h-[60px] px-5 py-4 justify-center items-center gap-3 rounded-full bg-[#4DA64D] shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] transition-transform hover:scale-105 active:scale-95">
          <div className="flex items-center gap-3">
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M6.25821 14.5823H3.59154C3.46821 14.5819 3.36821 14.4819 3.36788 14.3586V5.00859C3.36821 4.88526 3.46821 4.78526 3.59154 4.78493H6.25821C6.73154 4.78493 7.11488 4.40159 7.11488 3.92826C7.11488 3.45493 6.73154 3.07159 6.25821 3.07159H3.59154C2.62488 3.07326 1.84654 3.85159 1.84488 4.81826V14.3586C1.84654 15.3253 2.62488 16.1036 3.59154 16.1053H6.25821C6.73154 16.1053 7.11488 15.7219 7.11488 15.2486C7.11488 14.7753 6.73154 14.3919 6.25821 14.3919V14.5823Z"
                fill="white"
              />
              <path
                d="M12.6915 10.6713L5.69821 10.6863L7.54488 8.83963C7.83154 8.55296 7.83154 8.08629 7.54488 7.79963C7.25821 7.51296 6.79154 7.51296 6.50488 7.79963L4.25821 10.0463C3.55488 10.7496 3.55488 11.8763 4.25821 12.5796L6.50488 14.8263C6.79154 15.1129 7.25821 15.1129 7.54488 14.8263C7.83154 14.5396 7.83154 14.0729 7.54488 13.7863L5.69821 11.9396L12.6915 11.9246C13.1648 11.9229 13.5465 11.5396 13.5448 11.0663C13.5432 10.5929 13.1598 10.2113 12.6865 10.2129L12.6915 10.6713Z"
                fill="white"
              />
            </svg>
            <span className="text-white font-semibold text-sm font-poppins">
              Clock in
            </span>
          </div>
        </button>

        {/* Break - Mobile */}
        <button className="flex w-[120px] h-[48px] px-4 py-3 justify-center items-center gap-2 rounded-full bg-[#FFA501] shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] transition-transform hover:scale-105 active:scale-95">
          <div className="flex items-center gap-2">
            <svg
              width="12"
              height="13"
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M11.1636 6.46845H10.8727V5.88663C10.8727 5.42371 10.6888 4.97975 10.3615 4.65241C10.0342 4.32507 9.59019 4.14118 9.12727 4.14118H2.14545C1.68253 4.14118 1.23856 4.32507 0.911226 4.65241C0.583889 4.97975 0.399994 5.42371 0.399994 5.88663V11.7048C0.400918 12.4761 0.707707 13.2155 1.25307 13.7608C1.79843 14.3062 2.53783 14.613 3.30908 14.6139H7.96363C8.634 14.6131 9.28359 14.3811 9.8029 13.9572C10.3222 13.5333 10.6795 12.9433 10.8145 12.2866C11.1081 12.3279 11.4071 12.3063 11.6918 12.2233C11.9764 12.1404 12.2402 11.998 12.4657 11.8055C12.6912 11.613 12.8732 11.3748 12.9998 11.1067C13.1264 10.8386 13.1946 10.5467 13.2 10.2503V8.50481C13.2 7.96474 12.9855 7.44678 12.6036 7.06489C12.2217 6.683 11.7037 6.46845 11.1636 6.46845ZM12.0364 10.2503C12.0299 10.3891 11.9928 10.5248 11.9277 10.6476C11.8627 10.7704 11.7713 10.8774 11.6601 10.9608C11.5489 11.0441 11.4207 11.1019 11.2846 11.13C11.1485 11.158 11.0078 11.1556 10.8727 11.123V7.63209C11.0078 7.59944 11.1485 7.59706 11.2846 7.6251C11.4207 7.65315 11.5489 7.71093 11.6601 7.79432C11.7713 7.87771 11.8627 7.98465 11.9277 8.10747C11.9928 8.2303 12.0299 8.36598 12.0364 8.50481V10.2503ZM5.05454 2.39572V1.23209C5.05454 1.07778 5.11584 0.929791 5.22495 0.820679C5.33406 0.711567 5.48205 0.650269 5.63636 0.650269C5.79067 0.650269 5.93865 0.711567 6.04777 0.820679C6.15688 0.929791 6.21818 1.07778 6.21818 1.23209V2.39572C6.21818 2.55003 6.15688 2.69802 6.04777 2.80713C5.93865 2.91624 5.79067 2.97754 5.63636 2.97754C5.48205 2.97754 5.33406 2.91624 5.22495 2.80713C5.11584 2.69802 5.05454 2.55003 5.05454 2.39572ZM7.38181 2.39572V1.23209C7.38181 1.07778 7.44311 0.929791 7.55222 0.820679C7.66134 0.711567 7.80932 0.650269 7.96363 0.650269C8.11794 0.650269 8.26593 0.711567 8.37504 0.820679C8.48415 0.929791 8.54545 1.07778 8.54545 1.23209V2.39572C8.54545 2.55003 8.48415 2.69802 8.37504 2.80713C8.26593 2.91624 8.11794 2.97754 7.96363 2.97754C7.80932 2.97754 7.66134 2.91624 7.55222 2.80713C7.44311 2.69802 7.38181 2.55003 7.38181 2.39572ZM2.72727 2.39572V1.23209C2.72727 1.07778 2.78857 0.929791 2.89768 0.820679C3.00679 0.711567 3.15478 0.650269 3.30908 0.650269C3.46339 0.650269 3.61138 0.711567 3.72049 0.820679C3.8296 0.929791 3.8909 1.07778 3.8909 1.23209V2.39572C3.8909 2.55003 3.8296 2.69802 3.72049 2.80713C3.61138 2.91624 3.46339 2.97754 3.30908 2.97754C3.15478 2.97754 3.00679 2.91624 2.89768 2.80713C2.78857 2.69802 2.72727 2.55003 2.72727 2.39572Z"
                fill="white"
              />
            </svg>
            <span className="text-white font-semibold text-xs font-poppins">
              Break
            </span>
          </div>
        </button>

        {/* Clock Out - Mobile */}
        <button className="flex w-[120px] h-[48px] px-4 py-3 justify-center items-center gap-2 rounded-full bg-[#FF6262] shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] transition-transform hover:scale-105 active:scale-95">
          <div className="flex items-center gap-2">
            <svg
              width="12"
              height="12"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
            >
              <path
                d="M2.50821 14.5823H6.17488C6.29821 14.5819 6.39821 14.4819 6.39854 14.3586V5.00859C6.39821 4.88526 6.29821 4.78526 6.17488 4.78493H2.50821C2.03488 4.78493 1.65154 4.40159 1.65154 3.92826C1.65154 3.45493 2.03488 3.07159 2.50821 3.07159H6.17488C7.14154 3.07326 7.91988 3.85159 7.92154 4.81826V14.3586C7.91988 15.3253 7.14154 16.1036 6.17488 16.1053H2.50821C2.03488 16.1053 1.65154 15.7219 1.65154 15.2486C1.65154 14.7753 2.03488 14.3919 2.50821 14.3919V14.5823Z"
                fill="white"
              />
              <path
                d="M6.07488 11.9396L13.0682 11.9246L11.2215 13.7713C10.9348 14.0579 10.9348 14.5246 11.2215 14.8113C11.5082 15.0979 11.9748 15.0979 12.2615 14.8113L14.5082 12.5646C15.2115 11.8613 15.2115 10.7346 14.5082 10.0313L12.2615 7.78463C11.9748 7.49796 11.5082 7.49796 11.2215 7.78463C10.9348 8.07129 10.9348 8.53796 11.2215 8.82463L13.0682 10.6713L6.07488 10.6863C5.60154 10.6879 5.21988 11.0713 5.22154 11.5446C5.22321 12.0179 5.60654 12.3996 6.07988 12.3979L6.07488 11.9396Z"
                fill="white"
              />
            </svg>
            <span className="text-white font-semibold text-xs font-poppins">
              Clock out
            </span>
          </div>
        </button>
      </div>

      {/* Desktop: Full layout with notes (hidden on mobile) */}
      <div className="hidden md:flex flex-col lg:flex-row justify-center items-center lg:items-start gap-4 lg:gap-[60px] w-full">
        {/* Clock In */}
        <div className="flex flex-col items-center gap-4 w-full max-w-[280px] lg:w-[180px]">
          <button className="flex w-full lg:w-[150px] h-[44px] px-5 py-2.5 justify-center items-center gap-2.5 rounded-full bg-[#4DA64D] shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] transition-transform hover:scale-105 active:scale-95">
            <div className="flex items-center gap-2.5">
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  d="M6.25821 14.5823H3.59154C3.46821 14.5819 3.36821 14.4819 3.36788 14.3586V5.00859C3.36821 4.88526 3.46821 4.78526 3.59154 4.78493H6.25821C6.73154 4.78493 7.11488 4.40159 7.11488 3.92826C7.11488 3.45493 6.73154 3.07159 6.25821 3.07159H3.59154C2.62488 3.07326 1.84654 3.85159 1.84488 4.81826V14.3586C1.84654 15.3253 2.62488 16.1036 3.59154 16.1053H6.25821C6.73154 16.1053 7.11488 15.7219 7.11488 15.2486C7.11488 14.7753 6.73154 14.3919 6.25821 14.3919V14.5823Z"
                  fill="white"
                />
                <path
                  d="M12.6915 10.6713L5.69821 10.6863L7.54488 8.83963C7.83154 8.55296 7.83154 8.08629 7.54488 7.79963C7.25821 7.51296 6.79154 7.51296 6.50488 7.79963L4.25821 10.0463C3.55488 10.7496 3.55488 11.8763 4.25821 12.5796L6.50488 14.8263C6.79154 15.1129 7.25821 15.1129 7.54488 14.8263C7.83154 14.5396 7.83154 14.0729 7.54488 13.7863L5.69821 11.9396L12.6915 11.9246C13.1648 11.9229 13.5465 11.5396 13.5448 11.0663C13.5432 10.5929 13.1598 10.2113 12.6865 10.2129L12.6915 10.6713Z"
                  fill="white"
                />
              </svg>
              <span className="text-white font-semibold text-sm lg:text-base font-poppins">
                Clock in
              </span>
            </div>
          </button>

          <div className="flex h-[100px] lg:h-[120px] p-4 lg:p-5 flex-col items-center gap-2.5 w-full rounded-[10px] bg-[rgba(77,166,77,0.2)]">
            <textarea
              value={notes.clockin}
              onChange={(e) => handleNoteChange("clockin", e.target.value)}
              placeholder="Write your note here"
              className="flex-1 w-full text-[#666] text-xs font-normal font-poppins resize-none bg-transparent border-none outline-none placeholder:text-[#666]"
            />
            <div className="flex items-center gap-2 w-full">
              <NotebookPen className="w-4 h-4 text-[#77838F] opacity-50 flex-shrink-0" />
              <span className="text-[#77838F] opacity-50 text-[11px] font-normal font-poppins">
                Note
              </span>
            </div>
          </div>
        </div>

        {/* Break */}
        <div className="flex flex-col items-center gap-4 w-full max-w-[280px] lg:w-[180px]">
          <button className="flex w-full lg:w-[150px] h-[44px] px-5 py-2.5 justify-center items-center gap-2.5 rounded-full bg-[#FFA501] shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] transition-transform hover:scale-105 active:scale-95">
            <div className="flex items-center gap-2.5">
              <svg
                width="21"
                height="23"
                viewBox="0 0 21 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  d="M17.3182 9.51303H16.8636V8.60394C16.8636 7.88062 16.5763 7.18693 16.0648 6.67546C15.5534 6.164 14.8597 5.87666 14.1364 5.87666H3.22727C2.50396 5.87666 1.81026 6.164 1.2988 6.67546C0.787337 7.18693 0.5 7.88062 0.5 8.60394V17.6948C0.501444 18.8999 0.980802 20.0553 1.83293 20.9074C2.68505 21.7595 3.84037 22.2389 5.04545 22.2403H12.3182C13.3656 22.239 14.3806 21.8766 15.192 21.2142C16.0035 20.5518 16.5617 19.6299 16.7727 18.6039C17.2315 18.6684 17.6987 18.6346 18.1434 18.505C18.5882 18.3754 19.0003 18.1529 19.3527 17.8521C19.705 17.5514 19.9895 17.1792 20.1872 16.7603C20.385 16.3414 20.4916 15.8853 20.5 15.4221V12.6948C20.5 11.851 20.1648 11.0417 19.5681 10.445C18.9714 9.84826 18.1621 9.51303 17.3182 9.51303ZM18.6818 15.4221C18.6717 15.639 18.6137 15.851 18.5121 16.043C18.4105 16.2349 18.2677 16.402 18.094 16.5323C17.9202 16.6626 17.7199 16.7528 17.5072 16.7967C17.2945 16.8405 17.0747 16.8368 16.8636 16.7858V11.3312C17.0747 11.2802 17.2945 11.2765 17.5072 11.3203C17.7199 11.3641 17.9202 11.4544 18.094 11.5847C18.2677 11.715 18.4105 11.8821 18.5121 12.074C18.6137 12.2659 18.6717 12.4779 18.6818 12.6948V15.4221ZM7.77273 3.14939V1.33121C7.77273 1.0901 7.86851 0.858873 8.03899 0.688386C8.20948 0.517898 8.44071 0.422119 8.68182 0.422119C8.92292 0.422119 9.15415 0.517898 9.32464 0.688386C9.49513 0.858873 9.59091 1.0901 9.59091 1.33121V3.14939C9.59091 3.3905 9.49513 3.62173 9.32464 3.79222C9.15415 3.9627 8.92292 4.05848 8.68182 4.05848C8.44071 4.05848 8.20948 3.9627 8.03899 3.79222C7.86851 3.62173 7.77273 3.3905 7.77273 3.14939ZM11.4091 3.14939V1.33121C11.4091 1.0901 11.5049 0.858873 11.6754 0.688386C11.8458 0.517898 12.0771 0.422119 12.3182 0.422119C12.5593 0.422119 12.7905 0.517898 12.961 0.688386C13.1315 0.858873 13.2273 1.0901 13.2273 1.33121V3.14939C13.2273 3.3905 13.1315 3.62173 12.961 3.79222C12.7905 3.9627 12.5593 4.05848 12.3182 4.05848C12.0771 4.05848 11.8458 3.9627 11.6754 3.79222C11.5049 3.62173 11.4091 3.3905 11.4091 3.14939ZM4.13636 3.14939V1.33121C4.13636 1.0901 4.23214 0.858873 4.40262 0.688386C4.57311 0.517898 4.80434 0.422119 5.04545 0.422119C5.28656 0.422119 5.51779 0.517898 5.68827 0.688386C5.85876 0.858873 5.95454 1.0901 5.95454 1.33121V3.14939C5.95454 3.3905 5.85876 3.62173 5.68827 3.79222C5.51779 3.9627 5.28656 4.05848 5.04545 4.05848C4.80434 4.05848 4.57311 3.9627 4.40262 3.79222C4.23214 3.62173 4.13636 3.3905 4.13636 3.14939Z"
                  fill="white"
                />
              </svg>
              <span className="text-white font-semibold text-sm lg:text-base font-poppins">
                Break
              </span>
            </div>
          </button>

          <div className="flex h-[100px] lg:h-[120px] p-4 lg:p-5 flex-col items-center gap-2.5 w-full rounded-[10px] bg-[rgba(255,165,1,0.2)]">
            <textarea
              value={notes.break}
              onChange={(e) => handleNoteChange("break", e.target.value)}
              placeholder="Write your note here"
              className="flex-1 w-full text-[#666] text-xs font-normal font-poppins resize-none bg-transparent border-none outline-none placeholder:text-[#666]"
            />
            <div className="flex items-center gap-2 w-full">
              <NotebookPen className="w-4 h-4 text-[#77838F] opacity-50 flex-shrink-0" />
              <span className="text-[#77838F] opacity-50 text-[11px] font-normal font-poppins">
                Note
              </span>
            </div>
          </div>
        </div>

        {/* Clock Out */}
        <div className="flex flex-col items-center gap-4 w-full max-w-[280px] lg:w-[180px]">
          <button className="flex w-full lg:w-[150px] h-[44px] px-5 py-2.5 justify-center items-center gap-2.5 rounded-full bg-[#FF6262] shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] transition-transform hover:scale-105 active:scale-95">
            <div className="flex items-center gap-2.5">
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-shrink-0"
              >
                <path
                  d="M2.50821 14.5823H6.17488C6.29821 14.5819 6.39821 14.4819 6.39854 14.3586V5.00859C6.39821 4.88526 6.29821 4.78526 6.17488 4.78493H2.50821C2.03488 4.78493 1.65154 4.40159 1.65154 3.92826C1.65154 3.45493 2.03488 3.07159 2.50821 3.07159H6.17488C7.14154 3.07326 7.91988 3.85159 7.92154 4.81826V14.3586C7.91988 15.3253 7.14154 16.1036 6.17488 16.1053H2.50821C2.03488 16.1053 1.65154 15.7219 1.65154 15.2486C1.65154 14.7753 2.03488 14.3919 2.50821 14.3919V14.5823Z"
                  fill="white"
                />
                <path
                  d="M6.07488 11.9396L13.0682 11.9246L11.2215 13.7713C10.9348 14.0579 10.9348 14.5246 11.2215 14.8113C11.5082 15.0979 11.9748 15.0979 12.2615 14.8113L14.5082 12.5646C15.2115 11.8613 15.2115 10.7346 14.5082 10.0313L12.2615 7.78463C11.9748 7.49796 11.5082 7.49796 11.2215 7.78463C10.9348 8.07129 10.9348 8.53796 11.2215 8.82463L13.0682 10.6713L6.07488 10.6863C5.60154 10.6879 5.21988 11.0713 5.22154 11.5446C5.22321 12.0179 5.60654 12.3996 6.07988 12.3979L6.07488 11.9396Z"
                  fill="white"
                />
              </svg>
              <span className="text-white font-semibold text-sm lg:text-base font-poppins">
                Clock out
              </span>
            </div>
          </button>

          <div className="flex h-[100px] lg:h-[120px] p-4 lg:p-5 flex-col items-center gap-2.5 w-full rounded-[10px] bg-[rgba(255,98,98,0.2)]">
            <textarea
              value={notes.clockout}
              onChange={(e) => handleNoteChange("clockout", e.target.value)}
              placeholder="Write your note here"
              className="flex-1 w-full text-[#666] text-xs font-normal font-poppins resize-none bg-transparent border-none outline-none placeholder:text-[#666]"
            />
            <div className="flex items-center gap-2 w-full">
              <NotebookPen className="w-4 h-4 text-[#77838F] opacity-50 flex-shrink-0" />
              <span className="text-[#77838F] opacity-50 text-[11px] font-normal font-poppins">
                Note
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeClockControl;
