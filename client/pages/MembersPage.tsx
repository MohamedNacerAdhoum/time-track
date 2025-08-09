import React, { useState, useEffect } from "react";
import { useMembersStore } from "@/contexts/MembersContext";
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
  Edit
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

interface Member {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  location: string;
  experience: string;
  hours: number;
  balance: number;
  joined: string;
}

// Mock data based on the Figma design
const mockMembers: Member[] = [
  {
    id: "1",
    name: "User xxxxx",
    email: "xxxx@gmail.com",
    age: 35,
    role: "yyyyy",
    location: "yyyyy",
    experience: "1 year",
    hours: 20,
    balance: 102.3,
    joined: "31/08/2022"
  },
  {
    id: "2",
    name: "User xxxxx",
    email: "xxxx@gmail.com",
    age: 35,
    role: "yyyyy",
    location: "yyyyy",
    experience: "1 year",
    hours: 20,
    balance: 102.3,
    joined: "31/08/2022"
  },
  {
    id: "3",
    name: "User xxxxx",
    email: "xxxx@gmail.com",
    age: 35,
    role: "yyyyy",
    location: "yyyyy",
    experience: "1 year",
    hours: 20,
    balance: 102.3,
    joined: "31/08/2022"
  },
  {
    id: "4",
    name: "User xxxxx",
    email: "xxxx@gmail.com",
    age: 35,
    role: "yyyyy",
    location: "yyyyy",
    experience: "1 year",
    hours: 20,
    balance: 102.3,
    joined: "31/08/2022"
  },
  {
    id: "5",
    name: "User xxxxx",
    email: "xxxx@gmail.com",
    age: 35,
    role: "yyyyy",
    location: "yyyyy",
    experience: "1 year",
    hours: 20,
    balance: 102.3,
    joined: "31/08/2022"
  },
  {
    id: "6",
    name: "User xxxxx",
    email: "xxxx@gmail.com",
    age: 35,
    role: "yyyyy",
    location: "yyyyy",
    experience: "1 year",
    hours: 20,
    balance: 102.3,
    joined: "31/08/2022"
  },
  {
    id: "7",
    name: "User xxxxx",
    email: "xxxx@gmail.com",
    age: 35,
    role: "yyyyy",
    location: "yyyyy",
    experience: "1 year",
    hours: 20,
    balance: 102.3,
    joined: "31/08/2022"
  },
  {
    id: "8",
    name: "User xxxxx",
    email: "xxxx@gmail.com",
    age: 35,
    role: "yyyyy",
    location: "yyyyy",
    experience: "1 year",
    hours: 20,
    balance: 102.3,
    joined: "31/08/2022"
  },
  {
    id: "9",
    name: "User xxxxx",
    email: "xxxx@gmail.com",
    age: 35,
    role: "yyyyy",
    location: "yyyyy",
    experience: "1 year",
    hours: 20,
    balance: 102.3,
    joined: "31/08/2022"
  },
  {
    id: "10",
    name: "User xxxxx",
    email: "xxxx@gmail.com",
    age: 35,
    role: "yyyyy",
    location: "yyyyy",
    experience: "1 year",
    hours: 20,
    balance: 102.3,
    joined: "31/08/2022"
  }
];

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
        className
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
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isIndeterminate, setIsIndeterminate] = useState(false);

  // Use mock data for now
  const members = mockMembers;

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage]);

  // Update select all state based on selected members
  useEffect(() => {
    const currentPageData = filteredData.slice(startIndex, startIndex + rowsPerPage);
    const selectedOnPage = currentPageData.filter(member => selectedMembers.has(member.id));
    
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
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
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
      currentData.forEach(member => newSelected.add(member.id));
    } else {
      // Remove all current page members from selection
      currentData.forEach(member => newSelected.delete(member.id));
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

  const handleDeleteSelected = () => {
    console.log("Delete selected members:", Array.from(selectedMembers));
    setSelectedMembers(new Set());
  };

  const handleEditMember = (memberId: string) => {
    console.log("Edit member:", memberId);
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end items-center gap-2">
        <Button
          onClick={() => console.log("Add new member")}
          className="bg-[#63CDFA] hover:bg-[#4BA8E8] text-white px-5 py-4 rounded-xl shadow-lg flex items-center gap-3"
        >
          <Plus className="h-6 w-6" />
        </Button>
        
        {selectedMembers.size > 0 && (
          <Button
            onClick={handleDeleteSelected}
            className="bg-[#FF6262] hover:bg-[#FF4444] text-white px-5 py-4 rounded-xl shadow-lg flex items-center gap-3"
          >
            <Trash2 className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Search */}
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          {/* Header */}
          <div className="bg-[#63CDFA] px-5 py-5 flex items-center">
            <div className="flex items-center justify-center w-6 mr-7">
              <Checkbox
                checked={selectAll}
                onCheckedChange={handleSelectAll}
                className="w-6 h-6 border-2 border-[#0061FF] data-[state=checked]:bg-[#0061FF] data-[state=checked]:border-[#0061FF]"
                style={{
                  // Custom indeterminate state styling
                  ...(isIndeterminate && {
                    backgroundColor: '#FFF',
                    borderColor: '#0061FF',
                  })
                }}
              />
              {isIndeterminate && (
                <div className="absolute w-3.5 h-0.5 bg-[#0061FF] rounded-full" />
              )}
            </div>
            
            <div className="flex-1 flex items-center">
              <div className="w-[138px] mr-7">
                <SortableHeader>Name</SortableHeader>
              </div>
              
              <div className="w-[111px] mr-7">
                <SortableHeader showArrow={false}>Email</SortableHeader>
              </div>
              
              <div className="w-[50px] mr-7">
                <SortableHeader showArrow={false}>Age</SortableHeader>
              </div>
              
              <div className="w-[120px] mr-7">
                <SortableHeader showArrow={false}>Role</SortableHeader>
              </div>
              
              <div className="w-[103px] mr-7">
                <SortableHeader showArrow={false}>Location</SortableHeader>
              </div>
              
              <div className="w-[130px] mr-7">
                <SortableHeader showArrow={false}>Experience</SortableHeader>
              </div>
              
              <div className="w-[95px] mr-7">
                <SortableHeader>Hours</SortableHeader>
              </div>
              
              <div className="w-[115px] mr-7">
                <SortableHeader>Balance</SortableHeader>
              </div>
              
              <div className="flex-1">
                <SortableHeader showArrow={false}>Joined</SortableHeader>
              </div>
            </div>
          </div>

          {/* Rows */}
          {currentData.length > 0 ? (
            currentData.map((member, index) => (
              <div
                key={member.id}
                className={cn(
                  "px-5 py-5 flex items-center border-b border-gray-100",
                  index % 2 === 1 ? "bg-[#F2FBFF]" : "bg-white"
                )}
              >
                <div className="flex items-center justify-center w-6 mr-7">
                  <Checkbox
                    checked={selectedMembers.has(member.id)}
                    onCheckedChange={(checked) => handleSelectMember(member.id, checked as boolean)}
                    className="w-6 h-6 border-2 border-[#0061FF] data-[state=checked]:bg-[#0061FF] data-[state=checked]:border-[#0061FF]"
                  />
                </div>
                
                <div className="flex-1 flex items-center">
                  <div className="w-[138px] mr-7">
                    <span className="text-black font-semibold text-base">{member.name}</span>
                  </div>
                  
                  <div className="w-[111px] mr-7">
                    <span className="text-[#7F7F7F] text-base truncate block">{member.email}</span>
                  </div>
                  
                  <div className="w-[50px] mr-7">
                    <span className="text-[#7F7F7F] text-base">{member.age}</span>
                  </div>
                  
                  <div className="w-[120px] mr-7">
                    <span className="text-[#7F7F7F] text-base truncate block">{member.role}</span>
                  </div>
                  
                  <div className="w-[103px] mr-7">
                    <span className="text-[#7F7F7F] text-base truncate block">{member.location}</span>
                  </div>
                  
                  <div className="w-[130px] mr-7">
                    <span className="text-[#7F7F7F] text-base">{member.experience}</span>
                  </div>
                  
                  <div className="w-[95px] mr-7">
                    <span className="text-[#7F7F7F] text-base">{member.hours} h</span>
                  </div>
                  
                  <div className="w-[115px] mr-7">
                    <span className="text-[#7F7F7F] text-base">{member.balance}</span>
                  </div>
                  
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-[#7F7F7F] text-base">{member.joined}</span>
                    
                    <button
                      onClick={() => handleEditMember(member.id)}
                      className="ml-4 p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit className="h-7 w-7 text-[#63CDFA]" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-5 py-10 text-center text-gray-500 font-medium">
              No members found
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCurrentPage(1)} 
              disabled={currentPage === 1} 
              className="h-6 w-6"
            >
              <ChevronsLeft className="h-4 w-4 fill-[#9FA2B4] opacity-50" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCurrentPage(currentPage - 1)} 
              disabled={currentPage === 1} 
              className="h-6 w-6"
            >
              <ChevronLeft className="h-4 w-4 fill-[#9FA2B4] opacity-50" />
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map((page) => (
                <Button 
                  key={page} 
                  variant={currentPage === page ? "default" : "ghost"} 
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "h-8 w-8 rounded-full text-sm",
                    currentPage === page 
                      ? "bg-[#63CDFA] text-white hover:bg-[#63CDFA]/90" 
                      : "text-[#7F7F7F] hover:bg-gray-100"
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
              className="h-6 w-6"
            >
              <ChevronRight className="h-4 w-4 fill-[#9FA2B4]" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setCurrentPage(totalPages)} 
              disabled={currentPage === totalPages} 
              className="h-6 w-6"
            >
              <ChevronsRight className="h-4 w-4 fill-[#9FA2B4]" />
            </Button>
          </div>
          <span className="text-sm text-[#9FA2B4] font-light">{currentPage} of {totalPages}</span>
        </div>
        
        <div className="flex items-center gap-4 relative">
          <span className="text-sm text-[#9FA2B4] font-light">Rows per page</span>
          <div 
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setShowRowsDropdown(!showRowsDropdown)}
          >
            <span className="text-sm font-semibold text-black">{rowsPerPage}</span>
            <ChevronDown className={`h-3 w-3 text-black transition-transform ${showRowsDropdown ? 'rotate-180' : ''}`} />
          </div>
          {showRowsDropdown && (
            <div className="absolute right-0 bottom-full mb-1 w-20 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              {[5, 10, 20, 50].map((option) => (
                <div
                  key={option}
                  className={`px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${rowsPerPage === option ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
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
