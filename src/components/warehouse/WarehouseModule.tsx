
import React from 'react';
import { useModuleAccess } from '@/context/ModuleAccessContext';
import { ModuleAccess } from '@/types/moduleAccess';

export const WarehouseModule: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { hasAccess } = useModuleAccess();
  const moduleKey: keyof ModuleAccess = 'warehouse';

  if (!hasAccess(moduleKey)) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-lg font-medium text-red-800">Access Denied</h3>
        <p className="text-red-600">
          You do not have permission to access the Warehouse module.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
