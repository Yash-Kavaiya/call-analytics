'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Clock,
  FileAudio,
  MessageSquare,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Minus,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';

interface CallData {
  id: string;
  fileName: string;
  fileSize: number;
  status: string;
  audioUrl?: string;
  transcript?: {
    text: string;
    segments: Array<{
      speaker: string;
      text: string;
      startTime: number;
      endTime: number;
    }>;
  };
  sentiment?: string;
  sentimentScore?: number;
  qualityScore?: number;
  summary?: string;
  topics?: string[];
  keywords?: string[];
  duration?: number;
  language?: string;
  analysis?: {
    actionItems?: string[];
    customerSatisfaction?: string;
    agentPerformance?: {
      professionalism: number;
      helpfulness: number;
      clarity: number;
      resolution: number;
    };
  };
  createdAt: string;
  processedAt?: string;
  report?: string;
}

export default function CallDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [call, setCall] = useState<CallData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'transcript' | 'analysis' | 'report'>('transcript');

  useEffect(() => {
    async function fetchCall() {
      try {
        const response = await fetch(`/api/calls/${id}`);
        const data = await response.json();
        if (data.success) {
          setCall(data.data);
          if (data.data.report) {
            setReport(data.data.report);
          }
        }
      } catch (error) {
        console.error('Failed to fetch call:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCall();
  }, [id]);

  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const response = await fetch(`/api/reports/${id}`);
      const data = await response.json();
      if (data.success) {
        setReport(data.data.report);
        setActiveTab('report');
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return <ThumbsUp className="h-5 w-5 text-green-600" />;
      case 'negative':
        return <ThumbsDown className="h-5 w-5 text-red-600" />;
      default:
        return <Minus className="h-5 w-5 text-gray-600" />;
    }
  };

  const getSatisfactionBadge = (satisfaction?: string) => {
    const styles: Record<string, string> = {
      satisfied: 'bg-green-50 text-green-700',
      neutral: 'bg-yellow-50 text-yellow-700',
      dissatisfied: 'bg-red-50 text-red-700',
    };
    return satisfaction ? (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[satisfaction] || 'bg-gray-50 text-gray-700'}`}>
        {satisfaction.charAt(0).toUpperCase() + satisfaction.slice(1)}
      </span>
    ) : null;
  };

  if (isLoading) {
    return (
      <div className="p-8 pt-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-gray-500 mt-2">Loading call details...</p>
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="p-8 pt-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-semibold text-gray-900 mt-4">Call not found</h2>
        <p className="text-gray-500 mt-2">The call you are looking for does not exist.</p>
        <Link
          href="/dashboard/calls"
          className="inline-flex items-center gap-2 mt-4 text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to calls
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 pt-6 max-w-6xl mx-auto">
      {/* Back Button */}
      <Link
        href="/dashboard/calls"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to calls
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FileAudio className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{call.fileName}</h1>
              <p className="text-gray-500 text-sm">
                {new Date(call.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-700">
              <Clock className="h-4 w-4 text-gray-400" />
              {formatDuration(call.duration)}
            </div>
            {call.sentiment && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                call.sentiment === 'positive' ? 'bg-green-50 text-green-700' :
                call.sentiment === 'negative' ? 'bg-red-50 text-red-700' :
                'bg-gray-50 text-gray-700'
              }`}>
                {getSentimentIcon(call.sentiment)}
                {call.sentiment.charAt(0).toUpperCase() + call.sentiment.slice(1)}
              </div>
            )}
            {call.qualityScore && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg text-sm text-indigo-700">
                <BarChart3 className="h-4 w-4" />
                Quality: {call.qualityScore}/10
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Card */}
      {call.summary && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-600" />
            Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{call.summary}</p>
          
          {call.topics && call.topics.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-500 mb-2">Topics Discussed</p>
              <div className="flex flex-wrap gap-2">
                {call.topics.map((topic, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('transcript')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'transcript'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            Transcript
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'analysis'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Analysis
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'report'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Report
          </button>
        </div>

        <div className="p-6">
          {/* Transcript Tab */}
          {activeTab === 'transcript' && (
            <div>
              {call.transcript?.segments && call.transcript.segments.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {call.transcript.segments.map((segment, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="text-xs text-gray-400 pt-1 w-12 flex-shrink-0">
                        {formatTime(segment.startTime)}
                      </div>
                      <div className={`flex-1 p-4 rounded-xl ${
                        segment.speaker === 'agent'
                          ? 'bg-indigo-50 border border-indigo-100'
                          : segment.speaker === 'customer'
                          ? 'bg-gray-50 border border-gray-100'
                          : 'bg-yellow-50 border border-yellow-100'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {segment.speaker === 'agent' ? (
                            <User className="h-4 w-4 text-indigo-600" />
                          ) : (
                            <Users className="h-4 w-4 text-gray-600" />
                          )}
                          <span className={`text-sm font-medium ${
                            segment.speaker === 'agent' ? 'text-indigo-700' : 'text-gray-700'
                          }`}>
                            {segment.speaker.charAt(0).toUpperCase() + segment.speaker.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-700">{segment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : call.transcript?.text ? (
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">{call.transcript.text}</p>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No transcript available</p>
                </div>
              )}
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sentiment & Satisfaction */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Sentiment Analysis</h3>
                  <div className="flex items-center gap-4">
                    <div className={`h-16 w-16 rounded-xl flex items-center justify-center ${
                      call.sentiment === 'positive' ? 'bg-green-50' :
                      call.sentiment === 'negative' ? 'bg-red-50' : 'bg-gray-50'
                    }`}>
                      {getSentimentIcon(call.sentiment)}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900 capitalize">
                        {call.sentiment || 'Unknown'}
                      </p>
                      {call.sentimentScore !== undefined && (
                        <p className="text-sm text-gray-500">
                          Score: {Math.round(call.sentimentScore * 100)}%
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Customer Satisfaction</h3>
                  {getSatisfactionBadge(call.analysis?.customerSatisfaction)}
                </div>

                {call.keywords && call.keywords.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Keywords</h3>
                    <div className="flex flex-wrap gap-2">
                      {call.keywords.map((keyword, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Agent Performance */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Agent Performance</h3>
                {call.analysis?.agentPerformance ? (
                  <div className="space-y-4">
                    {Object.entries(call.analysis.agentPerformance).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 capitalize">{key}</span>
                          <span className="font-medium text-gray-900">{value}/10</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              value >= 7 ? 'bg-green-500' :
                              value >= 4 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${value * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No performance data available</p>
                )}

                {call.analysis?.actionItems && call.analysis.actionItems.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Action Items</h3>
                    <ul className="space-y-2">
                      {call.analysis.actionItems.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Report Tab */}
          {activeTab === 'report' && (
            <div>
              {report ? (
                <div className="prose max-w-none">
                  <div 
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{ 
                      __html: report
                        .replace(/^# /gm, '<h1 class="text-xl font-bold mt-6 mb-3">')
                        .replace(/^## /gm, '<h2 class="text-lg font-semibold mt-5 mb-2">')
                        .replace(/^### /gm, '<h3 class="text-base font-medium mt-4 mb-2">')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/^- /gm, '<li class="ml-4">')
                        .replace(/\n/g, '<br/>')
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No report generated yet</p>
                  <button
                    onClick={generateReport}
                    disabled={isGeneratingReport}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {isGeneratingReport ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4" />
                        Generate Report
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
