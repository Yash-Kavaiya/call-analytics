import { adminStorage } from './firebase-admin';

// Server-side function to get download URL
export async function getAudioDownloadUrl(filePath: string): Promise<string> {
  const bucket = adminStorage.bucket();
  const file = bucket.file(filePath);
  
  const [signedUrl] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
  });
  
  return signedUrl;
}

// Server-side function to download file as buffer
export async function downloadAudioAsBuffer(filePath: string): Promise<Buffer> {
  const bucket = adminStorage.bucket();
  const file = bucket.file(filePath);
  
  const [buffer] = await file.download();
  return buffer;
}

// Server-side function to download from URL
export async function downloadFromUrl(url: string): Promise<Buffer> {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
