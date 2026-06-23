import React from 'react';

export const SuperAdminDashboardPage: React.FC = () => {
  const stats = [
    { label: 'Total Organizations', value: '0', icon: '🏢' },
    { label: 'Active Users', value: '0', icon: '👥' },
    { label: 'Total Reports', value: '0', icon: '📊' },
    { label: 'System Health', value: '100%', icon: '✅' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-gray-600 text-sm font-semibold mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-[#C2410C]">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
