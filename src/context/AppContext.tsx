
import React, { createContext, useContext, ReactNode } from 'react';
import * as mockDataModule from '@/data/mockData';
import { AppContextProps } from './types';
import { useBatchState } from './batchContext';
import { useEggCollectionState } from './eggCollectionContext';
import { useFeedState } from './feedContext';
import { useVaccinationState } from './vaccinationContext';
import { useSalesState } from './salesContext';
import { useCustomerState } from './customerContext';
import { useUserState } from './userContext';

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
  },
  addBatch: () => {},
  updateBatch: () => {},
  addEggCollection: () => {},
  addFeedType: () => {},
  updateFeedType: () => {},
  deleteFeedType: () => {},
  addFeedConsumption: () => {},
  addFeedInventory: () => {},
  addVaccine: () => {},
  addVaccinationRecord: () => {},
  addCustomer: () => {},
  addOrder: () => {},
  updateOrderStatus: () => {},
  addProduct: () => {},
  updateProductPrice: () => {},
  addSale: () => {},
  addUser: () => {},
  updateUser: () => {},
  deleteUser: () => {},
  logoutUser: () => {},
  authenticateUser: () => null,
  isInitialLogin: () => false,
  setInitialLoginComplete: () => {},
  changeUserPassword: () => false,
  hasAccess: () => false,
});

// Create provider component
export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Initialize state for each module
  const batchState = useBatchState(mockDataModule.mockBatches);
  const eggCollectionState = useEggCollectionState(mockDataModule.mockEggCollections);
  const feedState = useFeedState(
    mockDataModule.mockFeedTypes, 
    mockDataModule.mockFeedConsumption, 
    mockDataModule.mockFeedInventory
  );
  const vaccinationState = useVaccinationState(
    mockDataModule.mockVaccines,
    mockDataModule.mockVaccinationRecords
  );
  const salesState = useSalesState(
    mockDataModule.mockSales,
    mockDataModule.mockProducts
  );
  const customerState = useCustomerState(
    mockDataModule.mockCustomers,
    mockDataModule.mockOrders
  );
  const userState = useUserState(mockDataModule.mockUsers);

  // Context value
  const value: AppContextProps = {
    ...userState,
    ...batchState,
    ...eggCollectionState,
    ...feedState,
    ...vaccinationState,
    ...salesState,
    ...customerState,
    warehouse: mockDataModule.mockWarehouse || {
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
