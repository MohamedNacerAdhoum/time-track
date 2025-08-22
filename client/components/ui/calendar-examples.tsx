import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { CalendarField } from "./calendar-field";

export function CalendarExamples() {
  const [date1, setDate1] = useState<Date>();
  const [date2, setDate2] = useState<Date>();
  const [date3, setDate3] = useState<Date>();

  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-bold">Calendar Field Examples</h2>

      {/* Default style (original CalendarWidget style) */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Default Style</h3>
        <CalendarField
          value={date1}
          onChange={setDate1}
          placeholder="Select date"
          variant="default"
        />
      </div>

      {/* Profile modal style */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Profile Modal Style</h3>
        <CalendarField
          value={date2}
          onChange={setDate2}
          placeholder="12/08/2022"
          variant="profile"
        />
      </div>

      {/* Custom field */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Custom Field Style</h3>
        <CalendarField value={date3} onChange={setDate3}>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Calendar className="w-4 h-4" />
            {date3 ? date3.toLocaleDateString() : "Pick a date"}
          </button>
        </CalendarField>
      </div>
    </div>
  );
}
