const employees = [
  {
    id: 1,
    name: "User xxxx",
    timestamp: "04 April, 2021 | 04:00 PM",
    avatar: "https://api.builderio.com/api/v1/image/assets/TEMP/user1"
  },
  {
    id: 2,
    name: "User yyy",
    timestamp: "04 April, 2021 | 04:00 PM",
    avatar: "https://api.builderio.com/api/v1/image/assets/TEMP/user2"
  },
  {
    id: 3,
    name: "User zzzzz",
    timestamp: "04 April, 2021 | 04:00 PM",
    avatar: "https://api.builderio.com/api/v1/image/assets/TEMP/user3"
  },
  {
    id: 4,
    name: "User xxxx",
    timestamp: "04 April, 2021 | 04:00 PM",
    avatar: "https://api.builderio.com/api/v1/image/assets/TEMP/user4"
  }
];

export function EmployeeStatus() {
  return (
    <div className="bg-white rounded-xl p-5">
      {/* Header */}
      <h3 className="text-2xl font-semibold text-black text-center mb-2">
        Employees Status
      </h3>
      
      {/* Status bar and numbers */}
      <div className="px-8 mb-6">
        <div className="flex justify-between items-center gap-12 mb-3">
          <div className="text-center">
            <div className="text-lg font-semibold">
              <span className="text-[#71839B]">8</span>
              <br />
              <span className="text-black">In</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              <span className="text-[#71839B]">0</span>
              <br />
              <span className="text-black">Break</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              <span className="text-[#71839B]">0</span>
              <br />
              <span className="text-black">Out</span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-3 bg-[#E6EEF5] rounded-full overflow-hidden">
          <div className="w-[24%] h-full bg-[#63CDFA] rounded-full" />
        </div>
      </div>
      
      {/* Employee list */}
      <div className="space-y-2.5">
        {employees.map((employee) => (
          <div 
            key={employee.id} 
            className="flex items-center gap-2.5 p-2.5 bg-[#F9F9F9] rounded-full"
          >
            <div className="w-12 h-12 rounded-full border-3 border-[#4DA64D] overflow-hidden bg-gradient-to-br from-blue-400 to-purple-400">
              {/* Placeholder for profile image */}
            </div>
            
            <div className="flex-1">
              <div className="text-xs font-bold text-[#23262F]">
                {employee.name}
              </div>
              <div className="text-[10px] font-normal text-[#708099]">
                {employee.timestamp}
              </div>
            </div>
          </div>
        ))}
        
        {/* See all button */}
        <div className="mt-4">
          <button className="w-full h-8 bg-[#63CDFA]/20 rounded-xl flex items-center justify-center">
            <span className="text-xs font-semibold text-[#63CDFA]">
              See all
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
