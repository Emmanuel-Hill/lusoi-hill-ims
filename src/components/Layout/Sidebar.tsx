
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useModuleAccess } from '@/context/ModuleAccessContext';
import { useAppContext } from '@/context/AppContext';
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
  CircleUser,
} from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  expanded: boolean;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon: Icon,
  children,
  expanded,
  active = false,
}) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      cn(
        'flex items-center rounded-md px-3 py-2 text-sm transition-colors h-10 mb-1',
        'hover:bg-lusoi-100 hover:text-lusoi-800',
        isActive
          ? 'bg-lusoi-500 text-white font-medium'
          : 'text-lusoi-700',
        !expanded && 'justify-center'
      )
    }
  >
    <Icon className={cn('h-5 w-5', expanded && 'mr-3')} />
    {expanded && <span>{children}</span>}
  </NavLink>
);

interface SidebarProps {
  expanded: boolean;
}

export default function Sidebar({ expanded }: SidebarProps) {
  const { hasAccess } = useModuleAccess();
  const { isInitialLogin } = useAppContext();

  return (
    <aside
      className={cn(
        'bg-lusoi-50 flex flex-col h-full py-4 border-r border-lusoi-100 transition-all duration-300',
        expanded ? 'w-64' : 'w-16'
      )}
    >
      {/* Logo Area */}
      <div className={cn(
        'px-4 mb-6',
        !expanded && 'flex justify-center'
      )}>
        {expanded ? (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-lusoi-500 rounded-md flex items-center justify-center text-white font-bold mr-2">
              L
            </div>
            <h1 className="text-lusoi-700 text-xl font-bold">Lusoi</h1>
          </div>
        ) : (
          <div className="w-8 h-8 bg-lusoi-500 rounded-md flex items-center justify-center text-white font-bold">
            L
          </div>
        )}
      </div>
      
      <nav className="space-y-1 px-2 flex-1">
        {hasAccess('dashboard') && (
          <SidebarItem to="/dashboard" icon={LayoutDashboard} expanded={expanded}>
            Dashboard
          </SidebarItem>
        )}
        
        {hasAccess('batches') && (
          <SidebarItem to="/batches" icon={Layers} expanded={expanded}>
            Batches
          </SidebarItem>
        )}
        
        {hasAccess('eggCollection') && (
          <SidebarItem to="/egg-collection" icon={Egg} expanded={expanded}>
            Egg Collection
          </SidebarItem>
        )}
        
        {hasAccess('feedManagement') && (
          <SidebarItem to="/feed-management" icon={Wheat} expanded={expanded}>
            Feed Management
          </SidebarItem>
        )}
        
        {hasAccess('vaccination') && (
          <SidebarItem to="/vaccination" icon={Syringe} expanded={expanded}>
            Vaccination
          </SidebarItem>
        )}
        
        {hasAccess('sales') && (
          <SidebarItem to="/sales" icon={Store} expanded={expanded}>
            Sales
          </SidebarItem>
        )}
        
        {hasAccess('customers') && (
          <SidebarItem to="/customers" icon={Users} expanded={expanded}>
            Customers
          </SidebarItem>
        )}
        
        {hasAccess('customers') && hasAccess('sales') && (
          <SidebarItem to="/orders" icon={ShoppingCart} expanded={expanded}>
            Orders
          </SidebarItem>
        )}
        
        {hasAccess('warehouse') && (
          <SidebarItem to="/warehouse" icon={Package} expanded={expanded}>
            Warehouse
          </SidebarItem>
        )}
        
        {hasAccess('calendar') && (
          <SidebarItem to="/calendar" icon={Calendar} expanded={expanded}>
            Calendar
          </SidebarItem>
        )}
        
        {hasAccess('userManagement') && (
          <SidebarItem to="/users" icon={CircleUser} expanded={expanded}>
            User Management
          </SidebarItem>
        )}
      </nav>

      {expanded && (
        <div className="px-4 py-2 mt-auto text-xs text-lusoi-600">
          Lusoi Poultry Management
          <p className="opacity-70">© 2025 All rights reserved</p>
        </div>
      )}
    </aside>
  );
}
