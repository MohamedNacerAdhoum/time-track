import React, { useState, useEffect } from "react";
import { useMembersStore } from "@/contexts/MembersContext";
import { MemberData } from "@/contexts/MembersContext";
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
  Edit,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { DeleteItemModal } from "@/components/general/DeleteItemModal";
import { UserFormModal } from "@/components/general/UserFormModal";

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

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

export default function MembersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showRowsDropdown, setShowRowsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    new Set(),
  );
  const [membersdata, setMembersData] = useState<MemberData[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { fetchAllMembers } = useMembersStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllMembers();
        if (data) setMembersData(data);
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };
    fetchData();
  }, [fetchAllMembers]);

  // Use mock data for now
  const members = membersdata;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, rowsPerPage]);

  // Update select all state based on selected members
  useEffect(() => {
    const currentPageData = filteredData.slice(
      startIndex,
      startIndex + rowsPerPage,
    );
    const selectedOnPage = currentPageData.filter((member) =>
      selectedMembers.has(member.id),
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
  }, [selectedMembers, currentPage, rowsPerPage]);

  // Filtering
  const filteredData = members.filter((member) => {
    return searchQuery
      ? member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role_name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handleSelectAll = (checked: boolean) => {
    const newSelected = new Set(selectedMembers);

    if (checked) {
      // Add all current page members to selection
      currentData.forEach((member) => newSelected.add(member.id));
    } else {
      // Remove all current page members from selection
      currentData.forEach((member) => newSelected.delete(member.id));
    }

    setSelectedMembers(newSelected);
  };

  const handleSelectMember = (memberId: string, checked: boolean) => {
    const newSelected = new Set(selectedMembers);

    if (checked) {
      newSelected.add(memberId);
    } else {
      newSelected.delete(memberId);
    }

    setSelectedMembers(newSelected);
  };

  const handleDeleteSelected = async () => {
    try {
      // Here you would typically call your API to delete the selected members
      console.log("Deleting members:", Array.from(selectedMembers));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update the local state to remove the deleted members
      setMembersData(prevMembers =>
        prevMembers.filter(member => !selectedMembers.has(member.id))
      );

      // Clear selection
      setSelectedMembers(new Set());

      // Show success message (you might want to use a toast notification here)
      console.log("Members deleted successfully");
    } catch (error) {
      console.error("Error deleting members:", error);
      throw error; // This will be caught by the DeleteItemModal
    }
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleEditMember = (memberId: string) => {
    console.log("Edit member:", memberId);
  };

  return (
    <div className="space-y-6">
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
            onClick={() => console.log("Add new member")}
            className="bg-[#63CDFA] hover:bg-[#4BA8E8] text-white px-5 py-[18px] rounded-xl shadow-[-4px_4px_12px_0_rgba(0,0,0,0.25)] flex items-center gap-3"
          >
            <Plus className="h-6 w-6" />
          </Button>

          {selectedMembers.size > 0 && (
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
                title={`Delete ${selectedMembers.size} Member${selectedMembers.size > 1 ? 's' : ''}?`}
                description={`Are you sure you want to delete the selected ${selectedMembers.size} member${selectedMembers.size > 1 ? 's' : ''}? This action cannot be undone.`}
                confirmButtonText={`Delete ${selectedMembers.size > 0 ? selectedMembers.size : ''} Member${selectedMembers.size > 1 ? 's' : ''}`}
                itemName={selectedMembers.size > 1 ? `${selectedMembers.size} members` : 'member'}
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
                    onCheckedChange={handleSelectAll}
                    className="w-6 h-6 border-2 border-white data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-[#0061FF]"
                  />
                </div>
              </TableHead>
              <TableHead className="text-white font-semibold w-40">
                <SortableHeader>Name</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold w-40">
                <SortableHeader showArrow={false}>Email</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold w-16">
                <SortableHeader showArrow={false}>Age</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold w-24">
                <SortableHeader showArrow={false}>Role</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold w-24">
                <SortableHeader showArrow={false}>Location</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold w-28">
                <SortableHeader showArrow={false}>Experience</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold w-20">
                <SortableHeader>Hours</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold w-24">
                <SortableHeader>Balance</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold">
                <SortableHeader showArrow={false}>Joined</SortableHeader>
              </TableHead>
              <TableHead className="text-white font-semibold">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((member, index) => (
                <TableRow
                  key={member.id}
                  className={cn(
                    "border-b border-gray-100",
                    index % 2 === 0 ? "bg-white" : "bg-[#F2FBFF]",
                  )}
                >
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selectedMembers.has(member.id)}
                      onCheckedChange={(checked) =>
                        handleSelectMember(member.id, checked as boolean)
                      }
                      className="w-6 h-6 border-2 border-[#0061FF] data-[state=checked]:bg-[#0061FF] data-[state=checked]:border-[#0061FF]"
                    />
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    {member.name}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {member.email}
                  </TableCell>
                  <TableCell className="text-gray-500">{member.age}</TableCell>
                  <TableCell className="text-gray-500">{member.role_name}</TableCell>
                  <TableCell className="text-gray-500">
                    {member.location}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {member.experience}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {member.hours} h
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {member.payrate}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {formatDate(member.joined)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditMember(member.id)}
                      className="h-8 w-8 text-[#63CDFA] hover:text-[#63CDFA] hover:bg-blue-50"
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center py-10 text-gray-500 font-medium"
                >
                  No members found
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
