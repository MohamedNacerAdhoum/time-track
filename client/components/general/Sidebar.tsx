import { useState, useEffect } from "react";
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
  X
} from "lucide-react";

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

export function Sidebar({ isCollapsed, onToggleCollapse, activeRoute = "Dashboard", isAdminView, onToggleView }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Mobile Header with Hamburger Menu */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40 lg:hidden">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-[#63CDFA]" />
            <span className="text-xl font-semibold text-black">TimeTracker</span>
          </div>
          <button
            onClick={onToggleCollapse}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <Menu className="w-6 h-6 text-gray-600" />
            ) : (
              <X className="w-6 h-6 text-gray-600" />
            )}
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
      <div className={`fixed left-0 z-40 h-full transition-all duration-300 ${
        isMobile ? 'top-16' : 'top-0'
      } ${
        isMobile && isCollapsed ? '-translate-x-full' : 'translate-x-0'
      }`}>
        {/* Active indicator background - positioned dynamically based on collapsed state */}
        <div className={`absolute left-0 ${isCollapsed && !isMobile ? 'top-[170px]' : 'top-[169px]'} w-[73px] h-[50px] transition-all duration-300 ${
          isMobile ? 'hidden' : 'block'
        }`}>
          <div className="w-[45px] h-[50px] bg-[#63CDFA] absolute left-0 top-0" />
          <div className={`${isCollapsed && !isMobile ? 'w-[57px]' : 'w-[56px]'} h-[50px] bg-white rounded-[40px] absolute left-[17px] top-0 transition-all duration-300`} />
        </div>

        {/* Sidebar background */}
        <div className={`${
          (isCollapsed && !isMobile) ? 'w-[90px]' : 'w-[250px]'
        } ${
          isMobile ? 'h-[calc(100vh-4rem)]' : 'h-screen'
        } bg-[#63CDFA] ${
          isMobile ? 'rounded-r-[20px]' : 'rounded-r-[40px]'
        } relative overflow-hidden transition-all duration-300 shadow-lg`}>
          {/* Top section */}
          <div className={`${
            (isCollapsed && !isMobile) ? 'h-[170px]' : 'h-[169px]'
          } bg-[#63CDFA] ${
            isMobile ? 'rounded-r-[20px]' : 'rounded-r-[40px]'
          } transition-all duration-300 ${
            isMobile ? 'hidden' : 'block'
          }`} />

          {/* Bottom section */}
          <div className={`${
            (isCollapsed && !isMobile) ? 'h-[804px]' : 'h-[806px]'
          } bg-[#63CDFA] ${
            isMobile ? 'rounded-r-[20px]' : 'rounded-r-[40px]'
          } transition-all duration-300 ${
            isMobile ? 'hidden' : 'block'
          }`} />

          {/* Logo Section */}
          <div className={`${
            isMobile ? 'static' : 'absolute'
          } ${
            isMobile ? 'pt-6 pb-4' : 'top-[57px] left-0 right-0'
          } ${
            (isCollapsed && !isMobile) ? 'px-[10px]' : 'px-5'
          } ${
            isMobile ? 'h-auto' : 'h-[35px]'
          } flex items-center transition-all duration-300`}>
            <div className="flex items-center justify-center gap-2.5 flex-1">
              <Clock className="w-[35px] h-[35px] text-white" />
              {(!isCollapsed || isMobile) && (
                <span className="text-white text-xl font-semibold">TimeTracker</span>
              )}
            </div>
          </div>

          {/* Navigation Menu */}
          <div className={`${
            isMobile ? 'static px-4 pb-4' : 'absolute'
          } ${
            !isMobile ? (isCollapsed ? 'top-[169px] left-[23px] w-[47px]' : 'top-[169px] left-[23px] w-[194px]') : ''
          } space-y-6 transition-all duration-300`}>
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = item.label === activeRoute;

              return (
                <div
                  key={item.label}
                  className={`flex items-center ${
                    (isCollapsed && !isMobile) ? 'gap-0 justify-center' : 'gap-6'
                  } px-2 py-2 cursor-pointer transition-all duration-300 ${
                    isActive ? 'bg-white rounded-lg' : 'hover:bg-white/10 rounded-lg'
                  } relative group`}
                  title={(isCollapsed && !isMobile) ? item.label : undefined}
                  onClick={() => {
                    // Close mobile menu when item is clicked
                    if (isMobile) {
                      onToggleCollapse();
                    }
                  }}
                >
                  <IconComponent
                    className={`w-[30px] h-[30px] flex-shrink-0 ${
                      isActive ? 'text-black' : 'text-white'
                    } transition-colors duration-300`}
                  />
                  {(!isCollapsed || isMobile) && (
                    <span
                      className={`text-xl font-semibold transition-opacity duration-300 ${
                        isActive ? 'text-black' : 'text-white'
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state on desktop */}
                  {(isCollapsed && !isMobile) && (
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
                isCollapsed ? 'right-[8px]' : 'right-[15px]'
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
    </>
  );
}
