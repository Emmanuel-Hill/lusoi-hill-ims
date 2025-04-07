
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./components/Layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Batches from "./pages/Batches";
import EggCollection from "./pages/EggCollection";
import NotFound from "./pages/NotFound";

import { AppProvider } from "./context/AppContext";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
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
              {/* Placeholder routes for other pages */}
              <Route
                path="/feed"
                element={
                  <DashboardLayout>
                    <div className="p-6">Feed Management content will be added soon.</div>
                  </DashboardLayout>
                }
              />
              <Route
                path="/vaccination"
                element={
                  <DashboardLayout>
                    <div className="p-6">Vaccination content will be added soon.</div>
                  </DashboardLayout>
                }
              />
              <Route
                path="/sales"
                element={
                  <DashboardLayout>
                    <div className="p-6">Sales content will be added soon.</div>
                  </DashboardLayout>
                }
              />
              <Route
                path="/customers"
                element={
                  <DashboardLayout>
                    <div className="p-6">Customers content will be added soon.</div>
                  </DashboardLayout>
                }
              />
              <Route
                path="/calendar"
                element={
                  <DashboardLayout>
                    <div className="p-6">Calendar content will be added soon.</div>
                  </DashboardLayout>
                }
              />
              <Route
                path="/reports"
                element={
                  <DashboardLayout>
                    <div className="p-6">Reports content will be added soon.</div>
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
