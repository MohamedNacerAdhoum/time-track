import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface CalendarProps {
  value?: Date | null;
  onChange: (date: Date) => void;
  isOpen: boolean;
  onClose: () => void;
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

interface Position {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export function Calendar({
  value,
  onChange,
  isOpen,
  onClose,
  fieldRef,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>({});
  const [isPositioned, setIsPositioned] = useState(false);

  // Update currentMonth when value changes (to show the correct month when calendar opens)
  useEffect(() => {
    if (value && isOpen) {
      setCurrentMonth(value);
    }
  }, [value, isOpen]);

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

  // Calculate optimal position
  const calculatePosition = () => {
    if (!fieldRef?.current || !popupRef.current) return;

    const fieldRect = fieldRef.current.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();

    const popupWidth = popupRect.width || 320;
    const popupHeight = popupRect.height || 400;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const spaceBelow = viewportHeight - fieldRect.bottom;
    const spaceAbove = fieldRect.top;
    const spaceRight = viewportWidth - fieldRect.left;
    const spaceLeft = fieldRect.right;

    const margin = 8;
    let newPosition: Position = {};

    // Determine vertical position
    if (spaceBelow >= popupHeight + margin) {
      newPosition.top = fieldRect.bottom + scrollY + 8;
    } else if (spaceAbove >= popupHeight + margin) {
      newPosition.bottom = viewportHeight - fieldRect.top - scrollY + 8;
    } else {
      if (spaceBelow >= spaceAbove) {
        newPosition.top = fieldRect.bottom + scrollY + 8;
        newPosition.maxHeight = spaceBelow - margin;
      } else {
        newPosition.bottom = viewportHeight - fieldRect.top - scrollY + 8;
        newPosition.maxHeight = spaceAbove - margin;
      }
    }

    // Determine horizontal position
    if (spaceRight >= popupWidth + margin) {
      newPosition.left = fieldRect.left + scrollX;
    } else if (spaceLeft >= popupWidth + margin) {
      newPosition.right = viewportWidth - fieldRect.right - scrollX;
    } else {
      if (spaceRight >= spaceLeft) {
        newPosition.left = fieldRect.left + scrollX;
        newPosition.maxWidth = spaceRight - margin;
      } else {
        newPosition.right = viewportWidth - fieldRect.right - scrollX;
        newPosition.maxWidth = spaceLeft - margin;
      }
    }

    // Ensure popup doesn't go beyond viewport boundaries
    if (newPosition.left !== undefined) {
      newPosition.left = Math.max(
        margin,
        Math.min(newPosition.left, viewportWidth - popupWidth - margin),
      );
    }
    if (newPosition.top !== undefined) {
      newPosition.top = Math.max(
        margin,
        Math.min(newPosition.top, viewportHeight - popupHeight - margin),
      );
    }

    setPosition(newPosition);
    setIsPositioned(true);
  };

  // Calculate position when popup opens
  useEffect(() => {
    if (!isOpen) {
      setIsPositioned(false);
      return;
    }

    const timeoutId = setTimeout(calculatePosition, 0);

    const handleResize = () => calculatePosition();
    const handleScroll = () => calculatePosition();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  // Re-calculate position when month changes
  useEffect(() => {
    if (isOpen && isPositioned) {
      const timeoutId = setTimeout(calculatePosition, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [currentMonth, isOpen, isPositioned]);

  if (!isOpen) return null;

  const popupElement = (
    <div
      ref={popupRef}
      className={cn(
        "fixed bg-white rounded-3xl z-[100] p-10 w-80",
        isPositioned ? "opacity-100" : "opacity-0",
      )}
      style={{
        boxShadow: "-4px 4px 12px 0 rgba(0, 0, 0, 0.25)",
        ...position,
        ...(position.maxHeight && {
          overflowY: "auto",
          height: `${Math.min(400, position.maxHeight)}px`,
        }),
        ...(position.maxWidth && {
          width: `${Math.min(320, position.maxWidth)}px`,
        }),
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
            <div key={day} className="flex items-center justify-center w-8 h-8">
              <span className="text-xs text-gray-400 font-normal">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-3">{renderCalendar()}</div>
      </div>
    </div>
  );

  return createPortal(popupElement, document.body);
}
