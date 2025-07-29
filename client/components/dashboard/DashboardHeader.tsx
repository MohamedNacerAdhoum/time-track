import { Bell, Power, User, Users } from "lucide-react";

interface DashboardHeaderProps {
  isAdminView: boolean;
  onToggleView: () => void;
}

export function DashboardHeader({ isAdminView, onToggleView }: DashboardHeaderProps) {
  return (
    <div className="flex w-full items-center gap-2.5 px-6 py-4 bg-white">
      {/* User/Admin Toggle - positioned at the end to match Figma */}
      <div className="flex justify-end items-center flex-1 bg-white relative">
        <div className="flex w-[126px] p-[8.64px] items-start gap-3 rounded-full border border-[#63CDFA]/50 bg-white relative">
          <div className="flex px-[8.64px] py-[8.64px] justify-center items-center gap-[8.64px] flex-1 self-stretch rounded-full bg-[#63CDFA] relative">
            <div className="flex w-[30.24px] h-[30.24px] p-[4.32px] justify-center items-center rounded-full relative">
              <User className="w-[22px] h-[22px] flex-shrink-0 text-white" />
            </div>
          </div>
          <div className="flex p-[8.64px] justify-center items-center gap-[8.64px] flex-1 self-stretch rounded-[8.64px] relative">
            <Users className="w-[30.24px] h-[30.24px] text-[#77838F]" />
          </div>
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-7 relative">
        {/* Notification Bell */}
        <div className="flex p-2.5 justify-center items-center gap-2.5 rounded-full bg-[#63CDFA] relative">
          <div className="w-10 h-10 relative">
            <Bell className="w-[30px] h-[33px] flex-shrink-0 text-white absolute left-1 top-[3px]" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6262] rounded-full border-2 border-[#63CDFA] flex items-center justify-center">
              <span className="text-white text-xs font-semibold leading-normal">9+</span>
            </div>
          </div>
        </div>

        {/* Profile Picture */}
        <div className="flex p-[3px] items-start gap-2.5 rounded-full border-[3px] border-[#4DA64D] relative">
          <div className="w-[63px] h-[63px] rounded-full relative">
            <div 
              className="w-[63px] h-[63px] rounded-full bg-cover bg-center" 
              style={{
                backgroundImage: "url('https://cdn.builder.io/api/v1/image/assets%2Fe586c13bd8994056b17ba0083cfb21fb%2Faceaf2278b834174a9471c88a3fba7ea?format=webp&width=800')"
              }}
            />
          </div>
        </div>

        {/* Power/Logout Button */}
        <div className="flex w-[60px] h-[60px] p-[9px] justify-center items-center gap-2.5 rounded-full border border-[#FFB7B7] relative">
          <Power className="w-6 h-6 text-[#FF6262]" />
        </div>
      </div>
    </div>
  );
}
