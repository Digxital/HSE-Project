import React from 'react';
import { AIInsightCard } from './AIInsightCard';

interface AIInsightsProps {
  hasData?: boolean;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ hasData = true }) => {
  // Mock data - will be replaced with API data later
  const insights = hasData
    ? [
        {
          id: 1,
          message: 'Near-miss reports increased by 22% at North Sea Platform Alpha in the last 14 days.',
          type: 'info' as const,
        },
        {
          id: 2,
          message: 'Action closure rate dropped from 82% to 68% this month.',
          type: 'warning' as const,
        },
      ]
    : [];

  // Don't render section if no insights
  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Section Header */}
      <div className="flex items-center space-x-2 mb-6">
        <h2 className="text-lg font-semibold text-gray-900">AI Insight</h2>
        <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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