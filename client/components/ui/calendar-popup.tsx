import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createPortal } from "react-dom";
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

interface Position {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  maxWidth?: number;
  maxHeight?: number;
}

export function CalendarPopup({
  value,
  onChange,
  isOpen,
  onClose,
  className,
  initialMonth,
  fieldRef,
}: CalendarPopupProps) {
  const [currentMonth, setCurrentMonth] = useState(
    initialMonth || value || new Date(),
  );
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position>({});
  const [isPositioned, setIsPositioned] = useState(false);

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

  // Calculate optimal position with smart viewport-aware positioning
  const calculatePosition = () => {
    if (!fieldRef?.current || !popupRef.current) return;

    const fieldRect = fieldRef.current.getBoundingClientRect();
    const popupRect = popupRef.current.getBoundingClientRect();

    // Get actual popup dimensions instead of estimates
    const popupWidth = popupRect.width || 320; // fallback to estimated width
    const popupHeight = popupRect.height || 400; // fallback to estimated height

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Calculate available space in all directions relative to viewport
    const spaceBelow = viewportHeight - fieldRect.bottom;
    const spaceAbove = fieldRect.top;
    const spaceRight = viewportWidth - fieldRect.left;
    const spaceLeft = fieldRect.right;

    const margin = 8; // 8px margin from viewport edges
    let newPosition: Position = {};

    // Determine vertical position
    if (spaceBelow >= popupHeight + margin) {
      // Enough space below - position below the field
      newPosition.top = fieldRect.bottom + scrollY + 8;
    } else if (spaceAbove >= popupHeight + margin) {
      // Not enough space below but enough above - position above the field
      newPosition.bottom = viewportHeight - fieldRect.top - scrollY + 8;
    } else {
      // Not enough space in either direction - choose the side with more space
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
      // Enough space on the right - align to left edge of field
      newPosition.left = fieldRect.left + scrollX;
    } else if (spaceLeft >= popupWidth + margin) {
      // Not enough space on right but enough on left - align to right edge of field
      newPosition.right = viewportWidth - fieldRect.right - scrollX;
    } else {
      // Not enough space on either side - position to fit in viewport
      if (spaceRight >= spaceLeft) {
        // More space on right
        newPosition.left = fieldRect.left + scrollX;
        newPosition.maxWidth = spaceRight - margin;
      } else {
        // More space on left
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

  // Calculate position when popup opens or on resize/scroll
  useEffect(() => {
    if (!isOpen) {
      setIsPositioned(false);
      return;
    }

    // Initial calculation after popup is rendered
    const timeoutId = setTimeout(calculatePosition, 0);

    // Recalculate on window resize or scroll
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

  // Re-calculate position when popup content changes (month navigation)
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
        // Hide initially until positioned to prevent flash
        isPositioned ? "opacity-100" : "opacity-0",
        className,
      )}
      style={{
        boxShadow: "-4px 4px 12px 0 rgba(0, 0, 0, 0.25)",
        ...position,
        // Ensure content is scrollable if height is constrained
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

  // Render popup in a portal to avoid container clipping
  return createPortal(popupElement, document.body);
}
