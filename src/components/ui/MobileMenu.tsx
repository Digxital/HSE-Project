import React from 'react';
import { cn } from '@/utils/className';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onGetStarted: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  onSignIn, 
  onGetStarted 
}) => {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          'fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-6">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Menu Items */}
          <div className="mt-12 space-y-4">
            <button
              onClick={() => {
                onSignIn();
                onClose();
              }}
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
            >
              Sign In
            </button>
            
            <button
              onClick={() => {
                onGetStarted();
                onClose();
              }}
              className="w-full text-left px-4 py-3 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </>
  );
};