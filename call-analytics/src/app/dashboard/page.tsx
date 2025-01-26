'use client';

import { BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon, Activity, Clock, Users, Phone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Mock data for charts
const lineChartData = [
  { name: 'Mon', calls: 120 },
  { name: 'Tue', calls: 150 },
  { name: 'Wed', calls: 180 },
  { name: 'Thu', calls: 140 },
  { name: 'Fri', calls: 160 },
  { name: 'Sat', calls: 90 },
  { name: 'Sun', calls: 70 },
];

const durationData = [
  { duration: '0-2min', calls: 250 },
  { duration: '2-5min', calls: 400 },
  { duration: '5-10min', calls: 300 },
  { duration: '10-15min', calls: 200 },
  { duration: '15min+', calls: 100 },
];

const sentimentData = [
  { name: 'Positive', value: 60 },
  { name: 'Neutral', value: 25 },
  { name: 'Negative', value: 15 },
];

const topicData = [
  { topic: 'Support', count: 450 },
  { topic: 'Sales', count: 380 },
  { topic: 'Billing', count: 320 },
  { topic: 'Technical', count: 280 },
  { topic: 'Other', count: 120 },
];

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];

export default function Dashboard() {
  return (
    <div className="p-8 pt-24">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Analytics Dashboard</h1>
          <p className="text-neutral-500">Overview of your call analytics</p>
        </div>
        <div className="flex gap-4">
          <select className="bg-white border border-neutral-200 rounded-lg px-4 py-2 text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700">
            Export Report
          </button>
        </div>
      </div>
        
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Calls"
          value="1,234"
          change="+12%"
          icon={<Phone className="h-6 w-6" />}
        />
        <StatCard
          title="Average Duration"
          value="5m 23s"
          change="-2%"
          icon={<Clock className="h-6 w-6" />}
        />
        <StatCard
          title="Active Users"
          value="892"
          change="+5%"
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Engagement Score"
          value="8.5"
          change="+3%"
          icon={<Activity className="h-6 w-6" />}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Call Volume Trends"
          subtitle="Daily call volume over time"
          icon={<LineChartIcon className="h-5 w-5" />}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="calls" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Call Duration Distribution"
          subtitle="Distribution of call lengths"
          icon={<BarChartIcon className="h-5 w-5" />}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={durationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="duration" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Sentiment Analysis"
          subtitle="Customer sentiment distribution"
          icon={<PieChartIcon className="h-5 w-5" />}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Topic Distribution"
          subtitle="Common topics in conversations"
          icon={<BarChartIcon className="h-5 w-5" />}
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="topic" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon }: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) {
  const isPositive = change.startsWith('+');
  
  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-neutral-600">{title}</span>
        <div className="p-2 bg-purple-50 rounded-lg">
          <span className="text-purple-600">{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-neutral-900">{value}</span>
        <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {change}
        </span>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, icon, children }: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-neutral-200 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          <p className="text-sm text-neutral-500">{subtitle}</p>
        </div>
        <div className="p-2 bg-purple-50 rounded-lg">
          <span className="text-purple-600">{icon}</span>
        </div>
      </div>
      {children}
    </div>
  );
}