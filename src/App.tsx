
import React from "react";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./components/Layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Batches from "./pages/Batches";
import EggCollection from "./pages/EggCollection";
import FeedManagement from "./pages/FeedManagement";
import Vaccination from "./pages/Vaccination";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import CalendarPage from "./pages/CalendarPage";
import Warehouse from "./pages/Warehouse";
import UserManagement from "./pages/UserManagement";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import AuthGuard from "./components/AuthGuard";

import { AppProvider } from "./context/AppContext";
import { ModuleAccessProvider } from "./context/ModuleAccessContext";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <ModuleAccessProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/change-password" element={<ChangePassword />} />
                
                <Route
                  path="/"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/batches"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <Batches />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/egg-collection"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <EggCollection />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/feed"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <FeedManagement />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/vaccination"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <Vaccination />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/sales"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <Sales />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/customers"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <Customers />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <CalendarPage />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/warehouse"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <Warehouse />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <AuthGuard>
                      <DashboardLayout>
                        <UserManagement />
                      </DashboardLayout>
                    </AuthGuard>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ModuleAccessProvider>
      </AppProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
