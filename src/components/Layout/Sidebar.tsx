
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useModuleAccess } from '@/context/ModuleAccessContext';
import {
  LayoutDashboard,
  Layers,
  Egg,
  Wheat,
  Syringe,
  ShoppingCart,
  Users,
  Calendar,
  Store,
  Package,
  User,
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon: Icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'flex items-center px-4 py-3 text-sm transition-colors',
        isActive
          ? 'bg-lusoi-500 text-white font-medium'
          : 'text-lusoi-600 hover:bg-lusoi-100 hover:text-lusoi-700',
      )
    }
  >
    <Icon className="h-5 w-5 mr-3" />
    <span>{children}</span>
  </NavLink>
);

interface SidebarProps {
  expanded: boolean;
}

export default function Sidebar({ expanded }: SidebarProps) {
  const { hasAccess } = useModuleAccess();

  // Handle mobile sidebar
  if (!expanded) {
    return null; // Don't render if collapsed (mobile view)
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 z-20 h-screen flex flex-col">
      {/* Logo Area */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/9f47a32c-ba10-492c-ae49-62d0c8cc1910.png" 
            alt="Lusoi Logo" 
            className="h-10 mr-2" 
          />
          <h1 className="text-xl font-semibold text-black">Lusoi</h1>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto pt-4">
        {hasAccess('dashboard') && (
          <SidebarItem to="/dashboard" icon={LayoutDashboard}>
            Dashboard
          </SidebarItem>
        )}
        
        {hasAccess('batches') && (
          <SidebarItem to="/batches" icon={Layers}>
            Batches
          </SidebarItem>
        )}
        
        {hasAccess('eggCollection') && (
          <SidebarItem to="/egg-collection" icon={Egg}>
            Egg Collection
          </SidebarItem>
        )}
        
        {hasAccess('feedManagement') && (
          <SidebarItem to="/feed-management" icon={Wheat}>
            Feed Management
          </SidebarItem>
        )}
        
        {hasAccess('vaccination') && (
          <SidebarItem to="/vaccination" icon={Syringe}>
            Vaccination
          </SidebarItem>
        )}
        
        {hasAccess('sales') && (
          <SidebarItem to="/sales" icon={Store}>
            Sales
          </SidebarItem>
        )}
        
        {hasAccess('customers') && (
          <SidebarItem to="/customers" icon={Users}>
            Customers
          </SidebarItem>
        )}
        
        {hasAccess('customers') && hasAccess('sales') && (
          <SidebarItem to="/orders" icon={ShoppingCart}>
            Orders
          </SidebarItem>
        )}
        
        {hasAccess('warehouse') && (
          <SidebarItem to="/warehouse" icon={Package}>
            Warehouse
          </SidebarItem>
        )}
        
        {hasAccess('calendar') && (
          <SidebarItem to="/calendar" icon={Calendar}>
            Calendar
          </SidebarItem>
        )}
        
        {hasAccess('userManagement') && (
          <SidebarItem to="/users" icon={User}>
            User Management
          </SidebarItem>
        )}
      </nav>

      <div className="px-4 py-4 border-t border-gray-200 mt-auto text-xs text-lusoi-600">
        Lusoi Poultry Management
        <p className="opacity-70">© 2025 All rights reserved</p>
      </div>
    </aside>
  );
}
