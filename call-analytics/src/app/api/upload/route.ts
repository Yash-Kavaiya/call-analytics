import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminStorage } from '@/lib/firebase-admin';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const callId = formData.get('callId') as string;

    if (!file || !callId) {
      return NextResponse.json(
        { success: false, error: 'File and callId are required' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `${callId}_${Date.now()}_${file.name}`;
    const filePath = `organizations/${session.user.organizationId}/calls/${fileName}`;

    // Try Firebase Storage first
    try {
      const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
      const envBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
      
      const bucketFormats = [
        envBucket,
        `${projectId}.appspot.com`,
        `${projectId}.firebasestorage.app`,
      ].filter(Boolean) as string[];
      
      for (const bucketName of bucketFormats) {
        try {
          console.log('Trying Firebase bucket:', bucketName);
          const bucket = adminStorage.bucket(bucketName);
          const fileRef = bucket.file(filePath);
          
          await fileRef.save(buffer, {
            metadata: {
              contentType: file.type,
              metadata: {
                originalName: file.name,
                callId: callId,
                uploadedBy: session.user.id,
              },
            },
          });
          
          const [signedUrl] = await fileRef.getSignedUrl({
            action: 'read',
            expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
          });
          
          console.log('Firebase upload successful to:', bucketName);
          return NextResponse.json({
            success: true,
            data: {
              url: signedUrl,
              path: filePath,
              storage: 'firebase',
            },
          });
        } catch (err) {
          console.log('Firebase bucket failed:', bucketName, err instanceof Error ? err.message : err);
        }
      }
    } catch (firebaseError) {
      console.log('Firebase Storage not available, using local storage');
    }

    // Fallback to local storage
    console.log('Using local file storage as fallback');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', session.user.organizationId);
    await mkdir(uploadsDir, { recursive: true });
    
    const localFilePath = path.join(uploadsDir, fileName);
    await writeFile(localFilePath, buffer);
    
    // Generate public URL for local file
    const publicUrl = `/uploads/${session.user.organizationId}/${fileName}`;

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        path: filePath,
        storage: 'local',
      },
    });
  } catch (error: unknown) {
    console.error('Upload error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as { code?: string })?.code,
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
