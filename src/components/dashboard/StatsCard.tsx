import React, { useState, useEffect } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  subtitleColor?: 'green' | 'red' | 'orange';
  linkText?: string;
  onLinkClick?: () => void;
  icon?: React.ReactNode;
  tooltip?: string;
  tooltipPosition?: 'center' | 'left';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  subtitleColor = 'green',
  linkText,
  onLinkClick,
  icon,
  tooltip,
  tooltipPosition = 'center',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(!showTooltip);
  };

  const getTooltipPositionClass = () => {
    // On mobile, always position left to avoid overflow
    if (isMobile || tooltipPosition === 'left') {
      return 'left-0';
    }
    return 'left-1/2 -translate-x-1/2';
  };

  const getArrowPositionClass = () => {
    // On mobile, always position arrow left
    if (isMobile || tooltipPosition === 'left') {
      return 'left-3';
    }
    return 'left-1/2 -translate-x-1/2';
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
        <div className="flex items-center space-x-1.5 mt-auto relative">
          {icon && tooltip && (
            <div 
              className="relative"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <button
                onClick={handleIconClick}
                className="flex-shrink-0 cursor-pointer"
              >
                {icon}
              </button>
              
              {/* Tooltip */}
              {showTooltip && (
                <div className={`absolute bottom-full ${getTooltipPositionClass()} mb-2 px-3 py-2 bg-gray-900/90 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg`}>
                  {tooltip}
                  {/* Arrow */}
                  <div className={`absolute top-full ${getArrowPositionClass()} border-4 border-transparent border-t-gray-900/90`}></div>
                </div>
              )}
            </div>
          )}
          {icon && !tooltip && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          <p className={`text-sm ${getSubtitleColorClass()}`}>
            {subtitle}
          </p>
        </div>
      )}
    </div>
  );
};