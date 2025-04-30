
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useModuleAccess } from '@/context/ModuleAccessContext';
import { useAppContext } from '@/context/AppContext';
import {
  Layers,
  Egg,
  Wheat,
  Syringe,
  ShoppingCart,
  Users,
  Calendar,
  LineChart,
  CircleUser,
  Store,
  Package,
} from 'lucide-react';

// Animation variants for the sidebar items
const itemVariants = {
  closed: {
    opacity: 0,
  },
  open: {
    opacity: 1,
  },
};

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
        'flex items-center rounded-md px-3 py-2 text-sm transition-colors h-10',
        'hover:bg-accent hover:text-accent-foreground',
        isActive
          ? 'bg-accent text-accent-foreground font-medium'
          : 'text-muted-foreground',
        !expanded && 'justify-center'
      )
    }
  >
    <Icon className={cn('h-5 w-5', expanded && 'mr-2')} />
    {expanded && <span>{children}</span>}
  </NavLink>
);

interface SidebarProps {
  expanded: boolean;
}

export default function Sidebar({ expanded }: SidebarProps) {
  const location = useLocation();
  const { hasAccess } = useModuleAccess();
  const { isInitialLogin } = useAppContext();

  return (
    <aside
      className={cn(
        'bg-background flex flex-col h-full py-2 border-r transition-all duration-300',
        expanded ? 'w-56' : 'w-14'
      )}
    >
      <nav className="space-y-1 px-2 flex-1">
        {hasAccess('dashboard') && (
          <SidebarItem to="/dashboard" icon={LineChart} expanded={expanded}>
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
    </aside>
  );
}
