
import { useState } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  initialLoginComplete?: boolean;
  moduleAccess?: Record<string, boolean>;
}

export const useUserState = (initialUsers: User[] = []) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[0] || null);
  const [isInitialLoginState, setIsInitialLoginState] = useState<boolean>(false);

  const addUser = (user: User) => {
    setUsers([...users, user]);
  };

  const updateUser = (user: User) => {
    setUsers(users.map(u => u.id === user.id ? user : u));
  };

  const deleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const authenticateUser = (email: string, password: string): User | null => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    
    return user || null;
  };

  const isInitialLogin = (userId: string): boolean => {
    const user = users.find(u => u.id === userId);
    return user ? !user.initialLoginComplete : false;
  };

  const setInitialLoginComplete = () => {
    setIsInitialLoginState(false);
  };

  const changeUserPassword = (oldPassword: string, newPassword: string): boolean => {
    if (currentUser && currentUser.password === oldPassword) {
      const updatedUser = { ...currentUser, password: newPassword };
      updateUser(updatedUser);
      return true;
    }
    return false;
  };

  const hasAccess = (module: string): boolean => {
    if (!currentUser || !currentUser.moduleAccess) return false;
    return currentUser.moduleAccess[module] || false;
  };

  return {
    users,
    currentUser,
    setCurrentUser,
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
};
