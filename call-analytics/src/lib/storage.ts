import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, auth } from './firebase';
import { signInWithCustomToken } from 'firebase/auth';

// Ensure Firebase auth is ready before upload
async function ensureFirebaseAuth(): Promise<void> {
  // If already authenticated, return
  if (auth.currentUser) {
    return;
  }

  // Try to get a custom token and sign in
  try {
    const response = await fetch('/api/auth/firebase-token', { method: 'POST' });
    const data = await response.json();
    
    if (data.token) {
      await signInWithCustomToken(auth, data.token);
      console.log('Firebase auth ready for upload');
    } else {
      throw new Error('No token received');
    }
  } catch (error) {
    console.error('Failed to authenticate with Firebase:', error);
    throw new Error('Firebase authentication required for upload');
  }
}

// Client-side upload function
export async function uploadAudioFile(
  file: File,
  organizationId: string,
  callId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Ensure Firebase auth is ready
  await ensureFirebaseAuth();

  const fileName = `${callId}_${Date.now()}_${file.name}`;
  const filePath = `organizations/${organizationId}/calls/${fileName}`;
  const storageRef = ref(storage, filePath);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        callId: callId,
      },
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
}

// Validate audio file
export function validateAudioFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/m4a',
    'audio/x-m4a',
    'audio/mp4',
    'audio/webm',
    'audio/ogg',
  ];

  const maxSize = 100 * 1024 * 1024; // 100MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: MP3, WAV, M4A, WEBM, OGG`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size: 100MB`,
    };
  }

  return { valid: true };
}

// Get file extension from mime type
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeToExt: Record<string, string> = {
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/wav': 'wav',
    'audio/wave': 'wav',
    'audio/x-wav': 'wav',
    'audio/m4a': 'm4a',
    'audio/x-m4a': 'm4a',
    'audio/mp4': 'm4a',
    'audio/webm': 'webm',
    'audio/ogg': 'ogg',
  };

  return mimeToExt[mimeType] || 'mp3';
}
