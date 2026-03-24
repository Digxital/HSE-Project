import React from 'react';
import { EmptyState } from '../common/EmptyState';
import { useReports } from '@/services/ReportsContext';

interface RecentReportsTableProps {
  hasData?: boolean;
}

export const RecentReportsTable: React.FC<RecentReportsTableProps> = ({ hasData = true }) => {
  const { reports: allReports, loading } = useReports();

  // Show the 3 most recent reports from the API context
  const reports = hasData ? allReports.slice(0, 3) : [];

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'text-red-600 bg-red-50';
      case 'Medium':
        return 'text-orange-600 bg-orange-50';
      case 'Low':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'text-gray-700';
      case 'Progress':
        return 'text-blue-700';
      case 'Closed':
        return 'text-gray-500';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center space-x-2 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Table or Empty State */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" data-aos="fade-up" data-aos-delay="100">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : reports.length === 0 ? (
          <EmptyState
            title="No Reports Yet"
            description="No reports have been submitted for this period."
            icon={
              <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FFF9F5] border-b border-gray-100">
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report ID
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report, index) => (
                  <tr
                    key={report.id}
                    className="bg-[#FFFAF5] hover:bg-[#FFFEFB] transition-colors cursor-pointer"
                  >
                    {/* Red indicator line for first row */}
                    <td className="py-4 px-6 text-sm font-medium text-gray-900 relative">
                      {index === 0 && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                      )}
                      <span className={index === 0 ? 'ml-2' : ''}>{report.id}</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">{report.category}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{report.location}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskBadgeColor(
                          report.risk
                        )}`}
                      >
                        •{report.risk}
                      </span>
                    </td>
                    <td className={`py-4 px-6 text-sm font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">{report.dateReported}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};