import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const demandItems = [
  {
    id: 1,
    name: "Xxxx Yyyyy",
    description: "Update on marketing campaign",
    time: "10 min ago",
    avatar: "https://api.builderio.com/api/v1/image/assets/TEMP/user1"
  },
  {
    id: 2,
    name: "Xxxx Yyyyy",
    description: "Update on marketing campaign",
    time: "10 min ago",
    avatar: "https://api.builderio.com/api/v1/image/assets/TEMP/user2"
  },
  {
    id: 3,
    name: "Xxxx Yyyyy",
    description: "Update on marketing campaign",
    time: "10 min ago",
    avatar: "https://api.builderio.com/api/v1/image/assets/TEMP/user3"
  },
  {
    id: 4,
    name: "Xxxx Yyyyy",
    description: "Update on marketing campaign",
    time: "10 min ago",
    avatar: "https://api.builderio.com/api/v1/image/assets/TEMP/user4",
    hideActions: true
  }
];

export function RecentDemands() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-black">Recent Demands</h2>
        <button className="text-[#62B2FD] text-sm font-medium hover:underline">
          See all
        </button>
      </div>

      {/* Demands List */}
      <div className="space-y-4">
        {demandItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2">
            {/* Left side - User info */}
            <div className="flex items-center gap-5">
              <div className="w-15 h-15 rounded-full bg-gray-300 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 rounded-full" />
              </div>
              
              <div>
                <div className="text-sm font-medium text-[#38393C]">
                  {item.name}
                </div>
                <div className="text-sm font-bold text-[#ABAEB7]">
                  {item.description}
                </div>
              </div>
            </div>

            {/* Right side - Time and actions */}
            <div className="flex flex-col items-end gap-2">
              <span className="text-xs text-[#686868]">{item.time}</span>
              
              {!item.hideActions && (
                <div className="flex gap-5">
                  <Button 
                    size="icon" 
                    className="w-9 h-9 bg-[#56C992] hover:bg-[#45b377] rounded-full"
                  >
                    <Check className="w-5 h-5 text-white" />
                  </Button>
                  <Button 
                    size="icon" 
                    className="w-9 h-9 bg-[#FF6262] hover:bg-[#e55555] rounded-full"
                  >
                    <X className="w-5 h-5 text-white" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
