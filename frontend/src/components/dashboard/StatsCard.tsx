import React from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  subtitleColor?: 'green' | 'red' | 'orange';
  linkText?: string;
  onLinkClick?: () => void;
  icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  subtitleColor = 'green',
  linkText,
  onLinkClick,
  icon,
}) => {
  const getSubtitleColorClass = () => {
    switch (subtitleColor) {
      case 'green':
        return 'text-green-600';
      case 'red':
        return 'text-red-600';
      case 'orange':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {linkText && (
          <button
            onClick={onLinkClick}
            className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center space-x-1"
          >
            <span>{linkText}</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Value */}
      <div className="mb-2">
        <p className="text-4xl font-bold text-gray-900">{value}</p>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className="flex items-center space-x-1 mt-auto">
          {icon}
          <p className={`text-sm ${getSubtitleColorClass()} flex items-center space-x-1`}>
            <span>{subtitle}</span>
          </p>
        </div>
      )}
    </div>
  );
};