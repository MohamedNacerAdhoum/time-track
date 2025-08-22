import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarPopupProps {
  value?: Date;
  onChange: (date: Date) => void;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  initialMonth?: Date;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function CalendarPopup({
  value,
  onChange,
  isOpen,
  onClose,
  className,
  initialMonth,
}: CalendarPopupProps) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth || value || new Date());

  const handleDateSelect = (date: Date) => {
    onChange(date);
    onClose();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Convert Sunday (0) to 6, Monday becomes 0
  };

  const getPrevMonthDays = (date: Date) => {
    const prevMonth = new Date(date.getFullYear(), date.getMonth() - 1, 0);
    return prevMonth.getDate();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const prevMonthDays = getPrevMonthDays(currentMonth);

    const days: React.ReactNode[] = [];

    // Previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push(
        <div
          key={`prev-${day}`}
          className="flex items-center justify-center w-8 h-8 text-gray-400 text-xs"
        >
          {day}
        </div>,
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day,
      );
      const isSelected =
        value &&
        value.getDate() === day &&
        value.getMonth() === currentMonth.getMonth() &&
        value.getFullYear() === currentMonth.getFullYear();

      // Sample highlight days (you can customize this logic)
      const hasEvent = day === 1 || day === 12;

      days.push(
        <div key={day} className="flex flex-col items-center gap-0.5">
          <button
            onClick={() => handleDateSelect(date)}
            className={cn(
              "flex items-center justify-center w-8 h-8 text-xs font-normal rounded-full transition-colors",
              isSelected
                ? "bg-[#63CDFA] text-white"
                : "text-gray-700 hover:bg-gray-100",
            )}
          >
            {day}
          </button>
          {hasEvent && !isSelected && (
            <div
              className={cn(
                "w-0.5 h-0.5 rounded-full",
                day === 1 ? "bg-blue-600" : "bg-[#63CDFA]",
              )}
            />
          )}
        </div>,
      );
    }

    // Next month's leading days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDay + daysInMonth);

    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="flex items-center justify-center w-8 h-8 text-gray-400 text-xs"
        >
          {day}
        </div>,
      );
    }

    return days;
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute top-full right-0 mt-2 bg-white rounded-3xl z-50 p-10 w-80",
        className
      )}
      style={{ boxShadow: "-4px 4px 12px 0 rgba(0, 0, 0, 0.25)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>

        <h3 className="text-sm font-semibold text-gray-900">
          {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>

        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-1.5">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-3 mb-2">
          {DAYS.map((day) => (
            <div
              key={day}
              className="flex items-center justify-center w-8 h-8"
            >
              <span className="text-xs text-gray-400 font-normal">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-3">{renderCalendar()}</div>
      </div>
    </div>
  );
}
