
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center">
        <img 
          src="/logo.png" 
          alt="Lusoi Hill Farm" 
          className="h-24 mb-8 animate-pulse"
        />
        <div className="w-12 h-12 rounded-full border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
