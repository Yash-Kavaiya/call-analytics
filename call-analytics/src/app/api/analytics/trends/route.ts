import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';

// GET - Get analytics trends over time
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
    const period = searchParams.get('period') || '30'; // days
    const days = parseInt(period);

    const orgId = session.user.organizationId;
    const callsRef = adminDb
      .collection('organizations')
      .doc(orgId)
      .collection('calls');

    // Get calls from the specified period
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const callsSnapshot = await callsRef
      .where('status', '==', 'completed')
      .get();

    const calls = callsSnapshot.docs
      .map(doc => doc.data())
      .filter(call => {
        const createdAt = call.createdAt?.toDate?.() || new Date(call.createdAt);
        return createdAt >= startDate;
      });

    // Group by date
    const dailyData: Record<string, {
      date: string;
      calls: number;
      avgQuality: number;
      qualitySum: number;
      positive: number;
      neutral: number;
      negative: number;
      totalDuration: number;
    }> = {};

    // Initialize all dates in range
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = {
        date: dateStr,
        calls: 0,
        avgQuality: 0,
        qualitySum: 0,
        positive: 0,
        neutral: 0,
        negative: 0,
        totalDuration: 0,
      };
    }

    // Populate with actual data
    calls.forEach(call => {
      const createdAt = call.createdAt?.toDate?.() || new Date(call.createdAt);
      const dateStr = createdAt.toISOString().split('T')[0];
      
      if (dailyData[dateStr]) {
        dailyData[dateStr].calls++;
        dailyData[dateStr].qualitySum += call.qualityScore || 0;
        dailyData[dateStr].totalDuration += call.duration || 0;
        
        if (call.sentiment === 'positive') dailyData[dateStr].positive++;
        else if (call.sentiment === 'negative') dailyData[dateStr].negative++;
        else dailyData[dateStr].neutral++;
      }
    });

    // Calculate averages and format
    const trends = Object.values(dailyData)
      .map(day => ({
        ...day,
        avgQuality: day.calls > 0 
          ? Math.round((day.qualitySum / day.calls) * 10) / 10 
          : 0,
        avgDuration: day.calls > 0 
          ? Math.round(day.totalDuration / day.calls) 
          : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Weekly aggregation
    const weeklyData: Record<string, {
      week: string;
      calls: number;
      avgQuality: number;
      qualitySum: number;
      qualityCount: number;
    }> = {};

    trends.forEach(day => {
      const date = new Date(day.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekStr = weekStart.toISOString().split('T')[0];

      if (!weeklyData[weekStr]) {
        weeklyData[weekStr] = {
          week: weekStr,
          calls: 0,
          avgQuality: 0,
          qualitySum: 0,
          qualityCount: 0,
        };
      }

      weeklyData[weekStr].calls += day.calls;
      if (day.avgQuality > 0) {
        weeklyData[weekStr].qualitySum += day.avgQuality;
        weeklyData[weekStr].qualityCount++;
      }
    });

    const weeklyTrends = Object.values(weeklyData)
      .map(week => ({
        ...week,
        avgQuality: week.qualityCount > 0 
          ? Math.round((week.qualitySum / week.qualityCount) * 10) / 10 
          : 0,
      }))
      .sort((a, b) => a.week.localeCompare(b.week));

    return NextResponse.json({
      success: true,
      data: {
        daily: trends,
        weekly: weeklyTrends,
        period: days,
      },
    });
  } catch (error) {
    console.error('Analytics trends error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch trends' },
      { status: 500 }
    );
  }
}
