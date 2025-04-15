
import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useModuleAccess } from '@/context/ModuleAccessContext';
import { toast } from 'sonner';
import Sidebar from './Sidebar';
import Header from './Header';
import { ModuleAccess } from '@/types/moduleAccess';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { hasAccess, allModules } = useModuleAccess();
  
  // Map routes to module access keys
  const routeToModule: Record<string, keyof ModuleAccess> = {
    '/': 'dashboard',
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
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
      />

      {/* Content area */}
      <div className={cn(
        "flex-1 transition-all duration-200",
        isSidebarOpen ? "md:ml-64" : "ml-0"
      )}>
        {/* Top navigation */}
        <Header 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />

        {/* Main content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
