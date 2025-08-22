import React, { useState, useEffect } from "react";
import { useAdminView } from "@/contexts/AdminViewContext";
import {
  ChevronDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pencil,
  Clock,
  Calendar as CalendarIcon,
  Notebook,
} from "lucide-react";
import { SearchBar } from "@/components/ui/search-bar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { DateFilter } from "@/components/ui/DateFilter";
import { BalancesCalendar } from "@/components/dashboard/BalancesCalendar";
import { DayDetails, type DayDetailsData } from "@/components/dashboard/DayDetails";
import { cn } from "@/lib/utils";

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return `${amount} TND`;
};

// Helper function to format time
const formatTime = (time?: string) => {
  if (!time) return "hh:mm:ss";
  return time;
};

// Payment badge component
function PaymentBadge({
  amount,
  type,
}: {
  amount: number;
  type: "positive" | "negative" | "neutral";
}) {
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "positive":
        return "bg-green-100 text-green-700 border-green-200";
      case "negative":
        return "bg-red-100 text-red-700 border-red-200";
      case "neutral":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPrefix = () => {
    if (type === "positive") return "+ ";
    if (type === "negative") return "- ";
    return "";
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-4 py-1 text-sm font-semibold rounded-full border",
        getBadgeStyle(type),
      )}
    >
      {getPrefix()}
      {formatCurrency(amount)}
    </Badge>
  );
}

// Sortable header component
function SortableHeader({
  children,
  showArrow = true,
  className,
}: {
  children: React.ReactNode;
  showArrow?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 cursor-pointer hover:text-white transition-colors",
        className,
      )}
    >
      {children}
      {showArrow && <ArrowUpDown className="h-4 w-4" />}
    </div>
  );
}

// Mock work data for different calendar states
const mockWorkData = {
  // Days with work (green border)
  '2023-4-3': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-5': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-6': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-7': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-8': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-9': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-10': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-12': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-14': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-15': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-16': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-17': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-18': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-20': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-21': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-23': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-24': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },
  '2023-4-25': { worked: true, status: 'worked' as const, amount: 50, hours: '8h 20mn' },

  // Days absent (yellow border)
  '2023-4-4': { worked: false, status: 'absent' as const, amount: 0, hours: '5h 20mn' },
  '2023-4-11': { worked: false, status: 'absent' as const, amount: 0, hours: '5h 20mn' },
  '2023-4-13': { worked: false, status: 'absent' as const, amount: 0, hours: '5h 20mn' },
  '2023-4-19': { worked: false, status: 'absent' as const, amount: 0, hours: '5h 20mn' },
  '2023-4-22': { worked: false, status: 'absent' as const, amount: 0, hours: '5h 20mn' },
};

// Component for user calendar view
function UserCalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date(2023, 3, 25)); // April 25, 2023

  // Get data for selected date
  const getSelectedDateData = (): DayDetailsData => {
    const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
    const workData = mockWorkData[dateKey as keyof typeof mockWorkData];
    const today = new Date();
    const isFuture = selectedDate > today;

    // Determine status and payment type
    let status: 'worked' | 'absent' | 'future' = 'worked';
    let paymentType: 'positive' | 'negative' | 'neutral' = 'positive';
    let payedAmount: number | string = 50;

    if (isFuture) {
      status = 'future';
      paymentType = 'neutral';
      payedAmount = '-';
    } else if (workData) {
      status = workData.status;
      paymentType = workData.amount > 0 ? 'positive' : workData.amount === 0 ? 'negative' : 'neutral';
      payedAmount = workData.amount;
    } else {
      status = 'absent';
      paymentType = 'negative';
      payedAmount = 0;
    }

    return {
      date: selectedDate.toLocaleDateString('en-GB'), // DD-MM-YYYY format
      workedTime: workData?.hours || (isFuture ? '5h 30mn' : '5h 20mn'),
      payedAmount,
      totalPayMonth: '1950 TND',
      clockIn: 'hh:mm:ss',
      breakPeriod: 'hh:mm:ss',
      clockOut: isFuture ? '-' : 'hh:mm:ss',
      status,
      paymentType,
    };
  };

  return (
    <div className="w-full">
      <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 xl:gap-12 2xl:gap-20 p-4 sm:p-6 lg:p-8 bg-[#EEFAFF] rounded-2xl min-h-[600px] lg:min-h-[700px]">
        <div className="flex-1 flex justify-center">
          <BalancesCalendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            workData={mockWorkData}
          />
        </div>
        <div className="flex-1 flex justify-center">
          <DayDetails data={getSelectedDateData()} />
        </div>
      </div>
    </div>
  );
}

// Sample data for admin view
const sampleBalanceData = [
  {
    id: "1",
    name: "User xxxxx",
    date: "01-01-2024",
    timeWorked: "8h 20mn",
    payedAmount: 50,
    paymentType: "positive" as const,
    totalPay: "2050 TND",
    payRate: "50 TND / Day",
  },
  {
    id: "2",
    name: "User xxxxx",
    date: "01-01-2024",
    timeWorked: "-",
    payedAmount: 0,
    paymentType: "neutral" as const,
    totalPay: "2050 TND",
    payRate: "50 TND / Day",
  },
  {
    id: "3",
    name: "User xxxxx",
    date: "01-01-2024",
    timeWorked: "8h 20mn",
    payedAmount: 50,
    paymentType: "positive" as const,
    totalPay: "2050 TND",
    payRate: "50 TND / Day",
  },
  {
    id: "4",
    name: "User xxxxx",
    date: "01-01-2024",
    timeWorked: "8h 20mn",
    payedAmount: 50,
    paymentType: "positive" as const,
    totalPay: "2050 TND",
    payRate: "50 TND / Day",
  },
  {
    id: "5",
    name: "User xxxxx",
    date: "01-01-2024",
    timeWorked: "8h 20mn",
    payedAmount: 50,
    paymentType: "positive" as const,
    totalPay: "2050 TND",
    payRate: "50 TND / Day",
  },
  {
    id: "6",
    name: "User xxxxx",
    date: "01-01-2024",
    timeWorked: "8h 20mn",
    payedAmount: 50,
    paymentType: "positive" as const,
    totalPay: "2050 TND",
    payRate: "50 TND / Day",
  },
  {
    id: "7",
    name: "User xxxxx",
    date: "01-01-2024",
    timeWorked: "8h 20mn",
    payedAmount: 50,
    paymentType: "positive" as const,
    totalPay: "2050 TND",
    payRate: "50 TND / Day",
  },
];

export default function BalancesPage() {
  const { isAdminView } = useAdminView();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsDropdown, setShowRowsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("hours");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedUser, setSelectedUser] = useState("all");

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, rowsPerPage, selectedDate, searchQuery, selectedUser]);

  // Filter data based on search and filters
  const filteredData = sampleBalanceData.filter((item) => {
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesDate = selectedDate
      ? new Date(
          item.date.split("-").reverse().join("-"),
        ).toLocaleDateString() === selectedDate.toLocaleDateString()
      : true;

    return matchesSearch && matchesDate;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  // User dropdown options
  const userOptions = [
    { value: "all", label: "All Users" },
    { value: "user1", label: "User xxxxx" },
    { value: "user2", label: "User yyyyy" },
    { value: "user3", label: "User zzzzz" },
  ];

  // Day filter option for admin view
  const dayOptions = [
    { value: "all", label: "Day" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "week", label: "This Week" },
  ];

  if (!isAdminView) {
    // User view - Calendar with daily summary
    return (
      <div className="space-y-6">
        {/* Tab Selector */}
        <div className="flex justify-center">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 h-16 p-2 bg-white rounded-2xl border border-blue-200">
              <TabsTrigger
                value="hours"
                className="h-12 text-lg font-medium data-[state=active]:text-white text-gray-600 data-[state=active]:bg-[#63CDFA] rounded-xl flex items-center gap-3"
              >
                <Clock className="w-7 h-7" />
                Hours
              </TabsTrigger>
              <TabsTrigger
                value="tickets"
                className="h-12 text-lg font-medium data-[state=active]:text-white text-gray-600 data-[state=active]:bg-[#63CDFA] rounded-xl flex items-center gap-3"
              >
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 30 30"
                  fill="currentColor"
                >
                  <path d="M7.5 30.0006H10.1625C10.7219 29.9953 11.2637 29.8043 11.7029 29.4577C12.142 29.1111 12.4536 28.6285 12.5887 28.0856C12.7335 27.5571 13.0478 27.0907 13.4835 26.7583C13.9192 26.4259 14.452 26.2458 15 26.2458C15.548 26.2458 16.0808 26.4259 16.5165 26.7583C16.9522 27.0907 17.2665 27.5571 17.4113 28.0856C17.5464 28.6285 17.858 29.1111 18.2971 29.4577C18.7363 29.8043 19.2781 29.9953 19.8375 30.0006H22.5C23.4946 30.0006 24.4484 29.6055 25.1517 28.9023C25.8549 28.199 26.25 27.2452 26.25 26.2506V21.2506H21.25C20.9185 21.2506 20.6005 21.1189 20.3661 20.8845C20.1317 20.6501 20 20.3321 20 20.0006C20 19.6691 20.1317 19.3511 20.3661 19.1167C20.6005 18.8823 20.9185 18.7506 21.25 18.7506H26.25V6.25061C26.248 4.59362 25.5889 3.00506 24.4172 1.83339C23.2456 0.661713 21.657 0.00259517 20 0.000610352L19.8375 0.000610352C19.2781 0.00592512 18.7363 0.196877 18.2971 0.543484C17.858 0.890092 17.5464 1.37273 17.4113 1.91561C17.2665 2.44416 16.9522 2.91051 16.5165 3.24293C16.0808 3.57534 15.548 3.7554 15 3.7554C14.452 3.7554 13.9192 3.57534 13.4835 3.24293C13.0478 2.91051 12.7335 2.44416 12.5887 1.91561C12.4536 1.37273 12.142 0.890092 11.7029 0.543484C11.2637 0.196877 10.7219 0.00592512 10.1625 0.000610352L10 0.000610352C8.34301 0.00259517 6.75445 0.661713 5.58277 1.83339C4.4111 3.00506 3.75198 4.59362 3.75 6.25061V18.7506H8.75C9.08152 18.7506 9.39946 18.8823 9.63388 19.1167C9.8683 19.3511 10 19.6691 10 20.0006C10 20.3321 9.8683 20.6501 9.63388 20.8845C9.39946 21.1189 9.08152 21.2506 8.75 21.2506H3.75V26.2506C3.75 27.2452 4.14509 28.199 4.84835 28.9023C5.55161 29.6055 6.50544 30.0006 7.5 30.0006ZM13.75 18.7506H16.25C16.5815 18.7506 16.8995 18.8823 17.1339 19.1167C17.3683 19.3511 17.5 19.6691 17.5 20.0006C17.5 20.3321 17.3683 20.6501 17.1339 20.8845C16.8995 21.1189 16.5815 21.2506 16.25 21.2506H13.75C13.4185 21.2506 13.1005 21.1189 12.8661 20.8845C12.6317 20.6501 12.5 20.3321 12.5 20.0006C12.5 19.6691 12.6317 19.3511 12.8661 19.1167C13.1005 18.8823 13.4185 18.7506 13.75 18.7506Z" />
                </svg>
                Tickets
              </TabsTrigger>
              <TabsTrigger
                value="leave"
                className="h-12 text-lg font-medium data-[state=active]:text-white text-gray-600 data-[state=active]:bg-[#63CDFA] rounded-xl flex items-center gap-3"
              >
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 31 30"
                  fill="currentColor"
                >
                  <path d="M13.6245 9.28371L17.5557 6.59747C17.7007 6.47622 17.8732 6.34372 18.0732 6.20872C17.4907 5.32248 17.1507 4.26248 17.1507 3.12499C17.1507 2.95624 17.1582 2.78999 17.1732 2.62499L14.8695 0.959996C14.8345 0.934996 14.7995 0.912496 14.7632 0.891246C12.417 -0.463748 9.52199 -0.259999 7.387 1.40999L3.22952 4.66123C1.70578 5.85498 0.832031 7.64872 0.832031 9.58371V16.2562C0.832031 19.0137 3.07452 21.2562 5.83201 21.2562H14.582C14.6282 21.2562 14.6745 21.2537 14.7207 21.2487C14.697 21.2487 14.6732 21.2499 14.6507 21.2499C12.5832 21.2499 10.9007 19.5674 10.9007 17.4999V14.4449C10.9007 12.3787 11.9182 10.4487 13.6245 9.28371ZM8.332 14.9999C8.332 15.6899 7.772 16.2499 7.08201 16.2499H5.83201C5.14201 16.2499 4.58202 15.6899 4.58202 14.9999V13.7499C4.58202 13.0599 5.14201 12.4999 5.83201 12.4999H7.08201C7.772 12.4999 8.332 13.0599 8.332 13.7499V14.9999ZM19.6495 3.12499C19.6495 1.39874 21.0482 0 22.7744 0C24.5007 0 25.8994 1.39874 25.8994 3.12499C25.8994 4.85123 24.5007 6.24997 22.7744 6.24997C21.0482 6.24997 19.6495 4.85123 19.6495 3.12499ZM20.9819 24.2236L18.9307 29.2236C18.732 29.7074 18.2657 29.9999 17.7732 29.9999C17.6157 29.9999 17.4545 29.9699 17.2995 29.9061C16.6607 29.6449 16.3557 28.9136 16.617 28.2749L18.6682 23.2749C18.9307 22.6362 19.6607 22.3324 20.2994 22.5924C20.9382 22.8537 21.2432 23.5849 20.9819 24.2236ZM30.2644 15.8274L27.2169 13.8412C26.9632 13.6762 26.7769 13.4237 26.6957 13.1312L25.8419 10.0825C25.3932 8.64621 23.8232 7.52122 22.2682 7.52122C20.4657 7.52122 19.4595 8.23872 19.0845 8.57996L15.0332 11.3487C14.0095 12.0475 13.3982 13.2049 13.3982 14.4449V17.4999C13.3982 18.1899 13.9582 18.7499 14.6482 18.7499C15.3382 18.7499 15.8982 18.1899 15.8982 17.4999V14.4449C15.8982 14.0312 16.102 13.6462 16.4432 13.4124L18.3982 12.0762V16.8237C18.3982 18.0462 18.9957 19.1937 20.0257 19.9149L25.3382 23.4274C25.6894 23.6599 25.8994 24.0499 25.8994 24.4699V28.7511C25.8994 29.4411 26.4594 30.0011 27.1494 30.0011C27.8394 30.0011 28.3994 29.4411 28.3994 28.7511V24.4699C28.3994 23.2074 27.7707 22.0387 26.7169 21.3424L24.5819 19.9312V14.5412C24.8782 15.1037 25.3132 15.5862 25.8532 15.9387L28.8994 17.9249C29.4807 18.3037 30.2532 18.1387 30.6294 17.5599C31.0057 16.9812 30.8432 16.2062 30.2644 15.8299V15.8274Z" />
                </svg>
                Leave
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Calendar Widget */}
        <UserCalendarView />
      </div>
    );
  }

  // Admin view - Table with user data
  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className="flex justify-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-16 p-2 bg-white rounded-2xl border border-blue-200">
            <TabsTrigger
              value="hours"
              className="h-12 text-lg font-medium data-[state=active]:text-white text-gray-600 data-[state=active]:bg-[#63CDFA] rounded-xl flex items-center gap-3"
            >
              <Clock className="w-7 h-7" />
              Hours
            </TabsTrigger>
            <TabsTrigger
              value="tickets"
              className="h-12 text-lg font-medium data-[state=active]:text-white text-gray-600 data-[state=active]:bg-[#63CDFA] rounded-xl flex items-center gap-3"
            >
              <svg className="w-7 h-7" viewBox="0 0 30 30" fill="currentColor">
                <path d="M7.5 30.0006H10.1625C10.7219 29.9953 11.2637 29.8043 11.7029 29.4577C12.142 29.1111 12.4536 28.6285 12.5887 28.0856C12.7335 27.5571 13.0478 27.0907 13.4835 26.7583C13.9192 26.4259 14.452 26.2458 15 26.2458C15.548 26.2458 16.0808 26.4259 16.5165 26.7583C16.9522 27.0907 17.2665 27.5571 17.4113 28.0856C17.5464 28.6285 17.858 29.1111 18.2971 29.4577C18.7363 29.8043 19.2781 29.9953 19.8375 30.0006H22.5C23.4946 30.0006 24.4484 29.6055 25.1517 28.9023C25.8549 28.199 26.25 27.2452 26.25 26.2506V21.2506H21.25C20.9185 21.2506 20.6005 21.1189 20.3661 20.8845C20.1317 20.6501 20 20.3321 20 20.0006C20 19.6691 20.1317 19.3511 20.3661 19.1167C20.6005 18.8823 20.9185 18.7506 21.25 18.7506H26.25V6.25061C26.248 4.59362 25.5889 3.00506 24.4172 1.83339C23.2456 0.661713 21.657 0.00259517 20 0.000610352L19.8375 0.000610352C19.2781 0.00592512 18.7363 0.196877 18.2971 0.543484C17.858 0.890092 17.5464 1.37273 17.4113 1.91561C17.2665 2.44416 16.9522 2.91051 16.5165 3.24293C16.0808 3.57534 15.548 3.7554 15 3.7554C14.452 3.7554 13.9192 3.57534 13.4835 3.24293C13.0478 2.91051 12.7335 2.44416 12.5887 1.91561C12.4536 1.37273 12.142 0.890092 11.7029 0.543484C11.2637 0.196877 10.7219 0.00592512 10.1625 0.000610352L10 0.000610352C8.34301 0.00259517 6.75445 0.661713 5.58277 1.83339C4.4111 3.00506 3.75198 4.59362 3.75 6.25061V18.7506H8.75C9.08152 18.7506 9.39946 18.8823 9.63388 19.1167C9.8683 19.3511 10 19.6691 10 20.0006C10 20.3321 9.8683 20.6501 9.63388 20.8845C9.39946 21.1189 9.08152 21.2506 8.75 21.2506H3.75V26.2506C3.75 27.2452 4.14509 28.199 4.84835 28.9023C5.55161 29.6055 6.50544 30.0006 7.5 30.0006ZM13.75 18.7506H16.25C16.5815 18.7506 16.8995 18.8823 17.1339 19.1167C17.3683 19.3511 17.5 19.6691 17.5 20.0006C17.5 20.3321 17.3683 20.6501 17.1339 20.8845C16.8995 21.1189 16.5815 21.2506 16.25 21.2506H13.75C13.4185 21.2506 13.1005 21.1189 12.8661 20.8845C12.6317 20.6501 12.5 20.3321 12.5 20.0006C12.5 19.6691 12.6317 19.3511 12.8661 19.1167C13.1005 18.8823 13.4185 18.7506 13.75 18.7506Z" />
              </svg>
              Tickets
            </TabsTrigger>
            <TabsTrigger
              value="leave"
              className="h-12 text-lg font-medium data-[state=active]:text-white text-gray-600 data-[state=active]:bg-[#63CDFA] rounded-xl flex items-center gap-3"
            >
              <svg className="w-7 h-7" viewBox="0 0 31 30" fill="currentColor">
                <path d="M13.6245 9.28371L17.5557 6.59747C17.7007 6.47622 17.8732 6.34372 18.0732 6.20872C17.4907 5.32248 17.1507 4.26248 17.1507 3.12499C17.1507 2.95624 17.1582 2.78999 17.1732 2.62499L14.8695 0.959996C14.8345 0.934996 14.7995 0.912496 14.7632 0.891246C12.417 -0.463748 9.52199 -0.259999 7.387 1.40999L3.22952 4.66123C1.70578 5.85498 0.832031 7.64872 0.832031 9.58371V16.2562C0.832031 19.0137 3.07452 21.2562 5.83201 21.2562H14.582C14.6282 21.2562 14.6745 21.2537 14.7207 21.2487C14.697 21.2487 14.6732 21.2499 14.6507 21.2499C12.5832 21.2499 10.9007 19.5674 10.9007 17.4999V14.4449C10.9007 12.3787 11.9182 10.4487 13.6245 9.28371ZM8.332 14.9999C8.332 15.6899 7.772 16.2499 7.08201 16.2499H5.83201C5.14201 16.2499 4.58202 15.6899 4.58202 14.9999V13.7499C4.58202 13.0599 5.14201 12.4999 5.83201 12.4999H7.08201C7.772 12.4999 8.332 13.0599 8.332 13.7499V14.9999ZM19.6495 3.12499C19.6495 1.39874 21.0482 0 22.7744 0C24.5007 0 25.8994 1.39874 25.8994 3.12499C25.8994 4.85123 24.5007 6.24997 22.7744 6.24997C21.0482 6.24997 19.6495 4.85123 19.6495 3.12499ZM20.9819 24.2236L18.9307 29.2236C18.732 29.7074 18.2657 29.9999 17.7732 29.9999C17.6157 29.9999 17.4545 29.9699 17.2995 29.9061C16.6607 29.6449 16.3557 28.9136 16.617 28.2749L18.6682 23.2749C18.9307 22.6362 19.6607 22.3324 20.2994 22.5924C20.9382 22.8537 21.2432 23.5849 20.9819 24.2236ZM30.2644 15.8274L27.2169 13.8412C26.9632 13.6762 26.7769 13.4237 26.6957 13.1312L25.8419 10.0825C25.3932 8.64621 23.8232 7.52122 22.2682 7.52122C20.4657 7.52122 19.4595 8.23872 19.0845 8.57996L15.0332 11.3487C14.0095 12.0475 13.3982 13.2049 13.3982 14.4449V17.4999C13.3982 18.1899 13.9582 18.7499 14.6482 18.7499C15.3382 18.7499 15.8982 18.1899 15.8982 17.4999V14.4449C15.8982 14.0312 16.102 13.6462 16.4432 13.4124L18.3982 12.0762V16.8237C18.3982 18.0462 18.9957 19.1937 20.0257 19.9149L25.3382 23.4274C25.6894 23.6599 25.8994 24.0499 25.8994 24.4699V28.7511C25.8994 29.4411 26.4594 30.0011 27.1494 30.0011C27.8394 30.0011 28.3994 29.4411 28.3994 28.7511V24.4699C28.3994 23.2074 27.7707 22.0387 26.7169 21.3424L24.5819 19.9312V14.5412C24.8782 15.1037 25.3132 15.5862 25.8532 15.9387L28.8994 17.9249C29.4807 18.3037 30.2532 18.1387 30.6294 17.5599C31.0057 16.9812 30.8432 16.2062 30.2644 15.8299V15.8274Z" />
              </svg>
              Leave
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Quick Search..."
        />
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          <DateFilter
            value={selectedDate}
            onChange={setSelectedDate}
            className="min-w-[180px] h-12"
            placeholder="25/07/2022"
            showClearButton={true}
          />
          <CustomDropdown
            value={selectedUser}
            options={userOptions}
            onChange={setSelectedUser}
            className="min-w-[160px] h-12"
          />
          <CustomDropdown
            value="day"
            options={dayOptions}
            onChange={() => {}}
            className="min-w-[100px] h-12"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-[#63CDFA] hover:bg-[#63CDFA]">
              <TableHead className="text-white font-semibold py-4">
                <SortableHeader>Name</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold text-center">
                <SortableHeader>Date</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold text-center">
                <SortableHeader>Time worked</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold text-center">
                <SortableHeader>Payed amount</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold text-center">
                <SortableHeader>Total Pay</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold text-center">
                <SortableHeader>Pay rate</SortableHeader>
              </TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={cn(
                    "border-b border-gray-100",
                    index % 2 === 0 ? "bg-white" : "bg-[#F2FBFF]",
                  )}
                >
                  <TableCell className="font-semibold text-gray-900">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-gray-500 text-center">
                    {item.date}
                  </TableCell>
                  <TableCell className="text-gray-500 text-center">
                    {item.timeWorked}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <PaymentBadge
                        amount={item.payedAmount}
                        type={item.paymentType}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500 text-center">
                    {item.totalPay}
                  </TableCell>
                  <TableCell className="text-gray-500 text-center">
                    {item.payRate}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-[#63CDFA] hover:text-[#63CDFA] hover:bg-blue-50"
                    >
                      <Pencil className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500 font-medium"
                >
                  No balance data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from(
                { length: Math.min(3, totalPages) },
                (_, i) => i + 1,
              ).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "h-8 w-8 rounded-full",
                    currentPage === page
                      ? "bg-[#63CDFA] text-white hover:bg-[#63CDFA]/90"
                      : "text-gray-500 hover:bg-gray-100",
                  )}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm text-gray-500">
            {currentPage} of {totalPages}
          </span>
        </div>
        <div className="flex items-center gap-4 relative order-first lg:order-last">
          <span className="text-sm text-gray-500">Rows per page</span>
          <div
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setShowRowsDropdown(!showRowsDropdown)}
          >
            <span className="text-sm font-semibold text-gray-900">
              {rowsPerPage}
            </span>
            <ChevronDown
              className={`h-3 w-3 text-gray-400 transition-transform ${showRowsDropdown ? "rotate-180" : ""}`}
            />
          </div>
          {showRowsDropdown && (
            <div className="absolute right-0 bottom-full mb-1 w-20 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {[5, 10, 20, 50].map((option) => (
                <div
                  key={option}
                  className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${rowsPerPage === option ? "bg-blue-50 text-blue-600" : "text-gray-700"}`}
                  onClick={() => {
                    setRowsPerPage(option);
                    setShowRowsDropdown(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
