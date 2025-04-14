
import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { toast } from 'sonner';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { hasAccess } = useAppContext();
  
  // Navigation items with access control
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard', access: 'dashboard' },
    { name: 'Batches', href: '/batches', icon: 'Users', access: 'batches' },
    { name: 'Egg Collection', href: '/egg-collection', icon: 'Egg', access: 'eggCollection' },
    { name: 'Feed Management', href: '/feed', icon: 'Utensils', access: 'feedManagement' },
    { name: 'Vaccination', href: '/vaccination', icon: 'Syringe', access: 'vaccination' },
    { name: 'Sales', href: '/sales', icon: 'ShoppingCart', access: 'sales' },
    { name: 'Customers', href: '/customers', icon: 'FileText', access: 'customers' },
    { name: 'Calendar', href: '/calendar', icon: 'Calendar', access: 'calendar' },
    { name: 'Warehouse', href: '/warehouse', icon: 'Package', access: 'warehouse' },
    { name: 'User Management', href: '/users', icon: 'UserCog', access: 'userManagement' }
  ];
  
  // Check if user has access to current route
  const currentPath = location.pathname;
  const currentNavItem = navigation.find(item => 
    currentPath === item.href || 
    (currentPath !== '/' && item.href !== '/' && currentPath.startsWith(item.href))
  );
  
  // If accessing a restricted page, redirect to dashboard
  if (currentNavItem && !hasAccess(currentNavItem.access as any)) {
    toast.error(`You don't have access to ${currentNavItem.name}`);
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
