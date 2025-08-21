import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/contexts/UserContext";
import {
  Home,
  Clock,
  Users,
  Calendar,
  Mail,
  MessageCircle,
  Coins,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { LogoutConfirmationModal } from "../dashboard/LogoutConfirmationModal";

const getMenuItems = (userRole: string | undefined) => {
  const isAdmin = userRole === "admin";
  const items = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Clock, label: "Timesheets", path: "/timesheets" },
    { icon: Calendar, label: "Schedules", path: "/schedules" },
    { icon: Mail, label: "Demands", path: "/demands" },
    { icon: MessageCircle, label: "Complaints", path: "/complaints" },
    { icon: Coins, label: "Balances", path: "/balances" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  // Only add Members tab for admin users
  if (isAdmin) {
    items.splice(2, 0, { icon: Users, label: "Members", path: "/members" });
  }

  return items;
};

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeRoute?: string;
  isAdminView?: boolean;
  onToggleView?: () => void;
}

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  activeRoute = "Dashboard",
  isAdminView,
  onToggleView,
}: SidebarProps) {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthStore();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = getMenuItems(isAdmin ? "admin" : "user");

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobile(isMobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
    setIsProfileDropdownOpen(false);
  };

  const handleLogoutConfirm = () => {
    console.log("User logged out");
    setIsLogoutModalOpen(false);
    window.location.href = "/";
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 z-50 h-full transition-all duration-300 ${
          isMobile ? "top-0" : "top-0"
        } ${isMobile && isCollapsed ? "-translate-x-full" : "translate-x-0"}`}
      >
        {/* Active indicator background - positioned dynamically based on collapsed state */}
        <div
          className={`absolute left-0 ${isCollapsed && !isMobile ? "top-[141px]" : "top-[140px]"} w-[73px] h-[50px] transition-all duration-300 ${
            isMobile ? "hidden" : "block"
          }`}
        >
          <div className="w-[45px] h-[50px] bg-[#63CDFA] absolute left-0 top-0" />
          <div
            className={`${isCollapsed && !isMobile ? "w-[57px]" : "w-[56px]"} h-[50px] bg-white rounded-[40px] absolute left-[17px] top-0 transition-all duration-300`}
          />
        </div>

        {/* Sidebar background */}
        <div
          className={`${isCollapsed && !isMobile ? "w-[90px]" : "w-[250px]"} ${
            isMobile ? "h-screen" : "h-screen"
          } bg-[#63CDFA] ${
            isMobile ? "rounded-r-[20px]" : "rounded-r-[40px]"
          } relative transition-all duration-300 shadow-lg`}
        >
          {/* Top section */}
          <div
            className={`${
              isCollapsed && !isMobile ? "h-[141px]" : "h-[140px]"
            } bg-[#63CDFA] ${
              isMobile ? "rounded-r-[20px]" : "rounded-r-[40px]"
            } transition-all duration-300 ${isMobile ? "hidden" : "block"}`}
          />

          {/* Bottom section */}
          <div
            className={`${
              isCollapsed && !isMobile ? "h-[833px]" : "h-[835px]"
            } bg-[#63CDFA] ${
              isMobile ? "rounded-r-[20px]" : "rounded-r-[40px]"
            } transition-all duration-300 ${isMobile ? "hidden" : "block"}`}
          />

          {/* Logo Section */}
          <div
            className={`${isMobile ? "static" : "absolute"} ${
              isMobile ? "pt-6 pb-4" : "top-[40px] left-0 right-0"
            } ${isCollapsed && !isMobile ? "px-[10px]" : "px-5"} ${
              isMobile ? "h-auto" : "h-[35px]"
            } flex items-center transition-all duration-300`}
          >
            <div className="flex items-center justify-center gap-2.5 flex-1">
              <Clock className="w-[35px] h-[35px] text-white" />
              {(!isCollapsed || isMobile) && (
                <span className="text-white text-xl font-semibold">
                  TimeTracker
                </span>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <div
            className={`${isMobile ? "static px-4 pb-4" : "absolute"} ${
              !isMobile
                ? isCollapsed
                  ? "top-[140px] left-[23px] w-[47px]"
                  : "top-[140px] left-[23px] w-[194px]"
                : ""
            } space-y-6 transition-all duration-300`}
          >
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = item.label === activeRoute;

              return (
                <div
                  key={item.label}
                  className={`flex items-center ${
                    isCollapsed && !isMobile ? "gap-0 justify-center" : "gap-6"
                  } px-2 py-2 cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "bg-white rounded-lg"
                      : "hover:bg-white/10 rounded-lg"
                  } relative group`}
                  title={isCollapsed && !isMobile ? item.label : undefined}
                  onClick={() => {
                    // Navigate to the route
                    navigate(item.path);
                    // Close mobile menu when item is clicked
                    if (isMobile) {
                      onToggleCollapse();
                    }
                  }}
                >
                  <IconComponent
                    className={`w-[30px] h-[30px] flex-shrink-0 ${
                      isActive ? "text-black" : "text-white"
                    } transition-colors duration-300`}
                  />
                  {(!isCollapsed || isMobile) && (
                    <span
                      className={`text-xl font-semibold transition-opacity duration-300 ${
                        isActive ? "text-black" : "text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip for collapsed state on desktop */}
                  {isCollapsed && !isMobile && (
                    <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Collapse Button - Desktop Only */}
          {!isMobile && (
            <button
              onClick={onToggleCollapse}
              className={`absolute top-[42px] ${
                isCollapsed ? "-right-[15px]" : "-right-[15px]"
              } w-[31px] h-[31px] bg-white rounded-full border border-[#71839B] flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:border-[#63CDFA] z-10 shadow-sm`}
            >
              {isCollapsed ? (
                <ChevronRight className="w-[15px] h-[15px] text-[#71839B]" />
              ) : (
                <ChevronLeft className="w-[15px] h-[15px] text-[#71839B]" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}
