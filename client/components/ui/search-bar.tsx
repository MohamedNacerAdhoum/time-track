import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  showClear?: boolean;
  onClear?: () => void;
  leftIcon?: React.ReactNode;
  disabled?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Quick Search...",
  className,
  inputClassName,
  showClear = false,
  onClear,
  leftIcon = <Search className="h-5 w-5 text-gray-400" />,
  disabled = false,
}: SearchBarProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <div className={cn("flex-1 w-full lg:max-w-md", className)}>
      <div className="relative">
        {/* Left icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {leftIcon}
        </div>

        {/* Input field */}
        <Input
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          disabled={disabled}
          className={cn(
            "pl-10 h-12 bg-gray-50 border-gray-200 rounded-xl text-lg",
            showClear && value && "pr-10",
            inputClassName,
          )}
        />

        {/* Clear button */}
        {showClear && value && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
