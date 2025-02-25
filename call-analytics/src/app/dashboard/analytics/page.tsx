'use client';

import { useState, useEffect } from 'react';
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
  Area,
  Legend
} from 'recharts';
import { 
  Calendar, 
  Download, 
  SlidersHorizontal, 
  ChevronUp, 
  ChevronDown, 
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  ChevronLeft,
  Layers,
  Users,
  ClipboardCheck,
  Star,
  BarChart2,
  PieChart as PieChartIcon,
  Clock,
  Phone,
  MessageSquare,
  ChevronDown as ChevronDownIcon
} from 'lucide-react';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('calls');
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Monitor scroll for header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const metricOptions = [
    { value: 'calls', label: 'Call Volume' },
    { value: 'duration', label: 'Call Duration' },
    { value: 'resolution', label: 'Resolution Rate' },
    { value: 'satisfaction', label: 'Satisfaction' },
  ];

  return (
    <div className="p-8 pt-24 bg-gradient-to-br from-indigo-50/40 to-gray-50 min-h-screen">
      {/* Header with Sticky Tab Navigation */}
      <div className={`${scrolled ? 'shadow-sm bg-white/80 backdrop-blur-sm' : ''} transition-all duration-300 sticky top-16 z-10 -mx-8 px-8 pt-2 pb-0`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
              Advanced Analytics
            </h1>
            <p className="text-gray-500">Comprehensive insights into your communication patterns</p>
          </div>
          <div className="flex flex-wrap gap-3 self-end md:self-auto">
            <div className="relative">
              <button 
                onClick={() => setIsCustomDateOpen(!isCustomDateOpen)}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-indigo-200 hover:text-indigo-600 transition-all"
              >
                <Calendar className="h-4 w-4 text-indigo-500" />
                {selectedPeriod === '7d' && 'Last 7 days'}
                {selectedPeriod === '30d' && 'Last 30 days'}
                {selectedPeriod === '90d' && 'Last 90 days'}
                {selectedPeriod === 'custom' && 'Custom Range'}
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isCustomDateOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCustomDateOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-10">
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    onClick={() => {
                      setSelectedPeriod('7d');
                      setIsCustomDateOpen(false);
                    }}
                  >
                    Last 7 days
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    onClick={() => {
                      setSelectedPeriod('30d');
                      setIsCustomDateOpen(false);
                    }}
                  >
                    Last 30 days
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    onClick={() => {
                      setSelectedPeriod('90d');
                      setIsCustomDateOpen(false);
                    }}
                  >
                    Last 90 days
                  </button>
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    onClick={() => {
                      setSelectedPeriod('custom');
                      setIsCustomDateOpen(false);
                    }}
                  >
                    Custom Range
                  </button>
                </div>
              )}
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:from-indigo-500 hover:to-indigo-400 transition-all duration-200">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-150 ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-indigo-600 hover:border-indigo-200'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-150 ${
              activeTab === 'performance'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-indigo-600 hover:border-indigo-200'
            }`}
            onClick={() => setActiveTab('performance')}
          >
            Performance
          </button>
          <button
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-150 ${
              activeTab === 'customers'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-indigo-600 hover:border-indigo-200'
            }`}
            onClick={() => setActiveTab('customers')}
          >
            Customers
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
        <MetricCard
          title="Total Calls"
          value="2,543"
          change="+15.3%"
          trend="up"
          icon={<Phone className="h-5 w-5" />}
        />
        <MetricCard
          title="Avg. Call Duration"
          value="6m 12s"
          change="-2.1%"
          trend="down"
          icon={<Clock className="h-5 w-5" />}
        />
        <MetricCard
          title="Resolution Rate"
          value="85.2%"
          change="+5.7%"
          trend="up"
          icon={<ClipboardCheck className="h-5 w-5" />}
        />
        <MetricCard
          title="Customer Satisfaction"
          value="4.8/5"
          change="+0.3"
          trend="up"
          icon={<Star className="h-5 w-5" />}
        />
      </div>

      {/* Charts Navigation */}
      <div className="flex overflow-x-auto pb-2 mb-6 -mx-2 px-2">
        {metricOptions.map((option) => (
          <button
            key={option.value}
            className={`px-4 py-2 mr-2 text-sm font-medium rounded-xl whitespace-nowrap transition-all duration-200 ${
              selectedMetric === option.value
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                : 'border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100'
            }`}
            onClick={() => setSelectedMetric(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsCard 
          title="Call Volume Trends" 
          subtitle="Daily trends with historical comparison"
          icon={<BarChart2 className="h-5 w-5" />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={volumeData}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#94A3B8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{fill: '#6B7280'}} axisLine={false} />
              <YAxis tick={{fill: '#6B7280'}} axisLine={false} />
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
                stroke="#6366F1" 
                fillOpacity={1}
                fill="url(#colorCalls)" 
                strokeWidth={2}
                name="Current Period"
              />
              <Area 
                type="monotone" 
                dataKey="previous" 
                stroke="#94A3B8" 
                fillOpacity={1}
                fill="url(#colorPrevious)" 
                strokeWidth={2}
                strokeDasharray="4 4"
                name="Previous Period"
              />
            </AreaChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard 
          title="Call Duration Distribution" 
          subtitle="Time spent on customer interactions"
          icon={<Clock className="h-5 w-5" />}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={durationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="range" tick={{fill: '#6B7280'}} axisLine={false} />
              <YAxis tick={{fill: '#6B7280'}} axisLine={false} />
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
                fill="#6366F1" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="previous" 
                name="Previous Period" 
                fill="#E5E7EB" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <AnalyticsCard 
          title="Sentiment Analysis" 
          subtitle="Voice of the customer"
          icon={<MessageSquare className="h-5 w-5" />}
        >
          <div className="flex items-center justify-center h-64">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index]} />
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
                    <span style={{ color: SENTIMENT_COLORS[index], fontWeight: 500 }}>
                      {value}: {sentimentData[index].value}%
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AnalyticsCard>

        <AnalyticsCard 
          title="Top Call Categories" 
          subtitle="Distribution by conversation type"
          icon={<Layers className="h-5 w-5" />}
        >
          <ResponsiveContainer width="100%" height={250}>
            <BarChart layout="vertical" data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
              <XAxis type="number" tick={{fill: '#6B7280'}} axisLine={false} />
              <YAxis 
                dataKey="category" 
                type="category" 
                width={100} 
                tick={{fill: '#1F2937'}} 
                axisLine={false}
              />
              <Tooltip 
                contentStyle={{
                  borderRadius: '8px', 
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  padding: '10px'
                }}
              />
              <Bar 
                dataKey="count" 
                name="Calls" 
                fill="#6366F1" 
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        <AnalyticsCard 
          title="Agent Performance" 
          subtitle="Team member effectiveness"
          icon={<Users className="h-5 w-5" />}
        >
          <div className="space-y-4 py-2">
            {agentData.map((agent) => (
              <div key={agent.name} className="p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors duration-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{agent.name}</span>
                  <span className="text-sm text-gray-500">{agent.calls} calls</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${agent.rating * 20}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Rating: {agent.rating}/5</span>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < Math.floor(agent.rating) ? 'text-indigo-500' : 'text-gray-300'}`} 
                        fill={i < Math.floor(agent.rating) ? 'currentColor' : 'none'} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnalyticsCard>
      </div>
      
      {/* Additional Metrics */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Performance Insights</h3>
            <p className="text-sm text-gray-500">Key metrics breakdown</p>
          </div>
          <div className="flex gap-2">
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {performanceInsights.map((insight, index) => (
            <div key={index} className="border border-gray-100 rounded-xl p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">{insight.title}</h4>
                  <p className="text-xl font-bold text-gray-900 mt-1">{insight.value}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  insight.changeDirection === 'up' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {insight.changeDirection === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {insight.change}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${insight.changeDirection === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: insight.progress }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, trend, icon }: {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
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
        <span className={`inline-flex items-center text-sm font-medium px-2 py-0.5 rounded-full ${
          trend === 'up' 
            ? 'bg-green-50 text-green-600' 
            : 'bg-red-50 text-red-600'
        }`}>
          {trend === 'up' ? <ChevronUp className="h-3.5 w-3.5 mr-0.5" /> : <ChevronDown className="h-3.5 w-3.5 mr-0.5" />}
          {change}
        </span>
      </div>
    </div>
  );
}

function AnalyticsCard({ title, subtitle, icon, children }: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="p-1.5 bg-indigo-50 rounded-md text-indigo-600 inline-flex">{icon}</span>
            {title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

// Enhanced mock data
const volumeData = Array.from({ length: 7 }, (_, i) => {
  const calls = Math.floor(Math.random() * 100) + 50;
  return {
    date: `Day ${i + 1}`,
    calls: calls,
    previous: calls * (0.85 + Math.random() * 0.3) // Previous period data for comparison
  };
});

const durationData = [
  { range: '0-2min', count: 250, previous: 220 },
  { range: '2-5min', count: 400, previous: 380 },
  { range: '5-10min', count: 300, previous: 320 },
  { range: '10-15min', count: 200, previous: 190 },
  { range: '15min+', count: 100, previous: 90 },
];

const sentimentData = [
  { name: 'Positive', value: 60 },
  { name: 'Neutral', value: 25 },
  { name: 'Negative', value: 15 },
];

const SENTIMENT_COLORS = ['#10B981', '#94A3B8', '#EF4444'];

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

const performanceInsights = [
  { 
    title: 'First Call Resolution', 
    value: '76.3%', 
    change: '4.2%', 
    changeDirection: 'up',
    progress: '76.3%'
  },
  { 
    title: 'Avg. Response Time', 
    value: '45s', 
    change: '12.4%', 
    changeDirection: 'down',
    progress: '45%'
  },
  { 
    title: 'Call Abandonment', 
    value: '3.2%', 
    change: '0.8%', 
    changeDirection: 'down',
    progress: '32%'
  },
  { 
    title: 'Customer Retention', 
    value: '92.7%', 
    change: '2.1%', 
    changeDirection: 'up',
    progress: '92.7%'
  },
];