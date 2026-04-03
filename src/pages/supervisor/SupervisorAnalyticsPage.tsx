import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useReports } from '@/services/ReportsContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

type TimeFilter = '12 months' | '6 months' | '30 days' | '7 days';

// Helper function to categorize reports based on keywords
const categorizeReport = (category: string): string => {
  const lower = category.toLowerCase();
  if (lower.includes('electrical') || lower.includes('wiring') || lower.includes('power')) return 'Electrical';
  if (lower.includes('fire') || lower.includes('extinguisher') || lower.includes('emergency exit')) return 'Fire';
  if (lower.includes('slip') || lower.includes('trip') || lower.includes('floor') || lower.includes('surface')) return 'Slips & Trips';
  if (lower.includes('chemical') || lower.includes('oil') || lower.includes('spill') || lower.includes('gas')) return 'Chemical';
  if (lower.includes('machinery') || lower.includes('forklift') || lower.includes('scaffolding') || lower.includes('equipment')) return 'Machinery';
  return 'Other';
};

export const SupervisorAnalyticsPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [trendsFilter, setTrendsFilter] = useState<TimeFilter>('12 months');
  const [locationFilter, setLocationFilter] = useState<TimeFilter>('12 months');

  // Get real reports data
  const { reports } = useReports();

  // Calculate stat card values from real data
  const totalReportsCount = useMemo(() => reports.length, [reports]);

  const reportsTrendCount = useMemo(() => {
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    return reports.filter(r => {
      const dateStr = r.dateReported.split('\n')[0];
      const reportDate = new Date(dateStr);
      return reportDate >= oneMonthAgo && reportDate <= now;
    }).length;
  }, [reports]);

  const openActionsCount = useMemo(() => {
    return reports.reduce((sum, report) => {
      return sum + report.actions.filter(a => a.status === 'Open').length;
    }, 0);
  }, [reports]);

  const overdueActionsCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let count = 0;

    reports.forEach(report => {
      report.actions.forEach(action => {
        if (action.status !== 'Completed') {
          try {
            const dueDate = new Date(action.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            if (dueDate < today) count++;
          } catch (e) {
            // Skip if date parsing fails
          }
        }
      });
    });

    return count;
  }, [reports]);

  const inProgressActionsCount = useMemo(() => {
    return reports.reduce((sum, report) => {
      return sum + report.actions.filter(a => a.status === 'In Progress').length;
    }, 0);
  }, [reports]);

  // Calculate risk level distribution from real reports (with percentages)
  const riskLevelData = useMemo(() => {
    const riskMap = {
      'Low': { count: 0, color: '#4CAF50' },
      'Medium': { count: 0, color: '#FF9800' },
      'High': { count: 0, color: '#E53935' },
    };

    reports.forEach(report => {
      if (riskMap[report.risk]) {
        riskMap[report.risk].count += 1;
      }
    });

    const total = reports.length || 1; // Avoid division by zero
    
    return [
      { 
        name: 'Low', 
        value: Math.round((riskMap['Low'].count / total) * 100), 
        color: riskMap['Low'].color 
      },
      { 
        name: 'Medium', 
        value: Math.round((riskMap['Medium'].count / total) * 100), 
        color: riskMap['Medium'].color 
      },
      { 
        name: 'High', 
        value: Math.round((riskMap['High'].count / total) * 100), 
        color: riskMap['High'].color 
      },
    ];
  }, [reports]);

  // Calculate top 5 locations by report count (filtered by time period)
  const reportsByLocationData = useMemo(() => {
    const colorPalette = ['#C24438', '#E8795A', '#F5C063', '#A8D5A2', '#E53935'];
    const locationMap: { [key: string]: number } = {};
    const now = new Date();

    // Filter reports based on locationFilter
    const filteredReports = reports.filter(report => {
      const dateStr = report.dateReported.split('\n')[0];
      const reportDate = new Date(dateStr);
      const daysDiff = (now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24);

      if (locationFilter === '12 months') return daysDiff <= 365;
      if (locationFilter === '6 months') return daysDiff <= 180;
      if (locationFilter === '30 days') return daysDiff <= 30;
      if (locationFilter === '7 days') return daysDiff <= 7;
      return true;
    });

    // Count reports by location
    filteredReports.forEach(report => {
      const loc = report.location;
      if (loc) {
        locationMap[loc] = (locationMap[loc] || 0) + 1;
      }
    });

    // Sort by count descending and take top 5
    const topLocations = Object.entries(locationMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Map to chart format with colors
    return topLocations.map(([location, count], index) => ({
      name: location,
      reports: count,
      color: colorPalette[index % colorPalette.length],
    }));
  }, [reports, locationFilter]);

  // Calculate dynamic max for location scale
  const locationMaxValue = useMemo(() => {
    if (reportsByLocationData.length === 0) return 10;
    const max = Math.max(...reportsByLocationData.map(item => item.reports));
    return Math.ceil(max * 1.1); // Add 10% padding
  }, [reportsByLocationData]);

  // Calculate reports by category from real reports
  const reportsByCategoryData = useMemo(() => {
    const colorPalette = ['#C24438', '#E8795A', '#F5C063', '#A8D5A2', '#E53935'];
    const categoryMap: { [key: string]: number } = {};

    // Categorize each report and count
    reports.forEach(report => {
      const cat = categorizeReport(report.category);
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    // Sort by count descending and take top 5
    const topCategories = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Map to chart format with colors
    return topCategories.map(([name, count], index) => ({
      name,
      value: count,
      color: colorPalette[index % colorPalette.length],
    }));
  }, [reports]);

  // Calculate report trends based on selected filter
  const reportTrendsData = useMemo(() => {
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let timeData: { [key: string]: { hazard: number; incident: number } } = {};

    if (trendsFilter === '12 months') {
      // Create last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const key = monthLabels[date.getMonth()];
        if (!timeData[key]) {
          timeData[key] = { hazard: 0, incident: 0 };
        }
      }
    } else if (trendsFilter === '6 months') {
      // Create last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const key = monthLabels[date.getMonth()];
        if (!timeData[key]) {
          timeData[key] = { hazard: 0, incident: 0 };
        }
      }
    } else if (trendsFilter === '30 days') {
      // Create last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!timeData[key]) {
          timeData[key] = { hazard: 0, incident: 0 };
        }
      }
    } else if (trendsFilter === '7 days') {
      // Create last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!timeData[key]) {
          timeData[key] = { hazard: 0, incident: 0 };
        }
      }
    }

    // Count reports by type and time period
    reports.forEach(report => {
      // Parse the dateReported which is formatted as "DD MMM, YYYY\nHH:MM AM/PM"
      const dateStr = report.dateReported.split('\n')[0]; // Get just the date part
      const date = new Date(dateStr);
      
      let key: string;
      if (trendsFilter === '12 months' || trendsFilter === '6 months') {
        key = monthLabels[date.getMonth()];
      } else {
        // 30 days or 7 days
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      
      if (timeData[key]) {
        if (report.type === 'Hazard') {
          timeData[key].hazard += 1;
        } else if (report.type === 'Incident') {
          timeData[key].incident += 1;
        }
      }
    });

    return Object.entries(timeData).map(([label, data]) => ({
      month: label,
      hazard: data.hazard,
      incident: data.incident,
    }));
  }, [reports, trendsFilter]);

  const timeFilters: TimeFilter[] = ['12 months', '6 months', '30 days', '7 days'];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-background-light">
      {/* Backdrop for mobile sidebar */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        role="supervisor"
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-20' : 'ml-64'
      }`}>
        {/* Top Bar */}
        <TopBar
          pageTitle="Analytics"
          onMenuClick={() => setMobileMenuOpen(true)}
          showMenuButton={isMobile}
          userName="John Matthew"
          userRole="Supervisor"
          notificationCount={4}
        />

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-aos="fade-up">
              {/* Total Reports */}
              <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-1 h-6">
                  <span className="text-sm text-gray-600">Total Reports</span>
                  <span className="text-[#C24438] text-[10px] md:text-xs font-medium cursor-pointer hover:underline flex items-center gap-0.5 whitespace-nowrap">
                    View all reports
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                  </span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{totalReportsCount}</div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  +{reportsTrendCount} since last month
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </p>
              </div>

              {/* Open Actions */}
              <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-1 h-6">
                  <span className="text-sm text-gray-600">Open Actions</span>
                  <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-[10px] md:text-xs w-fit whitespace-nowrap">See high-risk items</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{openActionsCount}</div>
                <p className="text-xs mt-1 flex items-center gap-1">
                  <span className="text-[#C24438]">{overdueActionsCount} actions overdue</span>
                  <svg className="w-3 h-3 text-[#C24438]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </p>
              </div>

              {/* In-Progress Report */}
              <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-1 h-6">
                  <span className="text-sm text-gray-600">In-Progress Report</span>
                  <span className="text-[#C24438] text-[10px] md:text-xs font-medium cursor-pointer hover:underline flex items-center gap-0.5 whitespace-nowrap">
                    View reports
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                  </span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{inProgressActionsCount}</div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  Actions underway
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </p>
              </div>

              {/* Overdue Actions */}
              <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100 flex flex-col">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-1 h-6">
                  <span className="text-sm text-gray-600">Overdue Actions</span>
                  <span className="text-[#C24438] text-[10px] md:text-xs font-medium cursor-pointer hover:underline whitespace-nowrap">Review & Prioritize</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{overdueActionsCount}</div>
                <p className="text-xs text-gray-500 mt-1">Past due date</p>
              </div>
            </div>

            {/* Report Trends */}
            <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Report Trends</h3>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-2">
                  {timeFilters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTrendsFilter(filter)}
                      className={`px-3 py-1.5 text-xs md:text-sm rounded-lg transition-colors ${
                        trendsFilter === filter
                          ? 'bg-[#C24438] text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#C24438]"></div>
                    <span className="text-sm text-gray-600">Hazard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF9500]"></div>
                    <span className="text-sm text-gray-600">Incident</span>
                  </div>
                </div>
              </div>
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportTrendsData}>
                    <defs>
                      <linearGradient id="svColorHazard" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C24438" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#C24438" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="svColorIncident" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF9500" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FF9500" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} ticks={[0, 10, 20, 30, 40, 50, 60]} domain={[0, 60]} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="hazard"
                      stroke="#C24438"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#svColorHazard)"
                    />
                    <Area
                      type="monotone"
                      dataKey="incident"
                      stroke="#FF9500"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#svColorIncident)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Reports by Location - Full Width */}
            <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100" data-aos="fade-up" data-aos-delay="150">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Reports by Location</h3>
                  <p className="text-sm text-gray-500">Locations with the highest number of reports</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {['12 months', '30 days', '7 days'].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setLocationFilter(filter as TimeFilter)}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                          locationFilter === filter
                            ? 'bg-[#C24438] text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                  <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-3 h-3 rounded-full bg-[#C24438]"></div>
                    Total Reports
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {reportsByLocationData.map((item) => (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">{item.name}</span>
                      <span className="text-sm font-medium text-gray-900">{item.reports}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(item.reports / locationMaxValue) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1 mt-4 text-xs text-gray-400">
                {Array.from({ length: 11 }, (_, i) => Math.round((locationMaxValue / 10) * i)).map((value, index) => (
                  <React.Fragment key={index}>
                    <span>{value}</span>
                    {index < 10 && <span className="flex-1"></span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Risk Level Distribution & Reports by Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Risk Level Distribution */}
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100" data-aos="fade-up" data-aos-delay="200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Level Distribution</h3>
                <p className="text-sm text-gray-500 mb-6">Percentage of reports by risk level</p>
                <div className="flex items-center gap-6">
                  <div className="w-36 h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskLevelData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={65}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {riskLevelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3">
                    {riskLevelData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reports by Category */}
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100" data-aos="fade-up" data-aos-delay="250">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports by Category</h3>
                <p className="text-sm text-gray-500 mb-6">Types of reported issues</p>
                <div className="flex items-center gap-6">
                  <div className="w-36 h-36">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reportsByCategoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={65}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {reportsByCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-3">
                    {reportsByCategoryData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-sm text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};
