import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
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
} from 'recharts';

type TimeFilter = '12 months' | '6 months' | '30 days' | '7 days' | 'Custom range';

// Mock data for charts
const reportTrendsData = [
  { month: 'Jan', hazard: 45, incident: 25 },
  { month: 'Feb', hazard: 35, incident: 20 },
  { month: 'Mar', hazard: 30, incident: 15 },
  { month: 'Apr', hazard: 25, incident: 10 },
  { month: 'May', hazard: 35, incident: 15 },
  { month: 'Jun', hazard: 55, incident: 40 },
  { month: 'Jul', hazard: 45, incident: 30 },
  { month: 'Aug', hazard: 30, incident: 20 },
  { month: 'Sep', hazard: 25, incident: 15 },
  { month: 'Oct', hazard: 30, incident: 20 },
  { month: 'Nov', hazard: 45, incident: 30 },
  { month: 'Dec', hazard: 55, incident: 40 },
];

const reportsByLocationData = [
  { name: 'North Sea Platform', seg1: 35, seg2: 25, seg3: 20, seg4: 15 },
  { name: 'Gulf of Mexico', seg1: 30, seg2: 20, seg3: 15, seg4: 10 },
  { name: 'Houston Office', seg1: 20, seg2: 15, seg3: 10, seg4: 8 },
  { name: 'Alaska Pipeline', seg1: 35, seg2: 20, seg3: 15, seg4: 20 },
  { name: 'Singapore Refinery', seg1: 15, seg2: 10, seg3: 5, seg4: 0 },
];

const riskLevelData = [
  { name: 'Low', value: 46, color: '#4CAF50' },
  { name: 'Medium', value: 24, color: '#FF9800' },
  { name: 'High', value: 15, color: '#E53935' },
];

const reportsByCategoryData = [
  { name: 'Electrical', value: 46, color: '#C24438' },
  { name: 'Fire', value: 24, color: '#E8795A' },
  { name: 'Slips & Trips', value: 15, color: '#F5C063' },
  { name: 'Chemical', value: 8, color: '#A8D5A2' },
  { name: 'Machinery', value: 7, color: '#E53935' },
];

export const SupervisorAnalyticsPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [trendsFilter, setTrendsFilter] = useState<TimeFilter>('12 months');
  const [locationFilter, setLocationFilter] = useState<TimeFilter>('12 months');

  const timeFilters: TimeFilter[] = ['12 months', '6 months', '30 days', '7 days', 'Custom range'];

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
              <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-1">
                  <span className="text-sm text-gray-600">Total Reports</span>
                  <span className="text-[#C24438] text-[10px] md:text-xs font-medium cursor-pointer hover:underline flex items-center gap-0.5">
                    View all reports
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                  </span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">248</div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  +18 since last month
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </p>
              </div>

              {/* Open Actions */}
              <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-1">
                  <span className="text-sm text-gray-600">Open Actions</span>
                  <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded text-[10px] md:text-xs w-fit">See high-risk items</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">41</div>
                <p className="text-xs mt-1 flex items-center gap-1">
                  <span className="text-[#C24438]">12 actions overdue</span>
                  <svg className="w-3 h-3 text-[#C24438]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </p>
              </div>

              {/* In-Progress Report */}
              <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-1">
                  <span className="text-sm text-gray-600">In-Progress Report</span>
                  <span className="text-[#C24438] text-[10px] md:text-xs font-medium cursor-pointer hover:underline flex items-center gap-0.5">
                    View reports
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                    </svg>
                  </span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">23</div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  Actions underway
                  <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </p>
              </div>

              {/* Overdue Actions */}
              <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 gap-1">
                  <span className="text-sm text-gray-600">Overdue Actions</span>
                  <span className="text-[#C24438] text-[10px] md:text-xs font-medium cursor-pointer hover:underline">Review & Prioritize</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">6</div>
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
                    {['12 months', '30 days', '7 days', 'Custom range'].map((filter) => (
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

              <div className="h-64 md:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={reportsByLocationData}
                    layout="vertical"
                    margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                    <XAxis
                      type="number"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 11 }}
                      domain={[0, 100]}
                      ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 11 }}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    />
                    <Bar dataKey="seg1" stackId="a" fill="#C24438" radius={[0, 0, 0, 0]} barSize={20} />
                    <Bar dataKey="seg2" stackId="a" fill="#E8956A" radius={[0, 0, 0, 0]} barSize={20} />
                    <Bar dataKey="seg3" stackId="a" fill="#F5C4A8" radius={[0, 0, 0, 0]} barSize={20} />
                    <Bar dataKey="seg4" stackId="a" fill="#FCDFD0" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
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
