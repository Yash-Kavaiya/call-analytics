'use client';

import { useState, useEffect, use } from 'react';
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
  Download,
  Play,
  Pause,
  TrendingUp,
  Target,
  Zap,
  Award,
  Tag,
  ListChecks,
  Sparkles,
  Volume2,
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
  const [call, setCall] = useState<CallData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'transcript' | 'report'>('overview');
  const [isPlaying, setIsPlaying] = useState(false);

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
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-600';
    if (score >= 6) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return 'bg-emerald-500';
    if (score >= 6) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getSentimentConfig = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return { icon: ThumbsUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'Positive' };
      case 'negative':
        return { icon: ThumbsDown, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Negative' };
      default:
        return { icon: Minus, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Neutral' };
    }
  };

  const getSatisfactionConfig = (satisfaction?: string) => {
    switch (satisfaction) {
      case 'satisfied':
        return { color: 'text-emerald-700', bg: 'bg-emerald-100', icon: '😊' };
      case 'dissatisfied':
        return { color: 'text-red-700', bg: 'bg-red-100', icon: '😞' };
      default:
        return { color: 'text-amber-700', bg: 'bg-amber-100', icon: '😐' };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-pulse"></div>
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-500 mt-4 font-medium">Loading call analysis...</p>
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900 mt-4">Call Not Found</h2>
          <p className="text-gray-500 mt-2">The call you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            href="/dashboard/calls"
            className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Calls
          </Link>
        </div>
      </div>
    );
  }

  const sentimentConfig = getSentimentConfig(call.sentiment);
  const satisfactionConfig = getSatisfactionConfig(call.analysis?.customerSatisfaction);
  const avgPerformance = call.analysis?.agentPerformance
    ? Math.round((call.analysis.agentPerformance.professionalism + call.analysis.agentPerformance.helpfulness + call.analysis.agentPerformance.clarity + call.analysis.agentPerformance.resolution) / 4 * 10) / 10
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard/calls"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Calls</span>
        </Link>

        {/* Hero Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-6 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <FileAudio className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{call.fileName}</h1>
                  <p className="text-indigo-100 mt-1">
                    {new Date(call.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {call.audioUrl && (
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur text-white rounded-xl hover:bg-white/30 transition-colors"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? 'Pause' : 'Play Audio'}
                  </button>
                )}
                <button
                  onClick={generateReport}
                  disabled={isGeneratingReport}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors font-medium disabled:opacity-50"
                >
                  {isGeneratingReport ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isGeneratingReport ? 'Generating...' : 'Export Report'}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-1">
                <Clock className="h-4 w-4" />
                Duration
              </div>
              <p className="text-xl font-bold text-gray-900">{formatDuration(call.duration)}</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-1">
                <Volume2 className="h-4 w-4" />
                Language
              </div>
              <p className="text-xl font-bold text-gray-900">{call.language?.toUpperCase() || 'EN'}</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-1">
                <Target className="h-4 w-4" />
                Quality Score
              </div>
              <p className={`text-xl font-bold ${getScoreColor(call.qualityScore || 0)}`}>
                {call.qualityScore || 0}/10
              </p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-1">
                <Award className="h-4 w-4" />
                Agent Score
              </div>
              <p className={`text-xl font-bold ${getScoreColor(avgPerformance)}`}>
                {avgPerformance}/10
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Analysis Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary Card */}
            {call.summary && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">AI Summary</h2>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">{call.summary}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {[
                  { id: 'overview', label: 'Analysis', icon: BarChart3 },
                  { id: 'transcript', label: 'Transcript', icon: MessageSquare },
                  { id: 'report', label: 'Full Report', icon: FileText },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'text-indigo-600 bg-indigo-50/50 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* Agent Performance */}
                    {call.analysis?.agentPerformance && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-indigo-600" />
                          Agent Performance Metrics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(call.analysis.agentPerformance).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 rounded-xl p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600 capitalize">{key}</span>
                                <span className={`text-lg font-bold ${getScoreColor(value)}`}>{value}</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                  className={`h-2.5 rounded-full transition-all duration-500 ${getScoreBg(value)}`}
                                  style={{ width: `${value * 10}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Items */}
                    {call.analysis?.actionItems && call.analysis.actionItems.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <ListChecks className="h-4 w-4 text-indigo-600" />
                          Action Items
                        </h3>
                        <div className="space-y-3">
                          {call.analysis.actionItems.map((item, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl">
                              <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Keywords */}
                    {call.keywords && call.keywords.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Tag className="h-4 w-4 text-indigo-600" />
                          Keywords Detected
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {call.keywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Transcript Tab */}
                {activeTab === 'transcript' && (
                  <div className="max-h-[600px] overflow-y-auto pr-2 space-y-4">
                    {call.transcript?.segments && call.transcript.segments.length > 0 ? (
                      call.transcript.segments.map((segment, index) => (
                        <div key={index} className="flex gap-4 group">
                          <div className="text-xs text-gray-400 pt-3 w-14 flex-shrink-0 font-mono">
                            {formatTime(segment.startTime)}
                          </div>
                          <div className={`flex-1 p-4 rounded-2xl transition-all ${
                            segment.speaker.toLowerCase().includes('agent')
                              ? 'bg-gradient-to-r from-indigo-50 to-indigo-50/50 border border-indigo-100'
                              : 'bg-gradient-to-r from-gray-50 to-gray-50/50 border border-gray-100'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                                segment.speaker.toLowerCase().includes('agent')
                                  ? 'bg-indigo-200 text-indigo-700'
                                  : 'bg-gray-200 text-gray-700'
                              }`}>
                                {segment.speaker.toLowerCase().includes('agent') ? (
                                  <User className="h-3.5 w-3.5" />
                                ) : (
                                  <Users className="h-3.5 w-3.5" />
                                )}
                              </div>
                              <span className={`text-sm font-semibold ${
                                segment.speaker.toLowerCase().includes('agent') ? 'text-indigo-700' : 'text-gray-700'
                              }`}>
                                {segment.speaker}
                              </span>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{segment.text}</p>
                          </div>
                        </div>
                      ))
                    ) : call.transcript?.text ? (
                      <div className="bg-gray-50 rounded-2xl p-6">
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{call.transcript.text}</p>
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <MessageSquare className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-medium">No transcript available</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Report Tab */}
                {activeTab === 'report' && (
                  <div>
                    {report ? (
                      <div className="prose prose-indigo max-w-none">
                        <div
                          className="text-gray-700"
                          dangerouslySetInnerHTML={{
                            __html: report
                              .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200">$1</h1>')
                              .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3">$1</h2>')
                              .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium text-gray-700 mt-4 mb-2">$1</h3>')
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                              .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1 text-gray-600">$1</li>')
                              .replace(/\n\n/g, '</p><p class="mb-4">')
                              .replace(/\n/g, '<br/>')
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="h-20 w-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                          <FileText className="h-10 w-10 text-indigo-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Report Generated</h3>
                        <p className="text-gray-500 mb-6">Generate a comprehensive AI report for this call</p>
                        <button
                          onClick={generateReport}
                          disabled={isGeneratingReport}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                        >
                          {isGeneratingReport ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Generating Report...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-5 w-5" />
                              Generate AI Report
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

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Sentiment Card */}
            <div className={`rounded-2xl p-6 ${sentimentConfig.bg} border ${sentimentConfig.border}`}>
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Sentiment Analysis</h3>
              <div className="flex items-center gap-4">
                <div className={`h-16 w-16 rounded-2xl ${sentimentConfig.bg} border-2 ${sentimentConfig.border} flex items-center justify-center`}>
                  <sentimentConfig.icon className={`h-8 w-8 ${sentimentConfig.color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${sentimentConfig.color}`}>{sentimentConfig.label}</p>
                  {call.sentimentScore !== undefined && (
                    <p className="text-sm text-gray-500 mt-1">
                      Confidence: {Math.round(call.sentimentScore * 100)}%
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Customer Satisfaction</h3>
              <div className="flex items-center gap-4">
                <div className={`h-14 w-14 rounded-2xl ${satisfactionConfig.bg} flex items-center justify-center text-3xl`}>
                  {satisfactionConfig.icon}
                </div>
                <div>
                  <p className={`text-xl font-bold ${satisfactionConfig.color} capitalize`}>
                    {call.analysis?.customerSatisfaction || 'Unknown'}
                  </p>
                </div>
              </div>
            </div>

            {/* Topics */}
            {call.topics && call.topics.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Topics Discussed</h3>
                <div className="flex flex-wrap gap-2">
                  {call.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-xl text-sm font-medium border border-indigo-100"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quality Score Gauge */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">Overall Quality</h3>
              <div className="relative pt-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke={call.qualityScore && call.qualityScore >= 7 ? '#10b981' : call.qualityScore && call.qualityScore >= 5 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="12"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(call.qualityScore || 0) * 35.2} 352`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className={`text-3xl font-bold ${getScoreColor(call.qualityScore || 0)}`}>
                          {call.qualityScore || 0}
                        </span>
                        <span className="text-gray-400 text-lg">/10</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500 mt-4">
                  {call.qualityScore && call.qualityScore >= 8 ? 'Excellent call quality' :
                   call.qualityScore && call.qualityScore >= 6 ? 'Good call quality' :
                   call.qualityScore && call.qualityScore >= 4 ? 'Average call quality' :
                   'Needs improvement'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
