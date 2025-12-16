import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import { downloadAudioAsBuffer, downloadFromUrl } from '@/lib/storage-server';
import { transcribeAudio } from '@/lib/elevenlabs';
import { analyzeCallTranscript } from '@/lib/gemini';
import { Timestamp } from 'firebase-admin/firestore';

// Increase timeout for long-running transcription/analysis
export const maxDuration = 300; // 5 minutes max
export const dynamic = 'force-dynamic';

// POST - Process call (transcribe + analyze)
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get call document
    const callRef = adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .collection('calls')
      .doc(id);

    const callDoc = await callRef.get();

    if (!callDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Call not found' },
        { status: 404 }
      );
    }

    const callData = callDoc.data();

    if (!callData?.audioUrl) {
      return NextResponse.json(
        { success: false, error: 'No audio file uploaded' },
        { status: 400 }
      );
    }

    // Update status to processing
    await callRef.update({ status: 'processing' });

    try {
      // Step 1: Download audio from Firebase Storage
      console.log('Downloading audio file...');
      await callRef.update({ status: 'transcribing' });

      // Download audio file
      const audioUrl = callData.audioUrl;
      let audioBuffer: Buffer;

      if (callData.storagePath) {
        // Download from Firebase Storage using path
        audioBuffer = await downloadAudioAsBuffer(callData.storagePath);
      } else {
        // Download from URL
        audioBuffer = await downloadFromUrl(audioUrl);
      }

      // Step 2: Transcribe with ElevenLabs
      console.log('Transcribing audio...');
      const transcription = await transcribeAudio(audioBuffer);

      // Update with transcription
      await callRef.update({
        status: 'analyzing',
        transcript: {
          text: transcription.text,
          segments: transcription.segments,
        },
        duration: transcription.duration || callData.duration || 0,
        language: transcription.language,
      });

      // Step 3: Analyze with Gemini
      console.log('Analyzing transcript...');
      const analysis = await analyzeCallTranscript(
        transcription.text,
        transcription.segments
      );

      // Step 4: Update call with analysis results
      await callRef.update({
        status: 'completed',
        sentiment: analysis.sentiment,
        sentimentScore: analysis.sentimentScore,
        topics: analysis.topics,
        summary: analysis.summary,
        keywords: analysis.keywords,
        qualityScore: analysis.qualityScore,
        analysis: {
          actionItems: analysis.actionItems,
          customerSatisfaction: analysis.customerSatisfaction,
          agentPerformance: analysis.agentPerformance,
        },
        processedAt: Timestamp.now(),
      });

      // Increment organization's call count
      await adminDb
        .collection('organizations')
        .doc(session.user.organizationId)
        .update({
          callsThisMonth: (callData.callsThisMonth || 0) + 1,
        });

      return NextResponse.json({
        success: true,
        data: {
          id,
          status: 'completed',
          transcript: transcription,
          analysis,
        },
      });
    } catch (processingError) {
      console.error('Processing error:', processingError);

      // Update status to failed
      await callRef.update({
        status: 'failed',
        error: processingError instanceof Error 
          ? processingError.message 
          : 'Processing failed',
      });

      return NextResponse.json(
        { 
          success: false, 
          error: processingError instanceof Error 
            ? processingError.message 
            : 'Failed to process call' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Process call error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process call' },
      { status: 500 }
    );
  }
}
