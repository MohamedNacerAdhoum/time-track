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
import { MakeComplaintModal } from "@/components/complaints/MakeComplaintModal";
import { cn } from "@/lib/utils";

import { useAdminView } from '@/contexts/AdminViewContext';

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

// Sample complaint data structure
interface ComplaintData {
  id: string;
  name: string;
  problem: string;
  explanation: string;
  state: "Pending" | "Approved" | "Declined";
  created_at: string;
}

// Sample data - in real app this would come from an API/context
const sampleComplaints: ComplaintData[] = [
  {
    id: "1",
    name: "John Smith",
    problem: "Workplace harassment",
    explanation: "Experiencing inappropriate behavior from a colleague during meetings",
    state: "Pending",
    created_at: new Date().toISOString(),
  },
  {
    id: "2", 
    name: "Sarah Johnson",
    problem: "Equipment malfunction",
    explanation: "Office computer keeps crashing and affecting productivity",
    state: "Approved",
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

export default function ComplaintsPage() {
  const { isAdminView } = useAdminView();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsDropdown, setShowRowsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("complaints");
  const [selectedComplaints, setSelectedComplaints] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMakeComplaintModalOpen, setIsMakeComplaintModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintData | null>(null);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, rowsPerPage, isAdminView]);

  // Reset selected complaints when data changes
  useEffect(() => {
    setSelectedComplaints(new Set());
    setSelectAll(false);
    setIsIndeterminate(false);
  }, [activeTab]);

  // Get the appropriate complaints based on view, tab, and search query
  const getFilteredComplaints = (): ComplaintData[] => {
    let sourceComplaints = activeTab === "complaints" ? sampleComplaints : [];

    return sourceComplaints.filter((complaint: ComplaintData) => {
      // Filter by search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesName = complaint.name?.toLowerCase().includes(searchLower) || false;
        const matchesProblem = complaint.problem?.toLowerCase().includes(searchLower) || false;
        const matchesExplanation = complaint.explanation?.toLowerCase().includes(searchLower) || false;

        if (!matchesName && !matchesProblem && !matchesExplanation) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredComplaints = getFilteredComplaints();

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredComplaints.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedComplaints = filteredComplaints.slice(startIndex, startIndex + rowsPerPage);

  // Update select all state based on selected complaints
  useEffect(() => {
    const currentPageData = paginatedComplaints;
    const selectedOnPage = currentPageData.filter((complaint) =>
      selectedComplaints.has(complaint.id),
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
  }, [selectedComplaints, currentPage, rowsPerPage]);

  // Handle tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, rowsPerPage]);

  const handleSelectAll = (checked: boolean) => {
    const newSelected = new Set(selectedComplaints);

    if (checked) {
      // Add all current page complaints to selection
      filteredComplaints.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).forEach((complaint) => newSelected.add(complaint.id));
    } else {
      // Remove all current page complaints from selection
      filteredComplaints.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).forEach((complaint) => newSelected.delete(complaint.id));
    }

    setSelectedComplaints(newSelected);
  };

  const handleSelectComplaint = (complaintId: string, checked: boolean) => {
    const newSelected = new Set(selectedComplaints);

    if (checked) {
      newSelected.add(complaintId);
    } else {
      newSelected.delete(complaintId);
    }

    setSelectedComplaints(newSelected);
  };

  const handleDeleteSelected = async () => {
    try {
      // In real app, this would call an API to delete complaints
      console.log("Deleting complaints:", Array.from(selectedComplaints));
      setSelectedComplaints(new Set());
    } catch (error) {
      console.error("Error deleting complaints:", error);
      throw error;
    }
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleAddComplaint = () => {
    setIsMakeComplaintModalOpen(true);
  };

  const handleSeeMore = (complaint: ComplaintData) => {
    setSelectedComplaint(complaint);
    // TODO: Open complaint view modal
    console.log("See more for complaint:", complaint);
  };

  const handleMakeComplaintSubmit = async (formData: any) => {
    try {
      // In real app, this would call an API to create a complaint
      console.log("Creating complaint:", formData);
      setIsMakeComplaintModalOpen(false);

      // Reset form and selection
      setSelectedComplaints(new Set());
      setSelectAll(false);
      setIsIndeterminate(false);
    } catch (error) {
      console.error("Error creating complaint:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex justify-center">
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-16 p-2 bg-white rounded-2xl border border-blue-200">
            <TabsTrigger
              value="complaints"
              className="h-12 text-lg font-medium data-[state=active]:text-white text-gray-600 data-[state=active]:bg-[#63CDFA] rounded-xl"
            >
              Complaints
            </TabsTrigger>
            <TabsTrigger
              value="attendance-claims"
              className="h-12 text-lg font-medium data-[state=active]:text-white text-gray-600 data-[state=active]:bg-[#63CDFA] rounded-xl"
            >
              Attendance Claims
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search + Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  placeholder={activeTab === "complaints" ? "Search complaints..." : "Search attendance claims..."}
                  className="pl-10 w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                  }}
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            onClick={handleAddComplaint}
            className="bg-[#63CDFA] hover:bg-[#4BA8E8] text-white px-5 py-[18px] rounded-xl shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] flex items-center gap-3"
          >
            <Plus className="h-6 w-6" />
          </Button>

          {selectedComplaints.size > 0 && (
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
                title={`Delete ${selectedComplaints.size} Complaint${selectedComplaints.size > 1 ? "s" : ""}?`}
                description={`Are you sure you want to delete the selected ${selectedComplaints.size} complaint${selectedComplaints.size > 1 ? "s" : ""}? This action cannot be undone.`}
                confirmButtonText={`Delete ${selectedComplaints.size > 0 ? selectedComplaints.size : ""} Complaint${selectedComplaints.size > 1 ? "s" : ""}`}
                itemName={
                  selectedComplaints.size > 1
                    ? `${selectedComplaints.size} complaints`
                    : "complaint"
                }
              />
            </>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "complaints" && (
        <>
          {/* Table */}
          <div className="bg-white rounded-xl overflow-hidden overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-[#63CDFA] hover:bg-[#63CDFA]">
                  <TableHead className="text-white font-semibold py-4 w-12">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={selectAll}
                        ref={(el) => {
                          if (el) (el as any).indeterminate = isIndeterminate;
                        }}
                        onCheckedChange={handleSelectAll}
                        className="w-6 h-6 border-2 border-white data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-[#0061FF]"
                      />
                    </div>
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    <SortableHeader>Name</SortableHeader>
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    <SortableHeader showArrow={false}>Problem</SortableHeader>
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    <SortableHeader showArrow={false}>Explanation</SortableHeader>
                  </TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map((complaint, index) => (
                    <TableRow
                      key={complaint.id}
                      className={cn(
                        "border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                        index % 2 === 0 ? "bg-white" : "bg-[#F2FBFF]",
                      )}
                    >
                      <TableCell className="text-center">
                        <Checkbox
                          checked={selectedComplaints.has(complaint.id)}
                          onCheckedChange={(checked) =>
                            handleSelectComplaint(complaint.id, checked as boolean)
                          }
                          className="w-6 h-6 border-2 border-[#0061FF] data-[state=checked]:bg-[#0061FF] data-[state=checked]:border-[#0061FF]"
                        />
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        {complaint.name}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        <div
                          className="truncate max-w-[300px]"
                          title={complaint.problem}
                        >
                          {complaint.problem}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        <div
                          className="truncate max-w-[300px]"
                          title={complaint.explanation}
                        >
                          {complaint.explanation}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSeeMore(complaint);
                          }}
                          className="bg-[#F2FBFF] hover:bg-[#E1F3FF] text-[#63CDFA] rounded-lg px-2 py-1 h-auto flex items-center gap-1 text-xs font-semibold"
                        >
                          See more
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-10 text-gray-500 font-medium"
                    >
                      No complaints found
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
                    { length: Math.min(3, Math.ceil(filteredComplaints.length / rowsPerPage)) },
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
                  disabled={currentPage === Math.ceil(filteredComplaints.length / rowsPerPage)}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage(Math.ceil(filteredComplaints.length / rowsPerPage))}
                  disabled={currentPage === Math.ceil(filteredComplaints.length / rowsPerPage)}
                  className="h-8 w-8"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-gray-500">
                {currentPage} of {Math.ceil(filteredComplaints.length / rowsPerPage)}
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
        </>
      )}

      {/* Attendance Claims Tab Content */}
      {activeTab === "attendance-claims" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Attendance Claims</h3>
            <p className="text-gray-500">
              Attendance claims functionality will be implemented here.
            </p>
          </div>
        </div>
      )}

      {/* Make Complaint Modal */}
      <MakeComplaintModal
        isOpen={isMakeComplaintModalOpen}
        onClose={() => setIsMakeComplaintModalOpen(false)}
        onSubmit={handleMakeComplaintSubmit}
      />
    </div>
  );
}
