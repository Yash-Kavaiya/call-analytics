'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FileUploader } from '@/components/upload/FileUploader';
import { UploadProgress, UploadStatus } from '@/components/upload/UploadProgress';
// Server-side upload function
async function uploadAudioFile(
  file: File,
  organizationId: string,
  callId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('callId', callId);

  // Simulate progress since we can't track server upload progress easily
  onProgress?.(10);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  onProgress?.(90);

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Upload failed');
  }

  onProgress?.(100);
  return data.data.url;
}
import {
  Upload,
  FileAudio,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Eye,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface UploadItem {
  id: string;
  file: File;
  status: UploadStatus;
  progress: number;
  error?: string;
  callId?: string;
}

interface Call {
  id: string;
  fileName: string;
  fileSize: number;
  status: string;
  sentiment?: string;
  summary?: string;
  duration?: number;
  createdAt: string;
}

export default function FilesPage() {
  const { data: session } = useSession();
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [recentCalls, setRecentCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recent calls
  useEffect(() => {
    async function fetchCalls() {
      try {
        const response = await fetch('/api/calls?limit=10');
        const data = await response.json();
        if (data.success) {
          setRecentCalls(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch calls:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCalls();
  }, []);

  const handleFilesSelected = useCallback((files: File[]) => {
    const newUploads: UploadItem[] = files.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      status: 'pending' as UploadStatus,
      progress: 0,
    }));

    setUploads(newUploads);
  }, []);

  const processUploadItem = async (upload: UploadItem) => {
    if (!session?.user?.organizationId) return;

    let callId: string | null = null;

    try {
      setUploads((prev) =>
        prev.map((u) =>
          u.id === upload.id ? { ...u, status: 'uploading' as UploadStatus } : u
        )
      );

      const createResponse = await fetch('/api/calls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: upload.file.name,
          fileSize: upload.file.size,
          mimeType: upload.file.type,
        }),
      });

      const createData = await createResponse.json();
      if (!createData.success) {
        throw new Error(createData.error || 'Failed to create call record');
      }

      callId = createData.data.id;

      const audioUrl = await uploadAudioFile(
        upload.file,
        session.user.organizationId,
        callId!,
        (progress) => {
          setUploads((prev) =>
            prev.map((u) =>
              u.id === upload.id ? { ...u, progress } : u
            )
          );
        }
      );

      await fetch(`/api/calls/${callId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioUrl,
          storagePath: `organizations/${session.user.organizationId}/calls/${callId}_${Date.now()}_${upload.file.name}`,
          status: 'processing',
        }),
      });

      setUploads((prev) =>
        prev.map((u) =>
          u.id === upload.id
            ? { ...u, status: 'processing' as UploadStatus, callId: callId || undefined, progress: 100 }
            : u
        )
      );

      setUploads((prev) =>
        prev.map((u) =>
          u.id === upload.id ? { ...u, status: 'transcribing' as UploadStatus } : u
        )
      );

      const processResponse = await fetch(`/api/calls/${callId}/process`, {
        method: 'POST',
      });

      const processData = await processResponse.json();

      if (processData.success) {
        setUploads((prev) =>
          prev.map((u) =>
            u.id === upload.id ? { ...u, status: 'completed' as UploadStatus } : u
          )
        );

        const callsResponse = await fetch('/api/calls?limit=10');
        const callsData = await callsResponse.json();
        if (callsData.success) {
          setRecentCalls(callsData.data);
        }
      } else {
        throw new Error(processData.error || 'Processing failed');
      }
    } catch (error) {
      console.error('Upload error:', error);

      if (callId) {
        try {
          await fetch(`/api/calls/${callId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: 'failed',
              error: error instanceof Error ? error.message : 'Upload failed'
            }),
          });

          const callsResponse = await fetch('/api/calls?limit=10');
          const callsData = await callsResponse.json();
          if (callsData.success) {
            setRecentCalls(callsData.data);
          }
        } catch (patchError) {
          console.error('Failed to update call status:', patchError);
        }
      }

      setUploads((prev) =>
        prev.map((u) =>
          u.id === upload.id
            ? {
              ...u,
              status: 'failed' as UploadStatus,
              error: error instanceof Error ? error.message : 'Upload failed',
            }
            : u
        )
      );
    }
  };

  const startUpload = useCallback(async () => {
    if (!session?.user?.organizationId) return;

    const pendingUploads = uploads.filter(u => u.status === 'pending');
    if (pendingUploads.length === 0) return;

    // DSA Optimization: Semaphore pattern to limit concurrency
    const CONCURRENCY_LIMIT = 3;
    const activePromises = new Set<Promise<void>>();

    for (const upload of pendingUploads) {
      if (activePromises.size >= CONCURRENCY_LIMIT) {
        await Promise.race(activePromises);
      }

      const p = processUploadItem(upload).then(() => {
        activePromises.delete(p);
      });
      activePromises.add(p);
    }

    await Promise.all(activePromises);
  }, [uploads, session]);

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-green-100 text-green-700',
      processing: 'bg-indigo-100 text-indigo-700',
      transcribing: 'bg-purple-100 text-purple-700',
      analyzing: 'bg-violet-100 text-violet-700',
      failed: 'bg-red-100 text-red-700',
      uploading: 'bg-yellow-100 text-yellow-700',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[sentiment] || ''}`}>
        {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
      </span>
    );
  };

  const hasUploads = uploads.length > 0;
  const hasPendingUploads = uploads.some((u) => u.status === 'pending');
  const isUploading = uploads.some((u) =>
    ['uploading', 'processing', 'transcribing', 'analyzing'].includes(u.status)
  );

  return (
    <div className="p-8 pt-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload Calls</h1>
        <p className="text-gray-500 mt-1">
          Upload audio recordings for transcription and AI analysis
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Upload className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Upload Audio Files</h2>
            <p className="text-sm text-gray-500">
              Drag and drop or click to select files
            </p>
          </div>
        </div>

        <FileUploader
          onFilesSelected={handleFilesSelected}
          disabled={isUploading}
          maxFiles={10}
        />

        {/* Upload Progress */}
        {hasUploads && (
          <div className="mt-6 space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Upload Queue</h3>
            {uploads.map((upload) => (
              <UploadProgress
                key={upload.id}
                fileName={upload.file.name}
                fileSize={upload.file.size}
                status={upload.status}
                progress={upload.progress}
                error={upload.error}
              />
            ))}

            {hasPendingUploads && !isUploading && (
              <button
                onClick={startUpload}
                className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-medium rounded-xl hover:from-indigo-500 hover:to-indigo-400 transition-all flex items-center justify-center gap-2"
              >
                <Upload className="h-5 w-5" />
                Start Upload & Processing
              </button>
            )}
          </div>
        )}
      </div>

      {/* Recent Calls */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Uploads</h2>
          <p className="text-sm text-gray-500">Your recently uploaded and processed calls</p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
            <p className="text-gray-500 mt-2">Loading calls...</p>
          </div>
        ) : recentCalls.length === 0 ? (
          <div className="p-12 text-center">
            <FileAudio className="h-12 w-12 text-gray-300 mx-auto" />
            <p className="text-gray-500 mt-3">No calls uploaded yet</p>
            <p className="text-sm text-gray-400">Upload your first call recording above</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentCalls.map((call) => (
              <div
                key={call.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <FileAudio className="h-5 w-5 text-indigo-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {call.fileName}
                      </p>
                      {getStatusBadge(call.status)}
                      {getSentimentBadge(call.sentiment)}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(call.duration)}
                      </span>
                      <span>{formatDate(call.createdAt)}</span>
                    </div>
                    {call.summary && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {call.summary}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {call.status === 'completed' && (
                      <Link
                        href={`/dashboard/calls/${call.id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    )}
                    {call.status === 'processing' && (
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                    )}
                    {call.status === 'failed' && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {recentCalls.length > 0 && (
          <div className="p-4 border-t border-gray-100 text-center">
            <Link
              href="/dashboard/calls"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View all calls →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
