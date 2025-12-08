import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { verifyPaymentSignature, PLANS, PlanId } from '@/lib/razorpay';
import { adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // Verify signature
    const isValid = await verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Get order details
    const orderDoc = await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .collection('orders')
      .doc(razorpay_order_id)
      .get();

    if (!orderDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const orderData = orderDoc.data();
    const planId = orderData?.planId as PlanId;
    const plan = PLANS[planId];

    // Update order status
    await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .collection('orders')
      .doc(razorpay_order_id)
      .update({
        status: 'paid',
        paymentId: razorpay_payment_id,
        paidAt: Timestamp.now(),
      });

    // Update organization plan
    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);

    await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .update({
        plan: planId,
        callsLimit: plan.calls,
        membersLimit: plan.members,
        retentionDays: plan.retention,
        razorpayPaymentId: razorpay_payment_id,
        subscriptionStartDate: Timestamp.now(),
        subscriptionEndDate: Timestamp.fromDate(subscriptionEnd),
        updatedAt: Timestamp.now(),
      });

    // Store payment record
    await adminDb
      .collection('organizations')
      .doc(session.user.organizationId)
      .collection('payments')
      .add({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        planId,
        amount: orderData?.amount,
        currency: orderData?.currency,
        status: 'captured',
        createdAt: Timestamp.now(),
      });

    return NextResponse.json({
      success: true,
      data: {
        plan: planId,
        message: 'Payment successful! Your plan has been upgraded.',
      },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
