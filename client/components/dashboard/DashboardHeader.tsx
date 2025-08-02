import { Bell, Power, User, Users, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { LogoutConfirmationModal } from "./LogoutConfirmationModal";
import { ProfileModal } from "./ProfileModal";

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
      {/* User/Admin Toggle - positioned at the start */}
      <div className="flex items-center bg-white relative">
        <div className="flex w-[126px] p-[8.64px] items-start gap-3 rounded-full border border-[#63CDFA]/50 bg-white relative">
          <button
            onClick={onToggleView}
            className={`flex px-[8.64px] py-[8.64px] justify-center items-center gap-[8.64px] flex-1 self-stretch rounded-full transition-all duration-200 ${
              !isAdminView ? "bg-[#63CDFA]" : "bg-transparent hover:bg-gray-50"
            } relative`}
          >
            <User
              className={`w-[30.24px] h-[30.24px] transition-colors ${
                !isAdminView ? "text-white" : "text-[#77838F]"
              }`}
            />
          </button>
          <button
            onClick={onToggleView}
            className={`flex px-[8.64px] py-[8.64px] justify-center items-center gap-[8.64px] flex-1 self-stretch rounded-full transition-all duration-200 ${
              isAdminView ? "bg-[#63CDFA]" : "bg-transparent hover:bg-gray-50"
            } relative`}
          >
            <Users
              className={`w-[30.24px] h-[30.24px] transition-colors ${
                isAdminView ? "text-white" : "text-[#77838F]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Vertical Divider */}
      <div className="h-16 w-1 bg-black/10 rounded-full mx-4"></div>

      {/* Spacer */}
      <div className="flex-1"></div>

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
            className="hidden md:flex p-[3px] items-start gap-2.5 rounded-full border-[3px] border-[#4DA64D] relative hover:bg-gray-50 transition-colors"
          >
            <div className="w-[63px] h-[63px] rounded-full relative">
              <div
                className="w-[63px] h-[63px] rounded-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://cdn.builder.io/api/v1/image/assets%2Fe586c13bd8994056b17ba0083cfb21fb%2Faceaf2278b834174a9471c88a3fba7ea?format=webp&width=800')",
                }}
              />
            </div>
          </button>

          {/* Mobile Profile Button */}
          <button
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            className="md:hidden flex items-center gap-2.5 p-[3px] rounded-full border border-[#71839B] bg-white hover:bg-gray-50 transition-colors w-[95px] h-[54px]"
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
              <ChevronDown className="w-[15px] h-[15px] text-[#71839B] rotate-0 transition-transform" />
            </div>
          </button>

          {/* Profile Dropdown */}
          {isProfileDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 bg-white rounded-[10.8px] shadow-[0_2.88px_8.64px_rgba(0,0,0,0.25)] border-none z-50 w-[145px]">
              {/* Profile */}
              <div 
                className="flex items-center gap-[10px] px-[21.6px] py-[10.8px] border-b-[0.36px] border-[#D9D9D9] hover:bg-gray-50 cursor-pointer rounded-t-[10.8px]"
                style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
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
                      <rect width="15" height="15" fill="white" transform="translate(0.599609 0.320068)" />
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
                style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
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
                style={{ fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif' }}
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

        {/* Power/Logout Button */}
        <button
          onClick={handleLogoutClick}
          className="flex w-[60px] h-[60px] p-[9px] justify-center items-center gap-2.5 rounded-full border border-[#FFB7B7] hover:bg-red-50 transition-colors cursor-pointer"
        >
          <Power className="w-6 h-6 text-[#FF6262]" />
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}
