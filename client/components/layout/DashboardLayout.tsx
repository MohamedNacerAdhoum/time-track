import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "@/components/general/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import DashboardPage from "@/pages/DashboardPage";

export default function DashboardLayout() {
  const [isAdminView, setIsAdminView] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();

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

  // Get current route for sidebar active state
  const getCurrentRoute = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path === "/timesheets") return "Timesheets";
    if (path === "/members") return "Members";
    if (path === "/schedules") return "Schedules";
    if (path === "/demands") return "Demands";
    if (path === "/complaints") return "Complaints";
    if (path === "/balances") return "Balances";
    if (path === "/settings") return "Settings";
    return "Dashboard";
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        activeRoute={getCurrentRoute()}
        isAdminView={isAdminView}
        onToggleView={handleToggleView}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMobile
            ? "pt-20 ml-0" // Mobile: add more top padding for header and toggle
            : isSidebarCollapsed
              ? "lg:ml-[90px] ml-0"
              : "lg:ml-[250px] ml-0"
        }`}
      >
        {/* Header - Hidden on mobile since we have the mobile header in sidebar */}
        <div className="hidden lg:block">
          <DashboardHeader
            isAdminView={isAdminView}
            onToggleView={handleToggleView}
          />
        </div>

        {/* Page Content with Transition */}
        <div
          className={`flex-1 p-4 lg:p-6 transition-all duration-300 ${
            isTransitioning ? "opacity-60 scale-95" : "opacity-100 scale-100"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {/* Render the current page component */}
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
