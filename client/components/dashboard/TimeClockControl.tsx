import { useState } from "react";
import { Clock, Calendar, NotebookPen } from "lucide-react";

const TimeClockControl = () => {
  const [notes, setNotes] = useState({
    clockin: "",
    break: "",
    clockout: "",
  });

  const handleNoteChange = (type: 'clockin' | 'break' | 'clockout', value: string) => {
    setNotes(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-start gap-8 md:gap-15 p-2 md:p-9">
      {/* Clock In */}
      <div className="flex flex-col items-center gap-5 w-full max-w-[180px] mx-auto md:mx-0">
        <button className="flex w-[150px] h-[44px] px-5 py-2.5 justify-center items-center gap-2.5 rounded-[100px] bg-clockin shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] transition-transform hover:scale-105 active:scale-95">
          <div className="flex items-center gap-2.5">
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.25821 14.5823H3.59154C3.46821 14.5819 3.36821 14.4819 3.36788 14.3586V5.00859C3.36821 4.88526 3.46821 4.78526 3.59154 4.78493H6.25821C6.73154 4.78493 7.11488 4.40159 7.11488 3.92826C7.11488 3.45493 6.73154 3.07159 6.25821 3.07159H3.59154C2.62488 3.07326 1.84654 3.85159 1.84488 4.81826V14.3586C1.84654 15.3253 2.62488 16.1036 3.59154 16.1053H6.25821C6.73154 16.1053 7.11488 15.7219 7.11488 15.2486C7.11488 14.7753 6.73154 14.3919 6.25821 14.3919V14.5823Z" fill="white"/>
              <path d="M12.6915 10.6713L5.69821 10.6863L7.54488 8.83963C7.83154 8.55296 7.83154 8.08629 7.54488 7.79963C7.25821 7.51296 6.79154 7.51296 6.50488 7.79963L4.25821 10.0463C3.55488 10.7496 3.55488 11.8763 4.25821 12.5796L6.50488 14.8263C6.79154 15.1129 7.25821 15.1129 7.54488 14.8263C7.83154 14.5396 7.83154 14.0729 7.54488 13.7863L5.69821 11.9396L12.6915 11.9246C13.1648 11.9229 13.5465 11.5396 13.5448 11.0663C13.5432 10.5929 13.1598 10.2113 12.6865 10.2129L12.6915 10.6713Z" fill="white"/>
            </svg>
            <span className="text-white font-semibold text-base">Clock in</span>
          </div>
        </button>
        
        <div className="flex h-[120px] p-5 flex-col items-center gap-2.5 self-stretch rounded-[10px] bg-clockin-light">
          <textarea
            value={notes.clockin}
            onChange={(e) => handleNoteChange('clockin', e.target.value)}
            placeholder="Write your note here"
            className="flex-1 self-stretch text-[#666] text-xs font-normal resize-none bg-transparent border-none outline-none placeholder:text-[#666]"
          />
          <div className="flex items-center gap-2 self-stretch">
            <NotebookPen className="w-4 h-4 text-[#77838F] opacity-50" />
            <span className="text-[#77838F] opacity-50 text-[11px] font-normal">Note</span>
          </div>
        </div>
      </div>

      {/* Break */}
      <div className="flex flex-col items-center gap-5 w-full max-w-[180px] mx-auto md:mx-0">
        <button className="flex w-[150px] h-[44px] px-5 py-2.5 justify-center items-center gap-2.5 rounded-[100px] bg-clockbreak shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] transition-transform hover:scale-105 active:scale-95">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-white" />
            <span className="text-white font-semibold text-base">Break</span>
          </div>
        </button>
        
        <div className="flex h-[120px] p-5 flex-col items-center gap-2.5 self-stretch rounded-[10px] bg-clockbreak-light">
          <textarea
            value={notes.break}
            onChange={(e) => handleNoteChange('break', e.target.value)}
            placeholder="Write your note here"
            className="flex-1 self-stretch text-[#666] text-xs font-normal resize-none bg-transparent border-none outline-none placeholder:text-[#666]"
          />
          <div className="flex items-center gap-2 self-stretch">
            <NotebookPen className="w-4 h-4 text-[#77838F] opacity-50" />
            <span className="text-[#77838F] opacity-50 text-[11px] font-normal">Note</span>
          </div>
        </div>
      </div>

      {/* Clock Out */}
      <div className="flex flex-col items-center gap-5 w-full max-w-[180px] mx-auto md:mx-0">
        <button className="flex w-[150px] h-[44px] px-5 py-2.5 justify-center items-center gap-2.5 rounded-[100px] bg-clockout shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] transition-transform hover:scale-105 active:scale-95">
          <div className="flex items-center gap-2.5">
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.50821 14.5823H6.17488C6.29821 14.5819 6.39821 14.4819 6.39854 14.3586V5.00859C6.39821 4.88526 6.29821 4.78526 6.17488 4.78493H2.50821C2.03488 4.78493 1.65154 4.40159 1.65154 3.92826C1.65154 3.45493 2.03488 3.07159 2.50821 3.07159H6.17488C7.14154 3.07326 7.91988 3.85159 7.92154 4.81826V14.3586C7.91988 15.3253 7.14154 16.1036 6.17488 16.1053H2.50821C2.03488 16.1053 1.65154 15.7219 1.65154 15.2486C1.65154 14.7753 2.03488 14.3919 2.50821 14.3919V14.5823Z" fill="white"/>
              <path d="M6.07488 11.9396L13.0682 11.9246L11.2215 13.7713C10.9348 14.0579 10.9348 14.5246 11.2215 14.8113C11.5082 15.0979 11.9748 15.0979 12.2615 14.8113L14.5082 12.5646C15.2115 11.8613 15.2115 10.7346 14.5082 10.0313L12.2615 7.78463C11.9748 7.49796 11.5082 7.49796 11.2215 7.78463C10.9348 8.07129 10.9348 8.53796 11.2215 8.82463L13.0682 10.6713L6.07488 10.6863C5.60154 10.6879 5.21988 11.0713 5.22154 11.5446C5.22321 12.0179 5.60654 12.3996 6.07988 12.3979L6.07488 11.9396Z" fill="white"/>
            </svg>
            <span className="text-white font-semibold text-base">Clock out</span>
          </div>
        </button>
        
        <div className="flex h-[120px] p-5 flex-col items-center gap-2.5 self-stretch rounded-[10px] bg-clockout-light">
          <textarea
            value={notes.clockout}
            onChange={(e) => handleNoteChange('clockout', e.target.value)}
            placeholder="Write your note here"
            className="flex-1 self-stretch text-[#666] text-xs font-normal resize-none bg-transparent border-none outline-none placeholder:text-[#666]"
          />
          <div className="flex items-center gap-2 self-stretch">
            <NotebookPen className="w-4 h-4 text-[#77838F] opacity-50" />
            <span className="text-[#77838F] opacity-50 text-[11px] font-normal">Note</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeClockControl;
