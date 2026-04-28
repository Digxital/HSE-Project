import React, { useEffect, useState } from 'react';
import logoImage from '@/assets/images/aegix-logo.png';
import darkLogoImage from '@/assets/images/aegix-darkmode-logo.png';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }

    // Listen for theme changes
    const htmlElement = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(htmlElement.classList.contains('dark'));
    });
    
    observer.observe(htmlElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors ${
      isDark ? 'bg-gray-950' : 'bg-white'
    }`}>
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
          src={isDark ? darkLogoImage : logoImage} 
          alt="Aegix Logo" 
          className="w-32 h-32 relative z-10"
        />
      </div>

      <h1 className={`mt-6 text-3xl font-bold transition-colors ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        Aegix
      </h1>
      
      {message && (
        <p className={`mt-2 text-sm transition-colors ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>{message}</p>
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