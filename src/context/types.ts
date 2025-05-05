
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
  authenticateUser: (email: string, password: string) => any;
  isInitialLogin: (userId: string) => boolean;
  setInitialLoginComplete: () => void;
  changeUserPassword: (oldPassword: string, newPassword: string) => boolean;
  hasAccess: (module: string) => boolean;
}
