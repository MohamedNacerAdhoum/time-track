import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom Switch component matching the design
interface CustomSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

function CustomSwitch({ checked, onChange, className }: CustomSwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-[25px] w-[42px] items-center rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:ring-offset-2",
        checked 
          ? "bg-[#63CDFA] border-[#71839B]" 
          : "bg-[#E6EEF5] border-[#71839B]",
        className
      )}
    >
      <div
        className={cn(
          "absolute h-5 w-5 rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out",
          checked ? "translate-x-[20px]" : "translate-x-[2px]"
        )}
        style={{
          filter: "drop-shadow(-4px 4px 12px rgba(0, 0, 0, 0.25))"
        }}
      />
    </button>
  );
}

// Custom Select component matching the design
interface CustomSelectProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
}

function CustomSelect({ value, options, onChange, className }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-[10px] bg-white px-5 py-5 text-left text-[19px] font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#63CDFA]"
      >
        <span>{value}</span>
        <ChevronDown 
          className={cn(
            "h-[30px] w-[30px] text-[#71839B] transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 rounded-[10px] bg-white shadow-lg border border-gray-200 z-50">
          {options.map((option, index) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full items-center px-5 py-5 text-left text-[19px] font-medium text-[#5F5F5F] hover:bg-gray-50 focus:bg-gray-50 focus:outline-none",
                index === 0 && "rounded-t-[10px]",
                index === options.length - 1 && "rounded-b-[10px]",
                index < options.length - 1 && "border-b border-[#71839B]/20"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Settings Item Component
interface SettingsItemProps {
  label: string;
  children: React.ReactNode;
}

function SettingsItem({ label, children }: SettingsItemProps) {
  return (
    <div className="flex items-center justify-between rounded-[10px] bg-white px-5 py-5">
      <span className="text-[19px] font-medium text-black">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-0 h-[29px] border-l border-[#EEEEEE]" />
        {children}
      </div>
    </div>
  );
}

// Section Header Component
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="px-2.5 py-5">
      <h2 className="text-2xl font-semibold text-black tracking-wide">{title}</h2>
    </div>
  );
}

export default function SettingsPage() {
  // State for notification toggles
  const [notifications, setNotifications] = useState({
    demands: true,
    attendanceClaims: false,
    complaints: false,
  });

  // State for theme toggle
  const [darkMode, setDarkMode] = useState(false);

  // State for dropdowns
  const [language, setLanguage] = useState("English");
  const [timeZone, setTimeZone] = useState("UTC + 01:00");

  const languageOptions = ["English", "Arabic", "French"];
  const timeZoneOptions = ["UTC + 01:00", "UTC + 02:00", "UTC + 03:00", "UTC - 05:00"];

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Main Content */}
      <div className="max-w-[1130px] mx-auto px-8 py-10">
        {/* Settings Container */}
        <div className="rounded-[20px] bg-[#EEFAFF] p-10 space-y-5">
          
          {/* Notifications Section */}
          <SectionHeader title="Notifications" />
          
          <SettingsItem label="Demands">
            <CustomSwitch 
              checked={notifications.demands}
              onChange={(checked) => setNotifications(prev => ({ ...prev, demands: checked }))}
            />
          </SettingsItem>

          <SettingsItem label="Attendance claims">
            <CustomSwitch 
              checked={notifications.attendanceClaims}
              onChange={(checked) => setNotifications(prev => ({ ...prev, attendanceClaims: checked }))}
            />
          </SettingsItem>

          <SettingsItem label="Complaints">
            <CustomSwitch 
              checked={notifications.complaints}
              onChange={(checked) => setNotifications(prev => ({ ...prev, complaints: checked }))}
            />
          </SettingsItem>

          {/* Theme Section */}
          <SectionHeader title="Theme" />
          
          <SettingsItem label="Dark mode">
            <CustomSwitch 
              checked={darkMode}
              onChange={setDarkMode}
            />
          </SettingsItem>

          {/* Language Section */}
          <SectionHeader title="Language" />
          
          <div className="space-y-2.5">
            <CustomSelect
              value={language}
              options={languageOptions}
              onChange={setLanguage}
            />
          </div>

          {/* Time Zone Section */}
          <SectionHeader title="Time zone" />
          
          <CustomSelect
            value={timeZone}
            options={timeZoneOptions}
            onChange={setTimeZone}
          />
        </div>
      </div>
    </div>
  );
}
