import { useState, useEffect } from "react";
import { Sidebar } from "@/components/general/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { StatsCards } from "@/components/dashboard/StatsCards";
import TimeClockControl from "@/components/dashboard/TimeClockControl";
import { AttendanceOverview } from "@/components/dashboard/AttendanceOverview";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import TodayActivity from "@/components/dashboard/TodayActivity";

export default function UserDashboard() {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Auto-collapse sidebar on mobile and handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        !isSidebarCollapsed &&
        window.innerWidth < 1024
      ) {
        setIsSidebarCollapsed(true);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isSidebarCollapsed]);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? "lg:ml-[90px] ml-0" : "lg:ml-[250px] ml-0"
        }`}
      >
        {/* Header */}
        <DashboardHeader
          isAdminView={isAdminView}
          onToggleView={() => setIsAdminView(!isAdminView)}
        />

        {/* Dashboard Content */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Greeting Section */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-black mb-2">
                Good morning 👋
              </h1>
              <p className="text-black/60 text-xl">
                Have a nice day at work XXX.
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

                {/* Time Clock Control - Replaces Recent Demands */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <TimeClockControl />
                </div>

                {/* Attendance Overview */}
                <AttendanceOverview />
              </div>

              {/* Right Column - Sidebar Content */}
              <div className="xl:col-span-4 space-y-6">
                <div className="bg-[#E1F5FE] rounded-3xl p-4">
                  <CalendarWidget />
                  <div className="mt-6">
                    {/* Today Activity - Replaces Employee Status */}
                    <TodayActivity />
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
