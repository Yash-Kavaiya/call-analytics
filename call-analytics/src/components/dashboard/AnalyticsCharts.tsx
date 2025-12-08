'use client';

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
  BarChart,
  Bar,
  Legend,
} from 'recharts';

interface TrendData {
  date: string;
  calls: number;
  avgQuality: number;
  positive: number;
  neutral: number;
  negative: number;
}

interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

const SENTIMENT_COLORS = {
  positive: '#22c55e',
  neutral: '#6b7280',
  negative: '#ef4444',
};

const SATISFACTION_COLORS = {
  satisfied: '#22c55e',
  neutral: '#f59e0b',
  dissatisfied: '#ef4444',
};

export function CallVolumeChart({ data }: { data: TrendData[] }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
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
  );
}

export function QualityTrendChart({ data }: { data: TrendData[] }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="qualityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis 
            domain={[0, 10]}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
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
            dataKey="avgQuality"
            stroke="#22c55e"
            strokeWidth={2}
            fill="url(#qualityGradient)"
            name="Quality Score"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SentimentPieChart({ data }: { data: SentimentData }) {
  const chartData = [
    { name: 'Positive', value: data.positive, color: SENTIMENT_COLORS.positive },
    { name: 'Neutral', value: data.neutral, color: SENTIMENT_COLORS.neutral },
    { name: 'Negative', value: data.negative, color: SENTIMENT_COLORS.negative },
  ].filter(item => item.value > 0);

  const total = data.positive + data.neutral + data.negative;

  if (total === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-gray-400">
        No sentiment data available
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value: number) => [
              `${value} (${Math.round((value / total) * 100)}%)`,
              'Calls',
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => (
              <span className="text-sm text-gray-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SentimentTrendChart({ data }: { data: TrendData[] }) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          <Legend />
          <Bar dataKey="positive" stackId="a" fill={SENTIMENT_COLORS.positive} name="Positive" />
          <Bar dataKey="neutral" stackId="a" fill={SENTIMENT_COLORS.neutral} name="Neutral" />
          <Bar dataKey="negative" stackId="a" fill={SENTIMENT_COLORS.negative} name="Negative" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface AgentPerformanceData {
  professionalism: number;
  helpfulness: number;
  clarity: number;
  resolution: number;
}

export function AgentPerformanceChart({ data }: { data: AgentPerformanceData }) {
  const chartData = [
    { metric: 'Professionalism', score: data.professionalism },
    { metric: 'Helpfulness', score: data.helpfulness },
    { metric: 'Clarity', score: data.clarity },
    { metric: 'Resolution', score: data.resolution },
  ];

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 80, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" domain={[0, 10]} tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis 
            type="category" 
            dataKey="metric" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Bar 
            dataKey="score" 
            fill="#6366f1" 
            radius={[0, 4, 4, 0]}
            name="Score"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TopicData {
  topic: string;
  count: number;
}

export function TopTopicsChart({ data }: { data: TopicData[] }) {
  const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6'];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.slice(0, 8)} layout="vertical" margin={{ top: 10, right: 30, left: 100, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis 
            type="category" 
            dataKey="topic" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            width={90}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="count" name="Mentions" radius={[0, 4, 4, 0]}>
            {data.slice(0, 8).map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
