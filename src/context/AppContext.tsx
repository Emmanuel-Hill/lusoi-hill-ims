import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/types';
import { users as mockUsers } from '@/data/mockData';

interface AppContextProps {
  users: User[];
  currentUser: User | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | null>>;
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
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(defaultUser);

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

  return (
    <AppContext.Provider value={{ users, currentUser, setCurrentUser }}>
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
