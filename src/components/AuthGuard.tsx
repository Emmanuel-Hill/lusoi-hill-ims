
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import LoadingScreen from './LoadingScreen';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { currentUser } = useAppContext();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate authentication check delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Show loading screen while checking auth
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // If not logged in and not on login page, redirect to login
  if (!currentUser && location.pathname !== '/login' && location.pathname !== '/change-password') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default AuthGuard;
