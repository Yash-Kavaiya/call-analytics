// Audio file validation and storage utilities

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// Supported audio formats
const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg',      // MP3
  'audio/mp3',       // MP3 (alternative)
  'audio/wav',       // WAV
  'audio/wave',      // WAV (alternative)
  'audio/x-wav',     // WAV (alternative)
  'audio/mp4',       // M4A
  'audio/m4a',       // M4A (alternative)
  'audio/x-m4a',     // M4A (alternative)
  'audio/ogg',       // OGG
  'audio/webm',      // WebM
  'audio/flac',      // FLAC
  'audio/aac',       // AAC
];

// Supported file extensions
const SUPPORTED_EXTENSIONS = [
  '.mp3',
  '.wav',
  '.m4a',
  '.ogg',
  '.webm',
  '.flac',
  '.aac',
];

// Maximum file size (100MB)
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Minimum file size (1KB - to catch empty files)
const MIN_FILE_SIZE = 1024;

/**
 * Validates an audio file for upload
 * @param file - The file to validate
 * @returns ValidationResult with valid status and optional error message
 */
export function validateAudioFile(file: File): ValidationResult {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size - too large
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    return { 
      valid: false, 
      error: `File size (${sizeMB}MB) exceeds maximum allowed size of 100MB` 
    };
  }

  // Check file size - too small
  if (file.size < MIN_FILE_SIZE) {
    return { 
      valid: false, 
      error: 'File appears to be empty or corrupted' 
    };
  }

  // Check MIME type
  const mimeType = file.type.toLowerCase();
  const isSupportedType = SUPPORTED_AUDIO_TYPES.includes(mimeType);

  // Check file extension as fallback
  const fileName = file.name.toLowerCase();
  const extension = fileName.substring(fileName.lastIndexOf('.'));
  const isSupportedExtension = SUPPORTED_EXTENSIONS.includes(extension);

  if (!isSupportedType && !isSupportedExtension) {
    return { 
      valid: false, 
      error: `Unsupported audio format. Supported formats: ${SUPPORTED_EXTENSIONS.join(', ')}` 
    };
  }

  return { valid: true };
}

/**
 * Formats file size for display
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "5.2 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generates a unique file name for storage
 * @param originalName - Original file name
 * @param callId - Call ID to prefix
 * @returns Unique file name
 */
export function generateStorageFileName(originalName: string, callId: string): string {
  const timestamp = Date.now();
  const extension = originalName.substring(originalName.lastIndexOf('.'));
  const sanitizedName = originalName
    .substring(0, originalName.lastIndexOf('.'))
    .replace(/[^a-zA-Z0-9]/g, '_')
    .substring(0, 50);
  
  return `${callId}_${timestamp}_${sanitizedName}${extension}`;
}

/**
 * Gets the storage path for an organization's call
 * @param organizationId - Organization ID
 * @param fileName - File name
 * @returns Storage path
 */
export function getStoragePath(organizationId: string, fileName: string): string {
  return `organizations/${organizationId}/calls/${fileName}`;
}
