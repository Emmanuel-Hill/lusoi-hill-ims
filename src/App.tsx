
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
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
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

import { AppProvider } from "./context/AppContext";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <SonnerToaster />
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                }
              />
              <Route
                path="/batches"
                element={
                  <DashboardLayout>
                    <Batches />
                  </DashboardLayout>
                }
              />
              <Route
                path="/egg-collection"
                element={
                  <DashboardLayout>
                    <EggCollection />
                  </DashboardLayout>
                }
              />
              <Route
                path="/feed"
                element={
                  <DashboardLayout>
                    <FeedManagement />
                  </DashboardLayout>
                }
              />
              <Route
                path="/vaccination"
                element={
                  <DashboardLayout>
                    <Vaccination />
                  </DashboardLayout>
                }
              />
              <Route
                path="/sales"
                element={
                  <DashboardLayout>
                    <Sales />
                  </DashboardLayout>
                }
              />
              <Route
                path="/customers"
                element={
                  <DashboardLayout>
                    <Customers />
                  </DashboardLayout>
                }
              />
              <Route
                path="/calendar"
                element={
                  <DashboardLayout>
                    <CalendarPage />
                  </DashboardLayout>
                }
              />
              <Route
                path="/reports"
                element={
                  <DashboardLayout>
                    <Reports />
                  </DashboardLayout>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
