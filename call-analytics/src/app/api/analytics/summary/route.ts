import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';

// GET - Get analytics summary for dashboard
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orgId = session.user.organizationId;
    const callsRef = adminDb
      .collection('organizations')
      .doc(orgId)
      .collection('calls');

    // Get all completed calls
    const completedCalls = await callsRef
      .where('status', '==', 'completed')
      .get();

    const calls = completedCalls.docs.map(doc => doc.data());

    // Calculate summary stats
    const totalCalls = calls.length;
    const totalDuration = calls.reduce((sum, call) => sum + (call.duration || 0), 0);
    const avgDuration = totalCalls > 0 ? totalDuration / totalCalls : 0;

    // Sentiment distribution
    const sentimentCounts = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };
    calls.forEach(call => {
      if (call.sentiment) {
        sentimentCounts[call.sentiment as keyof typeof sentimentCounts]++;
      }
    });

    // Average quality score
    const qualityScores = calls.filter(c => c.qualityScore).map(c => c.qualityScore);
    const avgQualityScore = qualityScores.length > 0
      ? qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length
      : 0;

    // Top topics
    const topicCounts: Record<string, number> = {};
    calls.forEach(call => {
      if (call.topics && Array.isArray(call.topics)) {
        call.topics.forEach((topic: string) => {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
      }
    });
    const topTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, count }));

    // Top keywords
    const keywordCounts: Record<string, number> = {};
    calls.forEach(call => {
      if (call.keywords && Array.isArray(call.keywords)) {
        call.keywords.forEach((keyword: string) => {
          keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
        });
      }
    });
    const topKeywords = Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([keyword, count]) => ({ keyword, count }));

    // Customer satisfaction distribution
    const satisfactionCounts = {
      satisfied: 0,
      neutral: 0,
      dissatisfied: 0,
    };
    calls.forEach(call => {
      const satisfaction = call.analysis?.customerSatisfaction;
      if (satisfaction && satisfaction in satisfactionCounts) {
        satisfactionCounts[satisfaction as keyof typeof satisfactionCounts]++;
      }
    });

    // Agent performance averages
    const agentPerformance = {
      professionalism: 0,
      helpfulness: 0,
      clarity: 0,
      resolution: 0,
    };
    let perfCount = 0;
    calls.forEach(call => {
      const perf = call.analysis?.agentPerformance;
      if (perf) {
        agentPerformance.professionalism += perf.professionalism || 0;
        agentPerformance.helpfulness += perf.helpfulness || 0;
        agentPerformance.clarity += perf.clarity || 0;
        agentPerformance.resolution += perf.resolution || 0;
        perfCount++;
      }
    });
    if (perfCount > 0) {
      agentPerformance.professionalism /= perfCount;
      agentPerformance.helpfulness /= perfCount;
      agentPerformance.clarity /= perfCount;
      agentPerformance.resolution /= perfCount;
    }

    // This month's calls
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const callsThisMonth = calls.filter(call => {
      const createdAt = call.createdAt?.toDate?.() || new Date(call.createdAt);
      return createdAt >= startOfMonth;
    }).length;

    return NextResponse.json({
      success: true,
      data: {
        totalCalls,
        callsThisMonth,
        totalDuration,
        avgDuration,
        avgQualityScore: Math.round(avgQualityScore * 10) / 10,
        sentimentDistribution: sentimentCounts,
        satisfactionDistribution: satisfactionCounts,
        topTopics,
        topKeywords,
        agentPerformance: {
          professionalism: Math.round(agentPerformance.professionalism * 10) / 10,
          helpfulness: Math.round(agentPerformance.helpfulness * 10) / 10,
          clarity: Math.round(agentPerformance.clarity * 10) / 10,
          resolution: Math.round(agentPerformance.resolution * 10) / 10,
        },
      },
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
