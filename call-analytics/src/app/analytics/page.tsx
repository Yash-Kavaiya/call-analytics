// app/analytics/page.tsx
'use client';

import { useState } from 'react';
import { Upload, PlayCircle, PauseCircle, Activity, ChevronDown } from 'lucide-react';

export default function Analytics() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAudioFile(file);
    }
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

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Call Analytics</h1>
          
          {/* Upload Section */}
          <div className="mb-8">
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
              />
              <label
                htmlFor="audio-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-12 w-12 text-neutral-400 mb-4" />
                <span className="text-neutral-600">
                  {audioFile ? audioFile.name : "Upload audio file"}
                </span>
              </label>
            </div>
          </div>

          {/* Audio Player */}
          {audioFile && (
            <div className="mb-8">
              <div className="bg-neutral-100 rounded-lg p-4 flex items-center gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-purple-600 hover:text-purple-700"
                >
                  {isPlaying ? (
                    <PauseCircle className="h-8 w-8" />
                  ) : (
                    <PlayCircle className="h-8 w-8" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="h-2 bg-neutral-200 rounded-full">
                    <div className="h-2 bg-purple-600 rounded-full w-1/3"></div>
                  </div>
                </div>
                <span className="text-neutral-600">5:23</span>
              </div>
              
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="mt-4 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Activity className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  "Analyze Call"
                )}
              </button>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              {/* Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-neutral-100 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Duration</h3>
                  <p className="text-2xl font-semibold">{analysis.overview.duration}</p>
                </div>
                <div className="bg-neutral-100 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Speakers</h3>
                  <p className="text-2xl font-semibold">{analysis.overview.speakerCount}</p>
                </div>
                <div className="bg-neutral-100 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Sentiment</h3>
                  <p className="text-2xl font-semibold">{analysis.overview.overallSentiment}</p>
                </div>
                <div className="bg-neutral-100 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">Engagement</h3>
                  <p className="text-2xl font-semibold">{analysis.overview.engagementScore}/10</p>
                </div>
              </div>

              {/* Speaker Analysis */}
              <div className="bg-white border border-neutral-200 rounded-lg">
                <div className="p-4 border-b border-neutral-200">
                  <h3 className="text-lg font-semibold">Speaker Analysis</h3>
                </div>
                <div className="p-4">
                  {analysis.metrics.speakerMetrics.map((speaker: any, index: number) => (
                    <div key={index} className="mb-6 last:mb-0">
                      <h4 className="font-medium mb-2">{speaker.speaker}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-neutral-500">Talk Time</p>
                          <p className="font-medium">{speaker.talkTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Talk %</p>
                          <p className="font-medium">{speaker.talkPercentage}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Interruptions</p>
                          <p className="font-medium">{speaker.interruptions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-500">Pace</p>
                          <p className="font-medium">{speaker.averagePace}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversation Flow */}
              <div className="bg-white border border-neutral-200 rounded-lg">
                <div className="p-4 border-b border-neutral-200">
                  <h3 className="text-lg font-semibold">Conversation Flow</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-neutral-500">Turn Taking Score</p>
                      <p className="font-medium">{analysis.metrics.conversationFlow.turnTakingScore}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Silences</p>
                      <p className="font-medium">{analysis.metrics.conversationFlow.silencesCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Avg Silence</p>
                      <p className="font-medium">{analysis.metrics.conversationFlow.averageSilenceDuration}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Overlaps</p>
                      <p className="font-medium">{analysis.metrics.conversationFlow.overlappingSegments}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Analysis */}
              <div className="bg-white border border-neutral-200 rounded-lg">
                <div className="p-4 border-b border-neutral-200">
                  <h3 className="text-lg font-semibold">Content Analysis</h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Top Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.metrics.contentAnalysis.topKeywords.map((keyword: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Key Metrics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Action Items</span>
                          <span className="font-medium">{analysis.metrics.contentAnalysis.actionItems}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Follow-up Tasks</span>
                          <span className="font-medium">{analysis.metrics.contentAnalysis.followUpTasks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Decisions Made</span>
                          <span className="font-medium">{analysis.metrics.contentAnalysis.decisions}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emotional Analysis */}
              <div className="bg-white border border-neutral-200 rounded-lg">
                <div className="p-4 border-b border-neutral-200">
                  <h3 className="text-lg font-semibold">Emotional Analysis</h3>
                </div>
                <div className="p-4">
                  <div className="h-4 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${analysis.metrics.emotions.positive}%` }}
                    ></div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-500">Positive</span>
                      <p className="font-medium">{analysis.metrics.emotions.positive}%</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Neutral</span>
                      <p className="font-medium">{analysis.metrics.emotions.neutral}%</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Negative</span>
                      <p className="font-medium">{analysis.metrics.emotions.negative}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}