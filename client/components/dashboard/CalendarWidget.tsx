import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import '@syncfusion/ej2-base/styles/material.css'; // Required core styles

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const generateCalendarData = (date: Date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const startDay = (startOfMonth.getDay() + 6) % 7; // Adjust for MON-SUN start
  const calendar: any[] = [];

  const prevMonth = new Date(date.getFullYear(), date.getMonth(), 0);
  const daysInPrevMonth = prevMonth.getDate();

  for (let i = startDay - 1; i >= 0; i--) {
    calendar.push({
      date: daysInPrevMonth - i,
      isCurrentMonth: false,
      hasEvent: false
    });
  }

  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    calendar.push({
      date: i,
      isCurrentMonth: true,
      hasEvent: [1, 12].includes(i), // mock event days
      eventType: i === 1 ? 'primary' : 'secondary',
      isSelected: i === date.getDate()
    });
  }

  const totalCells = 42; // 6 weeks
  let extra = totalCells - calendar.length;
  for (let i = 1; i <= extra; i++) {
    calendar.push({
      date: i,
      isCurrentMonth: false,
      hasEvent: false
    });
  }

  return calendar;
};

export function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState(generateCalendarData(new Date()));

  const goToPrevMonth = () => {
    const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(prev);
    setCalendarData(generateCalendarData(prev));
  };

  const goToNextMonth = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(next);
    setCalendarData(generateCalendarData(next));
  };

  return (
    <div className="bg-white rounded-xl p-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button size="icon" variant="ghost" className="w-6 h-6" onClick={goToPrevMonth}>
          <ChevronLeft className="w-4 h-4 text-black" />
        </Button>

        <h3 className="text-base font-semibold text-black tracking-tight">
          {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
        </h3>

        <Button size="icon" variant="ghost" className="w-6 h-6" onClick={goToNextMonth}>
          <ChevronRight className="w-4 h-4 text-black" />
        </Button>
      </div>

      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-3 mb-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center py-2">
            <span className="text-xs font-normal text-[#BDBDBD] tracking-tight">
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-3">
        {calendarData.map((item, index) => (
          <div key={index} className="relative flex flex-col items-center">
            <button
              className={`
                w-8 h-8 flex items-center justify-center text-sm font-normal tracking-tight
                ${new Date().getDate() === item.date &&
                  item.isCurrentMonth &&
                  new Date().getMonth() === currentDate.getMonth() &&
                  new Date().getFullYear() === currentDate.getFullYear()
                  ? 'bg-[#63CDFA] text-white rounded-full'
                  : item.isCurrentMonth
                    ? 'text-[#333] hover:bg-gray-100 rounded-lg'
                    : 'text-[#BDBDBD]'
                }               
              `}
            >
              {item.date}
            </button>

            {item.hasEvent && (
              <div className="mt-0.5">
                <div
                  className={`w-1 h-1 rounded-full ${item.eventType === 'primary' ? 'bg-[#016EED]' : 'bg-[#63CDFA]'
                    }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
