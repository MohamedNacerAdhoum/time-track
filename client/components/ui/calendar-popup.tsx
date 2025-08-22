import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarPopupProps {
  value?: Date;
  onChange: (date: Date) => void;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  initialMonth?: Date;
  fieldRef?: React.RefObject<HTMLDivElement>;
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
  fieldRef,
}: CalendarPopupProps) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth || value || new Date());
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: '100%', left: 'auto', right: '0', bottom: 'auto' });

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

  // Calculate optimal position based on viewport and modal boundaries
  useEffect(() => {
    if (!isOpen || !fieldRef?.current || !popupRef.current) return;

    const fieldRect = fieldRef.current.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calendar popup dimensions (approximately)
    const popupWidth = 320; // 80 * 4 (w-80)
    const popupHeight = 400; // approximate height

    // Find the closest modal container
    let modalContainer = fieldRef.current.closest('[role="dialog"]') ||
                        fieldRef.current.closest('.fixed.inset-0') ||
                        fieldRef.current.closest('.modal') ||
                        document.body;

    const modalRect = modalContainer === document.body ?
      { top: 0, left: 0, right: viewportWidth, bottom: viewportHeight, width: viewportWidth, height: viewportHeight } :
      modalContainer.getBoundingClientRect();

    let newPosition = {
      top: 'auto' as string,
      left: 'auto' as string,
      right: 'auto' as string,
      bottom: 'auto' as string
    };

    // Determine horizontal position
    const spaceOnRight = modalRect.right - fieldRect.right;
    const spaceOnLeft = fieldRect.left - modalRect.left;

    if (spaceOnRight >= popupWidth) {
      // Enough space on the right, align to right edge of field
      newPosition.right = '0';
    } else if (spaceOnLeft >= popupWidth) {
      // Not enough space on right, align to left edge of field
      newPosition.left = '0';
    } else {
      // Not enough space on either side, center within available space
      const availableWidth = modalRect.width;
      const leftOffset = Math.max(0, (availableWidth - popupWidth) / 2 - (fieldRect.left - modalRect.left));
      newPosition.left = `${leftOffset}px`;
    }

    // Determine vertical position
    const spaceBelow = modalRect.bottom - fieldRect.bottom;
    const spaceAbove = fieldRect.top - modalRect.top;

    if (spaceBelow >= popupHeight) {
      // Enough space below
      newPosition.top = '100%';
    } else if (spaceAbove >= popupHeight) {
      // Not enough space below, show above
      newPosition.bottom = '100%';
    } else {
      // Not enough space above or below, position to fit in available space
      if (spaceBelow > spaceAbove) {
        newPosition.top = '100%';
      } else {
        newPosition.bottom = '100%';
      }
    }

    setPosition(newPosition);
  }, [isOpen, fieldRef]);

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className={cn(
        "absolute mt-2 bg-white rounded-3xl z-[100] p-10 w-80 max-h-[400px] overflow-hidden",
        className
      )}
      style={{
        boxShadow: "-4px 4px 12px 0 rgba(0, 0, 0, 0.25)",
        top: position.top,
        left: position.left,
        right: position.right,
        bottom: position.bottom
      }}
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
