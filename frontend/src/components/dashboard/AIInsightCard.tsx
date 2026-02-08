import React from 'react';

interface AIInsightCardProps {
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ message, type }) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'info':
      case 'success':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-100',
          iconColor: 'text-green-600',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      case 'warning':
        return {
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-100',
          iconColor: 'text-orange-600',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        };
      case 'error':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-100',
          iconColor: 'text-red-600',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
    }
  };

  const config = getTypeConfig();

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-2xl p-5 flex items-start space-x-4`}>
      <div className={`${config.iconColor} flex-shrink-0 mt-0.5`}>
        {config.icon}
      </div>
      <p className="text-sm text-gray-800 leading-relaxed flex-1">{message}</p>
    </div>
  );
};