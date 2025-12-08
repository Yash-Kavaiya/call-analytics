'use client';

import { FileAudio, CheckCircle, XCircle, Loader2, Brain, Mic } from 'lucide-react';

export type UploadStatus = 
  | 'pending' 
  | 'uploading' 
  | 'processing' 
  | 'transcribing' 
  | 'analyzing' 
  | 'completed' 
  | 'failed';

interface UploadProgressProps {
  fileName: string;
  fileSize: number;
  status: UploadStatus;
  progress: number;
  error?: string;
  onRetry?: () => void;
  onCancel?: () => void;
}

export function UploadProgress({
  fileName,
  fileSize,
  status,
  progress,
  error,
  onRetry,
  onCancel,
}: UploadProgressProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getStatusInfo = () => {
    switch (status) {
      case 'pending':
        return { text: 'Waiting...', color: 'text-gray-500', icon: null };
      case 'uploading':
        return { text: `Uploading ${Math.round(progress)}%`, color: 'text-indigo-600', icon: <Loader2 className="h-4 w-4 animate-spin" /> };
      case 'processing':
        return { text: 'Processing...', color: 'text-indigo-600', icon: <Loader2 className="h-4 w-4 animate-spin" /> };
      case 'transcribing':
        return { text: 'Transcribing...', color: 'text-purple-600', icon: <Mic className="h-4 w-4 animate-pulse" /> };
      case 'analyzing':
        return { text: 'Analyzing...', color: 'text-violet-600', icon: <Brain className="h-4 w-4 animate-pulse" /> };
      case 'completed':
        return { text: 'Completed', color: 'text-green-600', icon: <CheckCircle className="h-4 w-4" /> };
      case 'failed':
        return { text: 'Failed', color: 'text-red-600', icon: <XCircle className="h-4 w-4" /> };
      default:
        return { text: 'Unknown', color: 'text-gray-500', icon: null };
    }
  };

  const statusInfo = getStatusInfo();
  const isActive = ['uploading', 'processing', 'transcribing', 'analyzing'].includes(status);

  return (
    <div className={`
      p-4 rounded-xl border transition-all duration-200
      ${status === 'completed' ? 'bg-green-50 border-green-200' : ''}
      ${status === 'failed' ? 'bg-red-50 border-red-200' : ''}
      ${isActive ? 'bg-indigo-50 border-indigo-200' : ''}
      ${status === 'pending' ? 'bg-gray-50 border-gray-200' : ''}
    `}>
      <div className="flex items-start gap-3">
        {/* File Icon */}
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
          ${status === 'completed' ? 'bg-green-100' : ''}
          ${status === 'failed' ? 'bg-red-100' : ''}
          ${isActive ? 'bg-indigo-100' : ''}
          ${status === 'pending' ? 'bg-gray-100' : ''}
        `}>
          <FileAudio className={`h-5 w-5 ${
            status === 'completed' ? 'text-green-600' :
            status === 'failed' ? 'text-red-600' :
            isActive ? 'text-indigo-600' :
            'text-gray-400'
          }`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {fileName}
            </p>
            <div className={`flex items-center gap-1.5 ${statusInfo.color}`}>
              {statusInfo.icon}
              <span className="text-xs font-medium">{statusInfo.text}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-0.5">
            {formatFileSize(fileSize)}
          </p>

          {/* Progress Bar */}
          {(status === 'uploading' || isActive) && (
            <div className="mt-2">
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    status === 'uploading' ? 'bg-indigo-500' :
                    status === 'transcribing' ? 'bg-purple-500' :
                    status === 'analyzing' ? 'bg-violet-500' :
                    'bg-indigo-500'
                  }`}
                  style={{ 
                    width: status === 'uploading' ? `${progress}%` : '100%',
                    animation: status !== 'uploading' ? 'pulse 2s infinite' : 'none'
                  }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {status === 'failed' && error && (
            <p className="text-xs text-red-600 mt-2">{error}</p>
          )}

          {/* Actions */}
          {status === 'failed' && (
            <div className="flex gap-2 mt-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Retry
                </button>
              )}
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700"
                >
                  Remove
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
