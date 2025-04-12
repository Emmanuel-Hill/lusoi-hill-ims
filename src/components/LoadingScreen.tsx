
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center justify-center">
        <img 
          src="/lovable-uploads/9eebc39c-2e9e-45dd-a2f3-7edc6d9d8bec.png" 
          alt="Lusoi Hill Farm" 
          className="h-32 mb-8 animate-pulse"
        />
        <div className="w-12 h-12 rounded-full border-4 border-t-green-700 border-r-transparent border-b-green-700 border-l-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
