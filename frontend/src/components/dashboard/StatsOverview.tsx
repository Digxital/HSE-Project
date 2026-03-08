import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from './StatsCard';
 
interface StatsOverviewProps {
  hasData?: boolean;
} 

export const StatsOverview: React.FC<StatsOverviewProps> = ({ hasData = true }) => {
  const navigate = useNavigate();
  const [showHeaderTooltip, setShowHeaderTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
 
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mock data - will be replaced with API data later
  const stats = hasData
    ? {
        totalReports: 248,
        totalReportsChange: '+18 since last month',
        highRiskItems: 23,
        highRiskImmediate: '5 require immediate action',
        openActions: 41,
        openActionsOverdue: '12 overdue',
        monthlyTrend: 7,
      }
    : {
        totalReports: 0,
        totalReportsChange: 'No reports yet',
        highRiskItems: 0,
        highRiskImmediate: 'No high-risk items',
        openActions: 0,
        openActionsOverdue: 'No overdue actions',
        monthlyTrend: 0,
      };

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center space-x-2 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">HSE Management Overview</h2>
        <div  
          className="relative"
          onMouseEnter={() => setShowHeaderTooltip(true)}
          onMouseLeave={() => setShowHeaderTooltip(false)}
        >
          <button 
            onClick={() => setShowHeaderTooltip(!showHeaderTooltip)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button> 
          
          {/* Tooltip */}
          {showHeaderTooltip && (
            <div className={`absolute bottom-full ${isMobile ? 'left-0' : 'left-1/2 -translate-x-1/2'} mb-2 px-3 py-2 bg-gray-900/90 text-white text-xs rounded-lg whitespace-nowrap z-50 shadow-lg`}>
              Overview of all HSE reports, risks, and actions
              {/* Arrow */}
              <div className={`absolute top-full ${isMobile ? 'left-3' : 'left-1/2 -translate-x-1/2'} border-4 border-transparent border-t-gray-900/90`}></div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Reports */}
        <div data-aos="fade-up" data-aos-delay="0">
          <StatsCard
            title="Total Reports"
            value={stats.totalReports}
            subtitle={stats.totalReportsChange}
            subtitleColor="green"
            linkText={hasData ? "View all reports" : undefined}
            onLinkClick={() => navigate('/reports')}
            icon={
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            tooltip="Compared to previous 30 days"
            tooltipPosition="left"
          />
        </div>

        {/* High-Risk Items */}
        <div data-aos="fade-up" data-aos-delay="100">
          <StatsCard
            title="High-Risk Items"
            value={stats.highRiskItems}
            subtitle={stats.highRiskImmediate}
            subtitleColor="red"
            linkText={hasData ? "View high-risk items" : undefined}
            onLinkClick={() => navigate('/analytics')}
            icon={
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
            tooltip="Items requiring attention within 24-48 hours"
          />
        </div>

        {/* Open Actions */}
        <div data-aos="fade-up" data-aos-delay="200">
          <StatsCard
            title="Open Actions"
            value={stats.openActions}
            subtitle={stats.openActionsOverdue}
            subtitleColor="orange"
            linkText={hasData ? "View open actions" : undefined}
            onLinkClick={() => navigate('/actions')}
            icon={
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            tooltip="Actions past their due date"
          />
        </div>

        {/* Monthly Trend Card */}
        <div data-aos="fade-up" data-aos-delay="300">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-baseline space-x-2">
                <h2 className="text-4xl font-bold text-gray-900">{stats.monthlyTrend}%</h2>
                {hasData && (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4 flex-grow-0">Monthly Trend</p>
            
            {/* Simple Trend Graph */}
            {hasData ? (
              <div className="h-20 flex items-end justify-between space-x-1 mt-auto">
                <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                  {/* Background gradient */}
                  <defs>
                    <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  
                  {/* Trend line path */}
                  <path
                    d="M 0,60 Q 30,55 50,45 T 100,35 Q 130,30 150,25 T 200,15"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  
                  {/* Fill area under curve */}
                  <path
                    d="M 0,60 Q 30,55 50,45 T 100,35 Q 130,30 150,25 T 200,15 L 200,80 L 0,80 Z"
                    fill="url(#trendGradient)"
                  />
                </svg>
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-xs text-gray-400">No data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};