import React, { useState, useEffect } from "react";
import {
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
import { SearchBar } from "@/components/ui/search-bar";
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
import { DemandResponseModal } from "@/components/demands/DemandResponseModal";
import { DemandViewModal } from "@/components/demands/DemandViewModal";
import { MakeDemandModal } from "@/components/demands/MakeDemandModal";
import { cn } from "@/lib/utils";

import {
  useDemands,
  type DemandData,
  type EmployeeData,
} from "@/contexts/DemandsContext";
import { useMembersStore } from "@/contexts/MembersContext";
import { useAdminView } from "@/contexts/AdminViewContext";

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
  const { isAdminView } = useAdminView();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsDropdown, setShowRowsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDemands, setSelectedDemands] = useState<Set<string>>(
    new Set(),
  );
  const [selectAll, setSelectAll] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isMakeDemandModalOpen, setIsMakeDemandModalOpen] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"demand" | "response">("demand");
  const [currentResponse, setCurrentResponse] = useState<any>(null);

  // Get all necessary data and methods from contexts
  const {
    demands,
    userDemands,
    loading: demandsLoading,
    error: demandsError,
    fetchAllDemands,
    fetchUserDemands,
    fetchDemandSilently,
    createDemand,
    createDemandResponse,
    getDemandResponse,
    deleteDemands,
    approveDemand,
    rejectDemand,
  } = useDemands();

  const { currentUser: memberUser } = useMembersStore();
  const isAdmin = memberUser?.is_staff;
  const currentUser = memberUser;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, rowsPerPage, isAdminView]);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        if (isAdminView) {
          await fetchAllDemands();
        } else {
          await fetchUserDemands();
        }
      } catch (err) {
        console.error("Error fetching initial demands:", err);
      }
    };

    fetchInitialData();
  }, [isAdminView, fetchAllDemands, fetchUserDemands]);

  // Reset selected demands when data changes
  useEffect(() => {
    setSelectedDemands(new Set());
    setSelectAll(false);
    setIsIndeterminate(false);
  }, [demands, userDemands]);

  // Get the appropriate demands based on view, tab, and search query
  const getFilteredDemands = (): DemandData[] => {
    const sourceDemands = isAdminView ? demands : userDemands;

    return sourceDemands.filter((demand: DemandData) => {
      // Filter by tab
      if (activeTab === "sent") {
        // Check if the current user is the sender
        const senderUserId = demand.sender?.user;
        const isSentByCurrentUser = senderUserId === currentUser?.id;
        if (!isSentByCurrentUser) return false;
      } else if (activeTab === "received") {
        // Check if the current user is in the receivers list
        const receiverUserIds =
          demand.receivers?.map((r: EmployeeData) => r.user).filter(Boolean) ||
          [];
        const isReceivedByCurrentUser = receiverUserIds.includes(
          currentUser?.id,
        );
        if (!isReceivedByCurrentUser) return false;
      }

      // Filter by state if tab is a state filter
      if (
        activeTab !== "all" &&
        activeTab !== "sent" &&
        activeTab !== "received"
      ) {
        if (demand.state !== activeTab.toUpperCase()) {
          return false;
        }
      }

      // Filter by search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSubject =
          demand.subject?.toLowerCase().includes(searchLower) || false;
        const matchesBody =
          demand.body?.toLowerCase().includes(searchLower) || false;
        const senderName =
          typeof demand.sender?.name === "string"
            ? demand.sender.name.toLowerCase()
            : "";
        const matchesSender = senderName.includes(searchLower);

        if (!matchesSubject && !matchesBody && !matchesSender) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredDemands = getFilteredDemands();

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDemands.length / rowsPerPage),
  );
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedDemands = filteredDemands.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  // Update select all state based on selected demands
  useEffect(() => {
    const currentPageData = paginatedDemands;
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

  // State changes effect
  useEffect(() => {
    // State change handling if needed
  }, [filteredDemands, paginatedDemands, isAdminView, activeTab]);

  // Handle tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, rowsPerPage]);

  if (demandsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (demandsError) {
    return (
      <div className="text-red-500 p-4 text-center">
        Error loading demands: {String(demandsError)}
      </div>
    );
  }

  const handleSelectAll = (checked: boolean) => {
    const newSelected = new Set(selectedDemands);

    if (checked) {
      // Add all current page demands to selection
      filteredDemands
        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
        .forEach((demand) => newSelected.add(demand.id));
    } else {
      // Remove all current page demands from selection
      filteredDemands
        .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
        .forEach((demand) => newSelected.delete(demand.id));
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
      await deleteDemands(Array.from(selectedDemands));
      setSelectedDemands(new Set());
    } catch (error) {
      console.error("Error deleting demands:", error);
      throw error;
    }
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleAddDemand = () => {
    setIsMakeDemandModalOpen(true);
  };

  const handleReply = (demand: any) => {
    setSelectedDemand(demand);
    setIsResponseModalOpen(true);
  };

  const handleView = async (demand: any, isResponse = false) => {
    console.log("handleView called with:", { demand, isResponse, currentUser });
    setSelectedDemand(demand);
    setViewMode(isResponse ? "response" : "demand");

    if (isResponse) {
      // Case 1: response is a full object
      if (demand.response && typeof demand.response === "object") {
        console.log("Using full response object from demand:", demand.response);
        setCurrentResponse(demand.response);
      }
      // Case 2: response is just an ID string or we have a response_id
      else if (typeof demand.response === "string" || demand.response_id) {
        const responseId = demand.response_id || demand.response;
        console.log("Fetching response data for demand ID:", demand.id);
        try {
          // Get the full demand with its response without showing loading state
          const fullDemand = await fetchDemandSilently(demand.id);
          if (fullDemand?.response) {
            console.log("Received response data:", fullDemand.response);
            setCurrentResponse(fullDemand.response);
          } else {
            console.log("No response found for demand:", demand.id);
            setCurrentResponse(null);
          }
        } catch (error) {
          console.error("Error fetching demand with response:", error);
          setCurrentResponse(null);
        }
      } else {
        console.log("No valid response data found in demand:", demand);
        setCurrentResponse(null);
      }
    } else {
      console.log("Viewing demand, not response");
      setCurrentResponse(null);
    }

    console.log("Opening view modal with state:", {
      demand,
      isResponse,
      viewMode: isResponse ? "response" : "demand",
      currentResponse: isResponse ? "fetching..." : null,
    });
    setIsViewModalOpen(true);
  };

  const handleResponseSubmit = async (data: { body: string; file?: File }) => {
    if (!selectedDemand) return;
    await createDemandResponse({
      demand_id: selectedDemand.id,
      body: data.body,
    });
    setIsResponseModalOpen(false);
  };

  const handleApproveDemand = async (demandId: string) => {
    await approveDemand(demandId);
  };

  const handleDeclineDemand = async (demandId: string) => {
    await rejectDemand(demandId);
  };

  const handleDownloadAttachment = (attachment: {
    name: string;
    url?: string;
  }) => {
    // Handle file download
    if (attachment.url) {
      window.open(attachment.url, "_blank");
    }
  };

  const handleMakeDemandSubmit = async (formData: any) => {
    try {
      // Set subject based on demand type
      const subject =
        formData.type === "permission"
          ? "Permission Demand"
          : formData.type === "leave"
            ? "Leave Demand"
            : formData.subject || "No Subject";

      let demandData: any = {
        subject,
        body: formData.body || formData.reason || "",
        demand_type: formData.type.toUpperCase(),
      };

      // Handle file attachment if present
      if (formData.file) {
        // You'll need to implement file upload logic here
        // For now, we'll just include the file object
        demandData.attachment = formData.file;
      }

      // Handle different demand types
      if (formData.type === "permission") {
        // Format permission demand data
        demandData.permission_demand = {
          date: formData.datePicker?.toISOString().split("T")[0],
          start_time: formData.from || "09:00:00",
          end_time: formData.hours
            ? calculateEndTime(formData.from, formData.hours)
            : "10:00:00",
          reason: formData.reason || "",
        };
      } else if (formData.type === "leave") {
        // Format leave demand data
        demandData.leave_demand = {
          leave_type:
            formData.leaveType === "multiple" ? "MULTIDAY" : "SINGLEDAY",
        };

        if (formData.leaveType === "multiple") {
          demandData.leave_demand.multiday = {
            start_date: formData.fromDate?.toISOString().split("T")[0],
            end_date: formData.toDate?.toISOString().split("T")[0],
          };
        } else {
          demandData.leave_demand.singleday = {
            date: formData.singleDate?.toISOString().split("T")[0],
            time_period: formData.timePeriod || "FULL_DAY",
          };
        }
      }

      await createDemand(demandData);
      setIsMakeDemandModalOpen(false);

      // Refresh the demands after creating a new one
      if (isAdminView) {
        await fetchAllDemands();
      } else {
        await fetchUserDemands();
      }

      // Reset form and selection
      setSelectedDemands(new Set());
      setSelectAll(false);
      setIsIndeterminate(false);
    } catch (error) {
      console.error("Error creating demand:", error);
      // You might want to show an error toast here
    }
  };

  // Helper function to calculate end time based on start time and duration
  const calculateEndTime = (startTime: string, hours: string): string => {
    if (!startTime || !hours) return "10:00:00";

    try {
      const [hoursStr, minutesStr] = startTime.split(":");
      let hoursNum = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);

      // Add the duration (assuming hours is a string like '2' for 2 hours)
      const durationHours = parseInt(hours, 10) || 1;
      hoursNum += durationHours;

      // Format back to HH:MM:SS
      return `${hoursNum.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
    } catch (e) {
      console.error("Error calculating end time:", e);
      return "10:00:00";
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex justify-center">
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            const handleTabChange = (value: string) => {
              setActiveTab(value);
              // No need to fetch data here as we already have all the data
            };
            handleTabChange(value);
          }}
          className="w-full"
        >
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search demands..."
          className="sm:max-w-md"
          inputClassName="w-full md:w-64"
        />

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button
            onClick={handleAddDemand}
            className="bg-[#63CDFA] hover:bg-[#4BA8E8] text-white px-5 py-[18px] rounded-xl shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] flex items-center gap-3"
          >
            <Plus className="h-5 w-5" />
          </Button>

          {selectedDemands.size > 0 && (
            <>
              <Button
                onClick={handleOpenDeleteModal}
                className="bg-[#FF6262] hover:bg-[#FF4444] text-white px-5 h-12 rounded-xl shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] flex items-center gap-3"
              >
                <Trash2 className="h-5 w-5" />
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
                <SortableHeader showArrow={false}>Subject</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold">
                <SortableHeader>Created at</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold text-center">
                <SortableHeader showArrow={false}>State</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold">
                Actions
              </TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDemands.length > 0 ? (
              filteredDemands
                .slice(
                  (currentPage - 1) * rowsPerPage,
                  currentPage * rowsPerPage,
                )
                .map((demand, index) => (
                  <TableRow
                    key={demand.id}
                    className={cn(
                      "border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                      index % 2 === 0 ? "bg-white" : "bg-[#F2FBFF]",
                    )}
                    onClick={() => handleView(demand)}
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
                      {demand.sender?.name || "-"}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      <div
                        className="truncate max-w-[300px]"
                        title={demand.subject}
                      >
                        {demand.subject}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {demand.created_at
                        ? new Date(demand.created_at).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <StateBadge
                        state={
                          demand.state === "PENDING"
                            ? "Pending"
                            : demand.state === "APPROVED"
                              ? "Approved"
                              : demand.state === "REJECTED"
                                ? "Declined"
                                : "Pending"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        {/* Show View Reply button if demand has a reply, otherwise show Reply button for admins */}
                        {demand.response ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              handleView(demand, true); // true indicates this is a response view
                            }}
                            className="bg-[#F2FBFF] hover:bg-[#E1F3FF] text-[#63CDFA] rounded-lg px-2 py-1 h-auto flex items-center gap-1 text-xs font-semibold"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">View Reply</span>
                          </Button>
                        ) : isAdmin ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              handleReply(demand);
                            }}
                            className="bg-[#F2FBFF] hover:bg-[#E1F3FF] text-[#63CDFA] rounded-lg px-2 py-1 h-auto flex items-center gap-1 text-xs font-semibold"
                          >
                            <RotateCcw className="h-4 w-4" />
                            <span className="hidden sm:inline">Reply</span>
                          </Button>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1 flex-wrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 rounded-full border border-[#63CDFA] bg-white hover:bg-[#F2FBFF] text-[#63CDFA]"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
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
                {
                  length: Math.min(
                    3,
                    Math.ceil(filteredDemands.length / rowsPerPage),
                  ),
                },
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
              disabled={
                currentPage === Math.ceil(filteredDemands.length / rowsPerPage)
              }
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setCurrentPage(Math.ceil(filteredDemands.length / rowsPerPage))
              }
              disabled={
                currentPage === Math.ceil(filteredDemands.length / rowsPerPage)
              }
              className="h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm text-gray-500">
            {currentPage} of {Math.ceil(filteredDemands.length / rowsPerPage)}
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

      {/* Demand Response Modal */}
      <DemandResponseModal
        isOpen={isResponseModalOpen}
        onClose={() => {
          setIsResponseModalOpen(false);
          setSelectedDemand(null);
        }}
        onSubmit={handleResponseSubmit}
        demandId={selectedDemand?.id}
      />

      {/* Demand View Modal */}
      <DemandViewModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedDemand(null);
        }}
        demand={selectedDemand}
        onApprove={handleApproveDemand}
        onDecline={handleDeclineDemand}
        onDownload={handleDownloadAttachment}
        showActions={
          isAdmin && selectedDemand && selectedDemand.state === "PENDING"
        }
        viewMode={viewMode}
        responseData={currentResponse}
      />

      {/* Make Demand Modal */}
      <MakeDemandModal
        isOpen={isMakeDemandModalOpen}
        onClose={() => setIsMakeDemandModalOpen(false)}
        onSubmit={handleMakeDemandSubmit}
      />
    </div>
  );
}
