import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/general/ProtectedRoute";

import Login from "./pages/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import TimesheetsPage from "./pages/TimesheetsPage";
import MembersPage from "./pages/MembersPage";
import SchedulesPage from "./pages/SchedulesPage";
import DemandsPage from "./pages/DemandsPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import BalancesPage from "./pages/BalancesPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboard Layout with nested routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="timesheets" element={<TimesheetsPage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="schedules" element={<SchedulesPage />} />
            <Route path="demands" element={<DemandsPage />} />
            <Route path="complaints" element={<ComplaintsPage />} />
            <Route path="balances" element={<BalancesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
