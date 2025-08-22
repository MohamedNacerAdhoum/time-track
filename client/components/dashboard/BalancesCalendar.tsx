import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  hasWorked?: boolean;
  workStatus?: "worked" | "absent" | "future";
  paymentAmount?: number;
  workedHours?: string;
  isFilled?: boolean;
  isSelected?: boolean;
}

interface BalancesCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  workData?: Record<
    string,
    {
      worked: boolean;
      status: "worked" | "absent" | "future";
      amount: number;
      hours: string;
    }
  >;
}

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const generateCalendarData = (date: Date, workData?: any): CalendarDay[] => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = (firstDay.getDay() + 6) % 7; // Adjust for Monday start

  const calendar: CalendarDay[] = [];

  // Previous month days
  const prevMonth = new Date(year, month, 0);
  const daysInPrevMonth = prevMonth.getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    calendar.push({
      date: daysInPrevMonth - i,
      isCurrentMonth: false,
    });
  }

  // Current month days
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const dayKey = `${year}-${month + 1}-${day}`;
    const dayData = workData?.[dayKey];
    const currentDate = new Date(year, month, day);
    const isToday = currentDate.toDateString() === today.toDateString();
    const isFuture = currentDate > today;

    calendar.push({
      date: day,
      isCurrentMonth: true,
      hasWorked: dayData?.worked || false,
      workStatus: isFuture ? "future" : dayData?.status || "absent",
      paymentAmount: dayData?.amount || 0,
      workedHours: dayData?.hours || "",
      isFilled: day === 25, // Example: day 25 is filled/completed
      isSelected: isToday,
    });
  }

  // Next month days
  const totalCells = 42; // 6 weeks
  const remainingCells = totalCells - calendar.length;
  for (let day = 1; day <= remainingCells; day++) {
    calendar.push({
      date: day,
      isCurrentMonth: false,
    });
  }

  return calendar;
};

export function BalancesCalendar({
  selectedDate,
  onDateSelect,
  workData,
}: BalancesCalendarProps) {
  const [currentDate, setCurrentDate] = useState(
    selectedDate || new Date(2023, 3, 1),
  ); // April 2023

  const calendarData = generateCalendarData(currentDate, workData);

  const goToPrevMonth = () => {
    const prev = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    setCurrentDate(prev);
  };

  const goToNextMonth = () => {
    const next = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    );
    setCurrentDate(next);
  };

  const handleDateClick = (day: CalendarDay) => {
    if (day.isCurrentMonth && onDateSelect) {
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day.date,
      );
      onDateSelect(newDate);
    }
  };

  const getDayStyles = (day: CalendarDay) => {
    if (!day.isCurrentMonth) {
      return "text-[#BDBDBD]";
    }

    const baseStyles =
      "w-11 h-11 flex items-center justify-center text-[17px] font-normal rounded-full transition-colors cursor-pointer";

    // Future dates with blue background
    if (day.workStatus === "future" && day.date === 26) {
      return cn(baseStyles, "bg-[#63CDFA] text-white");
    }

    // Filled/completed work day (green background)
    if (day.isFilled) {
      return cn(baseStyles, "bg-[#56C992] text-white");
    }

    // Days with work status borders
    if (day.workStatus === "worked") {
      return cn(
        baseStyles,
        "border-2 border-[#56C992] text-black bg-white hover:bg-gray-50",
      );
    }

    if (day.workStatus === "absent") {
      return cn(
        baseStyles,
        "border-2 border-[#FFA501] text-black bg-white hover:bg-gray-50",
      );
    }

    // Selected date border
    if (day.isSelected) {
      return cn(
        baseStyles,
        "border-[2.7px] border-[#63CDFA] text-[#333] bg-white",
      );
    }

    // Regular current month days
    return cn(baseStyles, "text-[#333] hover:bg-gray-100");
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 w-full max-w-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7 hover:bg-gray-100"
          onClick={goToPrevMonth}
        >
          <ChevronLeft className="w-5 h-5 text-black" />
        </Button>

        <h3 className="text-xl font-semibold text-black font-roboto">
          {currentDate.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <Button
          variant="ghost"
          size="icon"
          className="w-7 h-7 hover:bg-gray-100"
          onClick={goToNextMonth}
        >
          <ChevronRight className="w-5 h-5 text-black" />
        </Button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center py-2">
            <span className="text-[15px] font-normal text-[#BDBDBD] font-roboto">
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-4">
        {calendarData.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <button
              className={getDayStyles(day)}
              onClick={() => handleDateClick(day)}
              disabled={!day.isCurrentMonth}
            >
              <span className="font-roboto">{day.date}</span>
            </button>

            {/* Event indicator for day 1 */}
            {day.date === 1 && day.isCurrentMonth && (
              <div className="w-1 h-1 rounded-full bg-[#016EED]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
