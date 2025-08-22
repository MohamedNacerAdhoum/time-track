import React from "react";
import { CalendarField } from "./calendar-field";

interface CalendarWidgetProps {
  value?: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  formatDate?: (date: Date) => string;
}

function formatDateDefault(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function CalendarWidget({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled = false,
  formatDate = formatDateDefault,
}: CalendarWidgetProps) {
  return (
    <CalendarField
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      formatDate={formatDate}
      variant="default"
    />
  );
}
