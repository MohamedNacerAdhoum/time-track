import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ✅ Reusable Toggle Switch
function Toggle({ checked, onChange, className }: { checked: boolean; onChange: (checked: boolean) => void; className?: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-[25px] w-[42px] items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:ring-offset-2",
        checked ? "bg-[#63CDFA] border-[#71839B]" : "bg-[#E6EEF5] border-[#71839B]",
        className
      )}
    >
      <span
        className={cn(
          "absolute h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out",
          checked ? "translate-x-[18px]" : "translate-x-[2px]"
        )}
        style={{ filter: "drop-shadow(-4px 4px 12px rgba(0, 0, 0, 0.25))" }}
      />
    </button>
  );
}

// ✅ Custom Select with auto-positioning dropdown
function CustomSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (value: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate position on open
  const updatePosition = () => {
    if (!buttonRef.current || !dropdownRef.current) return;
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const dropdownHeight = options.length * 60; // Approximate height per option
    
    // If there's not enough space below but more space above, position dropdown above
    setPosition(spaceBelow < dropdownHeight && buttonRect.top > dropdownHeight ? 'top' : 'bottom');
  };

  // Update position when dropdown opens
  useEffect(() => {
    if (isOpen) {
      updatePosition();
      // Recalculate on window resize
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, [isOpen, options.length]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-[10px] bg-white px-5 py-5 text-left text-[19px] font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#63CDFA]"
      >
        <span>{value}</span>
        <ChevronDown className={cn("h-[30px] w-[30px] text-[#71839B] transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div 
          ref={dropdownRef}
          className={cn(
            "absolute left-0 right-0 rounded-[10px] bg-white shadow-lg border border-gray-200 z-50",
            position === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'
          )}
        >
          {options.map((opt, i) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={cn(
                "w-full px-5 py-5 text-left text-[19px] font-medium text-[#5F5F5F] hover:bg-gray-50",
                i === 0 && (position === 'bottom' ? 'rounded-t-[10px]' : 'rounded-b-[10px]'),
                i === options.length - 1 && (position === 'bottom' ? 'rounded-b-[10px]' : 'rounded-t-[10px]'),
                i < options.length - 1 && "border-b border-[#71839B]/20"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ✅ Settings Row
const SettingsItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between rounded-[10px] bg-white px-5 py-5">
    <span className="text-[19px] font-medium text-black">{label}</span>
    <div className="flex items-center gap-2">
      <div className="w-0 h-[29px] border-l border-[#EEEEEE]" />
      {children}
    </div>
  </div>
);

// ✅ Section Header
const SectionHeader = ({ title }: { title: string }) => (
  <div className="px-2.5 py-5">
    <h2 className="text-2xl font-bold text-black tracking-wide">{title}</h2>
  </div>
);

// ✅ Main Page
export default function SettingsPage() {
  const [notifications, setNotifications] = useState({ demands: true, attendanceClaims: false, complaints: false });
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [timeZone, setTimeZone] = useState("UTC + 01:00");

  return (
    <div className="w-full h-screen bg-white">
      <div className="max-w-[1130px] mx-auto py-5">
        <div className="rounded-[20px] bg-[#EEFAFF] p-10 space-y-5">
          <SectionHeader title="Notifications" />
          <SettingsItem label="Demands">
            <Toggle checked={notifications.demands} onChange={(v) => setNotifications({ ...notifications, demands: v })} />
          </SettingsItem>
          <SettingsItem label="Attendance claims">
            <Toggle checked={notifications.attendanceClaims} onChange={(v) => setNotifications({ ...notifications, attendanceClaims: v })} />
          </SettingsItem>
          <SettingsItem label="Complaints">
            <Toggle checked={notifications.complaints} onChange={(v) => setNotifications({ ...notifications, complaints: v })} />
          </SettingsItem>

          <SectionHeader title="Theme" />
          <SettingsItem label="Dark mode">
            <Toggle checked={darkMode} onChange={setDarkMode} />
          </SettingsItem>

          <SectionHeader title="Language" />
          <CustomSelect value={language} options={["English", "Arabic", "French"]} onChange={setLanguage} />

          <SectionHeader title="Time zone" />
          <CustomSelect value={timeZone} options={["UTC + 01:00", "UTC + 02:00", "UTC + 03:00", "UTC - 05:00"]} onChange={setTimeZone} />
        </div>
      </div>
    </div>
  );
}
