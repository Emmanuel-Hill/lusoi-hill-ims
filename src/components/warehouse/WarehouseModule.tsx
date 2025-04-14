
import React from 'react';
import { ModuleAccess } from '@/types';

// This defines the warehouse module access in the system
export const WAREHOUSE_MODULE_KEY: keyof ModuleAccess = 'warehouse';

// This component is just for organization and doesn't render anything
const WarehouseModule: React.FC = () => null;

export default WarehouseModule;
