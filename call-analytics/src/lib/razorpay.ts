import Razorpay from 'razorpay';

// Initialize Razorpay instance
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Plan configuration
export const PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 0, // Free
    priceInPaise: 0,
    calls: 10,
    members: 1,
    retention: 30,
    features: [
      '10 calls per month',
      'Basic transcription',
      'Sentiment analysis',
      '30-day data retention',
      'Email support',
    ],
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    price: 749, // ₹749/month (~$9)
    priceInPaise: 74900,
    calls: 100,
    members: 5,
    retention: 90,
    features: [
      '100 calls per month',
      'Advanced transcription with diarization',
      'Full AI analysis & reports',
      '90-day data retention',
      'Priority support',
      'Team collaboration (5 members)',
      'CSV/JSON export',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 16599, // ₹16,599/month (~$199)
    priceInPaise: 1659900,
    calls: Infinity,
    members: Infinity,
    retention: Infinity,
    features: [
      'Unlimited calls',
      'Advanced transcription with diarization',
      'Full AI analysis & reports',
      'Unlimited data retention',
      'Dedicated support',
      'Unlimited team members',
      'API access',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
} as const;

export type PlanId = keyof typeof PLANS;

// Create Razorpay order
export async function createOrder(
  planId: PlanId,
  organizationId: string,
  userId: string
) {
  const plan = PLANS[planId];
  
  if (plan.price === 0) {
    throw new Error('Cannot create order for free plan');
  }

  const order = await razorpay.orders.create({
    amount: plan.priceInPaise,
    currency: 'INR',
    receipt: `order_${organizationId}_${Date.now()}`,
    notes: {
      planId,
      organizationId,
      userId,
    },
  });

  return order;
}

// Verify payment signature
export async function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const crypto = await import('crypto');
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest('hex');
  
  return expectedSignature === signature;
}

// Create subscription (for recurring payments)
export async function createSubscription(
  planId: PlanId,
  customerId: string,
  organizationId: string
) {
  const plan = PLANS[planId];
  
  if (plan.price === 0) {
    throw new Error('Cannot create subscription for free plan');
  }

  // Note: You need to create plans in Razorpay Dashboard first
  // This is a simplified version - in production, use Razorpay plan IDs
  const subscription = await razorpay.subscriptions.create({
    plan_id: `plan_${planId}`, // Replace with actual Razorpay plan ID
    customer_notify: 1,
    total_count: 12, // 12 months
    notes: {
      planId,
      organizationId,
    },
  });

  return subscription;
}
