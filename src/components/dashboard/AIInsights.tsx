import React, { useMemo } from 'react';
import { AIInsightCard } from './AIInsightCard';
import { useReports } from '@/services/ReportsContext';

interface AIInsightsProps {
  hasData?: boolean;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ hasData = true }) => {
  const { reports, loading } = useReports();

  const insights = useMemo(() => {
    if (!hasData || loading || reports.length === 0) return [];

    const now = new Date();
    const daysAgo = (days: number) => {
      const date = new Date(now);
      date.setDate(date.getDate() - days);
      return date;
    };

    const parseReportDate = (dateValue: string) => {
      const raw = dateValue.split('\n')[0]?.trim();
      const parsed = new Date(raw);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const dateRanges = {
      last14Start: daysAgo(14),
      prev14Start: daysAgo(28),
      last30Start: daysAgo(30),
    };

    const reportsWithDates = reports
      .map((report) => ({
        report,
        date: parseReportDate(report.dateReported),
      }))
      .filter((entry) => entry.date !== null) as Array<{ report: typeof reports[number]; date: Date }>;

    const last14 = reportsWithDates.filter((entry) => entry.date >= dateRanges.last14Start && entry.date <= now);
    const prev14 = reportsWithDates.filter(
      (entry) => entry.date >= dateRanges.prev14Start && entry.date < dateRanges.last14Start
    );

    const last30 = reportsWithDates.filter((entry) => entry.date >= dateRanges.last30Start && entry.date <= now);
    const reportsScope = last30.length > 0 ? last30 : reportsWithDates;

    const insightsList: Array<{ id: number; message: string; type: 'info' | 'warning' | 'success' | 'error' }> = [];

    if (last14.length > 0 || prev14.length > 0) {
      const changeBase = prev14.length || 1;
      const change = Math.round(((last14.length - prev14.length) / changeBase) * 100);
      const trendType = change > 0 ? 'warning' : change < 0 ? 'success' : 'info';
      const trendWord = change > 0 ? 'increased' : change < 0 ? 'decreased' : 'stayed level';
      const suffix = prev14.length === 0 ? ' (baseline is 0)' : '';
      insightsList.push({
        id: 1,
        message: `Reports ${trendWord} by ${Math.abs(change)}% in the last 14 days (${last14.length} vs ${prev14.length}).${suffix}`,
        type: trendType,
      });
    }

    const totalActions = reports.reduce((sum, report) => sum + report.actions.length, 0);
    const completedActions = reports.reduce(
      (sum, report) => sum + report.actions.filter((action) => action.status === 'Completed').length,
      0
    );

    if (totalActions > 0) {
      const completionRate = Math.round((completedActions / totalActions) * 100);
      const completionType = completionRate < 70 ? 'warning' : 'success';
      insightsList.push({
        id: 2,
        message: `Action completion rate is ${completionRate}% (${completedActions} of ${totalActions} completed).`,
        type: completionType,
      });
    }

    if (reportsScope.length > 0) {
      const highRiskCount = reportsScope.filter((entry) => entry.report.risk === 'High').length;
      if (highRiskCount > 0) {
        const highRiskShare = Math.round((highRiskCount / reportsScope.length) * 100);
        const highRiskType = highRiskShare >= 40 ? 'warning' : 'info';
        insightsList.push({
          id: 3,
          message: `High-risk reports account for ${highRiskShare}% of recent reports (${highRiskCount} of ${reportsScope.length}).`,
          type: highRiskType,
        });
      }
    }

    return insightsList.slice(0, 3);
  }, [hasData, loading, reports]);

  // Don't render section if no insights
  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center space-x-2 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">AI Insight</h2>
        <svg className="w-5 h-5 text-gray-900 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <div key={insight.id} data-aos="fade-up" data-aos-delay={index * 100}>
            <AIInsightCard
              message={insight.message}
              type={insight.type}
            />
          </div>
        ))}
      </div>
    </div>
  );
};