'use client';

import { useState, useEffect } from 'react';
import { 
  Phone,
  Clock,
  TrendingUp,
  Star,
  FileAudio,
  ArrowRight,
  Loader2,
  Upload,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
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

interface DashboardStats {
  totalCalls: number;
  callsThisMonth: number;
  avgDuration: number;
  avgQualityScore: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

interface RecentCall {
  id: string;
  fileName: string;
  status: string;
  sentiment?: string;
  qualityScore?: number;
  duration?: number;
  createdAt: string;
}

interface TrendData {
  date: string;
  calls: number;
}

const SENTIMENT_COLORS = ['#22c55e', '#6b7280', '#ef4444'];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [summaryRes, callsRes, trendsRes] = await Promise.all([
          fetch('/api/analytics/summary'),
          fetch('/api/calls?limit=5'),
          fetch('/api/analytics/trends?period=7'),
        ]);

        const summaryData = await summaryRes.json();
        const callsData = await callsRes.json();
        const trendsData = await trendsRes.json();

        if (summaryData.success) {
          setStats(summaryData.data);
        }
        if (callsData.success) {
          setRecentCalls(callsData.data);
        }
        if (trendsData.success) {
          setTrends(trendsData.data.daily);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '0m 0s';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="p-8 pt-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-gray-500 mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const sentimentData = stats ? [
    { name: 'Positive', value: stats.sentimentDistribution.positive },
    { name: 'Neutral', value: stats.sentimentDistribution.neutral },
    { name: 'Negative', value: stats.sentimentDistribution.negative },
  ].filter(d => d.value > 0) : [];

  const totalSentiment = sentimentData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="p-8 pt-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your call analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.totalCalls || 0}</p>
              <p className="text-sm text-gray-500 mt-1">{stats?.callsThisMonth || 0} this month</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Phone className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Duration</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{formatDuration(stats?.avgDuration)}</p>
              <p className="text-sm text-gray-500 mt-1">Per call</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Quality Score</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.avgQualityScore || 0}/10</p>
              <p className="text-sm text-gray-500 mt-1">Average</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Positive Calls</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {totalSentiment > 0 
                  ? `${Math.round((stats?.sentimentDistribution.positive || 0) / totalSentiment * 100)}%`
                  : '0%'
                }
              </p>
              <p className="text-sm text-gray-500 mt-1">{stats?.sentimentDistribution.positive || 0} calls</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Call Volume Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Call Volume</h3>
              <p className="text-sm text-gray-500">Last 7 days</p>
            </div>
            <Link 
              href="/dashboard/analytics"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
            >
              View Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {trends.length > 0 ? (
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends}>
                  <defs>
                    <linearGradient id="callsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                    labelFormatter={formatDate}
                  />
                  <Area
                    type="monotone"
                    dataKey="calls"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fill="url(#callsGradient)"
                    name="Calls"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No data available yet</p>
              </div>
            </div>
          )}
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Sentiment</h3>
          <p className="text-sm text-gray-500 mb-4">Distribution</p>
          {sentimentData.length > 0 ? (
            <>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-gray-600">Positive</span>
                  </div>
                  <span className="font-medium">{stats?.sentimentDistribution.positive || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500" />
                    <span className="text-gray-600">Neutral</span>
                  </div>
                  <span className="font-medium">{stats?.sentimentDistribution.neutral || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-gray-600">Negative</span>
                  </div>
                  <span className="font-medium">{stats?.sentimentDistribution.negative || 0}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No sentiment data yet</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Calls */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Calls</h3>
            <p className="text-sm text-gray-500">Latest uploaded and processed calls</p>
          </div>
          <Link 
            href="/dashboard/calls"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {recentCalls.length === 0 ? (
          <div className="p-12 text-center">
            <FileAudio className="h-12 w-12 text-gray-300 mx-auto" />
            <p className="text-gray-500 mt-3">No calls uploaded yet</p>
            <p className="text-sm text-gray-400 mb-4">Upload your first call to get started</p>
            <Link
              href="/dashboard/files"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              Upload Calls
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentCalls.map((call) => (
              <div key={call.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <FileAudio className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{call.fileName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(call.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {call.sentiment && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        call.sentiment === 'positive' ? 'bg-green-50 text-green-700' :
                        call.sentiment === 'negative' ? 'bg-red-50 text-red-700' :
                        'bg-gray-50 text-gray-700'
                      }`}>
                        {call.sentiment}
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      call.status === 'completed' ? 'bg-green-50 text-green-700' :
                      call.status === 'failed' ? 'bg-red-50 text-red-700' :
                      'bg-indigo-50 text-indigo-700'
                    }`}>
                      {call.status}
                    </span>
                  </div>
                  {call.status === 'completed' && (
                    <Link
                      href={`/dashboard/calls/${call.id}`}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      View
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
