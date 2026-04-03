import React, { useState, useMemo } from 'react';
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
  BarChart,
  Bar,
  LineChart,
  Line,
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

export const AnalyticsPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trendsFilter, setTrendsFilter] = useState<TimeFilter>('12 months');
  const [locationFilter, setLocationFilter] = useState<TimeFilter>('12 months');

  // Get real reports data
  const { reports } = useReports();

  // Calculate stat card values from real data
  const totalReportsCount = useMemo(() => reports.length, [reports]);

  const reportsTrendPercentage = useMemo(() => {
    const now = new Date();
    const last30Start = new Date(now);
    last30Start.setDate(last30Start.getDate() - 30);
    const last60Start = new Date(now);
    last60Start.setDate(last60Start.getDate() - 60);

    const last30 = reports.filter(r => {
      const dateStr = r.dateReported.split('\n')[0];
      const reportDate = new Date(dateStr);
      return reportDate >= last30Start && reportDate <= now;
    }).length;

    const previous30 = reports.filter(r => {
      const dateStr = r.dateReported.split('\n')[0];
      const reportDate = new Date(dateStr);
      return reportDate >= last60Start && reportDate < last30Start;
    }).length;

    if (previous30 === 0) return 0;
    return Math.round(((last30 - previous30) / previous30) * 100);
  }, [reports]);

  const totalActionsCount = useMemo(() => {
    return reports.reduce((sum, report) => sum + report.actions.length, 0);
  }, [reports]);

  const newActionsThisWeek = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    let count = 0;

    reports.forEach(report => {
      report.actions.forEach(action => {
        try {
          const dueDate = new Date(action.dueDate);
          if (dueDate >= weekAgo) count++;
        } catch (e) {
          // Skip if date parsing fails
        }
      });
    });

    return count;
  }, [reports]);

  const openActionsCount = useMemo(() => {
    return reports.reduce((sum, report) => {
      return sum + report.actions.filter(a => a.status === 'Open').length;
    }, 0);
  }, [reports]);

  const inProgressActionsCount = useMemo(() => {
    return reports.reduce((sum, report) => {
      return sum + report.actions.filter(a => a.status === 'In Progress').length;
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

  // Calculate severity data from real reports
  // Severity mapping: Low risk (1-2), Medium risk (3), High risk (4-5)
  const reportsBySeverityData = useMemo(() => {
    const severityMap = {
      '1-2': { count: 0, color: '#34C759' },    // Low
      '3': { count: 0, color: '#FFCC00' },      // Medium
      '4-5': { count: 0, color: '#FF3B30' },    // High
    };

    reports.forEach(report => {
      if (report.risk === 'Low') {
        severityMap['1-2'].count += 1;
      } else if (report.risk === 'Medium') {
        severityMap['3'].count += 1;
      } else if (report.risk === 'High') {
        severityMap['4-5'].count += 1;
      }
    });

    return [
      { range: '1-2', count: severityMap['1-2'].count, color: severityMap['1-2'].color },
      { range: '3', count: severityMap['3'].count, color: severityMap['3'].color },
      { range: '4-5', count: severityMap['4-5'].count, color: severityMap['4-5'].color },
    ];
  }, [reports]);

  // Calculate risk level distribution from real reports (with percentages)
  const riskLevelData = useMemo(() => {
    const riskMap = {
      'Low': { count: 0, color: '#34C759' },
      'Medium': { count: 0, color: '#FF9500' },
      'High': { count: 0, color: '#FF3B30' },
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

  // Calculate actions by status from real action data
  const actionsByStatusData = useMemo(() => {
    const statusMap = {
      'Open': { count: 0, color: '#FF3B30' },
      'In Progress': { count: 0, color: '#FF9500' },
      'Completed': { count: 0, color: '#34C759' },
    };

    // Iterate through all reports and count actions by status
    reports.forEach(report => {
      report.actions.forEach(action => {
        if (statusMap[action.status]) {
          statusMap[action.status].count += 1;
        }
      });
    });

    const total = Object.values(statusMap).reduce((sum, item) => sum + item.count, 0) || 1; // Avoid division by zero

    return [
      { 
        name: 'Open', 
        value: Math.round((statusMap['Open'].count / total) * 100), 
        color: statusMap['Open'].color 
      },
      { 
        name: 'In Progress', 
        value: Math.round((statusMap['In Progress'].count / total) * 100), 
        color: statusMap['In Progress'].color 
      },
      { 
        name: 'Completed', 
        value: Math.round((statusMap['Completed'].count / total) * 100), 
        color: statusMap['Completed'].color 
      },
    ];
  }, [reports]);

  // Calculate top 5 locations by report count (filtered by time period)
  const reportsByLocationData = useMemo(() => {
    const colorPalette = ['#C24438', '#FF9500', '#FFCC00', '#34C759', '#007AFF'];
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
    const colorPalette = ['#C24438', '#FF9500', '#FFCC00', '#34C759', '#007AFF'];
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

  // Calculate safety improvement (completed actions per month for last 12 months)
  const safetyImprovementData = useMemo(() => {
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: { [key: string]: number } = {};

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = monthLabels[date.getMonth()];
      if (!monthlyData[key]) monthlyData[key] = 0;
    }

    // Count completed actions per month
    reports.forEach(report => {
      report.actions.forEach(action => {
        if (action.status === 'Completed') {
          // Parse the dueDate to get month - format: "Mar 15, 2026"
          try {
            const dueDate = new Date(action.dueDate);
            const key = monthLabels[dueDate.getMonth()];
            if (key) monthlyData[key]++;
          } catch (e) {
            // Skip if date parsing fails
          }
        }
      });
    });

    // Convert to array and return last 12 months
    return Object.entries(monthlyData).map(([month, value]) => ({
      month,
      value,
    }));
  }, [reports]);

  // Calculate risk alert (high-risk reports per month for last 12 months)
  const riskAlertData = useMemo(() => {
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData: { [key: string]: number } = {};

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = monthLabels[date.getMonth()];
      if (!monthlyData[key]) monthlyData[key] = 0;
    }

    // Count high-risk reports per month
    reports.forEach(report => {
      if (report.risk === 'High') {
        // Parse the dateReported to get month - format: "DD MMM, YYYY\nHH:MM AM/PM"
        try {
          const dateStr = report.dateReported.split('\n')[0];
          const reportDate = new Date(dateStr);
          const key = monthLabels[reportDate.getMonth()];
          if (key) monthlyData[key]++;
        } catch (e) {
          // Skip if date parsing fails
        }
      }
    });

    // Convert to array and return last 12 months
    return Object.entries(monthlyData).map(([month, value]) => ({
      month,
      value,
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

  return (
    <div className="min-h-screen bg-background-light">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        {/* Top Bar */}
        <TopBar
          pageTitle="Analytics"
          onMenuClick={() => setMobileMenuOpen(true)}
          showMenuButton={true}
          userName="Peter Omogbolahan"
          userRole="System Administrator"
          notificationCount={4}
        />

        {/* Main Content Area */}
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-aos="fade-up">
              {/* Total Reports */}
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100 flex flex-col">
                <div className="flex items-center justify-between mb-2 h-6">
                  <span className="text-sm text-gray-600">Total Reports</span>
                  <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${reportsTrendPercentage >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>{reportsTrendPercentage >= 0 ? '+' : ''}{reportsTrendPercentage}% from last 30 days</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{totalReportsCount}</div>
                <p className="text-xs text-gray-500 mt-1">Hazard and Incident reported</p>
              </div>

              {/* Total Actions */}
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100 flex flex-col">
                <div className="flex items-center justify-between mb-2 h-6">
                  <span className="text-sm text-gray-600">Total Actions</span>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full whitespace-nowrap">+{newActionsThisWeek} new actions this week </span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{totalActionsCount}</div>
                <p className="text-xs text-gray-500 mt-1">Corrective actions created</p>
              </div>

              {/* Open Actions */}
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100 flex flex-col">
                <div className="flex items-center justify-between mb-2 h-6">
                  <span className="text-sm text-gray-600">Open Actions</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full whitespace-nowrap">{inProgressActionsCount} in progress</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{openActionsCount}</div>
                <p className="text-xs text-gray-500 mt-1">Actions not yet completed</p>
              </div>

              {/* Overdue Actions */}
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100 flex flex-col">
                <div className="flex items-center justify-between mb-2 h-6">
                  <span className="text-sm text-gray-600">Overdue Actions</span>
                  <span className="text-xs text-[#C24438] bg-red-50 px-2 py-1 rounded-full whitespace-nowrap">Requires attention</span>
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
                      <linearGradient id="colorHazard" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C24438" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#C24438" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorIncident" x1="0" y1="0" x2="0" y2="1">
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
                      fill="url(#colorHazard)"
                    />
                    <Area
                      type="monotone"
                      dataKey="incident"
                      stroke="#FF9500"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorIncident)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Actions by Status & Reports by Location */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Actions by Status */}
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100" data-aos="fade-up" data-aos-delay="150">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Actions by Status</h3>
                <p className="text-sm text-gray-500 mb-4">Current progress of all actions</p>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-48 h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={actionsByStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {actionsByStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 space-y-2">
                    {actionsByStatusData.map((item) => (
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

              {/* Reports by Location */}
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100" data-aos="fade-up" data-aos-delay="200">
                <div className="flex flex-col gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Reports by Location</h3>
                    <p className="text-sm text-gray-500">Locations with the highest number of reports</p>
                  </div>
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
            </div>

            {/* Reports by Severity, Risk Distribution, Reports by Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Reports by Severity */}
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100" data-aos="fade-up" data-aos-delay="250">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports by Severity</h3>
                <p className="text-sm text-gray-500 mb-4">Breakdown of reports by severity level</p>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reportsBySeverityData}>
                      <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {reportsBySeverityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-[#C24438] mt-2 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#C24438]"></span>
                  Higher severity levels require urgent review
                </p>
              </div>

              {/* Risk Level Distribution */}
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100" data-aos="fade-up" data-aos-delay="300">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Level Distribution</h3>
                <p className="text-sm text-gray-500 mb-4">Percentage of reports by risk level</p>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskLevelData}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={55}
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
                  <div className="flex-1 space-y-2">
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
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100" data-aos="fade-up" data-aos-delay="350">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports by Category</h3>
                <p className="text-sm text-gray-500 mb-4">Types of reported issues</p>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={reportsByCategoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={55}
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
                  <div className="flex-1 space-y-2">
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

            {/* Safety Improvement & Risk Alert */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Safety Improvement */}
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100" data-aos="fade-up" data-aos-delay="400">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Safety Improvement</h3>
                <p className="text-sm text-gray-500 mb-2">Report submissions increased</p>
                <p className="text-sm text-green-600 font-medium mb-4">by 12% compared to last month</p>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={safetyImprovementData}>
                      <defs>
                        <linearGradient id="safetyGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34C759" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#34C759" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#34C759"
                        strokeWidth={2}
                        dot={false}
                        fill="url(#safetyGradient)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Risk Alert */}
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100" data-aos="fade-up" data-aos-delay="450">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Risk Alert</h3>
                <p className="text-sm text-gray-500 mb-2">Closed actions increased by</p>
                <p className="text-sm text-[#C24438] font-medium mb-4">8% this month</p>
                <div className="h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={riskAlertData}>
                      <defs>
                        <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C24438" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#C24438" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#C24438"
                        strokeWidth={2}
                        dot={false}
                        fill="url(#riskGradient)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
