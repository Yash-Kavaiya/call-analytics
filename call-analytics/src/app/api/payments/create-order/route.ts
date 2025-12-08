import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createOrder, PLANS, PlanId } from '@/lib/razorpay';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { planId } = await request.json();

    if (!planId || !PLANS[planId as PlanId]) {
      return NextResponse.json(
        { success: false, error: 'Invalid plan' },
        { status: 400 }
      );
    }

    if (planId === 'starter') {
      return NextResponse.json(
        { success: false, error: 'Starter plan is free' },
        { status: 400 }
      );
    }

    const order = await createOrder(
      planId as PlanId,
      session.user.organizationId,
      session.user.id
    );

    // Store order in Firestore for verification later
    await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .collection('orders')
      .doc(order.id)
      .set({
        orderId: order.id,
        planId,
        amount: order.amount,
        currency: order.currency,
        status: 'created',
        userId: session.user.id,
        createdAt: new Date(),
      });

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
