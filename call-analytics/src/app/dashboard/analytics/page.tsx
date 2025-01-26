'use client';

import { useState } from 'react';
import { 
  BarChart, Bar, 
  LineChart, Line, 
  PieChart, Pie, 
  Cell,
  XAxis, YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Calendar, Download, Filter, ChevronUp, ChevronDown } from 'lucide-react';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('calls');

  return (
    <div className="p-8 pt-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Advanced Analytics</h1>
          <p className="text-neutral-500">Deep insights into your call performance</p>
        </div>
        <div className="flex gap-4">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-neutral-200 rounded-lg"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Calls"
          value="2,543"
          change="+15.3%"
          trend="up"
        />
        <MetricCard
          title="Avg. Call Duration"
          value="6m 12s"
          change="-2.1%"
          trend="down"
        />
        <MetricCard
          title="Resolution Rate"
          value="85.2%"
          change="+5.7%"
          trend="up"
        />
        <MetricCard
          title="Customer Satisfaction"
          value="4.8/5"
          change="+0.3"
          trend="up"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsCard title="Call Volume Trends">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="calls" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Call Duration Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={durationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnalyticsCard title="Sentiment Analysis">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Top Call Categories">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard title="Agent Performance">
          <div className="space-y-4">
            {agentData.map((agent) => (
              <div key={agent.name} className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{agent.name}</span>
                  <span className="text-sm text-neutral-500">{agent.calls} calls</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${agent.rating * 20}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AnalyticsCard>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, trend }: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200">
      <h3 className="text-sm font-medium text-neutral-500 mb-2">{title}</h3>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-neutral-900">{value}</span>
        <div className={`flex items-center ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span className="text-sm font-medium">{change}</span>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({ title, children }: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

// Mock data
const volumeData = Array.from({ length: 7 }, (_, i) => ({
  date: `Day ${i + 1}`,
  calls: Math.floor(Math.random() * 100) + 50,
}));

const durationData = [
  { range: '0-2min', count: 250 },
  { range: '2-5min', count: 400 },
  { range: '5-10min', count: 300 },
  { range: '10-15min', count: 200 },
  { range: '15min+', count: 100 },
];

const sentimentData = [
  { name: 'Positive', value: 60 },
  { name: 'Neutral', value: 25 },
  { name: 'Negative', value: 15 },
];

const SENTIMENT_COLORS = ['#22c55e', '#94a3b8', '#ef4444'];

const categoryData = [
  { category: 'Support', count: 450 },
  { category: 'Sales', count: 380 },
  { category: 'Technical', count: 320 },
  { category: 'Billing', count: 280 },
  { category: 'General', count: 220 },
];

const agentData = [
  { name: 'John Smith', calls: 156, rating: 4.8 },
  { name: 'Sarah Johnson', calls: 142, rating: 4.6 },
  { name: 'Michael Brown', calls: 128, rating: 4.4 },
  { name: 'Emma Wilson', calls: 134, rating: 4.7 },
];