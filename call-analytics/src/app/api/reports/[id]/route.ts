import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import { generateCallReport } from '@/lib/gemini';

// GET - Generate detailed report for a call
export async function GET(
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
    const callDoc = await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .collection('calls')
      .doc(id)
      .get();

    if (!callDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Call not found' },
        { status: 404 }
      );
    }

    const callData = callDoc.data();

    if (callData?.status !== 'completed') {
      return NextResponse.json(
        { success: false, error: 'Call has not been processed yet' },
        { status: 400 }
      );
    }

    // Check if report already exists
    if (callData.report) {
      return NextResponse.json({
        success: true,
        data: {
          id,
          report: callData.report,
          generatedAt: callData.reportGeneratedAt?.toDate?.()?.toISOString() || null,
        },
      });
    }

    // Generate report using Gemini
    const transcript = callData.transcript?.text || '';
    const analysis = {
      sentiment: callData.sentiment,
      sentimentScore: callData.sentimentScore,
      topics: callData.topics,
      summary: callData.summary,
      keywords: callData.keywords,
      qualityScore: callData.qualityScore,
      actionItems: callData.analysis?.actionItems || [],
      customerSatisfaction: callData.analysis?.customerSatisfaction,
      agentPerformance: callData.analysis?.agentPerformance,
    };

    const report = await generateCallReport(transcript, analysis);

    // Save report to database
    const { Timestamp } = await import('firebase-admin/firestore');
    await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .collection('calls')
      .doc(id)
      .update({
        report,
        reportGeneratedAt: Timestamp.now(),
      });

    return NextResponse.json({
      success: true,
      data: {
        id,
        report,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Generate report error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
