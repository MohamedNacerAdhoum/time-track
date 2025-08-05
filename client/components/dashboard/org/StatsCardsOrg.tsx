import { Clock, UserX } from "lucide-react";

export function StatsCardsOrg() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:col-span-2">
      {/* Worked Hours Card */}
      <div className="bg-white border border-[#B7B9C7] rounded-2xl p-6 flex items-center justify-between">
        <div className="flex flex-col gap-6">
          <div className="text-4xl font-normal text-black">40h</div>
          <div className="text-2xl font-light text-[#252C58]">Worked hours</div>
        </div>
        <div className="bg-[#E6EAF5] rounded-full p-3">
          <Clock className="w-7 h-7 text-[#63CDFA]" />
        </div>
      </div>

      {/* Absent Workers Card */}
      <div className="bg-white border border-[#B7B9C7] rounded-2xl p-6 flex items-center justify-between">
        <div className="flex flex-col gap-6">
          <div className="text-4xl font-normal text-black">2</div>
          <div className="text-2xl font-light text-[#252C58]">Absent workers</div>
        </div>
        <div className="bg-[#E6EAF5] rounded-full p-3">
          <UserX className="w-7 h-7 text-[#63CDFA]" />
        </div>
      </div>
    </div>
  );
}
