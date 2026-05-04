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
          bgColor: 'bg-green-50 dark:bg-green-900/30',
          borderColor: 'border-green-100 dark:border-green-800/50',
          iconColor: 'text-green-600 dark:text-green-400',
          textColor: 'text-gray-800 dark:text-gray-100',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      case 'warning':
        return {
          bgColor: 'bg-orange-50 dark:bg-orange-900/30',
          borderColor: 'border-orange-100 dark:border-orange-800/50',
          iconColor: 'text-orange-600 dark:text-orange-400',
          textColor: 'text-gray-800 dark:text-gray-100',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        };
      case 'error':
        return {
          bgColor: 'bg-red-50 dark:bg-red-900/30',
          borderColor: 'border-red-100 dark:border-red-800/50',
          iconColor: 'text-red-600 dark:text-red-400',
          textColor: 'text-gray-800 dark:text-gray-100',
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
    <div className={`${config.bgColor} border ${config.borderColor} rounded-2xl p-5 flex items-start space-x-4 transition-colors`}>
      <div className={`${config.iconColor} flex-shrink-0 mt-0.5`}>
        {config.icon}
      </div>
      <p className={`text-sm ${config.textColor} leading-relaxed flex-1`}>{message}</p>
    </div>
  );
};