import React, { createContext, useState, useContext, ReactNode } from 'react';
import { 
  Batch, 
  EggCollection, 
  FeedType, 
  FeedInventory,
  FeedConsumption,
  Vaccine,
  VaccinationRecord,
  Product,
  Sale,
  Customer,
  Order,
  User,
  ModuleAccess,
  UserRole
} from '../types';

import {
  mockBatches,
  mockEggCollections,
  mockFeedTypes,
  mockFeedInventory,
  mockFeedConsumption,
  mockVaccines,
  mockVaccinationRecords,
  mockProducts,
  mockSales,
  mockCustomers,
  mockOrders,
  mockUsers
} from '../data/mockData';

interface AppContextType {
  // Batches
  batches: Batch[];
  addBatch: (batch: Omit<Batch, 'id' | 'createdAt'>) => void;
  updateBatch: (batch: Batch) => void;
  
  // Egg Collections
  eggCollections: EggCollection[];
  addEggCollection: (collection: Omit<EggCollection, 'id'>) => void;
  
  // Feed Management
  feedTypes: FeedType[];
  addFeedType: (feedType: Omit<FeedType, 'id'>) => void;
  updateFeedType: (feedType: FeedType) => void;
  deleteFeedType: (id: string) => void;
  feedInventory: FeedInventory[];
  addFeedInventory: (inventory: Omit<FeedInventory, 'id'>) => void;
  feedConsumption: FeedConsumption[];
  addFeedConsumption: (consumption: Omit<FeedConsumption, 'id'>) => void;
  
  // Vaccination Management
  vaccines: Vaccine[];
  addVaccine: (vaccine: Omit<Vaccine, 'id'>) => void;
  vaccinationRecords: VaccinationRecord[];
  addVaccinationRecord: (record: Omit<VaccinationRecord, 'id'>) => void;
  
  // Sales Management
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProductPrice: (id: string, price: number) => void;
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id'>) => void;
  
  // Customer Management
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  
  // User Management
  users: User[];
  currentUser: User | null;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  setCurrentUser: (user: User | null) => void;
  hasAccess: (module: keyof ModuleAccess) => boolean;
  
  // Authentication
  authenticateUser: (email: string, password: string) => User | null;
  logoutUser: () => void;
  isInitialLogin: (userId: string) => boolean;
  setInitialLoginComplete: (userId: string) => void;
  changeUserPassword: (userId: string, newPassword: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Update mock users to include passwords and initialLoginComplete flag
const updatedMockUsers = mockUsers.map(user => ({
  ...user,
  password: 'password123', // Initial password for all users
  initialLoginComplete: false
}));

// Create an admin user
const adminUser: User = {
  id: 'admin-001',
  name: 'System Administrator',
  email: 'admin@lusoihillfarm.co.ke',
  password: 'admin123', // Initial password for admin
  role: 'Admin',
  active: true,
  createdAt: new Date().toISOString().split('T')[0],
  lastLogin: null,
  initialLoginComplete: true, // Admin doesn't need to change password
  moduleAccess: {
    dashboard: true,
    batches: true,
    eggCollection: true,
    feedManagement: true,
    vaccination: true,
    sales: true,
    customers: true,
    calendar: true,
    reports: true,
    userManagement: true,
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for Batches
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [eggCollections, setEggCollections] = useState<EggCollection[]>(mockEggCollections);
  
  // State for Feed Management
  const [feedTypes, setFeedTypes] = useState<FeedType[]>(mockFeedTypes);
  const [feedInventory, setFeedInventory] = useState<FeedInventory[]>(mockFeedInventory);
  const [feedConsumption, setFeedConsumption] = useState<FeedConsumption[]>(mockFeedConsumption);
  
  // State for Vaccination Management
  const [vaccines, setVaccines] = useState<Vaccine[]>(mockVaccines);
  const [vaccinationRecords, setVaccinationRecords] = useState<VaccinationRecord[]>(mockVaccinationRecords);
  
  // State for Sales Management
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  
  // State for Customer Management
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  
  // State for User Management with admin user included
  const [users, setUsers] = useState<User[]>([adminUser, ...updatedMockUsers]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Functions for Batches
  const addBatch = (batch: Omit<Batch, 'id' | 'createdAt'>) => {
    const newBatch: Batch = {
      ...batch,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBatches([...batches, newBatch]);
  };

  const updateBatch = (updatedBatch: Batch) => {
    setBatches(batches.map(batch => 
      batch.id === updatedBatch.id ? updatedBatch : batch
    ));
  };
  
  // Functions for Egg Collections
  const addEggCollection = (collection: Omit<EggCollection, 'id'>) => {
    const newCollection: EggCollection = {
      ...collection,
      id: Date.now().toString()
    };
    setEggCollections([...eggCollections, newCollection]);
  };
  
  // Functions for Feed Management
  const addFeedType = (feedType: Omit<FeedType, 'id'>) => {
    const newFeedType: FeedType = {
      ...feedType,
      id: Date.now().toString()
    };
    setFeedTypes([...feedTypes, newFeedType]);
  };
  
  const updateFeedType = (updatedFeedType: FeedType) => {
    setFeedTypes(feedTypes.map(feedType => 
      feedType.id === updatedFeedType.id ? updatedFeedType : feedType
    ));
  };
  
  const deleteFeedType = (id: string) => {
    setFeedTypes(feedTypes.filter(feedType => feedType.id !== id));
  };

  const addFeedInventory = (inventory: Omit<FeedInventory, 'id'>) => {
    const newInventory: FeedInventory = {
      ...inventory,
      id: Date.now().toString()
    };
    setFeedInventory([...feedInventory, newInventory]);
  };

  const addFeedConsumption = (consumption: Omit<FeedConsumption, 'id'>) => {
    const newConsumption: FeedConsumption = {
      ...consumption,
      id: Date.now().toString()
    };
    setFeedConsumption([...feedConsumption, newConsumption]);
  };
  
  // Functions for Vaccination Management
  const addVaccine = (vaccine: Omit<Vaccine, 'id'>) => {
    const newVaccine: Vaccine = {
      ...vaccine,
      id: Date.now().toString()
    };
    setVaccines([...vaccines, newVaccine]);
  };

  const addVaccinationRecord = (record: Omit<VaccinationRecord, 'id'>) => {
    const newRecord: VaccinationRecord = {
      ...record,
      id: Date.now().toString()
    };
    setVaccinationRecords([...vaccinationRecords, newRecord]);
  };
  
  // Functions for Sales Management
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      priceUpdatedAt: new Date().toISOString().split('T')[0]
    };
    setProducts([...products, newProduct]);
  };

  const updateProductPrice = (id: string, price: number) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { 
          ...product, 
          currentPrice: price,
          priceUpdatedAt: new Date().toISOString().split('T')[0]
        } 
        : product
    ));
  };

  const addSale = (sale: Omit<Sale, 'id'>) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString()
    };
    setSales([...sales, newSale]);
  };
  
  // Functions for Customer Management
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString()
    };
    setCustomers([...customers, newCustomer]);
  };

  const addOrder = (order: Omit<Order, 'id'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString()
    };
    setOrders([...orders, newOrder]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, status } : order
    ));
  };
  
  // Functions for User Management
  const addUser = (user: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
  };
  
  const updateUser = (updatedUser: User) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
  };
  
  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };
  
  // Function to check if current user has access to a specific module
  const hasAccess = (module: keyof ModuleAccess): boolean => {
    if (!currentUser) return false;
    return currentUser.moduleAccess[module];
  };
  
  // Authentication functions
  const authenticateUser = (email: string, password: string): User | null => {
    const user = users.find(u => u.email === email && u.password === password && u.active);
    
    if (user) {
      // Update last login
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString().split('T')[0]
      };
      
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      setCurrentUser(updatedUser);
      
      // Store user ID in localStorage
      localStorage.setItem('currentUserId', updatedUser.id);
      
      return updatedUser;
    }
    
    return null;
  };
  
  const logoutUser = (): void => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserId');
  };
  
  const isInitialLogin = (userId: string): boolean => {
    const user = users.find(u => u.id === userId);
    return user ? !user.initialLoginComplete : false;
  };
  
  const setInitialLoginComplete = (userId: string): void => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, initialLoginComplete: true } : user
    ));
  };
  
  const changeUserPassword = (userId: string, newPassword: string): void => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, password: newPassword } : user
    ));
  };
  
  // Try to restore user from localStorage on initial load
  React.useEffect(() => {
    const userId = localStorage.getItem('currentUserId');
    if (userId) {
      const user = users.find(u => u.id === userId);
      if (user) {
        setCurrentUser(user);
      }
    }
  }, []);

  const value = {
    batches,
    addBatch,
    updateBatch,
    eggCollections,
    addEggCollection,
    feedTypes,
    addFeedType,
    updateFeedType,
    deleteFeedType,
    feedInventory,
    addFeedInventory,
    feedConsumption,
    addFeedConsumption,
    vaccines,
    addVaccine,
    vaccinationRecords,
    addVaccinationRecord,
    products,
    addProduct,
    updateProductPrice,
    sales,
    addSale,
    customers,
    addCustomer,
    orders,
    addOrder,
    updateOrderStatus,
    users,
    currentUser,
    addUser,
    updateUser,
    deleteUser,
    setCurrentUser,
    hasAccess,
    authenticateUser,
    logoutUser,
    isInitialLogin,
    setInitialLoginComplete,
    changeUserPassword
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
