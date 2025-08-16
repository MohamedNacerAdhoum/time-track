import React, { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  Trash2,
  MessageCircle,
  Eye,
  RotateCcw,
  Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteItemModal } from "@/components/general/DeleteItemModal";
import { cn } from "@/lib/utils";

// Mock data for demands
interface Demand {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
  state: "Pending" | "Approved" | "Declined";
  type: "sent" | "received";
}

const mockDemands: Demand[] = [
  {
    id: "1",
    name: "User xxxxx",
    subject: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    createdAt: "31/08/2022 - 08:20",
    state: "Pending",
    type: "received",
  },
  {
    id: "2",
    name: "User xxxxx",
    subject: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    createdAt: "31/08/2022 - 08:20",
    state: "Declined",
    type: "received",
  },
  {
    id: "3",
    name: "User xxxxx",
    subject: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    createdAt: "31/08/2022 - 08:20",
    state: "Pending",
    type: "sent",
  },
  {
    id: "4",
    name: "User xxxxx",
    subject: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    createdAt: "31/08/2022 - 08:20",
    state: "Approved",
    type: "received",
  },
  {
    id: "5",
    name: "User xxxxx",
    subject: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    createdAt: "31/08/2022 - 08:20",
    state: "Declined",
    type: "sent",
  },
  {
    id: "6",
    name: "User xxxxx",
    subject: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    createdAt: "31/08/2022 - 08:20",
    state: "Pending",
    type: "received",
  },
];

function StateBadge({ state }: { state: "Pending" | "Approved" | "Declined" }) {
  const getBadgeStyle = (state: string) => {
    switch (state) {
      case "Approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "Declined":
        return "bg-red-100 text-red-700 border-red-200";
      case "Pending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-4 py-1 text-sm font-semibold rounded-full border",
        getBadgeStyle(state),
      )}
    >
      {state}
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

export default function DemandsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [showRowsDropdown, setShowRowsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDemands, setSelectedDemands] = useState<Set<string>>(
    new Set(),
  );
  const [selectAll, setSelectAll] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, rowsPerPage, activeTab]);

  // Update select all state based on selected demands
  useEffect(() => {
    const currentPageData = currentData;
    const selectedOnPage = currentPageData.filter((demand) =>
      selectedDemands.has(demand.id),
    );

    if (selectedOnPage.length === 0) {
      setSelectAll(false);
      setIsIndeterminate(false);
    } else if (selectedOnPage.length === currentPageData.length) {
      setSelectAll(true);
      setIsIndeterminate(false);
    } else {
      setSelectAll(false);
      setIsIndeterminate(true);
    }
  }, [selectedDemands, currentPage, rowsPerPage]);

  // Filtering
  const filteredData = mockDemands.filter((demand) => {
    const matchesSearch = searchQuery
      ? demand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demand.subject.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "sent" && demand.type === "sent") ||
      (activeTab === "received" && demand.type === "received");

    return matchesSearch && matchesTab;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handleSelectAll = (checked: boolean) => {
    const newSelected = new Set(selectedDemands);

    if (checked) {
      // Add all current page demands to selection
      currentData.forEach((demand) => newSelected.add(demand.id));
    } else {
      // Remove all current page demands from selection
      currentData.forEach((demand) => newSelected.delete(demand.id));
    }

    setSelectedDemands(newSelected);
  };

  const handleSelectDemand = (demandId: string, checked: boolean) => {
    const newSelected = new Set(selectedDemands);

    if (checked) {
      newSelected.add(demandId);
    } else {
      newSelected.delete(demandId);
    }

    setSelectedDemands(newSelected);
  };

  const handleDeleteSelected = async () => {
    try {
      // Here you would typically call your API to delete the selected demands
      console.log("Deleting demands:", Array.from(selectedDemands));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear selection
      setSelectedDemands(new Set());

      // Show success message (you might want to use a toast notification here)
      console.log("Demands deleted successfully");
    } catch (error) {
      console.error("Error deleting demands:", error);
      throw error; // This will be caught by the DeleteItemModal
    }
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleAddDemand = () => {
    // This will do nothing for now as requested
    console.log("Add demand button clicked - no action implemented yet");
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex justify-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-16 p-2 bg-white rounded-2xl border border-blue-200">
            <TabsTrigger
              value="all"
              className="h-12 text-lg font-medium data-[state=active]:text-white text-gray-600 data-[state=active]:bg-[#63CDFA] rounded-xl"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="sent"
              className="h-12 text-lg font-medium data-[state=active]:text-white text-gray-600 data-[state=active]:bg-[#63CDFA] rounded-xl"
            >
              Sent
            </TabsTrigger>
            <TabsTrigger
              value="received"
              className="h-12 text-lg font-medium data-[state=active]:text-white text-gray-600 data-[state=active]:bg-[#63CDFA] rounded-xl"
            >
              Received
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search + Action Buttons */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
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

        <div className="flex items-center gap-2">
          <Button
            onClick={handleAddDemand}
            className="bg-[#63CDFA] hover:bg-[#4BA8E8] text-white px-5 py-[18px] rounded-xl shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] flex items-center gap-3"
          >
            <Plus className="h-6 w-6" />
          </Button>

          {selectedDemands.size > 0 && (
            <>
              <Button
                onClick={handleOpenDeleteModal}
                className="bg-[#FF6262] hover:bg-[#FF4444] text-white px-5 py-[18px] rounded-xl shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] flex items-center gap-3"
              >
                <Trash2 className="h-6 w-6" />
              </Button>

              <DeleteItemModal
                isOpen={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDeleteSelected}
                title={`Delete ${selectedDemands.size} Demand${selectedDemands.size > 1 ? "s" : ""}?`}
                description={`Are you sure you want to delete the selected ${selectedDemands.size} demand${selectedDemands.size > 1 ? "s" : ""}? This action cannot be undone.`}
                confirmButtonText={`Delete ${selectedDemands.size > 0 ? selectedDemands.size : ""} Demand${selectedDemands.size > 1 ? "s" : ""}`}
                itemName={
                  selectedDemands.size > 1
                    ? `${selectedDemands.size} demands`
                    : "demand"
                }
              />
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#63CDFA] hover:bg-[#63CDFA]">
              <TableHead className="text-white font-semibold py-4 w-10">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={selectAll}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onCheckedChange={handleSelectAll}
                    className="w-6 h-6 border-2 border-white data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-[#0061FF]"
                  />
                </div>
              </TableHead>
              <TableHead className="text-white font-semibold w-32">
                <SortableHeader>Name</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold">
                <SortableHeader showArrow={false}>Subject</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold w-28">
                <SortableHeader>Created at</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold w-24 text-center">
                <SortableHeader showArrow={false}>State</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold w-40 text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((demand, index) => (
                <TableRow
                  key={demand.id}
                  className={cn(
                    "border-b border-gray-100",
                    index % 2 === 0 ? "bg-white" : "bg-[#F2FBFF]",
                  )}
                >
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedDemands.has(demand.id)}
                      onCheckedChange={(checked) =>
                        handleSelectDemand(demand.id, checked as boolean)
                      }
                      className="w-6 h-6 border-2 border-[#0061FF] data-[state=checked]:bg-[#0061FF] data-[state=checked]:border-[#0061FF]"
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    {demand.name}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    <div className="truncate max-w-md" title={demand.subject}>
                      {demand.subject}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {demand.createdAt}
                  </TableCell>
                  <TableCell className="text-center">
                    <StateBadge state={demand.state} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      {/* Reply Button */}
                      <div className="flex items-center bg-[#F2FBFF] rounded-lg px-2 py-1 gap-1">
                        <RotateCcw className="h-4 w-4 text-[#63CDFA]" />
                        <span className="text-xs font-semibold text-[#63CDFA]">
                          Reply
                        </span>
                      </div>

                      {/* View Reply Button */}
                      <div className="flex items-center bg-[#F2FBFF] rounded-lg px-2 py-1 gap-1">
                        <Eye className="h-4 w-4 text-[#63CDFA]" />
                        <span className="text-xs font-semibold text-[#63CDFA]">
                          View
                        </span>
                      </div>

                      {/* Circular Action Button */}
                      <button className="w-8 h-8 rounded-full border border-[#63CDFA] bg-white flex items-center justify-center hover:bg-[#F2FBFF] transition-colors">
                        <Mail className="h-4 w-4 text-[#63CDFA]" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-gray-500 font-medium"
                >
                  No demands found
                </TableCell>
              </TableRow>
            )}
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
        <div className="flex items-center gap-4 relative">
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
              {[6, 10, 20, 50].map((option) => (
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
