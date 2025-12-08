'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Download, 
  Phone,
  Clock,
  Star,
  TrendingUp,
  Users,
  MessageSquare,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import {
  CallVolumeChart,
  QualityTrendChart,
  SentimentPieChart,
  SentimentTrendChart,
  AgentPerformanceChart,
  TopTopicsChart,
} from '@/components/dashboard/AnalyticsCharts';
import { StatsCard, MiniStats } from '@/components/dashboard/StatsCard';

interface AnalyticsSummary {
  totalCalls: number;
  callsThisMonth: number;
  totalDuration: number;
  avgDuration: number;
  avgQualityScore: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  satisfactionDistribution: {
    satisfied: number;
    neutral: number;
    dissatisfied: number;
  };
  topTopics: Array<{ topic: string; count: number }>;
  topKeywords: Array<{ keyword: string; count: number }>;
  agentPerformance: {
    professionalism: number;
    helpfulness: number;
    clarity: number;
    resolution: number;
  };
}

interface TrendData {
  date: string;
  calls: number;
  avgQuality: number;
  positive: number;
  neutral: number;
  negative: number;
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const [summaryRes, trendsRes] = await Promise.all([
        fetch('/api/analytics/summary'),
        fetch(`/api/analytics/trends?period=${selectedPeriod}`),
      ]);

      const summaryData = await summaryRes.json();
      const trendsData = await trendsRes.json();

      if (summaryData.success) {
        setSummary(summaryData.data);
      }
      if (trendsData.success) {
        setTrends(trendsData.data.daily);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/reports/export?format=csv');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `calls-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <div className="p-8 pt-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-gray-500 mt-2">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const totalSentiment = (summary?.sentimentDistribution.positive || 0) +
    (summary?.sentimentDistribution.neutral || 0) +
    (summary?.sentimentDistribution.negative || 0);

  return (
    <div className="p-8 pt-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Insights from your call recordings and AI analysis
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          
          <button
            onClick={fetchAnalytics}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-sm font-medium hover:from-indigo-500 hover:to-indigo-400 transition-all disabled:opacity-50"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Calls"
          value={summary?.totalCalls || 0}
          subtitle={`${summary?.callsThisMonth || 0} this month`}
          icon={Phone}
          color="indigo"
        />
        <StatsCard
          title="Avg. Duration"
          value={formatDuration(summary?.avgDuration || 0)}
          subtitle={`${formatDuration(summary?.totalDuration || 0)} total`}
          icon={Clock}
          color="purple"
        />
        <StatsCard
          title="Quality Score"
          value={`${summary?.avgQualityScore || 0}/10`}
          subtitle="Average across all calls"
          icon={Star}
          color="yellow"
        />
        <StatsCard
          title="Positive Sentiment"
          value={totalSentiment > 0 
            ? `${Math.round((summary?.sentimentDistribution.positive || 0) / totalSentiment * 100)}%`
            : '0%'
          }
          subtitle={`${summary?.sentimentDistribution.positive || 0} calls`}
          icon={TrendingUp}
          color="green"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Call Volume</h3>
          <p className="text-sm text-gray-500 mb-4">Daily call trends over time</p>
          {trends.length > 0 ? (
            <CallVolumeChart data={trends} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Quality Trend</h3>
          <p className="text-sm text-gray-500 mb-4">Average quality score over time</p>
          {trends.length > 0 ? (
            <QualityTrendChart data={trends} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            Sentiment Distribution
          </h3>
          <p className="text-sm text-gray-500 mb-4">Overall call sentiment breakdown</p>
          <SentimentPieChart data={summary?.sentimentDistribution || { positive: 0, neutral: 0, negative: 0 }} />
          <div className="mt-4 space-y-1 border-t border-gray-100 pt-4">
            <MiniStats label="Positive" value={summary?.sentimentDistribution.positive || 0} color="#22c55e" />
            <MiniStats label="Neutral" value={summary?.sentimentDistribution.neutral || 0} color="#6b7280" />
            <MiniStats label="Negative" value={summary?.sentimentDistribution.negative || 0} color="#ef4444" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Agent Performance
          </h3>
          <p className="text-sm text-gray-500 mb-4">Average scores across all calls</p>
          <AgentPerformanceChart data={summary?.agentPerformance || {
            professionalism: 0,
            helpfulness: 0,
            clarity: 0,
            resolution: 0,
          }} />
          <div className="mt-4 space-y-1 border-t border-gray-100 pt-4">
            <MiniStats label="Professionalism" value={`${summary?.agentPerformance.professionalism || 0}/10`} />
            <MiniStats label="Helpfulness" value={`${summary?.agentPerformance.helpfulness || 0}/10`} />
            <MiniStats label="Clarity" value={`${summary?.agentPerformance.clarity || 0}/10`} />
            <MiniStats label="Resolution" value={`${summary?.agentPerformance.resolution || 0}/10`} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Customer Satisfaction</h3>
          <p className="text-sm text-gray-500 mb-4">Based on AI analysis</p>
          <div className="space-y-4 mt-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Satisfied</span>
                <span className="font-medium text-green-600">{summary?.satisfactionDistribution.satisfied || 0}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${totalSentiment > 0 
                      ? (summary?.satisfactionDistribution.satisfied || 0) / totalSentiment * 100 
                      : 0}%` 
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Neutral</span>
                <span className="font-medium text-yellow-600">{summary?.satisfactionDistribution.neutral || 0}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${totalSentiment > 0 
                      ? (summary?.satisfactionDistribution.neutral || 0) / totalSentiment * 100 
                      : 0}%` 
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Dissatisfied</span>
                <span className="font-medium text-red-600">{summary?.satisfactionDistribution.dissatisfied || 0}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${totalSentiment > 0 
                      ? (summary?.satisfactionDistribution.dissatisfied || 0) / totalSentiment * 100 
                      : 0}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Sentiment Over Time</h3>
          <p className="text-sm text-gray-500 mb-4">Daily sentiment breakdown</p>
          {trends.length > 0 ? (
            <SentimentTrendChart data={trends} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Top Topics</h3>
          <p className="text-sm text-gray-500 mb-4">Most discussed topics in calls</p>
          {(summary?.topTopics?.length || 0) > 0 ? (
            <TopTopicsChart data={summary?.topTopics || []} />
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              No topics data available
            </div>
          )}
        </div>
      </div>

      {/* Keywords Cloud */}
      {(summary?.topKeywords?.length || 0) > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Top Keywords</h3>
          <p className="text-sm text-gray-500 mb-4">Frequently mentioned terms across all calls</p>
          <div className="flex flex-wrap gap-2">
            {summary?.topKeywords.map((item, index) => (
              <span
                key={item.keyword}
                className="px-3 py-1.5 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `rgba(99, 102, 241, ${0.1 + (index < 5 ? 0.1 : 0)})`,
                  color: index < 5 ? '#4f46e5' : '#6366f1',
                  fontSize: `${Math.max(12, 16 - index * 0.5)}px`,
                }}
              >
                {item.keyword} ({item.count})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
