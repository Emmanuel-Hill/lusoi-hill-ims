
import { useState } from 'react';

export const useUserState = (initialUsers: any[] = []) => {
  const [users, setUsers] = useState(initialUsers);
  const [currentUser, setCurrentUser] = useState(initialUsers[0] || null);
  const [isInitialLoginState, setIsInitialLoginState] = useState(false);

  const addUser = (user: any) => {
    // Handle user addition
    setUsers([...users, user]);
  };

  const updateUser = (user: any) => {
    // Handle user update
    setUsers(users.map(u => u.id === user.id ? user : u));
  };

  const deleteUser = (userId: string) => {
    // Handle user deletion
    setUsers(users.filter(u => u.id !== userId));
  };

  const logoutUser = () => {
    // Handle logout
    setCurrentUser(null);
  };

  // Authentication functions
  const authenticateUser = (email: string, password: string) => {
    // Mock authentication - in a real app, you would verify credentials
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    
    return user || null;
  };

  const isInitialLogin = (userId: string): boolean => {
    // Check if this is the user's first login
    const user = users.find(u => u.id === userId);
    return user ? !user.initialLoginComplete : false;
  };

  const setInitialLoginComplete = () => {
    setIsInitialLoginState(false);
  };

  const changeUserPassword = (oldPassword: string, newPassword: string): boolean => {
    // Here you would implement the password change logic
    if (currentUser && currentUser.password === oldPassword) {
      const updatedUser = { ...currentUser, password: newPassword };
      updateUser(updatedUser);
      return true;
    }
    return false;
  };

  const hasAccess = (module: string): boolean => {
    // Check if user has access to a module
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
