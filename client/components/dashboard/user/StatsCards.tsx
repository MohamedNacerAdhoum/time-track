import { Clock, Ticket } from "lucide-react";
import { useAuthStore } from "@/contexts/UserContext";
import { useMembersStore } from "@/contexts/MembersContext";
import { useEffect, useRef } from "react";

export function StatsCards() {
  const { user: authUser } = useAuthStore();
  const { currentUser, fetchCurrentUser } = useMembersStore();
  const hasFetched = useRef(false);

  // Fetch user data when component mounts
  useEffect(() => {
    if (!authUser?.token || hasFetched.current) return;

    const loadUserData = async () => {
      try {
        await fetchCurrentUser();
        hasFetched.current = true;
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    };

    loadUserData();
  }, [authUser?.token, fetchCurrentUser]);
  return (
    <div className="grid grid-cols-1 gap-5 lg:col-span-2">
      {/* Leave balance Card */}
      <div className="bg-white border border-[#B7B9C7] rounded-2xl p-6 flex items-center justify-between">
        <div className="flex flex-col gap-6">
          <div className="text-4xl font-normal text-black">{currentUser?.leave_balance ?? '--'}</div>
          <div className="text-2xl font-light text-[#252C58]">Leave balance</div>
        </div>
        <div className="bg-[#E6EAF5] rounded-full p-3">
          <Clock className="w-7 h-7 text-[#63CDFA]" />
        </div>
      </div>

      {/* Ticket Restaurant Card */}
      <div className="bg-white border border-[#B7B9C7] rounded-2xl p-6 flex items-center justify-between">
        <div className="flex flex-col gap-6">
          <div className="text-4xl font-normal text-black">--</div>
          <div className="text-2xl font-light text-[#252C58]">Ticket Restaurant</div>
        </div>
        <div className="bg-[#E6EAF5] rounded-full p-3">
          <Ticket className="w-7 h-7 text-[#63CDFA]" />
        </div>
      </div>
    </div>
  );
}
