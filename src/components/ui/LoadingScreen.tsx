import React from 'react';
import logoImage from '@/assets/images/aegix-logo.png';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <svg 
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 160 160"
        > 
          <rect
            x="8"
            y="8"
            width="144"
            height="144"
            rx="24"
            ry="24"
            fill="none"
            stroke="#C24438"
            strokeWidth="4"
            strokeLinecap="round"
            style={{
              strokeDasharray: '580',
              strokeDashoffset: '580',
              animation: 'draw 2s ease-in-out infinite'
            }}
          />
        </svg>
        
        <img 
          src={logoImage} 
          alt="Aegix Logo" 
          className="w-32 h-32 relative z-10"
        />
      </div>

      <h1 className="mt-6 text-3xl font-bold text-gray-900">
        Aegix
      </h1>
      
      {message && (
        <p className="mt-2 text-gray-600 text-sm">{message}</p>
      )}

      <style>{`
        @keyframes draw {
          0% {
            stroke-dashoffset: 580;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};