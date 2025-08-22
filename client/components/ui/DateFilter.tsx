import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Calendar } from "./Calendar";
import { cn } from "@/lib/utils";

interface DateFilterProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  showClearButton?: boolean;
}

function formatDate(date: Date): string {
  try {
    // Ensure we have a valid date
    if (!date || isNaN(date.getTime())) {
      return "Invalid Date";
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
}

export function DateFilter({
  value,
  onChange,
  placeholder = "Select date...",
  className,
  disabled = false,
  showClearButton = true,
}: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleDateChange = (date: Date) => {
    console.log("DateFilter: Date selected:", date);
    onChange(date);
    console.log("DateFilter: onChange called with:", date);
    handleClose(); // Close the calendar after selecting a date
  };

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    onChange(null);
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        fieldRef.current &&
        !fieldRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={fieldRef} className={cn("relative", className)}>
      <div
        onClick={handleToggle}
        className={cn(
          "flex items-center gap-5 px-8 py-4 rounded-2xl bg-gray-100 cursor-pointer select-none transition-colors",
          disabled && "opacity-50 cursor-not-allowed",
          "hover:bg-gray-200",
        )}
      >
        <span className="text-gray-500 font-semibold text-base">
          {value ? formatDate(value) : placeholder}
        </span>
        <CalendarIcon className="h-6 w-6 text-gray-400" />
      </div>

      {/* Clear button */}
      {showClearButton && value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
          title="Clear date filter"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <Calendar
        value={value}
        onChange={handleDateChange}
        isOpen={isOpen}
        onClose={handleClose}
        fieldRef={fieldRef}
      />
    </div>
  );
}
