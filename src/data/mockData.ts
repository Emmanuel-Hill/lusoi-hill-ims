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
  User
} from '../types';

// Mock Batches
export const mockBatches: Batch[] = [
  {
    id: '1',
    name: 'Batch A',
    birdCount: 500,
    batchStatus: 'Laying',
    createdAt: '2024-01-15',
    notes: 'First batch of the year'
  },
  {
    id: '2',
    name: 'Batch B',
    birdCount: 450,
    batchStatus: 'New',
    createdAt: '2024-02-20',
    notes: 'New batch added'
  },
  {
    id: '3',
    name: 'Batch C',
    birdCount: 350,
    batchStatus: 'Not Laying',
    createdAt: '2023-09-10',
    notes: 'Older batch'
  }
];

// Mock Egg Collections
export const mockEggCollections: EggCollection[] = [
  {
    id: '1',
    batchId: '1',
    date: '2024-04-05',
    wholeCount: 380,
    brokenCount: 12,
    notes: 'Morning collection'
  },
  {
    id: '2',
    batchId: '1',
    date: '2024-04-06',
    wholeCount: 395,
    brokenCount: 8,
    notes: 'Good production day'
  },
  {
    id: '3',
    batchId: '3',
    date: '2024-04-05',
    wholeCount: 0,
    brokenCount: 0,
    notes: 'No eggs - not laying'
  }
];

// Mock Feed Types
export const mockFeedTypes: FeedType[] = [
  {
    id: '1',
    name: 'Layer Feed - Standard',
    description: 'Standard feed for laying hens',
    birdType: 'Layers'
  },
  {
    id: '2',
    name: 'Grower Feed - Premium',
    description: 'Higher quality feed for growing birds',
    birdType: 'Growers'
  },
  {
    id: '3',
    name: 'Layer Feed - Organic',
    description: 'Organic feed for laying hens',
    birdType: 'Layers'
  }
];

// Mock Feed Inventory
export const mockFeedInventory: FeedInventory[] = [
  {
    id: '1',
    feedTypeId: '1',
    quantityKg: 500,
    date: '2024-04-01',
    isProduced: false,
    notes: 'Monthly order'
  },
  {
    id: '2',
    feedTypeId: '2',
    quantityKg: 300,
    date: '2024-04-03',
    isProduced: false,
    notes: 'Extra order for new batch'
  },
  {
    id: '3',
    feedTypeId: '1',
    quantityKg: 100,
    date: '2024-04-05',
    isProduced: true,
    notes: 'Farm produced feed'
  }
];

// Mock Feed Consumption
export const mockFeedConsumption: FeedConsumption[] = [
  {
    id: '1',
    batchId: '1',
    feedTypeId: '1',
    quantityKg: 25,
    date: '2024-04-06',
    timeOfDay: 'Morning',
    notes: 'Morning feeding'
  },
  {
    id: '2',
    batchId: '1',
    feedTypeId: '1',
    quantityKg: 20,
    date: '2024-04-06',
    timeOfDay: 'Evening',
    notes: 'Evening feeding'
  },
  {
    id: '3',
    batchId: '2',
    feedTypeId: '2',
    quantityKg: 15,
    date: '2024-04-06',
    timeOfDay: 'Morning',
    notes: 'Morning feeding for new batch'
  }
];

// Mock Vaccines
export const mockVaccines: Vaccine[] = [
  {
    id: '1',
    name: 'Newcastle Disease Vaccine',
    description: 'Protects against Newcastle disease',
    intervalDays: 90
  },
  {
    id: '2',
    name: 'Avian Influenza Vaccine',
    description: 'Protects against avian influenza',
    intervalDays: 180
  },
  {
    id: '3',
    name: 'Infectious Bronchitis Vaccine',
    description: 'Protects against infectious bronchitis',
    intervalDays: 120
  }
];

// Mock Vaccination Records
export const mockVaccinationRecords: VaccinationRecord[] = [
  {
    id: '1',
    batchId: '1',
    vaccineId: '1',
    date: '2024-02-15',
    notes: 'First vaccination',
    nextScheduledDate: '2024-05-15'
  },
  {
    id: '2',
    batchId: '2',
    vaccineId: '1',
    date: '2024-03-01',
    notes: 'Initial vaccination for new batch',
    nextScheduledDate: '2024-06-01'
  },
  {
    id: '3',
    batchId: '1',
    vaccineId: '2',
    date: '2024-01-20',
    notes: 'Avian influenza protection',
    nextScheduledDate: '2024-07-20'
  }
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Regular Eggs',
    type: 'Egg',
    condition: 'Whole',
    currentPrice: 0.50,
    priceUpdatedAt: '2024-03-15'
  },
  {
    id: '2',
    name: 'Cracked Eggs',
    type: 'Egg',
    condition: 'Broken',
    currentPrice: 0.25,
    priceUpdatedAt: '2024-03-15'
  },
  {
    id: '3',
    name: 'Layer Hen',
    type: 'Bird',
    condition: 'NA',
    currentPrice: 15.00,
    priceUpdatedAt: '2024-02-10'
  }
];

// Mock Sales
export const mockSales: Sale[] = [
  {
    id: '1',
    date: '2024-04-06',
    products: [
      {
        productId: '1',
        quantity: 120,
        pricePerUnit: 0.50
      },
      {
        productId: '2',
        quantity: 20,
        pricePerUnit: 0.25
      }
    ],
    customerId: '1',
    totalAmount: 65,
    notes: 'Regular customer weekly order'
  },
  {
    id: '2',
    date: '2024-04-06',
    products: [
      {
        productId: '3',
        quantity: 5,
        pricePerUnit: 15
      }
    ],
    totalAmount: 75,
    notes: 'Walk-in customer'
  }
];

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Local Grocery Store',
    contactNumber: '123-456-7890',
    address: '123 Main St, Anytown',
    notes: 'Regular weekly order'
  },
  {
    id: '2',
    name: 'City Restaurant',
    contactNumber: '098-765-4321',
    address: '456 Oak St, Anytown',
    notes: 'Prefers morning delivery'
  },
  {
    id: '3',
    name: 'John Smith',
    contactNumber: '555-123-4567',
    address: '789 Pine St, Anytown',
    notes: 'Individual customer, buys monthly'
  }
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: '1',
    customerId: '1',
    date: '2024-04-05',
    deliveryDate: '2024-04-07',
    deliveryLocation: '123 Main St, Anytown',
    contactPerson: 'Manager',
    contactNumber: '123-456-7890',
    products: [
      {
        productId: '1',
        quantity: 200
      }
    ],
    status: 'Processing',
    notes: 'Regular weekly order'
  },
  {
    id: '2',
    customerId: '2',
    date: '2024-04-06',
    deliveryDate: '2024-04-08',
    deliveryLocation: '456 Oak St, Anytown',
    contactPerson: 'Chef',
    contactNumber: '098-765-4321',
    products: [
      {
        productId: '1',
        quantity: 100
      },
      {
        productId: '3',
        quantity: 2
      }
    ],
    status: 'Pending',
    notes: 'Monthly order'
  }
];

// Mock Users with different roles
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@lusoifarm.com',
    role: 'Admin',
    active: true,
    createdAt: '2024-01-01',
    lastLogin: '2024-04-10',
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
      userManagement: true
    }
  },
  {
    id: '2',
    name: 'Production Manager',
    email: 'production@lusoifarm.com',
    role: 'ProductionManager',
    active: true,
    createdAt: '2024-01-05',
    lastLogin: '2024-04-09',
    moduleAccess: {
      dashboard: true,
      batches: true,
      eggCollection: true,
      feedManagement: true,
      vaccination: true,
      sales: false,
      customers: false,
      calendar: true,
      reports: true,
      userManagement: false
    }
  },
  {
    id: '3',
    name: 'Operations Manager',
    email: 'operations@lusoifarm.com',
    role: 'OperationsManager',
    active: true,
    createdAt: '2024-01-10',
    lastLogin: '2024-04-08',
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
      userManagement: true
    }
  },
  {
    id: '4',
    name: 'Sales Manager',
    email: 'sales@lusoifarm.com',
    role: 'SalesManager',
    active: true,
    createdAt: '2024-01-15',
    lastLogin: '2024-04-07',
    moduleAccess: {
      dashboard: true,
      batches: false,
      eggCollection: false,
      feedManagement: false,
      vaccination: false,
      sales: true,
      customers: true,
      calendar: true,
      reports: true,
      userManagement: false
    }
  },
  {
    id: '5',
    name: 'Warehouse Manager',
    email: 'warehouse@lusoifarm.com',
    role: 'WarehouseManager',
    active: true,
    createdAt: '2024-01-20',
    lastLogin: '2024-04-06',
    moduleAccess: {
      dashboard: true,
      batches: true,
      eggCollection: true,
      feedManagement: false,
      vaccination: false,
      sales: false,
      customers: false,
      calendar: true,
      reports: false,
      userManagement: false
    }
  }
];
