// app/analytics/page.tsx
'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  PlayCircle, 
  PauseCircle, 
  Activity, 
  ChevronDown, 
  ChevronUp,
  FileUp, 
  BarChart, 
  Clock, 
  Mic, 
  Volume2, 
  MessageSquare, 
  Zap, 
  Users,
  Download,
  Share2
} from 'lucide-react';

export default function Analytics() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioProgressRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
      simulateUploadProgress();
    }
  };

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleAnalyze = async () => {
    if (!audioFile) return;

    setIsAnalyzing(true);
    
    // Simulated analysis - replace with actual Gemini API call
    setTimeout(() => {
      setAnalysis({
        overview: {
          duration: "5:23",
          speakerCount: 2,
          overallSentiment: "Positive",
          engagementScore: 8.5
        },
        metrics: {
          speakerMetrics: [
            {
              speaker: "Speaker A",
              talkTime: "2:45",
              talkPercentage: 52,
              interruptions: 3,
              averagePace: "Medium",
              keywords: ["pricing", "features", "support"],
              sentiment: "Very Positive",
              questions: 5
            },
            {
              speaker: "Speaker B",
              talkTime: "2:38",
              talkPercentage: 48,
              interruptions: 2,
              averagePace: "Slow",
              keywords: ["budget", "timeline", "requirements"],
              sentiment: "Neutral",
              questions: 3
            }
          ],
          conversationFlow: {
            turnTakingScore: 85,
            silencesCount: 4,
            averageSilenceDuration: "2.3s",
            overlappingSegments: 5
          },
          contentAnalysis: {
            topKeywords: ["pricing", "features", "timeline", "support", "budget"],
            actionItems: 3,
            followUpTasks: 2,
            decisions: 2
          },
          emotions: {
            positive: 65,
            neutral: 25,
            negative: 10
          }
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleAudioProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioProgressRef.current) {
      const rect = audioProgressRef.current.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const progressPercentage = (clickPosition / rect.width) * 100;
      // Here you would typically update the audio playback position
      console.log(`Seek to ${progressPercentage.toFixed(2)}%`);
    }
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Decorative gradient corners */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-purple-600 via-violet-500 to-transparent opacity-10 rounded-br-full"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-indigo-600 via-purple-500 to-transparent opacity-10 rounded-tl-full"></div>
          
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Call Analytics</h1>
                <p className="text-neutral-600">Transform your conversations into actionable insights</p>
              </div>
              {analysis && (
                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-700 hover:border-purple-300 hover:bg-purple-50 transition-colors shadow-sm">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 rounded-lg text-neutral-700 hover:border-purple-300 hover:bg-purple-50 transition-colors shadow-sm">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </div>
              )}
            </div>
            
            {/* Upload Section */}
            <div className="mb-8">
              {audioFile ? (
                <div className="border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 text-center transition-all">
                  <div className="mb-4 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                      <FileUp className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium text-purple-800 mb-1">{audioFile.name}</h3>
                  <p className="text-sm text-neutral-500 mb-4">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB • {audioFile.type}</p>
                  <div className="w-full max-w-md mx-auto bg-white/70 rounded-full h-2.5 mb-3 overflow-hidden shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-purple-600 font-medium">
                    {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Ready for analysis'}
                  </span>
                </div>
              ) : (
                <div className="group border-2 border-dashed border-neutral-300 hover:border-purple-300 rounded-xl bg-white/50 hover:bg-purple-50/30 p-12 text-center transition-all duration-300">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="audio-upload"
                    ref={fileInputRef}
                  />
                  <div 
                    onClick={triggerFileUpload}
                    className="cursor-pointer flex flex-col items-center transition-all duration-300 transform group-hover:scale-105"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-indigo-100 group-hover:from-purple-200 group-hover:to-indigo-200 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-all duration-300">
                      <Upload className="h-10 w-10 text-purple-600 group-hover:text-purple-700 transition-colors" />
                    </div>
                    <h3 className="text-xl font-medium text-neutral-800 group-hover:text-purple-800 mb-3 transition-colors">Upload audio file</h3>
                    <p className="text-neutral-500 group-hover:text-neutral-600 max-w-md mx-auto mb-6 transition-colors">
                      Drag and drop your audio file here, or click to browse files from your device
                    </p>
                    <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 group-hover:translate-y-[-2px]">
                      Select File
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Audio Player */}
            {audioFile && (
              <div className="mb-8">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-6 mb-6">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="relative group bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                      {isPlaying ? (
                        <PauseCircle className="h-8 w-8 z-10" />
                      ) : (
                        <PlayCircle className="h-8 w-8 z-10" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div 
                        ref={audioProgressRef}
                        onClick={handleAudioProgressClick}
                        className="relative h-3 bg-white/80 rounded-full overflow-hidden shadow-inner cursor-pointer"
                      >
                        <div 
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                          style={{ width: '33%' }}
                        ></div>
                        <div 
                          className="absolute top-0 left-0 h-full w-2 bg-white rounded-full shadow-sm cursor-pointer transform -translate-x-1"
                          style={{ left: '33%' }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-neutral-600">
                        <span>1:48</span>
                        <span>5:23</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Volume2 className="h-5 w-5 text-neutral-500" />
                      <div className="h-2 w-24 bg-white/80 rounded-full shadow-inner">
                        <div className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-neutral-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Mic className="h-4 w-4 text-purple-600" />
                        </div>
                        <h3 className="font-medium text-neutral-800">Call Details</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div>
                          <span className="text-neutral-500">File:</span>
                          <span className="ml-2 text-neutral-800 font-medium">
                            {audioFile.name.length > 20 
                              ? `${audioFile.name.substring(0, 20)}...` 
                              : audioFile.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-neutral-500">Size:</span>
                          <span className="ml-2 text-neutral-800 font-medium">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                        </div>
                        <div>
                          <span className="text-neutral-500">Format:</span>
                          <span className="ml-2 text-neutral-800 font-medium">{audioFile.type.split('/')[1]?.toUpperCase() || 'AUDIO'}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500">Duration:</span>
                          <span className="ml-2 text-neutral-800 font-medium">5:23</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-neutral-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <BarChart className="h-4 w-4 text-indigo-600" />
                        </div>
                        <h3 className="font-medium text-neutral-800">Analysis Status</h3>
                      </div>
                      {isAnalyzing ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full border-2 border-purple-600 border-t-transparent animate-spin"></div>
                              <span className="text-sm text-neutral-700">Processing audio...</span>
                            </div>
                            <span className="text-sm font-medium text-purple-600">45%</span>
                          </div>
                          <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden shadow-inner">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 ease-out"
                              style={{ width: '45%' }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={handleAnalyze}
                          disabled={!!analysis}
                          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:translate-y-[-1px] ${
                            analysis 
                              ? 'bg-green-100 text-green-700 cursor-default' 
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-md'
                          }`}
                        >
                          {analysis ? (
                            <>
                              <Activity className="h-4 w-4" />
                              Analysis Complete
                            </>
                          ) : (
                            <>
                              <Activity className="h-4 w-4" />
                              Analyze Call
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {analysis && (
              <div className="space-y-8">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <OverviewCard title="Duration" value={analysis.overview.duration} icon={<Clock />} />
                  <OverviewCard title="Speakers" value={analysis.overview.speakerCount.toString()} icon={<Users />} />
                  <OverviewCard title="Sentiment" value={analysis.overview.overallSentiment} icon={<MessageSquare />} />
                  <OverviewCard title="Engagement" value={`${analysis.overview.engagementScore}/10`} icon={<Zap />} />
                </div>

                {/* Speaker Analysis */}
                <AnalysisSection 
                  title="Speaker Analysis" 
                  expanded={expandedSection === 'speakers'}
                  onToggle={() => toggleSection('speakers')}
                >
                  <div className="space-y-6">
                    {analysis.metrics.speakerMetrics.map((speaker: any, index: number) => (
                      <div key={index} className="p-5 border border-neutral-200 rounded-xl hover:border-purple-200 transition-colors bg-white">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                            {speaker.speaker.charAt(speaker.speaker.length - 1)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-neutral-800">{speaker.speaker}</h4>
                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                              <span>{speaker.talkTime} ({speaker.talkPercentage}%)</span>
                              <span>•</span>
                              <span className="text-purple-600">{speaker.sentiment}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-neutral-500">Talk Time</p>
                            <p className="font-medium text-neutral-800">{speaker.talkTime}</p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-500">Talk %</p>
                            <p className="font-medium text-neutral-800">{speaker.talkPercentage}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-500">Interruptions</p>
                            <p className="font-medium text-neutral-800">{speaker.interruptions}</p>
                          </div>
                          <div>
                            <p className="text-sm text-neutral-500">Pace</p>
                            <p className="font-medium text-neutral-800">{speaker.averagePace}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-neutral-600 mb-2">Key Topics</h5>
                          <div className="flex flex-wrap gap-2">
                            {speaker.keywords.map((keyword: string, i: number) => (
                              <span 
                                key={i} 
                                className="px-3 py-1 bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 rounded-full text-sm"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AnalysisSection>

                {/* Conversation Flow */}
                <AnalysisSection 
                  title="Conversation Flow" 
                  expanded={expandedSection === 'conversation'}
                  onToggle={() => toggleSection('conversation')}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 border border-neutral-200 rounded-xl bg-white">
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-neutral-500 mb-1">Turn Taking Score</p>
                      <p className="text-xl font-semibold text-purple-700">{analysis.metrics.conversationFlow.turnTakingScore}%</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-neutral-500 mb-1">Silences</p>
                      <p className="text-xl font-semibold text-purple-700">{analysis.metrics.conversationFlow.silencesCount}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-neutral-500 mb-1">Avg Silence</p>
                      <p className="text-xl font-semibold text-purple-700">{analysis.metrics.conversationFlow.averageSilenceDuration}</p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-neutral-500 mb-1">Overlaps</p>
                      <p className="text-xl font-semibold text-purple-700">{analysis.metrics.conversationFlow.overlappingSegments}</p>
                    </div>
                  </div>
                </AnalysisSection>

                {/* Content Analysis */}
                <AnalysisSection 
                  title="Content Analysis" 
                  expanded={expandedSection === 'content'}
                  onToggle={() => toggleSection('content')}
                >
                  <div className="p-5 border border-neutral-200 rounded-xl bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-neutral-700 mb-3">Top Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {analysis.metrics.contentAnalysis.topKeywords.map((keyword: string, index: number) => (
                            <span
                              key={index}
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                index % 3 === 0 ? 'bg-purple-100 text-purple-700' :
                                index % 3 === 1 ? 'bg-indigo-100 text-indigo-700' :
                                'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-700 mb-3">Key Metrics</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                            <span className="text-neutral-700">Action Items</span>
                            <span className="font-semibold text-purple-700">{analysis.metrics.contentAnalysis.actionItems}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                            <span className="text-neutral-700">Follow-up Tasks</span>
                            <span className="font-semibold text-purple-700">{analysis.metrics.contentAnalysis.followUpTasks}</span>
                          </div>
                          <div className="flex justify-between p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                            <span className="text-neutral-700">Decisions Made</span>
                            <span className="font-semibold text-purple-700">{analysis.metrics.contentAnalysis.decisions}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnalysisSection>

                {/* Emotional Analysis */}
                <AnalysisSection 
                  title="Emotional Analysis" 
                  expanded={expandedSection === 'emotions'}
                  onToggle={() => toggleSection('emotions')}
                >
                  <div className="p-5 border border-neutral-200 rounded-xl bg-white">
                    <div className="relative h-5 bg-neutral-100 rounded-full overflow-hidden shadow-inner mb-6">
                      <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" style={{ width: `${analysis.metrics.emotions.positive}%` }}></div>
                      <div className="absolute top-0 left-0 h-full bg-neutral-300 rounded-full" style={{ width: `${analysis.metrics.emotions.positive + analysis.metrics.emotions.neutral}%`, opacity: 0.7 }}></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <span className="text-sm text-neutral-600 block mb-1">Positive</span>
                        <p className="text-xl font-semibold text-green-600">{analysis.metrics.emotions.positive}%</p>
                      </div>
                      <div className="p-4 bg-neutral-50 rounded-lg text-center">
                        <span className="text-sm text-neutral-600 block mb-1">Neutral</span>
                        <p className="text-xl font-semibold text-neutral-600">{analysis.metrics.emotions.neutral}%</p>
                      </div>
                      <div className="p-4 bg-red-50 rounded-lg text-center">
                        <span className="text-sm text-neutral-600 block mb-1">Negative</span>
                        <p className="text-xl font-semibold text-red-600">{analysis.metrics.emotions.negative}%</p>
                      </div>
                    </div>
                  </div>
                </AnalysisSection>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function OverviewCard({ title, value, icon, gradientFrom = "from-purple-600", gradientTo = "to-indigo-600" }) {
  return (
    <div className="relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md group">
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${gradientFrom} ${gradientTo}`}></div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-neutral-500">{title}</h3>
          <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} group-hover:opacity-90 flex items-center justify-center text-white transition-all duration-300`}>
            {icon}
          </div>
        </div>
        <p className="text-2xl font-semibold text-neutral-800">{value}</p>
      </div>
    </div>
  );
}

function AnalysisSection({ title, children, expanded, onToggle }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md">
      <div 
        className="p-4 border-b border-neutral-200 flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
        <button className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors">
          {expanded ? <ChevronUp className="h-5 w-5 text-neutral-600" /> : <ChevronDown className="h-5 w-5 text-neutral-600" />}
        </button>
      </div>
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-5">
          {children}
        </div>
      </div>
    </div>
  );
}