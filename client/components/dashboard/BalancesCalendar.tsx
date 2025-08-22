import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  hasEvent: boolean;
  eventType?: "worked" | "not-worked" | "future" | "today";
  isSelected?: boolean;
}

interface BalancesCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function BalancesCalendar({
  selectedDate = new Date(),
  onDateSelect,
  className
}: BalancesCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  const generateCalendarData = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start

    const days: CalendarDay[] = [];
    
    // Previous month trailing days
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = adjustedFirstDay - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        hasEvent: false,
      });
    }

    // Current month days with mock data patterns
    for (let day = 1; day <= daysInMonth; day++) {
      const today = new Date();
      const isToday = day === today.getDate() && 
                     month === today.getMonth() && 
                     year === today.getFullYear();
      const isSelected = day === selectedDate.getDate() && 
                        month === selectedDate.getMonth() && 
                        year === selectedDate.getFullYear();
      
      // Mock work patterns - some days worked, some didn't, future dates
      let eventType: "worked" | "not-worked" | "future" | "today" = "worked";
      let hasEvent = true;
      
      if (isToday) {
        eventType = "today";
      } else if (day > today.getDate() && month >= today.getMonth() && year >= today.getFullYear()) {
        eventType = "future";
        hasEvent = false;
      } else if ([4, 11, 13, 19, 22].includes(day)) {
        eventType = "not-worked";
      } else if (day <= today.getDate()) {
        eventType = "worked";
      } else {
        eventType = "future";
        hasEvent = false;
      }
      
      days.push({
        date: day,
        isCurrentMonth: true,
        hasEvent,
        eventType,
        isSelected,
      });
    }

    // Next month leading days
    const totalCells = 42; // 6 weeks
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        hasEvent: false,
      });
    }

    return days;
  };

  const calendarData = generateCalendarData(currentDate);

  const goToPrevMonth = () => {
    const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(prev);
  };

  const goToNextMonth = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(next);
  };

  const handleDateClick = (day: CalendarDay) => {
    if (!day.isCurrentMonth) return;
    
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date);
    if (onDateSelect) {
      onDateSelect(newDate);
    }
  };

  const getDayButtonStyle = (day: CalendarDay) => {
    if (!day.isCurrentMonth) {
      return "text-[#BDBDBD] cursor-default";
    }

    let baseStyle = "w-10 h-10 flex items-center justify-center text-sm font-normal rounded-full transition-colors cursor-pointer ";
    
    if (day.isSelected) {
      return baseStyle + "bg-[#63CDFA] text-white";
    }
    
    if (day.eventType === "today") {
      return baseStyle + "bg-[#63CDFA] text-white";
    }
    
    if (day.hasEvent) {
      switch (day.eventType) {
        case "worked":
          return baseStyle + "border-2 border-green-400 text-[#333] hover:bg-green-50";
        case "not-worked":
          return baseStyle + "border-2 border-yellow-400 text-[#333] hover:bg-yellow-50";
        default:
          return baseStyle + "text-[#333] hover:bg-gray-100";
      }
    }
    
    return baseStyle + "text-[#333] hover:bg-gray-100";
  };

  return (
    <div className={`bg-white rounded-xl p-6 lg:p-10 w-full max-w-[500px] ${className || ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={goToPrevMonth}>
          <ChevronLeft className="w-5 h-5 text-black" />
        </Button>
        <h3 className="text-lg lg:text-xl font-semibold text-black">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h3>
        <Button variant="ghost" size="icon" className="w-7 h-7" onClick={goToNextMonth}>
          <ChevronRight className="w-5 h-5 text-black" />
        </Button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-2 lg:gap-4 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center py-2">
            <span className="text-sm font-normal text-[#BDBDBD]">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 lg:gap-4">
        {calendarData.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <button
              className={getDayButtonStyle(day)}
              onClick={() => handleDateClick(day)}
              disabled={!day.isCurrentMonth}
            >
              {day.date}
            </button>
            {day.hasEvent && day.isCurrentMonth && day.date === 1 && (
              <div className="w-1 h-1 rounded-full bg-[#016EED]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
