import { Bell, Power, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  isAdminView: boolean;
  onToggleView: () => void;
}

export function DashboardHeader({ isAdminView, onToggleView }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
      <div className="flex-1" />
      
      {/* Right side controls */}
      <div className="flex items-center gap-4">
        {/* User/Admin Toggle */}
        <div className="flex items-center gap-3 px-2 py-2 border border-[#63CDFA]/50 bg-white rounded-full">
          <button 
            className={`flex items-center justify-center w-12 h-12 rounded-lg transition-colors ${
              !isAdminView ? 'bg-transparent' : 'bg-transparent'
            }`}
            onClick={onToggleView}
          >
            <User className="w-6 h-6 text-[#77838F]" />
          </button>
          
          <div className="w-px h-8 bg-black/10" />
          
          <button 
            className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
              isAdminView ? 'bg-[#63CDFA]' : 'bg-transparent'
            }`}
            onClick={onToggleView}
          >
            <Users className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <Button 
            size="icon" 
            className="w-[60px] h-[60px] bg-[#63CDFA] hover:bg-[#4CB8E8] rounded-full"
          >
            <Bell className="w-7 h-7 text-white" />
          </Button>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6262] rounded-full border-2 border-[#63CDFA] flex items-center justify-center">
            <span className="text-white text-xs font-semibold">9+</span>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="w-[66px] h-[66px] rounded-full border-3 border-[#4DA64D] overflow-hidden">
          <img 
            src="https://cdn.builder.io/api/v1/image/assets%2Fe586c13bd8994056b17ba0083cfb21fb%2Faceaf2278b834174a9471c88a3fba7ea?format=webp&width=800" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Power/Logout Button */}
        <Button 
          size="icon" 
          variant="outline"
          className="w-[60px] h-[60px] border-[#FFB7B7] rounded-full hover:bg-red-50"
        >
          <Power className="w-6 h-6 text-[#FF6262]" />
        </Button>
      </div>
    </div>
  );
}
