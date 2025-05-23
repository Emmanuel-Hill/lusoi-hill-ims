// Types for Batch Management
export interface Batch {
  id: string;
  name: string;
  birdCount: number;
  batchStatus: 'New' | 'Laying' | 'Not Laying' | 'Retired';
  createdAt: string;
  notes?: string;
}

// Types for Egg Collection
export interface EggCollection {
  id: string;
  batchId: string;
  date: string;
  wholeCount: number;
  brokenCount: number;
  notes?: string;
  // Add optional properties for compatibility with the expanded form
  smallEggs?: number;
  mediumEggs?: number;
  largeEggs?: number;
  xlEggs?: number;
  goodEggs?: number;
  brokenEggs?: number;
}

// Types for Feed Management
export interface FeedType {
  id: string;
  name: string;
  description?: string;
  birdType: 'Layers' | 'Growers' | 'Other';
}

export interface FeedInventory {
  id: string;
  feedTypeId: string;
  quantityKg: number;
  date: string;
  isProduced: boolean; // farm-produced vs purchased
  notes?: string;
}

export interface FeedConsumption {
  id: string;
  batchId: string;
  feedTypeId: string;
  quantityKg: number;
  date: string;
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
  notes?: string;
}

// Types for Vaccination Management
export interface Vaccine {
  id: string;
  name: string;
  description?: string;
  intervalDays?: number; // days between doses
}

export interface VaccinationRecord {
  id: string;
  batchId: string;
  vaccineId: string;
  date: string;
  notes?: string;
  nextScheduledDate?: string;
}

// Types for Sales Management
export interface Product {
  id: string;
  name: string;
  type: 'Egg' | 'Bird';
  condition?: 'Whole' | 'Broken' | 'NA'; // NA for birds
  currentPrice: number;
  priceUpdatedAt: string;
}

export interface Sale {
  id: string;
  date: string;
  products: SaleItem[];
  customerId?: string;
  totalAmount: number;
  notes?: string;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  pricePerUnit: number;
}

// Types for Customer Management
export interface Customer {
  id: string;
  name: string;
  contactNumber?: string;
  address?: string;
  notes?: string;
}

export interface Order {
  id: string;
  customerId: string;
  date: string;
  deliveryDate: string;
  deliveryLocation: string;
  contactPerson: string;
  contactNumber?: string;
  products: OrderItem[];
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  notes?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

// Types for User Management
export type UserRole = 
  | 'Admin'           // Full access to all modules
  | 'ProductionManager'  // Access to farm-related modules
  | 'OperationsManager'  // Full access to all modules
  | 'Owner'           // Full access to all modules
  | 'ITSpecialist'    // Full access to all modules
  | 'SalesManager'    // Access to sales and customer modules
  | 'SalesTeamMember' // Access to sales and customer modules with limited permissions
  | 'Driver'          // Access to delivery-related modules
  | 'WarehouseManager'; // Access to inventory and tracking modules

// Import the ModuleAccess interface from moduleAccess.ts to avoid duplication
import { ModuleAccess } from './moduleAccess';
export type { ModuleAccess } from './moduleAccess';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
  moduleAccess: ModuleAccess;
  password: string;
  initialLoginComplete?: boolean;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
