import React, { useState, useEffect } from "react";
import { useTimeSheets } from "@/contexts/TimeSheetsContext";
import { useMembersStore } from "@/contexts/MembersContext";
import { useAdminView } from "@/contexts/AdminViewContext";
import { TimeSheet } from "@/contexts/TimeSheetsContext";
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  NotepadText,
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { CalendarField } from "@/components/ui/calendar-field";
import { cn } from "@/lib/utils";

// Helper function to format date string to time (HH:MM:SS)
const formatTime = (dateString?: string | null) => {
  if (!dateString) return "--:--:--";
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "--:--:--";
  }
};

function StatusBadge({ status }: { status: "IN" | "OUT" | "IN BREAK" }) {
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case "IN":
        return "bg-green-100 text-green-700 border-green-200";
      case "OUT":
        return "bg-red-100 text-red-700 border-red-200";
      case "IN BREAK":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-4 py-1 text-sm font-semibold rounded-full border",
        getBadgeStyle(status),
      )}
    >
      {status}
    </Badge>
  );
}

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

export default function TimesheetsPage() {
  const { isAdminView } = useAdminView();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsDropdown, setShowRowsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("today");
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");
  const [lastAction, setLastAction] = useState("last_action");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [adminTimeSheets, setAdminTimeSheets] = useState<TimeSheet[]>([]);

  const {
    timeSheets,
    allUsersTimeSheets,
    fetchUserTimeSheets,
    fetchAllUsersTodayTimeSheets,
    fetchAllUsersTimeSheets,
  } = useTimeSheets();
  const { currentUser } = useMembersStore();

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, activeTab, rowsPerPage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAdminView) {
          if (activeTab === "today") {
            const todayData = await fetchAllUsersTodayTimeSheets();
            if (todayData) setAdminTimeSheets(todayData);
          } else {
            const allData = await fetchAllUsersTimeSheets();
            if (allData?.results) setAdminTimeSheets(allData.results);
          }
        } else {
          await fetchUserTimeSheets();
        }
      } catch (err) {
        console.error("Error fetching timesheets:", err);
      }
    };
    fetchData();
  }, [
    activeTab,
    isAdminView,
    fetchAllUsersTodayTimeSheets,
    fetchAllUsersTimeSheets,
    fetchUserTimeSheets,
  ]);

  // Which data to use
  const displayData = isAdminView
    ? activeTab === "today"
      ? adminTimeSheets
      : allUsersTimeSheets?.results || []
    : timeSheets;

  // Filtering
  const filteredData = (displayData || []).filter((entry) => {
    const matchesSearch = searchQuery
      ? isAdminView
        ? entry.employee_name?.toLowerCase().includes(searchQuery.toLowerCase())
        : new Date(entry.date).toLocaleDateString().includes(searchQuery)
      : true;

    const matchesLastAction =
      lastAction === "last_action" || entry.status === lastAction;

    const matchesDate = selectedDate
      ? new Date(entry.date).toLocaleDateString() ===
        selectedDate.toLocaleDateString()
      : true;

    return matchesSearch && matchesLastAction && matchesDate;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handleNoteClick = (entryId: string) => {
    const entry = displayData?.find((e) => e.id === entryId);
    setSelectedNote(entry?.note || "No note available");
    setIsNoteModalOpen(true);
  };

  const lastActionOptions = [
    { value: "last_action", label: "All Actions" },
    { value: "IN", label: "Clocked In" },
    { value: "OUT", label: "Clocked Out" },
    { value: "IN BREAK", label: "On Break" },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      {isAdminView && (
        <div className="flex justify-center">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 h-16 p-2 bg-white rounded-2xl border border-blue-200">
              <TabsTrigger
                value="today"
                className="h-12 text-lg font-medium data-[state=active]:text-white text-gray-600 data-[state=active]:bg-[#63CDFA] rounded-xl"
              >
                Today
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="h-12 text-lg font-medium data-[state=active]:text-white text-gray-600 data-[state=active]:bg-[#63CDFA] rounded-xl"
              >
                History
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      {/* Search + Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex-1 w-full lg:max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Quick Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-xl text-lg"
            />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          <CustomDropdown
            value={lastAction}
            options={lastActionOptions}
            onChange={setLastAction}
            className="min-w-[160px]"
          />
          <div className="relative flex items-center">
            <CalendarField
              value={selectedDate}
              onChange={setSelectedDate}
              className="min-w-[180px] pr-8"
              placeholder="Select date..."
              variant="default"
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Clear date filter"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-[#63CDFA] hover:bg-[#63CDFA]">
              <TableHead className="text-white font-semibold py-4 w-32">
                <SortableHeader>Name</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold w-24">
                <SortableHeader>Date</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold w-24">
                <SortableHeader>Clock In</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold w-24">
                <SortableHeader>Clock Out</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold w-24">
                <SortableHeader>Break Period / day</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold text-center w-10">
                Last Action
              </TableHead>
              <TableHead className="text-white font-semibold text-center w-10">
                Note
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((entry, index) => (
                <TableRow
                  key={entry.id}
                  className={cn(
                    "border-b border-gray-100",
                    index % 2 === 0 ? "bg-white" : "bg-[#F2FBFF]",
                  )}
                >
                  <TableCell className="font-semibold text-gray-900">
                    {isAdminView ? entry.employee_name : entry.date}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(entry.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {formatTime(entry.clock_in)}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {formatTime(entry.clock_out)}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {entry.break_start && entry.break_end
                      ? `${formatTime(entry.break_start)} - ${formatTime(entry.break_end)}`
                      : "--:--:-- | --:--:--"}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={entry.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleNoteClick(entry.id)}
                      className="h-8 w-8 text-[#63CDFA] hover:text-[#63CDFA] hover:bg-blue-50"
                    >
                      <NotepadText className="h-5 w-5" />
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
                  No timesheet data available
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

      {/* Note Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsNoteModalOpen(false)}
          />
          <div className="relative bg-white border-2 border-[#63CDFA]/40 rounded-xl max-w-[575px] w-full mx-4 overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <NotepadText />
                  <h2 className="text-2xl font-semibold text-[#63CDFA]">
                    Note
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="h-10 w-10 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="text-[#00003C] text-lg leading-7 font-light whitespace-pre-wrap">
                {selectedNote}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
