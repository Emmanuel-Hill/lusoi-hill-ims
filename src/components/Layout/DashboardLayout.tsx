
import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
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
  ShoppingCart,
  UserCog,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from 'sonner';
import UserMenu from '../Navigation/UserMenu';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { hasAccess, users, currentUser, setCurrentUser } = useAppContext();
  
  // Navigation items with access control
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, access: 'dashboard' },
    { name: 'Batches', href: '/batches', icon: Users, access: 'batches' },
    { name: 'Egg Collection', href: '/egg-collection', icon: Egg, access: 'eggCollection' },
    { name: 'Feed Management', href: '/feed', icon: Utensils, access: 'feedManagement' },
    { name: 'Vaccination', href: '/vaccination', icon: Syringe, access: 'vaccination' },
    { name: 'Sales', href: '/sales', icon: ShoppingCart, access: 'sales' },
    { name: 'Customers', href: '/customers', icon: FileText, access: 'customers' },
    { name: 'Calendar', href: '/calendar', icon: Calendar, access: 'calendar' },
    { name: 'Warehouse', href: '/warehouse', icon: Package, access: 'warehouse' },
    { name: 'User Management', href: '/users', icon: UserCog, access: 'userManagement' }
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
  
  // Handle user switch
  const handleUserSwitch = (userId: string) => {
    const userToSwitch = users.find(user => user.id === userId);
    if (userToSwitch) {
      setCurrentUser(userToSwitch);
      toast.success(`Switched to ${userToSwitch.name}`);
    }
  };

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
              <img
                src="/lovable-uploads/9eebc39c-2e9e-45dd-a2f3-7edc6d9d8bec.png"
                alt="Lusoi Logo"
                className="h-10 w-auto"
              />
              <span className="text-2xl font-bold text-green-700">Lusoi</span>
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
              // Only show menu items the user has access to
              if (!hasAccess(item.access as any)) return null;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-green-700 text-white"
                      : "text-sidebar-foreground hover:bg-green-100 hover:text-green-800"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5",
                      isActive
                        ? "text-white"
                        : "text-green-700 group-hover:text-green-800"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <div className="text-xs font-semibold text-sidebar-foreground">
              Lusoi Poultry Management
            </div>
            <div className="mt-1 text-xs text-sidebar-foreground/70">
              © 2025 All rights reserved
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
            <div className="flex items-center space-x-4 ml-auto">
              {/* User selector - for demo purposes */}
              <div className="hidden md:block">
                <Select
                  value={currentUser?.id || ''}
                  onValueChange={handleUserSwitch}
                >
                  <SelectTrigger className="w-[200px] border-none">
                    <SelectValue 
                      placeholder={currentUser?.name || 'Select User'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="md:hidden px-4 py-2 text-sm font-medium text-gray-700">
                {currentUser?.name || 'User'}
              </span>
              
              {/* Add UserMenu component here */}
              <UserMenu />
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
