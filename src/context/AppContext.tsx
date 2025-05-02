
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockData } from '@/data/mockData';

// Define the types for context
export interface AppContextProps {
  users: any[];
  currentUser: any;
  setCurrentUser: React.Dispatch<React.SetStateAction<any>>;
  batches: any[];
  eggCollections: any[];
  feedConsumption: any[];
  feedInventory: any[];
  feedTypes: any[];
  vaccinationRecords: any[];
  vaccines: any[];
  sales: any[];
  products: any[];
  customers: any[];
  orders: any[];
  warehouse: {
    inventory: any[];
    receiving: any[];
    dispatch: any[];
  };
}

// Create context with default values
const AppContext = createContext<AppContextProps>({
  users: [],
  currentUser: null,
  setCurrentUser: () => {},
  batches: [],
  eggCollections: [],
  feedConsumption: [],
  feedInventory: [],
  feedTypes: [],
  vaccinationRecords: [],
  vaccines: [],
  sales: [],
  products: [],
  customers: [],
  orders: [],
  warehouse: {
    inventory: [],
    receiving: [],
    dispatch: []
  }
});

// Create provider component
export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(mockData.users[0] || null);

  // Context value
  const value: AppContextProps = {
    users: mockData.users,
    currentUser,
    setCurrentUser,
    batches: mockData.batches,
    eggCollections: mockData.eggCollections,
    feedConsumption: mockData.feedConsumption,
    feedInventory: mockData.feedInventory,
    feedTypes: mockData.feedTypes,
    vaccinationRecords: mockData.vaccinationRecords,
    vaccines: mockData.vaccines,
    sales: mockData.sales,
    products: mockData.products,
    customers: mockData.customers,
    orders: mockData.orders,
    warehouse: mockData.warehouse || {
      inventory: [],
      receiving: [],
      dispatch: []
    }
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for consuming the context
export const useAppContext = (): AppContextProps => useContext(AppContext);
