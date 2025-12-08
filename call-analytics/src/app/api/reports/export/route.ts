import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';

interface CallData {
  id: string;
  fileName?: string;
  duration?: number;
  sentiment?: string;
  sentimentScore?: number;
  qualityScore?: number;
  topics?: string[];
  summary?: string;
  analysis?: {
    customerSatisfaction?: string;
    agentPerformance?: {
      professionalism?: number;
      helpfulness?: number;
      clarity?: number;
      resolution?: number;
    };
  };
  createdAt: Date;
  processedAt?: Date | null;
}

// GET - Export calls data as CSV
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sentiment = searchParams.get('sentiment');

    const orgId = session.user.organizationId;
    const query = adminDb
      .collection('organizations')
      .doc(orgId)
      .collection('calls')
      .where('status', '==', 'completed')
      .orderBy('createdAt', 'desc');

    const snapshot = await query.get();

    let calls: CallData[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        fileName: data.fileName,
        duration: data.duration,
        sentiment: data.sentiment,
        sentimentScore: data.sentimentScore,
        qualityScore: data.qualityScore,
        topics: data.topics,
        summary: data.summary,
        analysis: data.analysis,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        processedAt: data.processedAt?.toDate?.() || null,
      };
    });

    // Apply filters
    if (startDate) {
      const start = new Date(startDate);
      calls = calls.filter(call => call.createdAt >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      calls = calls.filter(call => call.createdAt <= end);
    }
    if (sentiment) {
      calls = calls.filter(call => call.sentiment === sentiment);
    }

    if (format === 'json') {
      return NextResponse.json({
        success: true,
        data: calls.map(call => ({
          id: call.id,
          fileName: call.fileName,
          duration: call.duration,
          sentiment: call.sentiment,
          sentimentScore: call.sentimentScore,
          qualityScore: call.qualityScore,
          topics: call.topics,
          summary: call.summary,
          customerSatisfaction: call.analysis?.customerSatisfaction,
          agentPerformance: call.analysis?.agentPerformance,
          createdAt: call.createdAt.toISOString(),
        })),
      });
    }

    // Generate CSV
    const headers = [
      'ID',
      'File Name',
      'Duration (seconds)',
      'Sentiment',
      'Sentiment Score',
      'Quality Score',
      'Topics',
      'Summary',
      'Customer Satisfaction',
      'Agent Professionalism',
      'Agent Helpfulness',
      'Agent Clarity',
      'Agent Resolution',
      'Created At',
    ];

    const rows = calls.map(call => [
      call.id,
      call.fileName || '',
      call.duration || 0,
      call.sentiment || '',
      call.sentimentScore || '',
      call.qualityScore || '',
      (call.topics || []).join('; '),
      (call.summary || '').replace(/"/g, '""'),
      call.analysis?.customerSatisfaction || '',
      call.analysis?.agentPerformance?.professionalism || '',
      call.analysis?.agentPerformance?.helpfulness || '',
      call.analysis?.agentPerformance?.clarity || '',
      call.analysis?.agentPerformance?.resolution || '',
      call.createdAt.toISOString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        row.map(cell => 
          typeof cell === 'string' && (cell.includes(',') || cell.includes('"') || cell.includes('\n'))
            ? `"${cell}"`
            : cell
        ).join(',')
      ),
    ].join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="calls-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
