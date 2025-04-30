
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AppProvider } from '@/context/AppContext';
import { ModuleAccessProvider } from '@/context/ModuleAccessContext';
import AuthGuard from '@/components/AuthGuard';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Batches from '@/pages/Batches';
import EggCollection from '@/pages/EggCollection';
import FeedManagement from '@/pages/FeedManagement';
import Vaccination from '@/pages/Vaccination';
import Sales from '@/pages/Sales';
import Customers from '@/pages/Customers';
import Orders from '@/pages/Orders';
import CalendarPage from '@/pages/CalendarPage';
import UserManagement from '@/pages/UserManagement';
import ChangePassword from '@/pages/ChangePassword';
import Warehouse from '@/pages/Warehouse';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AppProvider>
        <ModuleAccessProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <AuthGuard>
                    <DashboardLayout>
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="batches" element={<Batches />} />
                        <Route path="egg-collection" element={<EggCollection />} />
                        <Route path="feed-management" element={<FeedManagement />} />
                        <Route path="vaccination" element={<Vaccination />} />
                        <Route path="sales" element={<Sales />} />
                        <Route path="customers" element={<Customers />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="calendar" element={<CalendarPage />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="change-password" element={<ChangePassword />} />
                        <Route path="warehouse" element={<Warehouse />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </DashboardLayout>
                  </AuthGuard>
                }
              />
            </Routes>
          </Router>
          <Toaster />
        </ModuleAccessProvider>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
