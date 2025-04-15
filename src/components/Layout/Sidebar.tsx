
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Egg,
  Calendar,
  Package,
  Syringe,
  ShoppingCart,
  X,
  Utensils,
  FileText,
  UserCog
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useModuleAccess } from '@/context/ModuleAccessContext';
import { ModuleAccess } from '@/types/moduleAccess';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const { hasAccess } = useModuleAccess();
  
  // Navigation items with access control
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, access: 'dashboard' as keyof ModuleAccess },
    { name: 'Batches', href: '/batches', icon: Users, access: 'batches' as keyof ModuleAccess },
    { name: 'Egg Collection', href: '/egg-collection', icon: Egg, access: 'eggCollection' as keyof ModuleAccess },
    { name: 'Feed Management', href: '/feed', icon: Utensils, access: 'feedManagement' as keyof ModuleAccess },
    { name: 'Vaccination', href: '/vaccination', icon: Syringe, access: 'vaccination' as keyof ModuleAccess },
    { name: 'Sales', href: '/sales', icon: ShoppingCart, access: 'sales' as keyof ModuleAccess },
    { name: 'Customers', href: '/customers', icon: FileText, access: 'customers' as keyof ModuleAccess },
    { name: 'Calendar', href: '/calendar', icon: Calendar, access: 'calendar' as keyof ModuleAccess },
    { name: 'Warehouse', href: '/warehouse', icon: Package, access: 'warehouse' as keyof ModuleAccess },
    { name: 'User Management', href: '/users', icon: UserCog, access: 'userManagement' as keyof ModuleAccess }
  ];
  
  return (
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
            const isActive = location.pathname === item.href;
            // Only show menu items the user has access to
            if (!hasAccess(item.access)) return null;
            
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
  );
};

export default Sidebar;
