
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Egg,
  Users,
  BarChartHorizontal,
  FileText,
  LayoutDashboard,
  Menu,
  X,
  Utensils,
  Syringe,
  Calendar,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Batches', href: '/batches', icon: Users },
    { name: 'Egg Collection', href: '/egg-collection', icon: Egg },
    { name: 'Feed Management', href: '/feed', icon: Utensils },
    { name: 'Vaccination', href: '/vaccination', icon: Syringe },
    { name: 'Sales', href: '/sales', icon: ShoppingCart },
    { name: 'Customers', href: '/customers', icon: FileText },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Reports', href: '/reports', icon: BarChartHorizontal }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-sidebar border-r border-sidebar-border transition-transform duration-200 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-6">
            <Link to="/" className="flex items-center space-x-2">
              <Egg className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">EggTrack</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = item.href === location.pathname;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive
                        ? "text-sidebar-primary-foreground"
                        : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <div className="text-xs font-semibold text-sidebar-foreground">
              EggTrack Poultry Management
            </div>
            <div className="mt-1 text-xs text-sidebar-foreground/70">
              © 2024 All rights reserved
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className={cn(
        "flex-1 transition-all duration-200",
        isSidebarOpen ? "md:ml-64" : "ml-0"
      )}>
        {/* Top navigation */}
        <div className="bg-white shadow">
          <div className="px-4 py-2 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn("md:hidden", !isSidebarOpen && "block")}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="flex items-center">
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                Admin User
              </span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
