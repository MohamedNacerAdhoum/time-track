import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CustomDropdown({
  value,
  options,
  onChange,
  placeholder = "Select option",
  className,
  disabled = false,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      {/* Trigger */}
      <div
        onClick={handleToggle}
        className={cn(
          "flex items-center justify-center gap-5 px-8 py-4 rounded-2xl bg-gray-100 cursor-pointer select-none transition-colors",
          disabled && "opacity-50 cursor-not-allowed",
          "hover:bg-gray-200",
        )}
      >
        <span className="text-gray-500 font-semibold text-base">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {isOpen ? (
          <ChevronUp className="h-6 w-6 text-gray-400" />
        ) : (
          <ChevronDown className="h-6 w-6 text-gray-400" />
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg z-50 border-0 overflow-hidden"
          style={{ boxShadow: "-4px 4px 12px 0 rgba(0, 0, 0, 0.25)" }}
        >
          {options.map((option, index) => (
            <div key={option.value}>
              <button
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full px-8 py-4 text-left font-semibold text-base transition-colors",
                  "text-gray-500 hover:bg-gray-50",
                  value === option.value && "bg-blue-50 text-blue-600",
                  index === 0 && "rounded-t-2xl",
                  index === options.length - 1 && "rounded-b-2xl",
                )}
              >
                {option.label}
              </button>
              {index < options.length - 1 && (
                <div className="border-b border-gray-200" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
