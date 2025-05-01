
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useModuleAccess } from '@/context/ModuleAccessContext';
import { toast } from 'sonner';
import Sidebar from './Sidebar';
import Header from './Header';
import { ModuleAccess } from '@/types/moduleAccess';
import DarkModeToggle from "@/components/ui/DarkModeToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true); // Always open on desktop
  const location = useLocation();
  const { hasAccess, allModules } = useModuleAccess();
  
  // Map routes to module access keys
  const routeToModule: Record<string, keyof ModuleAccess> = {
    '/': 'dashboard',
    '/dashboard': 'dashboard',
    '/batches': 'batches',
    '/egg-collection': 'eggCollection',
    '/feed': 'feedManagement',
    '/vaccination': 'vaccination',
    '/sales': 'sales',
    '/customers': 'customers',
    '/calendar': 'calendar',
    '/warehouse': 'warehouse',
    '/users': 'userManagement',
  };
  
  // Check if user has access to current route
  const currentPath = location.pathname;
  const currentModule = Object.entries(routeToModule).find(([route]) => 
    currentPath === route || 
    (currentPath !== '/' && route !== '/' && currentPath.startsWith(route))
  );
  
  // If accessing a restricted page, redirect to dashboard
  if (currentModule && !hasAccess(currentModule[1])) {
    toast.error(`You don't have access to ${currentModule[1]}`);
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar - always shown on desktop, toggleable on mobile */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isSidebarOpen ? "block" : "hidden md:block"
      )}>
        <Sidebar expanded={true} />
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top navigation */}
        <Header 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />
        
        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
      
      {/* Dark Mode toggle (positioned absolute) */}
      <div className="fixed bottom-4 right-4 z-50">
        <DarkModeToggle />
      </div>
    </div>
  );
};

export default DashboardLayout;
