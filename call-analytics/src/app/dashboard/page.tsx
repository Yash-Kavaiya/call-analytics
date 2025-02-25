'use client';

import { 
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  Activity, 
  Clock, 
  Users, 
  Phone,
  Download,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  Area,
  AreaChart 
} from 'recharts';
import { useState } from 'react';

// Enhanced mock data for charts
const lineChartData = [
  { name: 'Mon', calls: 120, average: 90 },
  { name: 'Tue', calls: 150, average: 95 },
  { name: 'Wed', calls: 180, average: 100 },
  { name: 'Thu', calls: 140, average: 105 },
  { name: 'Fri', calls: 160, average: 100 },
  { name: 'Sat', calls: 90, average: 85 },
  { name: 'Sun', calls: 70, average: 80 },
];

const durationData = [
  { duration: '0-2min', calls: 250, previous: 220 },
  { duration: '2-5min', calls: 400, previous: 380 },
  { duration: '5-10min', calls: 300, previous: 290 },
  { duration: '10-15min', calls: 200, previous: 190 },
  { duration: '15min+', calls: 100, previous: 110 },
];

const sentimentData = [
  { name: 'Positive', value: 60 },
  { name: 'Neutral', value: 25 },
  { name: 'Negative', value: 15 },
];

const topicData = [
  { topic: 'Support', count: 450, previous: 420 },
  { topic: 'Sales', count: 380, previous: 350 },
  { topic: 'Billing', count: 320, previous: 300 },
  { topic: 'Technical', count: 280, previous: 260 },
  { topic: 'Other', count: 120, previous: 110 },
];

// Enhanced color palette
const COLORS = {
  primary: '#6366F1',
  primaryLight: '#8183FF',
  primaryDark: '#4F46E5',
  secondary: '#F59E0B',
  success: '#10B981',
  danger: '#EF4444',
  neutral: '#6B7280',
  neutralLight: '#E5E7EB',
  background: '#F9FAFB',
  cardBg: '#FFFFFF',
  text: '#1F2937',
  textLight: '#6B7280',
};

const CHART_COLORS = ['#6366F1', '#8183FF', '#A5B4FC', '#C7D2FE', '#E0E7FF'];
const SENTIMENT_COLORS = ['#10B981', '#94A3B8', '#EF4444'];

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-gray-50">
      <div className="p-8 pt-24 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
              Analytics Pro
            </h1>
            <p className="text-gray-500 mt-1">Comprehensive insights for your communication data</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <button 
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <Calendar className="h-4 w-4 text-indigo-500" />
                {timeRange === '7d' && 'Last 7 days'}
                {timeRange === '30d' && 'Last 30 days'}
                {timeRange === '90d' && 'Last 90 days'}
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    onClick={() => {
                      setTimeRange('7d');
                      setDropdownOpen(false);
                    }}
                  >
                    Last 7 days
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    onClick={() => {
                      setTimeRange('30d');
                      setDropdownOpen(false);
                    }}
                  >
                    Last 30 days
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    onClick={() => {
                      setTimeRange('90d');
                      setDropdownOpen(false);
                    }}
                  >
                    Last 90 days
                  </button>
                </div>
              )}
            </div>
            
            <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300">
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>
          
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Calls"
            value="1,234"
            change="+12%"
            icon={<Phone className="h-5 w-5" />}
            positive
          />
          <StatCard
            title="Average Duration"
            value="5m 23s"
            change="-2%"
            icon={<Clock className="h-5 w-5" />}
            positive={false}
          />
          <StatCard
            title="Active Users"
            value="892"
            change="+5%"
            icon={<Users className="h-5 w-5" />}
            positive
          />
          <StatCard
            title="Engagement Score"
            value="8.5"
            change="+3%"
            icon={<Activity className="h-5 w-5" />}
            positive
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard
            title="Call Volume Trends"
            subtitle="Daily call volume with historical average"
            icon={<LineChartIcon className="h-5 w-5" />}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lineChartData}>
                  <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{fill: COLORS.textLight}} axisLine={false} />
                  <YAxis tick={{fill: COLORS.textLight}} axisLine={false} />
                  <Tooltip 
                    contentStyle={{
                      borderRadius: '8px', 
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      padding: '10px'
                    }}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="calls" 
                    stroke={COLORS.primary} 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorCalls)"
                    activeDot={{ r: 8 }} 
                    name="Current"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke={COLORS.secondary} 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Historical Average"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard
            title="Call Duration Distribution"
            subtitle="Length of calls compared to previous period"
            icon={<BarChartIcon className="h-5 w-5" />}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="duration" tick={{fill: COLORS.textLight}} axisLine={false} />
                  <YAxis tick={{fill: COLORS.textLight}} axisLine={false} />
                  <Tooltip 
                    contentStyle={{
                      borderRadius: '8px', 
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      padding: '10px'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="calls" 
                    fill={COLORS.primary} 
                    radius={[4, 4, 0, 0]} 
                    name="Current Period"
                  />
                  <Bar 
                    dataKey="previous" 
                    fill={COLORS.neutralLight} 
                    radius={[4, 4, 0, 0]} 
                    name="Previous Period"
                  />
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
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                    contentStyle={{
                      borderRadius: '8px', 
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      padding: '10px'
                    }}
                  />
                  <Legend 
                    formatter={(value, entry, index) => (
                      <span className="text-sm font-medium" style={{ color: COLORS.text }}>
                        {value}: {sentimentData[index].value}%
                      </span>
                    )}
                  />
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
                <BarChart 
                  data={topicData}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={true} vertical={false} />
                  <XAxis type="number" tick={{fill: COLORS.textLight}} axisLine={false} />
                  <YAxis 
                    dataKey="topic" 
                    type="category" 
                    tick={{fill: COLORS.text}} 
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip 
                    contentStyle={{
                      borderRadius: '8px', 
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      padding: '10px'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="count" 
                    name="Current Period" 
                    fill={COLORS.primary}
                    radius={[0, 4, 4, 0]} 
                  />
                  <Bar 
                    dataKey="previous" 
                    name="Previous Period" 
                    fill={COLORS.neutralLight}
                    radius={[0, 4, 4, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon, positive }: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  positive: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 font-medium">{title}</span>
        <div className="p-2.5 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors duration-300">
          <span className="text-indigo-600">{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
          positive 
            ? 'bg-green-50 text-green-600' 
            : 'bg-red-50 text-red-600'
        }`}>
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
    <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="p-2.5 bg-indigo-50 rounded-lg">
          <span className="text-indigo-600">{icon}</span>
        </div>
      </div>
      {children}
    </div>
  );
}