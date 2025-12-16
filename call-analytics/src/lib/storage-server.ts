import { adminStorage } from './firebase-admin';
import { readFile } from 'fs/promises';
import path from 'path';

// Get the correct bucket name
function getBucket() {
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 
    `${process.env.FIREBASE_ADMIN_PROJECT_ID}.appspot.com`;
  return adminStorage.bucket(bucketName);
}

// Server-side function to get download URL
export async function getAudioDownloadUrl(filePath: string): Promise<string> {
  const bucket = getBucket();
  const file = bucket.file(filePath);
  
  const [signedUrl] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
  });
  
  return signedUrl;
}

// Server-side function to download file as buffer
export async function downloadAudioAsBuffer(storagePath: string): Promise<Buffer> {
  // Check if it's a local file path (starts with organizations/)
  // Local files are stored in public/uploads/
  try {
    // Try Firebase Storage first
    const bucket = getBucket();
    const file = bucket.file(storagePath);
    const [buffer] = await file.download();
    return buffer;
  } catch {
    // Fallback to local storage
    console.log('Firebase download failed, trying local storage');
    // Extract org ID and filename from path like "organizations/orgId/calls/filename"
    const parts = storagePath.split('/');
    if (parts.length >= 4) {
      const orgId = parts[1];
      const fileName = parts[3];
      const localPath = path.join(process.cwd(), 'public', 'uploads', orgId, fileName);
      return readFile(localPath);
    }
    throw new Error('Invalid storage path');
  }
}

// Server-side function to download from URL
export async function downloadFromUrl(url: string): Promise<Buffer> {
  // Handle local URLs
  if (url.startsWith('/uploads/')) {
    const localPath = path.join(process.cwd(), 'public', url);
    return readFile(localPath);
  }
  
  // Handle remote URLs
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
