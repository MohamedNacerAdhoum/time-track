import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarPopup } from "./calendar-popup";

interface CalendarFieldProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  formatDate?: (date: Date) => string;
  children?: React.ReactNode;
  variant?: "default" | "profile";
}

function formatDateDefault(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function CalendarField({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
  formatDate = formatDateDefault,
  children,
  variant = "default",
}: CalendarFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Default field styles based on variant
  const getDefaultField = () => {
    if (variant === "profile") {
      return (
        <div className="relative">
          <input
            type="text"
            value={value ? formatDate(value) : ""}
            placeholder={placeholder}
            readOnly
            className="w-full px-3 py-2 rounded-lg border border-[#CCDFFF] bg-[#F2FBFF] text-[14px] text-[#7F7F7F] pr-10 focus:outline-none focus:ring-2 focus:ring-[#63CDFA] focus:border-transparent cursor-pointer"
            style={{ fontFamily: "IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif" }}
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#06B2FB]" />
        </div>
      );
    }

    return (
      <div
        className={cn(
          "flex items-center gap-5 px-8 py-4 rounded-2xl bg-gray-100 cursor-pointer select-none transition-colors",
          disabled && "opacity-50 cursor-not-allowed",
          "hover:bg-gray-200",
        )}
      >
        <span className="text-gray-500 font-semibold text-base">
          {value ? formatDate(value) : placeholder}
        </span>
        <Calendar className="h-6 w-6 text-gray-400" />
      </div>
    );
  };

  return (
    <div className={cn("relative", className)}>
      <div onClick={handleToggle}>
        {children || getDefaultField()}
      </div>

      <CalendarPopup
        value={value}
        onChange={onChange}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </div>
  );
}
