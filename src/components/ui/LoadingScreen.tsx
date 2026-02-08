import React from 'react';
import logoImage from '@/assets/images/aegix-logo.png'; // Update extension if needed

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Logo with subtle animation */}
      <div className="animate-pulse">
        <img 
          src={logoImage} 
          alt="Aegix Logo" 
          className="w-32 h-32"
        />
      </div>

      {/* Aegix text */}
      <h1 className="mt-6 text-3xl font-bold text-gray-900">
        Aegix
      </h1>
    </div>
  );
};