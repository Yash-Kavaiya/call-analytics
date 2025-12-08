'use client';

import { useState, useEffect } from 'react';
import { 
  Phone, 
  Search, 
  SlidersHorizontal, 
  Download, 
  Clock, 
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  FileAudio,
  Eye,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

interface Call {
  id: string;
  fileName: string;
  fileSize: number;
  status: string;
  sentiment?: string;
  sentimentScore?: number;
  qualityScore?: number;
  summary?: string;
  topics?: string[];
  duration?: number;
  createdAt: string;
  processedAt?: string;
}

export default function CallsPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isExporting, setIsExporting] = useState(false);

  const fetchCalls = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/calls?limit=50');
      const data = await response.json();
      if (data.success) {
        setCalls(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch calls:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (sentimentFilter !== 'all') params.set('sentiment', sentimentFilter);
      
      const response = await fetch(`/api/reports/export?${params.toString()}`);
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

  // Filter calls
  const filteredCalls = calls.filter(call => {
    const matchesSearch = searchQuery === '' || 
      call.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.topics?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesSentiment = sentimentFilter === 'all' || call.sentiment === sentimentFilter;
    const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
    
    return matchesSearch && matchesSentiment && matchesStatus;
  });

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-green-50 text-green-700',
      processing: 'bg-indigo-50 text-indigo-700',
      transcribing: 'bg-purple-50 text-purple-700',
      analyzing: 'bg-violet-50 text-violet-700',
      failed: 'bg-red-50 text-red-700',
      uploading: 'bg-yellow-50 text-yellow-700',
    };

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-50 text-gray-700'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getSentimentBadge = (sentiment?: string) => {
    if (!sentiment) return null;
    
    const styles: Record<string, string> = {
      positive: 'bg-green-50 text-green-700',
      neutral: 'bg-gray-50 text-gray-700',
      negative: 'bg-red-50 text-red-700',
    };

    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[sentiment] || ''}`}>
        {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-8 pt-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call History</h1>
          <p className="text-gray-500 mt-1">View and analyze all processed calls</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchCalls}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              filterOpen 
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                : 'border border-gray-200 text-gray-600 hover:border-indigo-200 hover:text-indigo-600'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${filterOpen ? 'rotate-180' : ''}`} />
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
            Export
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by file name, summary, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Filters Panel */}
        {filterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 mt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sentiment</label>
              <select
                value={sentimentFilter}
                onChange={(e) => setSentimentFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Sentiments</option>
                <option value="positive">Positive</option>
                <option value="neutral">Neutral</option>
                <option value="negative">Negative</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Calls Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
            <p className="text-gray-500 mt-2">Loading calls...</p>
          </div>
        ) : filteredCalls.length === 0 ? (
          <div className="p-12 text-center">
            <FileAudio className="h-12 w-12 text-gray-300 mx-auto" />
            <p className="text-gray-500 mt-3">No calls found</p>
            <p className="text-sm text-gray-400">
              {calls.length === 0 
                ? 'Upload your first call recording to get started'
                : 'Try adjusting your filters'}
            </p>
            {calls.length === 0 && (
              <Link
                href="/dashboard/files"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Upload Calls
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Call</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality</th>
                    <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCalls.map((call) => (
                    <tr key={call.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                            <FileAudio className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 truncate max-w-[200px]">
                              {call.fileName}
                            </div>
                            <div className="text-xs text-gray-500">{formatDate(call.createdAt)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>{formatDuration(call.duration)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(call.status)}
                      </td>
                      <td className="px-6 py-4">
                        {getSentimentBadge(call.sentiment)}
                      </td>
                      <td className="px-6 py-4">
                        {call.qualityScore ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-100 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  call.qualityScore >= 7 ? 'bg-green-500' :
                                  call.qualityScore >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${call.qualityScore * 10}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{call.qualityScore}/10</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {call.status === 'completed' ? (
                          <Link
                            href={`/dashboard/calls/${call.id}`}
                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        ) : call.status === 'failed' ? (
                          <span className="flex items-center gap-1 text-red-500 text-sm">
                            <AlertCircle className="h-4 w-4" />
                            Failed
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-400 text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-800">{filteredCalls.length}</span> calls
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
