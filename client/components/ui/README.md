# Custom UI Components

## CustomDropdown

A reusable dropdown component that matches the Figma design specifications.

### Props

- `value: string` - Currently selected value
- `options: DropdownOption[]` - Array of options with `value` and `label`
- `onChange: (value: string) => void` - Callback when option is selected
- `placeholder?: string` - Placeholder text when no option selected
- `className?: string` - Additional CSS classes
- `disabled?: boolean` - Whether the dropdown is disabled

### Usage Example

```tsx
import { CustomDropdown } from "@/components/ui/custom-dropdown";

const options = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

function MyComponent() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  return (
    <CustomDropdown
      value={selectedPeriod}
      options={options}
      onChange={setSelectedPeriod}
      placeholder="Select period"
    />
  );
}
```

## CalendarWidget

A reusable calendar widget for date selection that matches the Figma design.

### Props

- `value?: Date` - Currently selected date
- `onChange: (date: Date) => void` - Callback when date is selected
- `placeholder?: string` - Placeholder text when no date selected
- `className?: string` - Additional CSS classes
- `disabled?: boolean` - Whether the calendar is disabled
- `formatDate?: (date: Date) => string` - Custom date formatting function

### Usage Example

```tsx
import { CalendarWidget } from "@/components/ui/calendar-widget";

function MyComponent() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <CalendarWidget
      value={selectedDate}
      onChange={setSelectedDate}
      placeholder="Select date"
      formatDate={(date) => date.toLocaleDateString()}
    />
  );
}
```

## Features

### CustomDropdown Features

- ✅ Matches Figma design exactly
- ✅ Click outside to close
- ✅ Keyboard navigation support
- ✅ Hover states and transitions
- ✅ Proper shadow and border styling
- ✅ Responsive design

### CalendarWidget Features

- ✅ Full calendar view with month navigation
- ✅ Highlight selected date
- ✅ Event indicators (small dots)
- ✅ Click outside to close
- ✅ Responsive layout
- ✅ Custom date formatting
- ✅ Previous/next month navigation

## Implementation Notes

Both components are built with:

- React hooks for state management
- TypeScript for type safety
- Tailwind CSS for styling
- Lucide React for icons
- Responsive design principles
- Accessibility considerations

The components automatically handle:

- Click outside detection
- State management
- Visual feedback
- Proper z-index layering
- Responsive positioning
