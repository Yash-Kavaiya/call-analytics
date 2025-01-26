'use client';

import { useState } from 'react';
import { Phone, Search, Filter, Download, Clock, User, Tag, AlertCircle } from 'lucide-react';

export default function Calls() {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="p-8 pt-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Call History</h1>
          <p className="text-neutral-500">View and analyze your call recordings</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-neutral-200 mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search calls..."
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
          <select className="px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
            <option>All Time</option>
            <option>Today</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>

        {/* Filters Panel */}
        {filterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
            <select className="px-4 py-2 border border-neutral-200 rounded-lg">
              <option>All Agents</option>
              <option>Team A</option>
              <option>Team B</option>
            </select>
            <select className="px-4 py-2 border border-neutral-200 rounded-lg">
              <option>All Categories</option>
              <option>Support</option>
              <option>Sales</option>
              <option>Technical</option>
            </select>
            <select className="px-4 py-2 border border-neutral-200 rounded-lg">
              <option>All Sentiments</option>
              <option>Positive</option>
              <option>Neutral</option>
              <option>Negative</option>
            </select>
          </div>
        )}
      </div>

      {/* Calls Table */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Call Details</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Duration</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Agent</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Category</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Sentiment</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {callData.map((call) => (
              <tr key={call.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-neutral-400" />
                    <div>
                      <div className="font-medium text-neutral-900">{call.phone}</div>
                      <div className="text-sm text-neutral-500">{call.date}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-neutral-400" />
                    <span>{call.duration}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-neutral-400" />
                    <span>{call.agent}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-neutral-400" />
                    <span>{call.category}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    call.sentiment === 'Positive' ? 'bg-green-100 text-green-700' :
                    call.sentiment === 'Negative' ? 'bg-red-100 text-red-700' :
                    'bg-neutral-100 text-neutral-700'
                  }`}>
                    {call.sentiment}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-purple-600 hover:text-purple-700">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            Showing 1 to 10 of 100 calls
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50">
              Previous
            </button>
            <button className="px-4 py-2 border border-neutral-200 rounded-lg hover:bg-neutral-50">
              Next
            </button>
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
