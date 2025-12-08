'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Check,
  AlertTriangle,
  Loader2,
  ArrowRight,
  Calendar,
  BarChart3,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

interface SubscriptionData {
  plan: string;
  planName: string;
  price: number;
  callsUsed: number;
  callsLimit: string | number;
  usagePercentage: number;
  isActive: boolean;
  subscriptionEndDate: string | null;
  features: string[];
}

export default function BillingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const response = await fetch('/api/payments/subscription');
        const data = await response.json();
        if (data.success) {
          setSubscription(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 pt-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="text-gray-500 mt-2">Loading billing information...</p>
        </div>
      </div>
    );
  }

  const usageColor = subscription?.usagePercentage 
    ? subscription.usagePercentage >= 90 
      ? 'bg-red-500' 
      : subscription.usagePercentage >= 70 
        ? 'bg-yellow-500' 
        : 'bg-green-500'
    : 'bg-gray-300';

  return (
    <div className="p-8 pt-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-500 mt-1">Manage your subscription and billing details</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Current Plan</h2>
              <p className="text-gray-500">{subscription?.planName || 'Starter'} Plan</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {subscription?.price === 0 ? 'Free' : `₹${subscription?.price}`}
              {subscription?.price !== 0 && <span className="text-sm font-normal text-gray-500">/month</span>}
            </p>
            {subscription?.isActive ? (
              <span className="inline-flex items-center gap-1 text-sm text-green-600">
                <Check className="h-4 w-4" />
                Active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4" />
                Expired
              </span>
            )}
          </div>
        </div>

        {subscription?.subscriptionEndDate && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Calendar className="h-4 w-4" />
            <span>
              {subscription.isActive ? 'Renews' : 'Expired'} on{' '}
              {new Date(subscription.subscriptionEndDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        )}

        <div className="flex gap-3">
          <Link
            href="/pricing"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            {subscription?.plan === 'starter' ? 'Upgrade Plan' : 'Change Plan'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Usage */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Usage This Month</h2>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Calls Processed</span>
            <span className="font-medium text-gray-900">
              {subscription?.callsUsed || 0} / {subscription?.callsLimit || 10}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${usageColor}`}
              style={{ width: `${Math.min(subscription?.usagePercentage || 0, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {subscription?.usagePercentage || 0}% of your monthly limit used
          </p>
        </div>

        {(subscription?.usagePercentage || 0) >= 80 && (
          <div className={`p-3 rounded-lg ${
            (subscription?.usagePercentage || 0) >= 90 
              ? 'bg-red-50 border border-red-100' 
              : 'bg-yellow-50 border border-yellow-100'
          }`}>
            <div className="flex items-start gap-2">
              <AlertTriangle className={`h-5 w-5 flex-shrink-0 ${
                (subscription?.usagePercentage || 0) >= 90 ? 'text-red-500' : 'text-yellow-500'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  (subscription?.usagePercentage || 0) >= 90 ? 'text-red-700' : 'text-yellow-700'
                }`}>
                  {(subscription?.usagePercentage || 0) >= 90 
                    ? 'You\'re almost at your limit!' 
                    : 'Approaching your limit'}
                </p>
                <p className={`text-xs ${
                  (subscription?.usagePercentage || 0) >= 90 ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  Consider upgrading your plan to continue processing calls.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Plan Features */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Plan Features</h2>
        </div>

        <ul className="space-y-3">
          {subscription?.features?.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        {subscription?.plan !== 'enterprise' && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 mb-3">
              Need more features? Upgrade to unlock additional capabilities.
            </p>
            <Link
              href="/pricing"
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
            >
              View all plans
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
