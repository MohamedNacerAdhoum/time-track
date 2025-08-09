import { Bell, Power, User, Users, ChevronDown, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { LogoutConfirmationModal } from "../dashboard/LogoutConfirmationModal";
import { ProfileModal } from "./ProfileModal";
import { NotificationPopup } from "../dashboard/NotificationPopup";
import { useAuthStore } from "@/contexts/UserContext";
import { useMembersStore } from "@/contexts/MembersContext";
import { useIsMobile } from "@/hooks/useMobile";
import { MobileProfile } from "./MobileProfile";

interface DashboardHeaderProps {
  isAdminView: boolean;
  onToggleView: () => void;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
}

export function DashboardHeader({
  isAdminView,
  onToggleView,
  onToggleCollapse,
  isCollapsed,
}: DashboardHeaderProps) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const { currentUser, loading, error, fetchCurrentUser } = useMembersStore();
  const { user, isAdmin } = useAuthStore();
  const isMobile = useIsMobile();
  const displayUser = currentUser ?? user;

  // Match ProfileModal's border color logic
  const getStatusColor = (status: string | undefined | null) => {
    const raw = (status || "").toString().trim().toLowerCase();
    if (!raw) return "border-[#EF4444]";
    if (raw.includes("break")) return "border-[#F59E0B]";
    if (raw === "in") return "border-[#0FBA83]";
    if (raw.startsWith("in")) return "border-[#0FBA83]";
    return "border-[#EF4444]";
  };

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
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
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

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleProfileClick = () => {
    if (isMobile) {
      setIsMobileProfileOpen(true);
      setIsProfileDropdownOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Header with Hamburger Menu - Always show on mobile */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center justify-between px-5 z-40 lg:hidden">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu */}
            <button
              onClick={onToggleCollapse}
              className="flex items-center justify-center transition-colors"
            >
              <Menu className="w-[30px] h-[30px] text-[#63CDFA]" />
            </button>

            {/* Dashboard Title */}
            <span className="text-lg font-semibold text-black">Dashboard</span>
          </div>

          {/* Profile with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2.5 p-[3px] rounded-full border border-[#71839B]/50 bg-white hover:bg-gray-50 transition-colors w-[95px] h-[54px]"
            >
              <div className="flex p-[2.16px] items-center">
                <div
                  className={`w-[41px] h-[41px] rounded-full p-[2.16px] border-[2.16px] ${getStatusColor(displayUser?.status)}`}
                >
                  {displayUser?.imageUrl ? (
                    <div
                      className="w-full h-full rounded-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${displayUser.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-xl font-medium text-gray-500">
                      {displayUser?.name
                        ? displayUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center p-2 rounded-full">
                  <ChevronDown className="w-[25px] h-[25px] text-[#71839B] rotate-0 transition-transform" />
                </div>
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-[10.8px] shadow-[0_2.88px_8.64px_rgba(0,0,0,0.25)] border-none z-50 w-[145px]">
                {/* Admin Toggle - Only show for admin users */}
                {isAdmin && (
                  <div className="px-[15px] py-[10px] border-b-[0.36px] border-[#D9D9D9]">
                    <div className="flex items-center justify-center">
                      <div className="flex w-[110px] p-1 items-center gap-1 rounded-full border border-[#63CDFA]/50 bg-white">
                        <button
                          onClick={() => {
                            onToggleView();
                            setIsProfileDropdownOpen(false);
                          }}
                          className={`flex-1 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                            !isAdminView ? "bg-[#63CDFA]" : "hover:bg-gray-50"
                          }`}
                        >
                          <User
                            className={`w-4 h-4 transition-colors ${
                              !isAdminView ? "text-white" : "text-[#77838F]"
                            }`}
                          />
                        </button>
                        <button
                          onClick={() => {
                            onToggleView();
                            setIsProfileDropdownOpen(false);
                          }}
                          className={`flex-1 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                            isAdminView ? "bg-[#63CDFA]" : "hover:bg-gray-50"
                          }`}
                        >
                          <Users
                            className={`w-4 h-4 transition-colors ${
                              isAdminView ? "text-white" : "text-[#77838F]"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Profile */}
                <div
                  onClick={handleProfileClick}
                  className="flex items-center gap-[10px] px-[20px] py-[10px] border-b-[0.36px] border-[#D9D9D9] hover:bg-gray-50 cursor-pointer"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  <User className="w-[20px] h-[20px] text-[#71839B]" />
                  <span className="text-[#77838F] text-[12px] font-semibold leading-[20.16px]">
                    Profile
                  </span>
                </div>

                {/* Notifications */}
                <div
                  className="flex items-center gap-[10px] px-[20px] py-[10px] border-b-[0.36px] border-[#D9D9D9] hover:bg-gray-50 cursor-pointer"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  <Bell className="w-[20px] h-[20px] text-[#71839B]" />
                  <span className="text-[#77838F] text-[12px] font-semibold leading-[20.16px]">
                    Notifications
                  </span>
                </div>

                {/* Logout */}
                <div
                  onClick={handleLogoutClick}
                  className="flex items-center gap-[10px] px-[20px] py-[10px] hover:bg-gray-50 cursor-pointer rounded-b-[10.8px]"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  <Power className="w-[20px] h-[20px] text-[#FF6A6A]" />
                  <span className="text-[#FF6A6A] text-[12px] font-semibold leading-[20.16px]">
                    Logout
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Desktop Header */}
      <div
        className={`flex w-full items-center gap-2.5 px-6 py-4 bg-white ${isMobile ? "hidden" : ""}`}
      >
        {/* User/Admin Toggle - show for admin users, on mobile show on left, on desktop show as before */}
        {isAdmin ? (
          <>
            {isMobile ? (
              // Mobile layout - admin switch on left side
              <div className="flex items-center">
                <div className="flex w-[84px] p-1 items-center gap-1 rounded-full border border-[#63CDFA]/50 bg-white">
                  <button
                    onClick={onToggleView}
                    className={`flex-1 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                      !isAdminView ? "bg-[#63CDFA]" : "hover:bg-gray-50"
                    }`}
                  >
                    <User
                      className={`w-5 h-5 transition-colors ${
                        !isAdminView ? "text-white" : "text-[#77838F]"
                      }`}
                    />
                  </button>
                  <button
                    onClick={onToggleView}
                    className={`flex-1 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                      isAdminView ? "bg-[#63CDFA]" : "hover:bg-gray-50"
                    }`}
                  >
                    <Users
                      className={`w-5 h-5 transition-colors ${
                        isAdminView ? "text-white" : "text-[#77838F]"
                      }`}
                    />
                  </button>
                </div>
              </div>
            ) : (
              // Desktop layout - admin switch centered
              <>
                <div className="flex items-center">
                  <div className="flex w-[126px] p-2 items-center gap-3 rounded-full border border-[#63CDFA]/50 bg-white">
                    <button
                      onClick={onToggleView}
                      className={`flex-1 flex items-center justify-center p-2 rounded-full transition-all duration-200 ${
                        !isAdminView ? "bg-[#63CDFA]" : "hover:bg-gray-50"
                      }`}
                    >
                      <User
                        className={`w-7 h-7 transition-colors ${
                          !isAdminView ? "text-white" : "text-[#77838F]"
                        }`}
                      />
                    </button>
                    <button
                      onClick={onToggleView}
                      className={`flex-1 flex items-center justify-center p-2 rounded-full transition-all duration-200 ${
                        isAdminView ? "bg-[#63CDFA]" : "hover:bg-gray-50"
                      }`}
                    >
                      <Users
                        className={`w-7 h-7 transition-colors ${
                          isAdminView ? "text-white" : "text-[#77838F]"
                        }`}
                      />
                    </button>
                  </div>
                </div>
                <div className="h-16 w-1 bg-black/10 rounded-full mx-4" />
              </>
            )}
          </>
        ) : (
          <div className="flex items-center"></div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side controls */}
        <div className="flex items-center gap-7 relative">
          {/* Notification Bell - Hidden on mobile */}
          <div className="relative hidden md:block" ref={notificationRef}>
            <button
              onClick={handleNotificationClick}
              className="flex p-2.5 justify-center items-center gap-2.5 rounded-full bg-[#63CDFA] relative hover:bg-[#4BA8E8] transition-colors cursor-pointer"
            >
              <div className="w-10 h-10 relative">
                <Bell className="w-[30px] h-[33px] flex-shrink-0 text-white absolute left-1 top-[3px]" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6262] rounded-full border-2 border-[#63CDFA] flex items-center justify-center">
                  <span className="text-white text-xs font-semibold leading-normal">
                    9+
                  </span>
                </div>
              </div>
            </button>

            {/* Notification Popup */}
            <NotificationPopup
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
            />
          </div>

          {/* Profile Picture with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {/* Desktop Profile Button */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hidden md:flex p-[3px] items-start gap-2.5 rounded-full relative hover:bg-gray-50 transition-colors"
            >
              <div className="w-[63px] h-[63px] rounded-full relative">
                <div
                  className={`w-full h-full rounded-full p-[3px] border-[3px] ${getStatusColor(displayUser?.status)}`}
                >
                  {displayUser?.imageUrl ? (
                    <div
                      className="w-full h-full rounded-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${displayUser.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-2xl font-medium text-gray-500">
                      {displayUser?.name
                        ? displayUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "U"}
                    </div>
                  )}
                </div>
              </div>
            </button>
          </div>

          {/* Power/Logout Button - Hidden on mobile */}
          <button
            onClick={handleLogoutClick}
            className="hidden md:flex w-[60px] h-[60px] p-[9px] justify-center items-center gap-2.5 rounded-full border border-[#FFB7B7] hover:bg-red-50 transition-colors cursor-pointer"
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

      {/* Mobile Profile */}
      <MobileProfile
        isOpen={isMobileProfileOpen}
        onClose={() => setIsMobileProfileOpen(false)}
      />
    </>
  );
}
