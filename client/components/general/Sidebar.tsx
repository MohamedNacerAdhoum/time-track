import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  Menu,
  X,
} from "lucide-react";
import { LogoutConfirmationModal } from "../dashboard/LogoutConfirmationModal";

const menuItems = [
  { icon: Home, label: "Dashboard", isActive: true },
  { icon: Clock, label: "Timesheets", isActive: false },
  { icon: Users, label: "Members", isActive: false },
  { icon: Calendar, label: "Schedules", isActive: false },
  { icon: Mail, label: "Demands", isActive: false },
  { icon: MessageCircle, label: "Complaints", isActive: false },
  { icon: Coins, label: "Balances", isActive: false },
  { icon: Settings, label: "Settings", isActive: false },
];

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
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
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
      {/* Mobile Header with Hamburger Menu */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center justify-between px-5 z-40 lg:hidden">
          <div className="flex items-center gap-3">
            {/* Hamburger Menu */}
            <button
              onClick={onToggleCollapse}
              className="flex items-center justify-center transition-colors"
            >
              <svg
                width="34"
                height="36"
                viewBox="0 0 34 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M31.8562 9.78776H2.59037C1.43582 9.78776 0.499939 9.09219 0.499939 8.23409C0.499939 7.37599 1.43582 6.68042 2.59037 6.68042H31.8563C33.0108 6.68042 33.9467 7.37599 33.9467 8.23409C33.9467 9.09219 33.0108 9.78776 31.8562 9.78776Z"
                  fill="#63CDFA"
                />
                <path
                  d="M31.8562 19.5535H2.59037C1.43582 19.5535 0.499939 18.8579 0.499939 17.9998C0.499939 17.1418 1.43582 16.4462 2.59037 16.4462H31.8563C33.0108 16.4462 33.9467 17.1417 33.9467 17.9998C33.9467 18.8579 33.0108 19.5535 31.8562 19.5535Z"
                  fill="#63CDFA"
                />
                <path
                  d="M31.8562 29.3194H2.59037C1.43582 29.3194 0.499939 28.6239 0.499939 27.7658C0.499939 26.9078 1.43582 26.2122 2.59037 26.2122H31.8563C33.0108 26.2122 33.9467 26.9077 33.9467 27.7658C33.9467 28.6239 33.0108 29.3194 31.8562 29.3194Z"
                  fill="#63CDFA"
                />
              </svg>
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
              <div className="flex p-[2.16px] items-center rounded-full border-[2.16px] border-[#4DA64D] relative">
                <div
                  className="w-[41px] h-[41px] rounded-full bg-cover bg-center border-[2.16px] border-white"
                  style={{
                    backgroundImage:
                      "url('https://cdn.builder.io/api/v1/image/assets%2Fe586c13bd8994056b17ba0083cfb21fb%2Faceaf2278b834174a9471c88a3fba7ea?format=webp&width=800')",
                  }}
                />
              </div>
              <div className="flex items-center justify-center p-2 rounded-full">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`text-[#71839B] transition-transform duration-200 ${isProfileDropdownOpen ? "rotate-180" : "rotate-0"}`}
                >
                  <path
                    d="M0.960615 4.05942C1.20917 4.05964 1.44747 4.15855 1.62312 4.33442L6.41812 9.12942C6.56321 9.27455 6.73548 9.38968 6.92508 9.46823C7.11468 9.54678 7.31789 9.58721 7.52312 9.58721C7.72834 9.58721 7.93156 9.54678 8.12115 9.46823C8.31075 9.38968 8.48302 9.27455 8.62812 9.12942L13.4169 4.34067C13.5937 4.16989 13.8305 4.0754 14.0763 4.07754C14.3221 4.07967 14.5573 4.17827 14.7311 4.35209C14.9049 4.52591 15.0035 4.76104 15.0056 5.00685C15.0078 5.25266 14.9133 5.48948 14.7425 5.66629L9.95749 10.455C9.31233 11.0989 8.43806 11.4606 7.52655 11.4606C6.61505 11.4606 5.74078 11.0989 5.09562 10.455L0.29749 5.66004C0.166293 5.52893 0.0769361 5.36185 0.0407273 5.17993C0.00451847 4.99802 0.0230848 4.80945 0.094077 4.63809C0.165069 4.46674 0.285296 4.32029 0.439546 4.21728C0.593795 4.11427 0.775133 4.05933 0.960615 4.05942Z"
                    fill="#71839B"
                  />
                </svg>
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-[10.8px] shadow-[0_2.88px_8.64px_rgba(0,0,0,0.25)] border-none z-50 w-[145px]">
                {/* Profile */}
                <div
                  className="flex items-center gap-[10px] px-[21.6px] py-[10.8px] border-b-[0.36px] border-[#D9D9D9] hover:bg-gray-50 cursor-pointer rounded-t-[10.8px]"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_535_13061)">
                      <path
                        d="M8.09961 7.82007C8.84129 7.82007 9.56631 7.60014 10.183 7.18808C10.7997 6.77603 11.2803 6.19036 11.5642 5.50513C11.848 4.81991 11.9222 4.06591 11.7776 3.33848C11.6329 2.61105 11.2757 1.94287 10.7513 1.41842C10.2268 0.893973 9.55863 0.53682 8.8312 0.392125C8.10377 0.247431 7.34977 0.321693 6.66455 0.605522C5.97932 0.88935 5.39365 1.37 4.9816 1.98668C4.56954 2.60337 4.34961 3.32839 4.34961 4.07007C4.3506 5.06433 4.74601 6.01758 5.44906 6.72062C6.1521 7.42367 7.10535 7.81908 8.09961 7.82007ZM8.09961 1.57007C8.59406 1.57007 9.07741 1.71669 9.48853 1.9914C9.89966 2.2661 10.2201 2.65655 10.4093 3.11336C10.5985 3.57018 10.648 4.07284 10.5516 4.5578C10.4551 5.04275 10.217 5.48821 9.86738 5.83784C9.51775 6.18747 9.07229 6.42557 8.58734 6.52203C8.10238 6.6185 7.59972 6.56899 7.1429 6.37977C6.68609 6.19055 6.29564 5.87012 6.02094 5.459C5.74623 5.04787 5.59961 4.56452 5.59961 4.07007C5.59961 3.40703 5.863 2.77114 6.33184 2.3023C6.80068 1.83346 7.43657 1.57007 8.09961 1.57007Z"
                        fill="#77838F"
                      />
                      <path
                        d="M8.09961 9.07007C6.60827 9.07172 5.17849 9.66489 4.12396 10.7194C3.06943 11.774 2.47626 13.2037 2.47461 14.6951C2.47461 14.8608 2.54046 15.0198 2.65767 15.137C2.77488 15.2542 2.93385 15.3201 3.09961 15.3201C3.26537 15.3201 3.42434 15.2542 3.54155 15.137C3.65876 15.0198 3.72461 14.8608 3.72461 14.6951C3.72461 13.5347 4.18555 12.4219 5.00602 11.6015C5.82649 10.781 6.93929 10.3201 8.09961 10.3201C9.25993 10.3201 10.3727 10.781 11.1932 11.6015C12.0137 12.4219 12.4746 13.5347 12.4746 14.6951C12.4746 14.8608 12.5405 15.0198 12.6577 15.137C12.7749 15.2542 12.9338 15.3201 13.0996 15.3201C13.2654 15.3201 13.4243 15.2542 13.5416 15.137C13.6588 15.0198 13.7246 14.8608 13.7246 14.6951C13.723 13.2037 13.1298 11.774 12.0753 10.7194C11.0207 9.66489 9.59094 9.07172 8.09961 9.07007Z"
                        fill="#77838F"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_535_13061">
                        <rect
                          width="15"
                          height="15"
                          fill="white"
                          transform="translate(0.599609 0.320068)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="text-[#77838F] text-[10px] font-semibold leading-[20.16px]">
                    Profile
                  </span>
                </div>

                {/* Notifications */}
                <div
                  className="flex items-center gap-[10px] px-[21.6px] py-[10.8px] border-b-[0.36px] border-[#D9D9D9] hover:bg-gray-50 cursor-pointer"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  <svg
                    width="15"
                    height="16"
                    viewBox="0 0 16 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.4732 9.56359L14.163 4.84965C13.7789 3.46866 12.9443 2.25566 11.7918 1.40347C10.6392 0.551284 9.23486 0.108806 7.80196 0.146374C6.36906 0.183943 4.98983 0.699401 3.88351 1.61081C2.77719 2.52223 2.00727 3.77729 1.69613 5.17651L0.681767 9.73806C0.569721 10.2421 0.572312 10.7649 0.689347 11.2678C0.806383 11.7707 1.03487 12.2408 1.35795 12.6436C1.68103 13.0464 2.09045 13.3715 2.55597 13.5948C3.0215 13.8182 3.53125 13.9341 4.04759 13.9341H4.81578C4.97404 14.7135 5.3969 15.4143 6.0127 15.9176C6.6285 16.4209 7.39937 16.6959 8.1947 16.6959C8.99003 16.6959 9.7609 16.4209 10.3767 15.9176C10.9925 15.4143 11.4154 14.7135 11.5736 13.9341H12.1515C12.683 13.9342 13.2074 13.8113 13.6836 13.5752C14.1598 13.339 14.5749 12.996 14.8966 12.5728C15.2182 12.1497 15.4377 11.6579 15.5379 11.1359C15.638 10.6138 15.6154 10.0757 15.4732 9.56359ZM8.1947 15.3133C7.76836 15.3115 7.35298 15.1781 7.00539 14.9312C6.65779 14.6843 6.39496 14.3361 6.25285 13.9341H10.1365C9.99444 14.3361 9.73161 14.6843 9.38401 14.9312C9.03642 15.1781 8.62104 15.3115 8.1947 15.3133ZM13.7982 11.7378C13.606 11.9927 13.3571 12.1993 13.0711 12.3412C12.7851 12.483 12.47 12.5562 12.1508 12.555H4.04759C3.73782 12.5549 3.43202 12.4853 3.15275 12.3513C2.87349 12.2172 2.62789 12.0222 2.43409 11.7805C2.24029 11.5389 2.10323 11.2568 2.03303 10.9551C1.96284 10.6533 1.96129 10.3397 2.02851 10.0373L3.04219 5.4751C3.28654 4.37606 3.89127 3.39023 4.76023 2.67435C5.6292 1.95846 6.71254 1.5536 7.83803 1.52411C8.96352 1.49463 10.0666 1.84221 10.9718 2.51162C11.8771 3.18103 12.5326 4.13383 12.8342 5.21857L14.1444 9.93252C14.2309 10.2396 14.2447 10.5627 14.1846 10.8761C14.1245 11.1895 13.9922 11.4845 13.7982 11.7378Z"
                      fill="#77838F"
                    />
                  </svg>
                  <span className="text-[#77838F] text-[10px] font-semibold leading-[20.16px]">
                    Notifications
                  </span>
                </div>

                {/* Logout */}
                <div
                  onClick={handleLogoutClick}
                  className="flex items-center gap-[10px] px-[21.6px] py-[10.8px] hover:bg-gray-50 cursor-pointer rounded-b-[10.8px]"
                  style={{
                    fontFamily:
                      "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.5 1.5C8.03043 1.5 8.46957 1.93913 8.46957 2.46957V5.76087C8.46957 6.2913 8.03043 6.73043 7.5 6.73043C6.96957 6.73043 6.53043 6.2913 6.53043 5.76087V2.46957C6.53043 1.93913 6.96957 1.5 7.5 1.5Z"
                      fill="#FF6A6A"
                    />
                    <path
                      d="M8.91304 5.13043C8.90435 5.31522 9.01304 5.48696 9.17826 5.57391C10.6348 6.32609 11.1783 8.17391 10.4261 9.63043C9.67391 11.087 7.82609 11.6304 6.36957 10.8783C4.91304 10.1261 4.36957 8.27826 5.12174 6.82174C5.35652 6.37391 5.70435 6.00000 6.12174 5.72174C6.29130 5.63043 6.40870 5.45217 6.40435 5.26087C6.40435 4.73043 5.96522 4.28261 5.43478 4.28261C5.31304 4.28261 5.19565 4.31739 5.09565 4.38261C3.21739 5.47391 2.60435 7.91304 3.69565 9.79130C4.78696 11.6696 7.22609 12.2826 9.10435 11.1913C10.9826 10.1000 11.5957 7.66087 10.5043 5.78261C10.1739 5.22609 9.70435 4.76087 9.14783 4.43478C8.86087 4.28696 8.50000 4.36957 8.35217 4.65652C8.30000 4.75652 8.27826 4.86957 8.91304 5.13043Z"
                      fill="#FF6A6A"
                    />
                  </svg>
                  <span className="text-[#FF6A6A] text-[10px] font-semibold leading-[20.16px]">
                    Logout
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User/Admin Toggle for Mobile - positioned below header */}
      {isMobile && isAdminView !== undefined && onToggleView && (
        <div className="fixed left-5 top-20 flex items-center px-1 py-1 border border-[#63CDFA]/50 bg-white rounded-full shadow-sm z-30 lg:hidden">
          <button
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
              !isAdminView
                ? "bg-[#63CDFA] shadow-sm"
                : "bg-transparent hover:bg-gray-50"
            }`}
            onClick={onToggleView}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.00452 7.73598C8.91322 7.73598 10.4605 6.18867 10.4605 4.27997C10.4605 2.37128 8.91322 0.823975 7.00452 0.823975C5.09583 0.823975 3.54852 2.37128 3.54852 4.27997C3.54852 6.18867 5.09583 7.73598 7.00452 7.73598Z"
                fill={!isAdminView ? "white" : "#77838F"}
              />
              <path
                d="M7.0045 8.88782C4.14277 8.891 1.82368 11.2101 1.8205 14.0718C1.8205 14.3899 2.07837 14.6478 2.39649 14.6478H11.6125C11.9306 14.6478 12.1885 14.3899 12.1885 14.0718C12.1853 11.2101 9.86623 8.89098 7.0045 8.88782Z"
                fill={!isAdminView ? "white" : "#77838F"}
              />
            </svg>
          </button>

          <button
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
              isAdminView
                ? "bg-[#63CDFA] shadow-sm"
                : "bg-transparent hover:bg-gray-50"
            }`}
            onClick={onToggleView}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.6352 12.9615C9.99724 12.9615 9.37361 12.7723 8.84316 12.4179C8.31271 12.0634 7.89928 11.5597 7.65514 10.9703C7.411 10.3809 7.34712 9.73231 7.47158 9.1066C7.59604 8.4809 7.90325 7.90615 8.35436 7.45504C8.80547 7.00393 9.38022 6.69672 10.0059 6.57226C10.6316 6.4478 11.2802 6.51168 11.8696 6.75582C12.459 6.99996 12.9628 7.41339 13.3172 7.94384C13.6716 8.47428 13.8608 9.09792 13.8608 9.73588C13.8608 10.5914 13.521 11.4118 12.916 12.0167C12.3111 12.6216 11.4907 12.9615 10.6352 12.9615Z"
                fill={isAdminView ? "white" : "#77838F"}
              />
              <path
                d="M5.54118 12.9615H1.7648C1.55093 12.9615 1.34582 12.8765 1.19459 12.7253C1.04336 12.5741 0.958405 12.369 0.958405 12.1551C0.966046 10.9972 1.38719 9.88011 2.14587 9.00535C2.90456 8.13059 3.95085 7.55572 5.09604 7.38442C5.22912 7.36578 5.36474 7.38068 5.49059 7.42778C5.61644 7.47488 5.72852 7.55268 5.81665 7.65412C5.90478 7.75555 5.96617 7.8774 5.99524 8.00859C6.0243 8.13978 6.02013 8.27616 5.98308 8.40532C5.85951 8.83804 5.79681 9.28587 5.79681 9.73588C5.79704 10.4534 5.95853 11.1617 6.26936 11.8083C6.32782 11.9311 6.3543 12.0666 6.34633 12.2023C6.33837 12.3381 6.29622 12.4696 6.2238 12.5846C6.15138 12.6997 6.05105 12.7946 5.93212 12.8605C5.8132 12.9263 5.67955 12.9611 5.5436 12.9615H5.54118Z"
                fill={isAdminView ? "white" : "#77838F"}
              />
              <path
                d="M14.6672 19.4127H6.60321C6.38933 19.4127 6.18422 19.3277 6.03299 19.1765C5.88177 19.0253 5.79681 18.8202 5.79681 18.6063C5.79681 17.3231 6.30656 16.0924 7.21394 15.185C8.12132 14.2776 9.35198 13.7679 10.6352 13.7679C11.9184 13.7679 13.1491 14.2776 14.0565 15.185C14.9638 16.0924 15.4736 17.3231 15.4736 18.6063C15.4736 18.8202 15.3886 19.0253 15.2374 19.1765C15.0862 19.3277 14.8811 19.4127 14.6672 19.4127Z"
                fill={isAdminView ? "white" : "#77838F"}
              />
            </svg>
          </button>
        </div>
      )}

      {/* Mobile Overlay */}
      {!isCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 z-40 h-full transition-all duration-300 ${
          isMobile ? "top-16" : "top-0"
        } ${isMobile && isCollapsed ? "-translate-x-full" : "translate-x-0"}`}
      >
        {/* Active indicator background - positioned dynamically based on collapsed state */}
        <div
          className={`absolute left-0 ${isCollapsed && !isMobile ? "top-[170px]" : "top-[169px]"} w-[73px] h-[50px] transition-all duration-300 ${
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
            isMobile ? "h-[calc(100vh-4rem)]" : "h-screen"
          } bg-[#63CDFA] ${
            isMobile ? "rounded-r-[20px]" : "rounded-r-[40px]"
          } relative overflow-hidden transition-all duration-300 shadow-lg`}
        >
          {/* Top section */}
          <div
            className={`${
              isCollapsed && !isMobile ? "h-[170px]" : "h-[169px]"
            } bg-[#63CDFA] ${
              isMobile ? "rounded-r-[20px]" : "rounded-r-[40px]"
            } transition-all duration-300 ${isMobile ? "hidden" : "block"}`}
          />

          {/* Bottom section */}
          <div
            className={`${
              isCollapsed && !isMobile ? "h-[804px]" : "h-[806px]"
            } bg-[#63CDFA] ${
              isMobile ? "rounded-r-[20px]" : "rounded-r-[40px]"
            } transition-all duration-300 ${isMobile ? "hidden" : "block"}`}
          />

          {/* Logo Section */}
          <div
            className={`${isMobile ? "static" : "absolute"} ${
              isMobile ? "pt-6 pb-4" : "top-[57px] left-0 right-0"
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
                  ? "top-[169px] left-[23px] w-[47px]"
                  : "top-[169px] left-[23px] w-[194px]"
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
              className={`absolute top-[59px] ${
                isCollapsed ? "right-[8px]" : "right-[15px]"
              } w-[31px] h-[31px] bg-white rounded-full border border-[#71839B] flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:border-[#63CDFA] z-10`}
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
