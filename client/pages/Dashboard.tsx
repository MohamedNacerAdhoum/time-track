import { useState, useEffect } from "react";
import { Sidebar } from "@/components/general/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentDemands } from "@/components/dashboard/RecentDemands";
import TimeClockControl from "@/components/dashboard/TimeClockControl";
import { AttendanceOverview } from "@/components/dashboard/AttendanceOverview";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { EmployeeStatus } from "@/components/dashboard/EmployeeStatus";
import TodayActivity from "@/components/dashboard/TodayActivity";

export default function Dashboard() {
  const [isAdminView, setIsAdminView] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-collapse sidebar on mobile and handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarCollapsed(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSidebarCollapsed && window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSidebarCollapsed]);

  // Smooth transition when switching views
  const handleToggleView = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsAdminView(!isAdminView);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
    }, 150);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isMobile 
          ? 'pt-16 ml-0' // Mobile: add top padding for header, no left margin
          : isSidebarCollapsed 
            ? 'lg:ml-[90px] ml-0' 
            : 'lg:ml-[250px] ml-0'
      }`}>
        {/* Header - Hidden on mobile since we have the mobile header in sidebar */}
        <div className="hidden lg:block">
          <DashboardHeader
            isAdminView={isAdminView}
            onToggleView={handleToggleView}
          />
        </div>

        {/* Dashboard Content with Transition */}
        <div className={`flex-1 p-4 lg:p-6 transition-all duration-300 ${
          isTransitioning ? 'opacity-60 scale-95' : 'opacity-100 scale-100'
        }`}>
          <div className="max-w-7xl mx-auto">
            {/* Mobile View Toggle - Visible only on mobile */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-black">
                  {isAdminView ? 'Admin Dashboard' : 'User Dashboard'}
                </h1>
                <div className="flex items-center gap-3 px-3 py-2 border border-[#63CDFA]/50 bg-white rounded-full shadow-sm">
                  <button 
                    className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                      !isAdminView ? 'bg-[#63CDFA] shadow-sm' : 'bg-transparent hover:bg-gray-50'
                    }`}
                    onClick={handleToggleView}
                  >
                    <span className={`text-sm font-semibold transition-colors ${!isAdminView ? 'text-white' : 'text-[#77838F]'}`}>
                      User
                    </span>
                  </button>
                  
                  <div className="w-px h-6 bg-black/10" />
                  
                  <button 
                    className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                      isAdminView ? 'bg-[#63CDFA] shadow-sm' : 'bg-transparent hover:bg-gray-50'
                    }`}
                    onClick={handleToggleView}
                  >
                    <span className={`text-sm font-semibold transition-colors ${isAdminView ? 'text-white' : 'text-[#77838F]'}`}>
                      Admin
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Greeting Section */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-black mb-2">
                Good morning 👋
              </h1>
              <p className="text-black/60 text-xl">
                {isAdminView 
                  ? "Welcome to your admin dashboard. Manage your team effectively."
                  : "Have a nice day at work XXX."
                }
              </p>

              {/* Time Display */}
              <div className="mt-8">
                <div className="text-4xl font-bold text-black">
                  HH : mm : ss
                </div>
              </div>
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left Column - Main Content */}
              <div className="xl:col-span-8 space-y-6">
                {/* Stats Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <AttendanceChart />
                  <StatsCards />
                </div>

                {/* Conditional Section Based on View */}
                {isAdminView ? (
                  <RecentDemands />
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                    <TimeClockControl />
                  </div>
                )}

                {/* Attendance Overview */}
                <AttendanceOverview />
              </div>

              {/* Right Column - Sidebar Content */}
              <div className="xl:col-span-4 space-y-6">
                <div className="bg-[#E1F5FE] rounded-3xl p-4">
                  <CalendarWidget />
                  <div className="mt-6">
                    {/* Conditional Activity Based on View */}
                    {isAdminView ? (
                      <EmployeeStatus />
                    ) : (
                      <TodayActivity />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
