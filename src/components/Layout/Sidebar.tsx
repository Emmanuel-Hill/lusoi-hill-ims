
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
          ? 'bg-sidebar-primary text-white font-medium'
          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground',
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
    <aside className="w-64 bg-sidebar-background border-r border-sidebar-border z-20 h-screen flex flex-col">
      {/* Logo Area */}
      <div className="px-6 py-5 border-b border-sidebar-border">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/cf99a3a6-af81-4c19-aa62-36e4b3bffd5c.png" 
            alt="Lusoi Logo" 
            className="h-12 mr-3" 
          />
          <h1 className="text-xl font-semibold text-primary">Lusoi</h1>
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

      <div className="px-4 py-4 border-t border-sidebar-border mt-auto text-xs text-sidebar-foreground/80">
        Lusoi Poultry Management
        <p className="opacity-70">© 2025 All rights reserved</p>
      </div>
    </aside>
  );
}
