'use client';

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Upload a file directly to Firebase Storage from the client
 * This bypasses Vercel's 4.5MB body size limit
 */
export async function uploadToFirebaseClient(
  file: File,
  organizationId: string,
  callId: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string; path: string }> {
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
        onProgress?.(Math.round(progress));
      },
      (error) => {
        console.error('Firebase upload error:', error);
        reject(new Error(`Upload failed: ${error.message}`));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadURL,
            path: filePath,
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
}

/**
 * Smart upload function that chooses the best upload method
 * - Small files (< 4MB): Use server API
 * - Large files (>= 4MB): Use direct Firebase upload
 */
export async function smartUpload(
  file: File,
  organizationId: string,
  callId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const VERCEL_LIMIT = 4 * 1024 * 1024; // 4MB (with some buffer for request overhead)
  
  if (file.size >= VERCEL_LIMIT) {
    // Large file - upload directly to Firebase
    console.log('Using client-side Firebase upload for large file');
    const result = await uploadToFirebaseClient(file, organizationId, callId, onProgress);
    return result.url;
  } else {
    // Small file - use server API
    console.log('Using server API upload for small file');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('callId', callId);

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
}
