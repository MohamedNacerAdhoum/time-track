import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const calendarData = [
  // Previous month days (grayed out)
  { date: 27, isCurrentMonth: false, hasEvent: false },
  { date: 28, isCurrentMonth: false, hasEvent: false },
  { date: 29, isCurrentMonth: false, hasEvent: false },
  { date: 30, isCurrentMonth: false, hasEvent: false },
  { date: 31, isCurrentMonth: false, hasEvent: false },
  { date: 1, isCurrentMonth: true, hasEvent: true, eventType: "primary" },
  { date: 2, isCurrentMonth: true, hasEvent: false },
  
  // Week 2
  { date: 3, isCurrentMonth: true, hasEvent: false },
  { date: 4, isCurrentMonth: true, hasEvent: false },
  { date: 5, isCurrentMonth: true, hasEvent: false },
  { date: 6, isCurrentMonth: true, hasEvent: false },
  { date: 7, isCurrentMonth: true, hasEvent: false },
  { date: 8, isCurrentMonth: true, hasEvent: false },
  { date: 9, isCurrentMonth: true, hasEvent: false },
  
  // Week 3
  { date: 10, isCurrentMonth: true, hasEvent: false },
  { date: 11, isCurrentMonth: true, hasEvent: false },
  { date: 12, isCurrentMonth: true, hasEvent: true, eventType: "secondary" },
  { date: 13, isCurrentMonth: true, hasEvent: false },
  { date: 14, isCurrentMonth: true, hasEvent: false },
  { date: 15, isCurrentMonth: true, hasEvent: false },
  { date: 16, isCurrentMonth: true, hasEvent: false },
  
  // Week 4
  { date: 17, isCurrentMonth: true, hasEvent: false },
  { date: 18, isCurrentMonth: true, hasEvent: false },
  { date: 19, isCurrentMonth: true, hasEvent: false },
  { date: 20, isCurrentMonth: true, hasEvent: false },
  { date: 21, isCurrentMonth: true, hasEvent: false },
  { date: 22, isCurrentMonth: true, hasEvent: false },
  { date: 23, isCurrentMonth: true, hasEvent: false },
  
  // Week 5
  { date: 24, isCurrentMonth: true, hasEvent: false },
  { date: 25, isCurrentMonth: true, hasEvent: false, isSelected: true },
  { date: 26, isCurrentMonth: true, hasEvent: false },
  { date: 27, isCurrentMonth: true, hasEvent: false },
  { date: 28, isCurrentMonth: true, hasEvent: false },
  { date: 29, isCurrentMonth: true, hasEvent: false },
  { date: 30, isCurrentMonth: true, hasEvent: false },
];

const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function CalendarWidget() {
  return (
    <div className="bg-white rounded-xl p-12">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button size="icon" variant="ghost" className="w-6 h-6">
          <ChevronLeft className="w-4 h-4 text-black" />
        </Button>
        
        <h3 className="text-base font-semibold text-black tracking-tight">
          April 2023
        </h3>
        
        <Button size="icon" variant="ghost" className="w-6 h-6">
          <ChevronRight className="w-4 h-4 text-black" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
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

        {/* Calendar dates */}
        <div className="grid grid-cols-7 gap-3">
          {calendarData.map((item, index) => (
            <div key={index} className="relative flex flex-col items-center">
              <button
                className={`
                  w-8 h-8 flex items-center justify-center text-sm font-normal tracking-tight
                  ${item.isSelected 
                    ? 'bg-[#63CDFA] text-white rounded-full' 
                    : item.isCurrentMonth 
                      ? 'text-[#333] hover:bg-gray-100 rounded-lg' 
                      : 'text-[#BDBDBD]'
                  }
                `}
              >
                {item.date}
              </button>
              
              {/* Event indicators */}
              {item.hasEvent && (
                <div className="mt-0.5">
                  <div 
                    className={`w-1 h-1 rounded-full ${
                      item.eventType === 'primary' ? 'bg-[#016EED]' : 'bg-[#63CDFA]'
                    }`} 
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
