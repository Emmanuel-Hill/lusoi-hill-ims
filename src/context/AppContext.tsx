import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as mockDataModule from '@/data/mockData';

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
  addBatch: (batch: any) => void;
  updateBatch: (batch: any) => void;
  addEggCollection: (collection: any) => void;
  addFeedType: (feedType: any) => void;
  updateFeedType: (feedType: any) => void;
  deleteFeedType: (feedTypeId: string) => void;
  addFeedConsumption: (consumption: any) => void;
  addFeedInventory: (inventory: any) => void;
  addVaccine: (vaccine: any) => void;
  addVaccinationRecord: (record: any) => void;
  addCustomer: (customer: any) => void;
  addOrder: (order: any) => void;
  updateOrderStatus: (orderId: string, status: any) => void;
  addProduct: (product: any) => void;
  updateProductPrice: (productId: string, price: number) => void;
  addSale: (sale: any) => void;
  addUser: (user: any) => void;
  updateUser: (user: any) => void;
  deleteUser: (userId: string) => void;
  logoutUser: () => void;
  authenticateUser: (email: string, password: string) => any; // Changed return type to any
  isInitialLogin: (userId: string) => boolean; // Changed to function with parameter
  setInitialLoginComplete: () => void;
  changeUserPassword: (oldPassword: string, newPassword: string) => void; // Changed parameters
  hasAccess: (module: string) => boolean;
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
  authenticateUser: () => false,
  isInitialLogin: () => false,
  setInitialLoginComplete: () => {},
  changeUserPassword: () => {},
  hasAccess: () => false,
});

// Create provider component
export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(mockDataModule.mockUsers[0] || null);
  const [batches, setBatches] = useState(mockDataModule.mockBatches || []);
  const [eggCollections, setEggCollections] = useState(mockDataModule.mockEggCollections || []);
  const [feedConsumption, setFeedConsumption] = useState(mockDataModule.mockFeedConsumption || []);
  const [feedInventory, setFeedInventory] = useState(mockDataModule.mockFeedInventory || []);
  const [feedTypes, setFeedTypes] = useState(mockDataModule.mockFeedTypes || []);
  const [vaccinationRecords, setVaccinationRecords] = useState(mockDataModule.mockVaccinationRecords || []);
  const [vaccines, setVaccines] = useState(mockDataModule.mockVaccines || []);
  const [sales, setSales] = useState(mockDataModule.mockSales || []);
  const [products, setProducts] = useState(mockDataModule.mockProducts || []);
  const [customers, setCustomers] = useState(mockDataModule.mockCustomers || []);
  const [orders, setOrders] = useState(mockDataModule.mockOrders || []);
  const [isInitialLoginState, setIsInitialLoginState] = useState(false);

  // CRUD operations
  const addBatch = (batch: any) => {
    setBatches([...batches, batch]);
  };

  const updateBatch = (updatedBatch: any) => {
    setBatches(batches.map(batch => batch.id === updatedBatch.id ? updatedBatch : batch));
  };

  const addEggCollection = (collection: any) => {
    setEggCollections([...eggCollections, collection]);
  };

  const addFeedType = (feedType: any) => {
    setFeedTypes([...feedTypes, feedType]);
  };

  const updateFeedType = (updatedFeedType: any) => {
    setFeedTypes(feedTypes.map(type => type.id === updatedFeedType.id ? updatedFeedType : type));
  };

  const deleteFeedType = (feedTypeId: string) => {
    setFeedTypes(feedTypes.filter(type => type.id !== feedTypeId));
  };

  const addFeedConsumption = (consumption: any) => {
    setFeedConsumption([...feedConsumption, consumption]);
  };

  const addFeedInventory = (inventory: any) => {
    setFeedInventory([...feedInventory, inventory]);
  };

  const addVaccine = (vaccine: any) => {
    setVaccines([...vaccines, vaccine]);
  };

  const addVaccinationRecord = (record: any) => {
    setVaccinationRecords([...vaccinationRecords, record]);
  };

  const addCustomer = (customer: any) => {
    setCustomers([...customers, customer]);
  };

  const addOrder = (order: any) => {
    setOrders([...orders, order]);
  };

  const updateOrderStatus = (orderId: string, status: any) => {
    setOrders(orders.map(order => order.id === orderId ? { ...order, status } : order));
  };

  const addProduct = (product: any) => {
    setProducts([...products, product]);
  };

  const updateProductPrice = (productId: string, price: number) => {
    setProducts(products.map(product => product.id === productId ? { ...product, currentPrice: price, priceUpdatedAt: new Date().toISOString() } : product));
  };

  const addSale = (sale: any) => {
    setSales([...sales, sale]);
  };

  const addUser = (user: any) => {
    // Handle user addition
  };

  const updateUser = (user: any) => {
    // Handle user update
  };

  const deleteUser = (userId: string) => {
    // Handle user deletion
  };

  const logoutUser = () => {
    // Handle logout
  };

  // Authentication functions
  const authenticateUser = (email: string, password: string) => {
    // Mock authentication - in a real app, you would verify credentials
    const user = mockDataModule.mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    
    return user || null;
  };

  const isInitialLogin = (userId: string): boolean => {
    // Check if this is the user's first login
    const user = mockDataModule.mockUsers.find(u => u.id === userId);
    return user ? !user.initialLoginComplete : false;
  };

  const setInitialLoginComplete = () => {
    setIsInitialLoginState(false);
  };

  const changeUserPassword = (oldPassword: string, newPassword: string): void => {
    // Here you would implement the password change logic
    // For now, we're just mocking the behavior
    console.log("Password changed from", oldPassword, "to", newPassword);
    
    // This is a void function, it doesn't return a value
  };

  const hasAccess = (module: string): boolean => {
    // Check if user has access to a module
    if (!currentUser || !currentUser.moduleAccess) return false;
    return currentUser.moduleAccess[module] || false;
  };

  // Context value
  const value: AppContextProps = {
    users: mockDataModule.mockUsers,
    currentUser,
    setCurrentUser,
    batches,
    eggCollections,
    feedConsumption,
    feedInventory,
    feedTypes,
    vaccinationRecords,
    vaccines,
    sales,
    products,
    customers,
    orders,
    warehouse: mockDataModule.mockWarehouse || {
      inventory: [],
      receiving: [],
      dispatch: []
    },
    addBatch,
    updateBatch,
    addEggCollection,
    addFeedType,
    updateFeedType,
    deleteFeedType,
    addFeedConsumption,
    addFeedInventory,
    addVaccine,
    addVaccinationRecord,
    addCustomer,
    addOrder,
    updateOrderStatus,
    addProduct,
    updateProductPrice,
    addSale,
    addUser,
    updateUser,
    deleteUser,
    logoutUser,
    authenticateUser,
    isInitialLogin,
    setInitialLoginComplete,
    changeUserPassword,
    hasAccess
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for consuming the context
export const useAppContext = (): AppContextProps => useContext(AppContext);
