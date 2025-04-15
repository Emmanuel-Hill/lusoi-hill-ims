
import React, { createContext, useContext } from 'react';
import { ModuleAccess } from '@/types/moduleAccess';
import { useAppContext } from './AppContext';

// Create a context for module access
interface ModuleAccessContextType {
  hasAccess: (module: keyof ModuleAccess) => boolean;
  allModules: Array<{key: keyof ModuleAccess, label: string}>;
}

const ModuleAccessContext = createContext<ModuleAccessContextType | undefined>(undefined);

export const allModules: Array<{key: keyof ModuleAccess, label: string}> = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'batches', label: 'Batches' },
  { key: 'eggCollection', label: 'Egg Collection' },
  { key: 'feedManagement', label: 'Feed Management' },
  { key: 'vaccination', label: 'Vaccination' },
  { key: 'sales', label: 'Sales' },
  { key: 'customers', label: 'Customers' },
  { key: 'calendar', label: 'Calendar' },
  { key: 'warehouse', label: 'Warehouse' },
  { key: 'reports', label: 'Reports' },
  { key: 'userManagement', label: 'User Management' }
];

export const ModuleAccessProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { hasAccess } = useAppContext();
  
  const value = {
    hasAccess,
    allModules
  };
  
  return (
    <ModuleAccessContext.Provider value={value}>
      {children}
    </ModuleAccessContext.Provider>
  );
};

export const useModuleAccess = () => {
  const context = useContext(ModuleAccessContext);
  if (context === undefined) {
    throw new Error('useModuleAccess must be used within a ModuleAccessProvider');
  }
  return context;
};
