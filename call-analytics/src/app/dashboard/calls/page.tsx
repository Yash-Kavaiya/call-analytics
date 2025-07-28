'use client';

import { useState } from 'react';
import { 
  Phone, 
  Search, 
  SlidersHorizontal, 
  Download, 
  Clock, 
  User, 
  Tag, 
  AlertCircle,
  Info,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Headphones,
  Play,
  BarChart3,
  Calendar
} from 'lucide-react';

interface CallData {
  id: number;
  phone: string;
  date: string;
  duration: string;
  agent: string;
  category: string;
  sentiment: string;
}

export default function Calls() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallData | null>(null);

  return (
    <div className="p-8 pt-24 bg-gradient-to-br from-indigo-50/40 to-gray-50 min-h-screen">
      {selectedCall ? (
        <CallDetails call={selectedCall} onBack={() => setSelectedCall(null)} />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
                Call History
              </h1>
              <p className="text-gray-500 mt-1">Analyze conversations and extract insights</p>
            </div>
            <div className="flex gap-3 self-end md:self-auto">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filterOpen 
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                    : 'border border-gray-200 text-gray-600 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-200 ${filterOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:from-indigo-500 hover:to-indigo-400 transition-all duration-200">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-6 transition-all duration-300">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by phone number, agent or keywords..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                />
              </div>
              
              <div className="relative">
                <Calendar className="h-4 w-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select className="appearance-none pl-10 pr-9 py-2.5 border border-gray-200 text-sm text-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                  <option>All Time</option>
                  <option>Today</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Custom Range</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Filters Panel */}
            <div 
              className={`grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100 overflow-hidden transition-all duration-300 ${
                filterOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0 invisible'
              }`}
            >
              <div className="relative">
                <User className="h-4 w-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select className="appearance-none pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                  <option>All Agents</option>
                  <option>John Smith</option>
                  <option>Sarah Johnson</option>
                  <option>Michael Brown</option>
                  <option>Emma Wilson</option>
                  <option>James Davis</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <Tag className="h-4 w-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select className="appearance-none pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                  <option>All Categories</option>
                  <option>Support</option>
                  <option>Sales</option>
                  <option>Technical</option>
                  <option>Billing</option>
                  <option>General</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <AlertCircle className="h-4 w-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select className="appearance-none pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                  <option>All Sentiments</option>
                  <option>Positive</option>
                  <option>Neutral</option>
                  <option>Negative</option>
                </select>
                <ChevronDown className="h-4 w-4 absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Calls Table */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Call Details</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {callData.map((call) => (
                    <tr key={call.id} className="hover:bg-indigo-50/40 transition-colors duration-150">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                            <Phone className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{call.phone}</div>
                            <div className="text-xs text-gray-500">{call.date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{call.duration}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <div className="h-5 w-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                            <User className="h-3 w-3" />
                          </div>
                          <span>{call.agent}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                          {call.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          call.sentiment === 'Positive' ? 'bg-green-50 text-green-700' :
                          call.sentiment === 'Negative' ? 'bg-red-50 text-red-700' :
                          'bg-gray-50 text-gray-700'
                        }`}>
                          {call.sentiment}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => setSelectedCall(call)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-800">1-10</span> of <span className="font-medium text-gray-800">100</span> calls
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-600 border-indigo-100">
                  1
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200">
                  2
                </button>
                <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200">
                  3
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface CallDetailsProps {
  call: CallData;
  onBack: () => void;
}

function CallDetails({ call, onBack }: CallDetailsProps) {
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  
  // Mock transcription data
  const transcription = [
    { time: '0:05', speaker: 'Agent', text: 'Thank you for calling customer support. My name is John. How can I help you today?' },
    { time: '0:12', speaker: 'Customer', text: 'Hi John, I\'m having trouble with my recent order. It shows as delivered but I haven\'t received it yet.' },
    { time: '0:20', speaker: 'Agent', text: 'I\'m sorry to hear that. Let me look into this for you right away. Can you please provide your order number?' },
    { time: '0:25', speaker: 'Customer', text: 'Sure, it\'s #ORD-45892.' },
    { time: '0:35', speaker: 'Agent', text: 'Thank you. I can see that your order was marked as delivered yesterday at 2:15 PM. Let me check the delivery details...' },
    { time: '0:50', speaker: 'Agent', text: 'It looks like it was left at the front desk of your building. Does that sound correct?' },
    { time: '0:55', speaker: 'Customer', text: 'Oh, I haven\'t checked with the front desk. That might explain it.' },
    { time: '1:05', speaker: 'Agent', text: 'No problem at all. Would you like me to arrange a redelivery or would you prefer to check with your front desk first?' },
  ];
  
  // Mock metrics data
  const metrics = {
    talkTime: { agent: '65%', customer: '35%' },
    keywords: ['order', 'delivery', 'front desk', 'redelivery'],
    topics: [
      { name: 'Order Status', percentage: 45 },
      { name: 'Delivery Issues', percentage: 35 },
      { name: 'Customer Service', percentage: 20 }
    ]
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Navigation */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to all calls</span>
      </button>
      
      {/* Call header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{call.phone}</h2>
              <p className="text-gray-500">{call.date}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <div className="px-3 py-1.5 rounded-full text-sm bg-indigo-50 text-indigo-700 flex items-center gap-2">
              <User className="h-3.5 w-3.5" />
              {call.agent}
            </div>
            <div className="px-3 py-1.5 rounded-full text-sm bg-indigo-50 text-indigo-700 flex items-center gap-2">
              <Tag className="h-3.5 w-3.5" />
              {call.category}
            </div>
            <div className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-2 ${
              call.sentiment === 'Positive' ? 'bg-green-50 text-green-700' :
              call.sentiment === 'Negative' ? 'bg-red-50 text-red-700' :
              'bg-gray-50 text-gray-700'
            }`}>
              <AlertCircle className="h-3.5 w-3.5" />
              {call.sentiment} Sentiment
            </div>
            <div className="px-3 py-1.5 rounded-full text-sm bg-indigo-50 text-indigo-700 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              {call.duration}
            </div>
          </div>
        </div>
      </div>
      
      {/* Audio player */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Headphones className="h-5 w-5 text-indigo-600" />
            Call Recording
          </h3>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors">
            Download Audio
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className={`h-10 w-10 rounded-full flex items-center justify-center ${
              isPlaying ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-600'
            }`}
          >
            {isPlaying ? <span className="h-3 w-3 bg-white rounded-sm"></span> : <Play className="h-5 w-5" />}
          </button>
          
          <div className="flex-1">
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${(currentTime / duration) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0:00</span>
              <span>{call.duration}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Transcription and metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transcription */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="h-5 w-5 text-indigo-600" />
            Call Transcription
          </h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {transcription.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="text-xs text-gray-500 pt-1 w-10 flex-shrink-0">
                  {item.time}
                </div>
                <div className={`flex-1 p-3 rounded-lg text-sm ${
                  item.speaker === 'Agent' 
                    ? 'bg-indigo-50 text-indigo-900' 
                    : 'bg-gray-50 text-gray-900'
                }`}>
                  <div className="font-medium mb-1">{item.speaker}</div>
                  <div>{item.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Call Metrics */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-600" />
            Call Metrics
          </h3>
          
          <div className="space-y-6">
            {/* Talk time */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Talk Time Distribution</h4>
              <div className="flex gap-2 items-center mb-1.5">
                <div className="h-3 rounded-full bg-indigo-500" style={{ width: metrics.talkTime.agent }}></div>
                <div className="h-3 rounded-full bg-gray-300" style={{ width: metrics.talkTime.customer }}></div>
              </div>
              <div className="flex text-xs">
                <div className="flex-1">
                  <span className="inline-block h-2 w-2 bg-indigo-500 rounded-full mr-1"></span>
                  Agent ({metrics.talkTime.agent})
                </div>
                <div className="flex-1 text-right">
                  <span className="inline-block h-2 w-2 bg-gray-300 rounded-full mr-1"></span>
                  Customer ({metrics.talkTime.customer})
                </div>
              </div>
            </div>
            
            {/* Keywords */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Key Terms</h4>
              <div className="flex flex-wrap gap-2">
                {metrics.keywords.map((keyword, index) => (
                  <span key={index} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Topics */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Topics Discussed</h4>
              <div className="space-y-2">
                {metrics.topics.map((topic, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{topic.name}</span>
                      <span>{topic.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full">
                      <div 
                        className="h-1.5 bg-indigo-500 rounded-full" 
                        style={{ width: `${topic.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock call data
const callData = [
  {
    id: 1,
    phone: '+1 (555) 123-4567',
    date: '2024-01-20 10:30 AM',
    duration: '5m 23s',
    agent: 'John Smith',
    category: 'Support',
    sentiment: 'Positive'
  },
  {
    id: 2,
    phone: '+1 (555) 234-5678',
    date: '2024-01-20 11:15 AM',
    duration: '3m 45s',
    agent: 'Sarah Johnson',
    category: 'Sales',
    sentiment: 'Neutral'
  },
  {
    id: 3,
    phone: '+1 (555) 345-6789',
    date: '2024-01-20 12:00 PM',
    duration: '8m 12s',
    agent: 'Michael Brown',
    category: 'Technical',
    sentiment: 'Negative'
  },
  // Add more mock data as needed...
].concat(Array(7).fill(null).map((_, i) => ({
  id: i + 4,
  phone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
  date: '2024-01-20 ' + (Math.floor(Math.random() * 12) + 1) + ':' + Math.floor(Math.random() * 60) + ' ' + (Math.random() > 0.5 ? 'AM' : 'PM'),
  duration: Math.floor(Math.random() * 10) + 'm ' + Math.floor(Math.random() * 60) + 's',
  agent: ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emma Wilson', 'James Davis'][Math.floor(Math.random() * 5)],
  category: ['Support', 'Sales', 'Technical', 'Billing', 'General'][Math.floor(Math.random() * 5)],
  sentiment: ['Positive', 'Neutral', 'Negative'][Math.floor(Math.random() * 3)]
})));