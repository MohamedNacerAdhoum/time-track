  import { useMemo, useEffect } from 'react';
import { useTimeSheets } from '@/contexts/TimeSheetsContext';
import { format } from 'date-fns';

export function EmployeeStatus() {
  const { employeesStatus, loading: loadingStatus, fetchEmployeesStatus } = useTimeSheets();
  
  // Fetch employees status when component mounts
  useEffect(() => {
    fetchEmployeesStatus();
  }, [fetchEmployeesStatus]);
  
  // Process recent employees from the status data
  const recentEmployees = useMemo(() => {
    if (!employeesStatus?.RECENT) return [];
    
    return employeesStatus.RECENT.map(employee => ({
      id: employee.employee,
      name: employee.employee_name,
      status: employee.status === 'IN' ? 'in' : 
              employee.status === 'IN BREAK' ? 'break' : 'out',
      timestamp: format(new Date(employee.last_modified), 'MMMM d, yyyy h:mm a'),
      imageUrl: employee.employee_image
    }));
  }, [employeesStatus]);
  
  // Get status counts from the API response
  const statusCounts = useMemo(() => ({
    in: employeesStatus?.IN || 0,
    break: employeesStatus?.['IN BREAK'] || 0,
    out: employeesStatus?.OUT || 0,
    total: employeesStatus?.TOTAL || 0,
    absent: employeesStatus?.ABSENT || 0
  }), [employeesStatus]);
  
  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (!statusCounts.total) return 0;
    return ((statusCounts.in + statusCounts.break) / statusCounts.total) * 100;
  }, [statusCounts]);
  
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
              <span className="text-[#71839B]">{statusCounts.in}</span>
              <br />
              <span className="text-black">In</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              <span className="text-[#71839B]">{statusCounts.break}</span>
              <br />
              <span className="text-black">Break</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">
              <span className="text-[#71839B]">{statusCounts.out}</span>
              <br />
              <span className="text-black">Out</span>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-3 bg-[#E6EEF5] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#63CDFA] rounded-full transition-all duration-500 ease-in-out" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Employee list */}
      <div className="space-y-2.5">
        {loadingStatus ? (
          // Loading state
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                  <div className="h-3 w-16 bg-gray-100 rounded"></div>
                </div>
              </div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : (
          // Actual data
          recentEmployees.slice(0, 5).map((member) => {
            const statusColors = {
              in: 'bg-[#0FBA83]',
              break: 'bg-[#F59E0B]',
              out: 'bg-[#EF4444]'
            };
            
            const statusText = {
              in: 'In',
              break: 'Break',
              out: 'Out'
            };
            
            return (
              <div key={member.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full p-[2px] ${member.status === 'in' ? 'border-2 border-[#0FBA83]' : member.status === 'break' ? 'border-2 border-[#F59E0B]' : 'border-2 border-[#EF4444]'}`}>
                    {member.imageUrl ? (
                      <img 
                        src={member.imageUrl} 
                        alt={member.name}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-medium ${member.status === 'in' ? 'text-[#0FBA83]' : member.status === 'break' ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>
                    {statusText[member.status]}
                  </p>
                </div>
              </div>
            );
          })
        )}
        
        {!loadingStatus && recentEmployees.length > 0 && (
          <div className="mt-4">
            <button className="w-full h-8 bg-[#63CDFA]/20 rounded-xl flex items-center justify-center hover:bg-[#63CDFA]/30 transition-colors">
              <span className="text-xs font-semibold text-[#63CDFA]">
                See all
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
