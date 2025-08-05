import { Clock, Ticket } from "lucide-react";

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-5 lg:col-span-2">
      {/* Worked Hours Card */}
      <div className="bg-white border border-[#B7B9C7] rounded-2xl p-6 flex items-center justify-between">
        <div className="flex flex-col gap-6">
          <div className="text-4xl font-normal text-black">4.1</div>
          <div className="text-2xl font-light text-[#252C58]">Leave balance</div>
        </div>
        <div className="bg-[#E6EAF5] rounded-full p-3">
          <Clock className="w-7 h-7 text-[#63CDFA]" />
        </div>
      </div>

      {/* Absent Workers Card */}
      <div className="bg-white border border-[#B7B9C7] rounded-2xl p-6 flex items-center justify-between">
        <div className="flex flex-col gap-6">
          <div className="text-4xl font-normal text-black">5</div>
          <div className="text-2xl font-light text-[#252C58]">Ticket Restaurant</div>
        </div>
        <div className="bg-[#E6EAF5] rounded-full p-3">
          <Ticket className="w-7 h-7 text-[#63CDFA]" />
        </div>
      </div>
    </div>
  );
}
