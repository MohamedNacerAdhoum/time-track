import { useState } from "react";
import { Search, ChevronDown, Calendar, ArrowUpDown, FileText, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TimesheetEntry {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string;
  breakPeriod: string;
  status: "IN" | "OUT" | "IN BREAK";
  variant?: "default" | "alternate";
}

const mockData: TimesheetEntry[] = [
  {
    id: "1",
    date: "21 - 02 - 2024",
    clockIn: "09:00:00",
    clockOut: "17:00:00",
    breakPeriod: "01:00:00",
    status: "IN",
    variant: "default"
  },
  {
    id: "2",
    date: "21 - 02 - 2024",
    clockIn: "09:15:00",
    clockOut: "17:30:00",
    breakPeriod: "01:15:00",
    status: "OUT",
    variant: "alternate"
  },
  {
    id: "3",
    date: "21 - 02 - 2024",
    clockIn: "08:45:00",
    clockOut: "16:45:00",
    breakPeriod: "00:45:00",
    status: "IN",
    variant: "default"
  },
  {
    id: "4",
    date: "21 - 02 - 2024",
    clockIn: "09:30:00",
    clockOut: "18:00:00",
    breakPeriod: "01:30:00",
    status: "OUT",
    variant: "alternate"
  },
  {
    id: "5",
    date: "21 - 02 - 2024",
    clockIn: "09:00:00",
    clockOut: "--:--:--",
    breakPeriod: "00:30:00",
    status: "IN BREAK",
    variant: "default"
  },
  {
    id: "6",
    date: "21 - 02 - 2024",
    clockIn: "08:30:00",
    clockOut: "17:15:00",
    breakPeriod: "01:00:00",
    status: "OUT",
    variant: "alternate"
  },
  {
    id: "7",
    date: "21 - 02 - 2024",
    clockIn: "09:10:00",
    clockOut: "17:45:00",
    breakPeriod: "00:50:00",
    status: "IN",
    variant: "default"
  }
];

function StatusBadge({ status }: { status: TimesheetEntry["status"] }) {
  const getBadgeStyle = (status: TimesheetEntry["status"]) => {
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
        getBadgeStyle(status)
      )}
    >
      {status}
    </Badge>
  );
}

function SortableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 cursor-pointer hover:text-white transition-colors", className)}>
      {children}
      <ArrowUpDown className="h-4 w-4" />
    </div>
  );
}

export default function TimesheetsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("history");

  const totalPages = Math.ceil(mockData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = mockData.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex justify-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-16 p-2 bg-gray-100 rounded-2xl border border-blue-200">
            <TabsTrigger 
              value="today" 
              className="h-12 text-lg font-medium text-gray-600 data-[state=active]:bg-white data-[state=active]:text-gray-600 data-[state=active]:shadow-sm rounded-xl"
            >
              Today
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="h-12 text-lg font-medium text-white bg-[#63CDFA] data-[state=active]:bg-[#63CDFA] data-[state=active]:text-white data-[state=active]:shadow-sm rounded-xl"
            >
              History
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Quick Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-xl text-lg"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl">
            <span className="text-gray-500 font-medium">Last action</span>
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-xl">
            <span className="text-gray-500 font-medium">25/07/2022</span>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#63CDFA] hover:bg-[#63CDFA]">
              <TableHead className="text-white font-semibold py-6">
                <SortableHeader>Name</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold">
                <SortableHeader>Date</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold">
                <SortableHeader>Clock In</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold">
                <SortableHeader>Clock Out</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold">
                <SortableHeader>Break Period / day</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold text-center">
                Last Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((entry, index) => (
              <TableRow 
                key={entry.id}
                className={cn(
                  "border-b border-gray-100",
                  entry.variant === "alternate" ? "bg-[#F2FBFF]" : "bg-white"
                )}
              >
                <TableCell className="font-semibold text-gray-900">
                  {entry.date}
                </TableCell>
                <TableCell className="text-gray-500">
                  {entry.clockIn || "hh:mm:ss"}
                </TableCell>
                <TableCell className="text-gray-500">
                  {entry.clockOut || "hh:mm:ss"}
                </TableCell>
                <TableCell className="text-gray-500">
                  {entry.breakPeriod || "hh:mm:ss"}
                </TableCell>
                <TableCell className="text-gray-500">
                  {entry.breakPeriod || "hh:mm:ss"}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-3">
                    <StatusBadge status={entry.status} />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-[#63CDFA] hover:text-[#63CDFA] hover:bg-blue-50"
                    >
                      <FileText className="h-5 w-5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
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
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "h-8 w-8 rounded-full",
                    currentPage === page 
                      ? "bg-[#63CDFA] text-white hover:bg-[#63CDFA]/90" 
                      : "text-gray-500 hover:bg-gray-100"
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

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Rows per page</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{rowsPerPage}</span>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
