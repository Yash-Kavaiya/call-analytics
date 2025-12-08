import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { adminDb } from '@/lib/firebase-admin';
import { PLANS } from '@/lib/razorpay';

// GET - Get current subscription status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const orgDoc = await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .get();

    if (!orgDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Organization not found' },
        { status: 404 }
      );
    }

    const orgData = orgDoc.data();
    const currentPlan = orgData?.plan || 'starter';
    const plan = PLANS[currentPlan as keyof typeof PLANS];

    // Get usage stats
    const callsThisMonth = orgData?.callsThisMonth || 0;
    const callsLimit = plan.calls;
    const usagePercentage = callsLimit === Infinity ? 0 : Math.round((callsThisMonth / callsLimit) * 100);

    // Check subscription status
    const subscriptionEndDate = orgData?.subscriptionEndDate?.toDate?.();
    const isActive = currentPlan === 'starter' || 
      (subscriptionEndDate && subscriptionEndDate > new Date());

    return NextResponse.json({
      success: true,
      data: {
        plan: currentPlan,
        planName: plan.name,
        price: plan.price,
        callsUsed: callsThisMonth,
        callsLimit: callsLimit === Infinity ? 'Unlimited' : callsLimit,
        usagePercentage,
        isActive,
        subscriptionEndDate: subscriptionEndDate?.toISOString() || null,
        features: plan.features,
      },
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get subscription' },
      { status: 500 }
    );
  }
}
