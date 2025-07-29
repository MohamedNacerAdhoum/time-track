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
  ChevronRight
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
}

export function Sidebar({ isCollapsed, onToggleCollapse, activeRoute = "Dashboard" }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onToggleCollapse}
        />
      )}
      
      <div className="fixed left-0 top-0 h-full z-30 transition-all duration-300">
        {/* Active indicator background - positioned dynamically based on collapsed state */}
        <div className={`absolute left-0 ${isCollapsed ? 'top-[170px]' : 'top-[169px]'} w-[73px] h-[50px] transition-all duration-300`}>
          <div className="w-[45px] h-[50px] bg-[#63CDFA] absolute left-0 top-0" />
          <div className={`${isCollapsed ? 'w-[57px]' : 'w-[56px]'} h-[50px] bg-white rounded-[40px] absolute left-[17px] top-0 transition-all duration-300`} />
        </div>

        {/* Sidebar background */}
        <div className={`${isCollapsed ? 'w-[90px]' : 'w-[250px]'} h-screen bg-[#63CDFA] rounded-r-[40px] relative overflow-hidden transition-all duration-300 shadow-lg`}>
          {/* Top section */}
          <div className={`${isCollapsed ? 'h-[170px]' : 'h-[169px]'} bg-[#63CDFA] rounded-r-[40px] transition-all duration-300`} />

          {/* Bottom section */}
          <div className={`${isCollapsed ? 'h-[804px]' : 'h-[806px]'} bg-[#63CDFA] rounded-r-[40px] transition-all duration-300`} />

          {/* Logo Section */}
          <div className={`absolute top-[57px] left-0 right-0 ${isCollapsed ? 'px-[10px]' : 'px-5'} h-[35px] flex items-center transition-all duration-300`}>
            <div className="flex items-center justify-center gap-2.5 flex-1">
              <Clock className="w-[35px] h-[35px] text-white" />
            </div>
          </div>

          {/* Navigation Menu */}
          <div className={`absolute ${isCollapsed ? 'top-[169px] left-[23px] w-[47px]' : 'top-[169px] left-[23px] w-[194px]'} space-y-6 transition-all duration-300`}>
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = item.label === activeRoute;

              return (
                <div
                  key={item.label}
                  className={`flex items-center ${isCollapsed ? 'gap-0 justify-center' : 'gap-6'} px-2 py-2 cursor-pointer transition-all duration-300 ${isActive ? 'bg-white rounded-lg' : 'hover:bg-white/10 rounded-lg'} relative group`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <IconComponent
                    className={`w-[30px] h-[30px] flex-shrink-0 ${isActive ? 'text-black' : 'text-white'} transition-colors duration-300`}
                  />
                  {!isCollapsed && (
                    <span
                      className={`text-xl font-semibold transition-opacity duration-300 ${isActive ? 'text-black' : 'text-white'}`}
                    >
                      {item.label}
                    </span>
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Collapse Button */}
          <button
            onClick={onToggleCollapse}
            className={`absolute top-[59px] ${isCollapsed ? 'right-[8px]' : 'right-[15px]'} w-[31px] h-[31px] bg-white rounded-full border border-[#71839B] flex items-center justify-center transition-all duration-300 hover:bg-gray-50 hover:border-[#63CDFA] z-10`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-[15px] h-[15px] text-[#71839B]" />
            ) : (
              <ChevronLeft className="w-[15px] h-[15px] text-[#71839B]" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
