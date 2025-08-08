import React, { useState } from "react";
import { Search, ChevronDown, Calendar, ArrowUpDown, FileText, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
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
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const totalPages = Math.ceil(mockData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = mockData.slice(startIndex, endIndex);

  const handleNoteClick = (entryId: string) => {
    setSelectedNoteId(entryId);
    setIsNoteModalOpen(true);
  };

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
              <TableHead className="text-white font-semibold py-6 w-32">
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
              <TableHead className="text-white font-semibold w-32">
                <SortableHeader>Break Period / day</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold text-center w-32">
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
                      onClick={() => handleNoteClick(entry.id)}
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

      {/* Note Modal - Temporarily disabled for debugging */}
      {/* <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
        <DialogContent className="max-w-[575px] p-0 bg-white border-2 border-[#63CDFA]/40 rounded-xl overflow-hidden">
          <div className="p-8">
            Header
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.75 3.7775C23.75 3.7675 23.75 3.76 23.75 3.75V1.25C23.75 0.918479 23.6183 0.600537 23.3839 0.366117C23.1495 0.131696 22.8315 0 22.5 0C22.1685 0 21.8505 0.131696 21.6161 0.366117C21.3817 0.600537 21.25 0.918479 21.25 1.25V2.625C20.8386 2.54146 20.4198 2.49958 20 2.5H18.75V1.25C18.75 0.918479 18.6183 0.600537 18.3839 0.366117C18.1495 0.131696 17.8315 0 17.5 0C17.1685 0 16.8505 0.131696 16.6161 0.366117C16.3817 0.600537 16.25 0.918479 16.25 1.25V2.5H13.75V1.25C13.75 0.918479 13.6183 0.600537 13.3839 0.366117C13.1495 0.131696 12.8315 0 12.5 0C12.1685 0 11.8505 0.131696 11.6161 0.366117C11.3817 0.600537 11.25 0.918479 11.25 1.25V2.5H10C9.58019 2.49958 9.16141 2.54146 8.75 2.625V1.25C8.75 0.918479 8.6183 0.600537 8.38388 0.366117C8.14946 0.131696 7.83152 0 7.5 0C7.16848 0 6.85054 0.131696 6.61612 0.366117C6.3817 0.600537 6.25 0.918479 6.25 1.25V3.75V3.7775C5.47598 4.35547 4.84712 5.10567 4.41321 5.96873C3.97929 6.83179 3.75223 7.784 3.75 8.75V23.75C3.75198 25.407 4.4111 26.9956 5.58277 28.1672C6.75445 29.3389 8.34301 29.998 10 30H20C21.657 29.998 23.2456 29.3389 24.4172 28.1672C25.5889 26.9956 26.248 25.407 26.25 23.75V8.75C26.2478 7.784 26.0207 6.83179 25.5868 5.96873C25.1529 5.10567 24.524 4.35547 23.75 3.7775ZM15 21.25H10C9.66848 21.25 9.35054 21.1183 9.11612 20.8839C8.8817 20.6495 8.75 20.3315 8.75 20C8.75 19.6685 8.8817 19.3505 9.11612 19.1161C9.35054 18.8817 9.66848 18.75 10 18.75H15C15.3315 18.75 15.6495 18.8817 15.8839 19.1161C16.1183 19.3505 16.25 19.6685 16.25 20C16.25 20.3315 16.1183 20.6495 15.8839 20.8839C15.6495 21.1183 15.3315 21.25 15 21.25ZM20 16.25H10C9.66848 16.25 9.35054 16.1183 9.11612 15.8839C8.8817 15.6495 8.75 15.3315 8.75 15C8.75 14.6685 8.8817 14.3505 9.11612 14.1161C9.35054 13.8817 9.66848 13.75 10 13.75H20C20.3315 13.75 20.6495 13.8817 20.8839 14.1161C21.1183 14.3505 21.25 14.6685 21.25 15C21.25 15.3315 21.1183 16.6495 20.8839 15.8839C20.6495 16.1183 20.3315 16.25 20 16.25ZM20 11.25H10C9.66848 11.25 9.35054 11.1183 9.11612 10.8839C8.8817 10.6495 8.75 10.3315 8.75 10C8.75 9.66848 8.8817 9.35054 9.11612 9.11612C9.35054 8.8817 9.66848 8.75 10 8.75H20C20.3315 8.75 20.6495 8.8817 20.8839 9.11612C21.1183 9.35054 21.25 9.66848 21.25 10C21.25 10.3315 21.1183 10.6495 20.8839 10.8839C20.6495 11.1183 20.3315 11.25 20 11.25Z" fill="#63CDFA"/>
                </svg>
                <h2 className="text-2xl font-semibold text-[#63CDFA]">Note</h2>
              </div>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </Button>
              </DialogClose>
            </div>

            Content
            <div className="text-[#00003C] text-lg leading-7 font-light">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus consequat eros ut nunc lacinia, iaculis maximus sapien efficitur. Praesent augue erat, accumsan id diam quis, ornare vulputate eros.
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
