import { Batch, EggCollection, FeedConsumption, FeedInventory, FeedType, Order, Product, Sale, User, Vaccine, VaccinationRecord, Customer } from '@/types';
import { ModuleAccess } from '@/types/moduleAccess';

// Default module access for new users
const defaultModuleAccess: ModuleAccess = {
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
};

// Mock data for Batch Management
export const mockBatches: Batch[] = [
  { id: '1', name: 'Batch A', birdCount: 500, batchStatus: 'Laying', createdAt: '2023-01-01', notes: 'First batch' },
  { id: '2', name: 'Batch B', birdCount: 300, batchStatus: 'New', createdAt: '2023-02-15', notes: 'New chicks' },
  { id: '3', name: 'Batch C', birdCount: 400, batchStatus: 'Not Laying', createdAt: '2023-03-10', notes: 'Molting season' },
];

// Mock data for Egg Collection
export const mockEggCollections: EggCollection[] = [
  { id: '1', batchId: '1', date: '2023-11-01', wholeCount: 450, brokenCount: 10, notes: 'Good collection day' },
  { id: '2', batchId: '1', date: '2023-11-02', wholeCount: 460, brokenCount: 5, notes: 'Excellent yield' },
  { id: '3', batchId: '2', date: '2023-11-01', wholeCount: 280, brokenCount: 2, notes: 'Consistent collection' },
];

// Mock data for Feed Management
export const mockFeedTypes: FeedType[] = [
  { id: '1', name: 'Layer Feed', description: 'For laying hens', birdType: 'Layers' },
  { id: '2', name: 'Grower Feed', description: 'For growing chicks', birdType: 'Growers' },
];

export const mockFeedInventory: FeedInventory[] = [
  { id: '1', feedTypeId: '1', quantityKg: 500, date: '2023-11-01', isProduced: true, notes: 'Farm produced' },
  { id: '2', feedTypeId: '2', quantityKg: 300, date: '2023-11-01', isProduced: false, notes: 'Purchased from supplier' },
];

export const mockFeedConsumption: FeedConsumption[] = [
  { id: '1', batchId: '1', feedTypeId: '1', quantityKg: 50, date: '2023-11-01', timeOfDay: 'Morning', notes: 'Regular feeding' },
  { id: '2', batchId: '2', feedTypeId: '2', quantityKg: 30, date: '2023-11-01', timeOfDay: 'Afternoon', notes: 'Adjusted for chick size' },
];

// Mock data for Vaccination Management
export const mockVaccines: Vaccine[] = [
  { id: '1', name: 'Newcastle Disease Vaccine', description: 'Protects against Newcastle disease', intervalDays: 30 },
  { id: '2', name: 'Gumboro Disease Vaccine', description: 'Protects against Gumboro disease', intervalDays: 21 },
];

export const mockVaccinationRecords: VaccinationRecord[] = [
  { id: '1', batchId: '1', vaccineId: '1', date: '2023-11-01', notes: 'First dose', nextScheduledDate: '2023-12-01' },
  { id: '2', batchId: '2', vaccineId: '2', date: '2023-11-01', notes: 'Initial vaccination', nextScheduledDate: '2023-11-22' },
];

// Mock data for Sales Management
export const mockProducts: Product[] = [
  { id: '1', name: 'Fresh Eggs', type: 'Egg', condition: 'Whole', currentPrice: 12, priceUpdatedAt: '2023-11-01' },
  { id: '2', name: 'Broiler Chicken', type: 'Bird', currentPrice: 5, priceUpdatedAt: '2023-11-01' },
];

export const mockSales: Sale[] = [
  { id: '1', date: '2023-11-01', products: [{ productId: '1', quantity: 10, pricePerUnit: 12 }], totalAmount: 120, notes: 'Morning sales' },
  { id: '2', date: '2023-11-01', products: [{ productId: '2', quantity: 5, pricePerUnit: 5 }], totalAmount: 25, notes: 'Afternoon sales' },
];

// Mock data for Customer Management
export const mockCustomers: Customer[] = [
  { id: '1', name: 'John Doe', contactNumber: '123-456-7890', address: '123 Main St', notes: 'Regular customer' },
  { id: '2', name: 'Jane Smith', contactNumber: '987-654-3210', address: '456 Elm St', notes: 'New customer' },
];

export const mockOrders: Order[] = [
  {
    id: '1',
    customerId: '1',
    date: '2023-11-05',
    deliveryDate: '2023-11-07',
    deliveryLocation: 'John\'s Farm',
    contactPerson: 'John Doe',
    contactNumber: '123-456-7890',
    products: [{ productId: '1', quantity: 20 }],
    status: 'Pending',
    notes: 'Order for fresh eggs'
  },
  {
    id: '2',
    customerId: '2',
    date: '2023-11-06',
    deliveryDate: '2023-11-08',
    deliveryLocation: 'Jane\'s Store',
    contactPerson: 'Jane Smith',
    contactNumber: '987-654-3210',
    products: [{ productId: '2', quantity: 10 }],
    status: 'Processing',
    notes: 'Order for broiler chicken'
  }
];

// Mock data for User Management
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Admin',
    active: true,
    createdAt: '2023-01-01',
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
  },
  {
    id: '2',
    name: 'Production Manager',
    email: 'production@example.com',
    role: 'ProductionManager',
    active: true,
    createdAt: '2023-01-01',
    moduleAccess: {
      dashboard: true,
      batches: true,
      eggCollection: true,
      feedManagement: true,
      vaccination: true,
      sales: false,
      customers: false,
      calendar: true,
      reports: false,
      userManagement: false,
      warehouse: false,
    },
    password: 'password',
    initialLoginComplete: true,
  },
  {
    id: '3',
    name: 'Sales Manager',
    email: 'sales@example.com',
    role: 'SalesManager',
    active: true,
    createdAt: '2023-01-01',
    moduleAccess: {
      dashboard: true,
      batches: false,
      eggCollection: false,
      feedManagement: false,
      vaccination: false,
      sales: true,
      customers: true,
      calendar: true,
      reports: false,
      userManagement: false,
      warehouse: false,
    },
    password: 'password',
    initialLoginComplete: true,
  },
  {
    id: '4',
    name: 'Warehouse Manager',
    email: 'warehouse@example.com',
    role: 'WarehouseManager',
    active: true,
    createdAt: '2023-01-01',
    moduleAccess: {
      dashboard: true,
      batches: false,
      eggCollection: false,
      feedManagement: false,
      vaccination: false,
      sales: false,
      customers: false,
      calendar: true,
      reports: false,
      userManagement: false,
      warehouse: true,
    },
    password: 'password',
    initialLoginComplete: true,
  },
  {
    id: '5',
    name: 'IT Specialist',
    email: 'it@example.com',
    role: 'ITSpecialist',
    active: true,
    createdAt: '2023-01-01',
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
  },
];

// Mock data for Warehouse Management
export const mockWarehouse = {
  inventory: [
    { id: '1', productId: '1', quantity: 1000, lastUpdated: '2023-11-01' },
    { id: '2', productId: '2', quantity: 200, lastUpdated: '2023-11-01' }
  ],
  receiving: [
    { id: '1', productId: '1', quantity: 500, date: '2023-11-01', source: 'Farm Production' }
  ],
  dispatch: [
    { id: '1', productId: '1', quantity: 100, date: '2023-11-02', destination: 'Market' }
  ]
};
