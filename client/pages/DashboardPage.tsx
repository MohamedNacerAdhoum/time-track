import { useState, useEffect } from "react";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { StatsCardsOrg } from "@/components/dashboard/StatsCardsOrg";
import { TimeOverviewChart } from "@/components/dashboard/TimeOverviewChart";
import { RecentDemands } from "@/components/dashboard/RecentDemands";
import TimeClockControl from "@/components/dashboard/TimeClockControl";
import { AttendanceOverview } from "@/components/dashboard/AttendanceOverview";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { EmployeeStatus } from "@/components/dashboard/EmployeeStatus";
import TodayActivity from "@/components/dashboard/TodayActivity";

interface DashboardPageProps {
  isAdminView?: boolean;
}

export default function DashboardPage({
  isAdminView = true,
}: DashboardPageProps) {
  return (
    <>
      {/* Greeting Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-black mb-2">Good morning 👋</h1>
        <p className="text-black/60 text-xl">
          {isAdminView
            ? "Welcome to your admin dashboard. Manage your team effectively."
            : "Have a nice day at work XXX."}
        </p>

        {/* Time Display */}
        <div className="mt-8">
          <div className="text-4xl font-bold text-black">HH : mm : ss</div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-8 space-y-6">
          {/* Stats Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {isAdminView ? (
              <>
                <AttendanceChart />
                <StatsCardsOrg />
              </>
            ) : (
              <>
                <TimeOverviewChart />
                <StatsCards />
              </>
            )}
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
              {isAdminView ? <EmployeeStatus /> : <TodayActivity />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
