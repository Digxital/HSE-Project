import React, { useState } from 'react';
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
  LineChart,
  Line,
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

const actionsByStatusData = [
  { name: 'Open', value: 40, color: '#FF3B30' },
  { name: 'In Progress', value: 26, color: '#FF9500' },
  { name: 'Completed', value: 18, color: '#34C759' },
  { name: 'Closed', value: 9, color: '#8E8E93' },
  { name: 'Overdue', value: 7, color: '#AF52DE' },
];

const reportsByLocationData = [
  { name: 'North Sea Platform', reports: 95, color: '#C24438' },
  { name: 'Gulf of Mexico', reports: 75, color: '#FF9500' },
  { name: 'Houston Office', reports: 55, color: '#FFCC00' },
  { name: 'Alaska Pipeline', reports: 40, color: '#34C759' },
  { name: 'Singapore Refinery', reports: 25, color: '#007AFF' },
];

const reportsBySeverityData = [
  { range: '1-5', count: 45, color: '#34C759' },
  { range: '6-10', count: 65, color: '#A8D08D' },
  { range: '11-15', count: 85, color: '#FFCC00' },
  { range: '16-20', count: 55, color: '#FF9500' },
  { range: '21-25', count: 35, color: '#FF3B30' },
];

const riskLevelData = [
  { name: 'Low', value: 48, color: '#34C759' },
  { name: 'Medium', value: 24, color: '#FF9500' },
  { name: 'High', value: 8, color: '#FF3B30' },
];

const reportsByCategoryData = [
  { name: 'Electrical', value: 46, color: '#C24438' },
  { name: 'Fire', value: 24, color: '#FF9500' },
  { name: 'Slips & Trips', value: 15, color: '#FFCC00' },
  { name: 'Chemical', value: 8, color: '#34C759' },
  { name: 'Machinery', value: 7, color: '#007AFF' },
];

const safetyImprovementData = [
  { month: 'Jan', value: 10 },
  { month: 'Feb', value: 15 },
  { month: 'Mar', value: 12 },
  { month: 'Apr', value: 18 },
  { month: 'May', value: 22 },
  { month: 'Jun', value: 25 },
];

const riskAlertData = [
  { month: 'Jan', value: 5 },
  { month: 'Feb', value: 8 },
  { month: 'Mar', value: 6 },
  { month: 'Apr', value: 10 },
  { month: 'May', value: 12 },
  { month: 'Jun', value: 15 },
];

export const AnalyticsPage: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trendsFilter, setTrendsFilter] = useState<TimeFilter>('12 months');
  const [locationFilter, setLocationFilter] = useState<TimeFilter>('12 months');

  const timeFilters: TimeFilter[] = ['12 months', '6 months', '30 days', '7 days', 'Custom range'];

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
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Reports</span>
                  <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">+12% from last 30 days</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">248</div>
                <p className="text-xs text-gray-500 mt-1">Hazard and Incident reported</p>
              </div>

              {/* Total Actions */}
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Actions</span>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">+8 new actions this week </span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">190</div>
                <p className="text-xs text-gray-500 mt-1">Corrective actions created</p>
              </div>

              {/* Open Actions */}
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Open Actions</span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">12 in progress</span>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">34</div>
                <p className="text-xs text-gray-500 mt-1">Actions not yet completed</p>
              </div>

              {/* Overdue Actions */}
              <div className="bg-[#FFFAF5] rounded-xl p-4 md:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Overdue Actions</span>
                  <span className="text-xs text-[#C24438] bg-red-50 px-2 py-1 rounded-full">Requires attention</span>
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
                            width: `${(item.reports / 100) * 100}%`,
                            backgroundColor: item.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1 mt-4 text-xs text-gray-400">
                  <span>0</span>
                  <span className="flex-1"></span>
                  <span>10</span>
                  <span className="flex-1"></span>
                  <span>20</span>
                  <span className="flex-1"></span>
                  <span>30</span>
                  <span className="flex-1"></span>
                  <span>40</span>
                  <span className="flex-1"></span>
                  <span>50</span>
                  <span className="flex-1"></span>
                  <span>60</span>
                  <span className="flex-1"></span>
                  <span>70</span>
                  <span className="flex-1"></span>
                  <span>80</span>
                  <span className="flex-1"></span>
                  <span>90</span>
                  <span className="flex-1"></span>
                  <span>100</span>
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
