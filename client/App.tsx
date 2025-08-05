import "./global.css";
import { createRoot, Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "./components/general/ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";

// Pages
import Login from "./pages/Login";
import DashboardPage from "./pages/DashboardPage";
import TimesheetsPage from "./pages/TimesheetsPage";
import MembersPage from "./pages/MembersPage";
import SchedulesPage from "./pages/SchedulesPage";
import DemandsPage from "./pages/DemandsPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import BalancesPage from "./pages/BalancesPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

// Extend HTMLElement to include our custom _reactRoot property
declare global {
  interface HTMLElement {
    _reactRoot?: Root;
  }
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="timesheets" element={<TimesheetsPage />} />
                <Route path="members" element={<MembersPage />} />
                <Route path="schedules" element={<SchedulesPage />} />
                <Route path="demands" element={<DemandsPage />} />
                <Route path="complaints" element={<ComplaintsPage />} />
                <Route path="balances" element={<BalancesPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

const container = document.getElementById("root")!;

// Prevent multiple root creation during development
if (!container._reactRoot) {
  container._reactRoot = createRoot(container);
}

container._reactRoot.render(<App />);
