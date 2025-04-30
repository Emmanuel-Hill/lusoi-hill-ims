import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Batch, EggCollection, FeedConsumption, FeedInventory, FeedType, VaccinationRecord, Vaccine, Product, Sale, Customer, Order } from '@/types';
import { ModuleAccess } from '@/types/moduleAccess';
import { mockUsers, mockBatches, mockEggCollections, mockFeedConsumption, mockFeedInventory, mockFeedTypes, mockVaccinationRecords, mockVaccines, mockProducts, mockSales, mockCustomers, mockOrders } from '@/data/mockData';

interface AppContextProps {
  // User management
  users: User[];
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  authenticateUser: (email: string, password: string) => User | null;
  logoutUser: () => void;
  changeUserPassword: (userId: string, oldPassword: string, newPassword: string) => boolean;
  isInitialLogin: (userId: string) => boolean;
  setInitialLoginComplete: (userId: string) => void;
  
  // Module access
  hasAccess: (module: keyof ModuleAccess) => boolean;
  
  // Batch management
  batches: Batch[];
  addBatch: (batch: Batch) => void;
  updateBatch: (batch: Batch) => void;
  
  // Egg collection
  eggCollections: EggCollection[];
  addEggCollection: (collection: EggCollection) => void;
  
  // Feed management
  feedTypes: FeedType[];
  feedConsumption: FeedConsumption[];
  feedInventory: FeedInventory[];
  addFeedType: (feedType: FeedType) => void;
  updateFeedType: (feedType: FeedType) => void;
  deleteFeedType: (id: string) => void;
  addFeedConsumption: (consumption: FeedConsumption) => void;
  addFeedInventory: (inventory: FeedInventory) => void;
  
  // Vaccination management
  vaccines: Vaccine[];
  vaccinationRecords: VaccinationRecord[];
  addVaccine: (vaccine: Vaccine) => void;
  addVaccinationRecord: (record: VaccinationRecord) => void;
  
  // Sales management
  products: Product[];
  sales: Sale[];
  addProduct: (product: Product) => void;
  updateProductPrice: (productId: string, price: number) => void;
  addSale: (sale: Sale) => void;
  
  // Customer management
  customers: Customer[];
  orders: Order[];
  addCustomer: (customer: Customer) => void;
  
  // Order management
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled') => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
  children: React.ReactNode;
}

const defaultUser: User = {
  id: '6',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'SalesTeamMember',
  active: true,
  createdAt: new Date().toISOString(),
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
    warehouse: true,
  },
  password: 'password',
  initialLoginComplete: true,
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // State for various data
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(defaultUser);
  const [batches, setBatches] = useState<Batch[]>(mockBatches);
  const [eggCollections, setEggCollections] = useState<EggCollection[]>(mockEggCollections);
  const [feedConsumption, setFeedConsumption] = useState<FeedConsumption[]>(mockFeedConsumption);
  const [feedInventory, setFeedInventory] = useState<FeedInventory[]>(mockFeedInventory);
  const [feedTypes, setFeedTypes] = useState<FeedType[]>(mockFeedTypes);
  const [vaccinationRecords, setVaccinationRecords] = useState<VaccinationRecord[]>(mockVaccinationRecords);
  const [vaccines, setVaccines] = useState<Vaccine[]>(mockVaccines);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [sales, setSales] = useState<Sale[]>(mockSales);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  useEffect(() => {
    // Simulate fetching the current user from local storage or session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    // Persist the current user to local storage or session
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // User management functions
  const addUser = (user: User) => {
    const newUser = { ...user, id: crypto.randomUUID() };
    setUsers([...users, newUser]);
  };

  const updateUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const authenticateUser = (email: string, password: string): User | null => {
    const user = users.find(u => u.email === email && u.password === password && u.active);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const changeUserPassword = (userId: string, oldPassword: string, newPassword: string): boolean => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1 || users[userIndex].password !== oldPassword) {
      return false;
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: newPassword
    };
    setUsers(updatedUsers);
    
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({
        ...currentUser,
        password: newPassword
      });
    }
    
    return true;
  };

  const isInitialLogin = (userId: string): boolean => {
    const user = users.find(u => u.id === userId);
    return user ? !user.initialLoginComplete : false;
  };

  const setInitialLoginComplete = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, initialLoginComplete: true };
      }
      return user;
    }));
    
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({
        ...currentUser,
        initialLoginComplete: true
      });
    }
  };

  // Module access check
  const hasAccess = (module: keyof ModuleAccess): boolean => {
    return currentUser ? currentUser.moduleAccess[module] : false;
  };

  // Batch management functions
  const addBatch = (batch: Batch) => {
    const newBatch = { ...batch, id: crypto.randomUUID() };
    setBatches([...batches, newBatch]);
  };

  const updateBatch = (updatedBatch: Batch) => {
    setBatches(batches.map(batch => batch.id === updatedBatch.id ? updatedBatch : batch));
  };

  // Egg collection functions
  const addEggCollection = (collection: EggCollection) => {
    const newCollection = { ...collection, id: crypto.randomUUID() };
    setEggCollections([...eggCollections, newCollection]);
  };

  // Feed management functions
  const addFeedType = (feedType: FeedType) => {
    const newFeedType = { ...feedType, id: crypto.randomUUID() };
    setFeedTypes([...feedTypes, newFeedType]);
  };

  const updateFeedType = (updatedFeedType: FeedType) => {
    setFeedTypes(feedTypes.map(type => type.id === updatedFeedType.id ? updatedFeedType : type));
  };

  const deleteFeedType = (id: string) => {
    setFeedTypes(feedTypes.filter(type => type.id !== id));
  };

  const addFeedConsumption = (consumption: FeedConsumption) => {
    const newConsumption = { ...consumption, id: crypto.randomUUID() };
    setFeedConsumption([...feedConsumption, newConsumption]);
  };

  const addFeedInventory = (inventory: FeedInventory) => {
    const newInventory = { ...inventory, id: crypto.randomUUID() };
    setFeedInventory([...feedInventory, newInventory]);
  };

  // Vaccination management functions
  const addVaccine = (vaccine: Vaccine) => {
    const newVaccine = { ...vaccine, id: crypto.randomUUID() };
    setVaccines([...vaccines, newVaccine]);
  };

  const addVaccinationRecord = (record: VaccinationRecord) => {
    const newRecord = { ...record, id: crypto.randomUUID() };
    setVaccinationRecords([...vaccinationRecords, newRecord]);
  };

  // Sales management functions
  const addProduct = (product: Product) => {
    const newProduct = { ...product, id: crypto.randomUUID() };
    setProducts([...products, newProduct]);
  };

  const updateProductPrice = (productId: string, price: number) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          currentPrice: price,
          priceUpdatedAt: new Date().toISOString()
        };
      }
      return product;
    }));
  };

  const addSale = (sale: Sale) => {
    const newSale = { ...sale, id: crypto.randomUUID() };
    setSales([...sales, newSale]);
  };

  // Customer management functions
  const addCustomer = (customer: Customer) => {
    const newCustomer = { ...customer, id: crypto.randomUUID() };
    setCustomers([...customers, newCustomer]);
  };

  // Order management functions
  const addOrder = (order: Order) => {
    const newOrder = { ...order, id: crypto.randomUUID() };
    setOrders([...orders, newOrder]);
  };

  const updateOrderStatus = (orderId: string, status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled') => {
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status };
      }
      return order;
    }));
  };

  return (
    <AppContext.Provider value={{ 
      // User management
      users, 
      currentUser, 
      setCurrentUser,
      addUser,
      updateUser,
      deleteUser,
      authenticateUser,
      logoutUser,
      changeUserPassword,
      isInitialLogin,
      setInitialLoginComplete,
      
      // Module access
      hasAccess,
      
      // Batch management
      batches,
      addBatch,
      updateBatch,
      
      // Egg collection
      eggCollections,
      addEggCollection,
      
      // Feed management
      feedTypes,
      feedConsumption,
      feedInventory,
      addFeedType,
      updateFeedType,
      deleteFeedType,
      addFeedConsumption,
      addFeedInventory,
      
      // Vaccination management
      vaccines,
      vaccinationRecords,
      addVaccine,
      addVaccinationRecord,
      
      // Sales management
      products,
      sales,
      addProduct,
      updateProductPrice,
      addSale,
      
      // Customer management
      customers,
      orders,
      addCustomer,
      
      // Order management
      addOrder,
      updateOrderStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
