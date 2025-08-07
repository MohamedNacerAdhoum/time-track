import { Bell, Power, User, Users, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { LogoutConfirmationModal } from "../dashboard/LogoutConfirmationModal";
import { ProfileModal } from "./ProfileModal";
import { useAuthStore } from "@/contexts/UserContext";

interface DashboardHeaderProps {
  isAdminView: boolean;
  onToggleView: () => void;
}

export function DashboardHeader({
  isAdminView,
  onToggleView,
}: DashboardHeaderProps) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAdmin } = useAuthStore();

  // Check if user is admin on component mount
  useEffect(() => {
    if (!isAdmin) {
      // Force user view for non-admin users
      onToggleView();
    }
  }, [isAdmin, onToggleView]);

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
    <div className="flex w-full items-center gap-2.5 px-6 py-4 bg-white">
      {/* User/Admin Toggle - only show for admin users */}
      {isAdmin ? (
        <>
          <div className="flex items-center">
            <div className="flex w-[126px] p-2 items-center gap-3 rounded-full border border-[#63CDFA]/50 bg-white">
              <button
                onClick={onToggleView}
                className={`flex-1 flex items-center justify-center p-2 rounded-full transition-all duration-200 ${!isAdminView ? "bg-[#63CDFA]" : "hover:bg-gray-50"
                  }`}
              >
                <User
                  className={`w-7 h-7 transition-colors ${!isAdminView ? "text-white" : "text-[#77838F]"
                    }`}
                />
              </button>
              <button
                onClick={onToggleView}
                className={`flex-1 flex items-center justify-center p-2 rounded-full transition-all duration-200 ${isAdminView ? "bg-[#63CDFA]" : "hover:bg-gray-50"
                  }`}
              >
                <Users
                  className={`w-7 h-7 transition-colors ${isAdminView ? "text-white" : "text-[#77838F]"
                    }`}
                />
              </button>
            </div>
          </div>
          <div className="h-16 w-1 bg-black/10 rounded-full mx-4" />
        </>
      ) : (
        <div className="flex items-center">
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right side controls */}
      <div className="flex items-center gap-7 relative">
        {/* Notification Bell */}
        <div className="flex p-2.5 justify-center items-center gap-2.5 rounded-full bg-[#63CDFA] relative">
          <div className="w-10 h-10 relative">
            <Bell className="w-[30px] h-[33px] flex-shrink-0 text-white absolute left-1 top-[3px]" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6262] rounded-full border-2 border-[#63CDFA] flex items-center justify-center">
              <span className="text-white text-xs font-semibold leading-normal">
                9+
              </span>
            </div>
          </div>
        </div>

        {/* Profile Picture with Dropdown */}
        <div className="relative" ref={dropdownRef}>
          {/* Desktop Profile Button */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="hidden md:flex p-[3px] items-start gap-2.5 rounded-full relative hover:bg-gray-50 transition-colors"
          >
            <div className="w-[63px] h-[63px] rounded-full relative">
              <div className={`w-full h-full rounded-full p-[3px] border-[3px] ${user?.status === 'in' ? 'border-[#0FBA83]' : user?.status === 'break' ? 'border-[#F59E0B]' : 'border-[#EF4444]'}`}>
                {user?.imageUrl ? (
                  <div
                    className="w-full h-full rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${user.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-2xl font-medium text-gray-500">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </div>
                )}
              </div>
            </div>
          </button>

          {/* Mobile Profile Button */}
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="md:hidden flex items-center gap-2.5 p-[3px] rounded-full bg-white hover:bg-gray-50 transition-colors w-[95px] h-[54px]"
          >
            <div className="flex p-[2.16px] items-center">
              <div className={`w-[41px] h-[41px] rounded-full p-[2.16px] ${user?.status === 'in' ? 'border-[2.16px] border-[#0FBA83]' : user?.status === 'break' ? 'border-[2.16px] border-[#F59E0B]' : 'border-[2.16px] border-[#EF4444]'}`}>
                {user?.imageUrl ? (
                  <div
                    className="w-full h-full rounded-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${user.imageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-500">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center p-2 rounded-full">
                <ChevronDown className="w-[15px] h-[15px] text-[#71839B] rotate-0 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        {/* Power/Logout Button */}
        <button
          onClick={handleLogoutClick}
          className="flex w-[60px] h-[60px] p-[9px] justify-center items-center gap-2.5 rounded-full border border-[#FFB7B7] hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Power className="w-6 h-6 text-[#FF6262]" />
        </button>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}
