'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface UsageData {
  callsUsed: number;
  callsLimit: number | string;
  usagePercentage: number;
  plan: string;
}

export function UsageAlert() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function fetchUsage() {
      try {
        const response = await fetch('/api/payments/subscription');
        const data = await response.json();
        if (data.success) {
          setUsage({
            callsUsed: data.data.callsUsed,
            callsLimit: data.data.callsLimit,
            usagePercentage: data.data.usagePercentage,
            plan: data.data.plan,
          });
        }
      } catch (error) {
        console.error('Failed to fetch usage:', error);
      }
    }

    fetchUsage();
  }, []);

  if (!usage || dismissed || usage.usagePercentage < 80) {
    return null;
  }

  const isAtLimit = usage.usagePercentage >= 100;
  const isCritical = usage.usagePercentage >= 90;

  return (
    <div className={`mx-8 mt-6 p-4 rounded-xl border ${
      isAtLimit 
        ? 'bg-red-50 border-red-200' 
        : isCritical 
          ? 'bg-orange-50 border-orange-200' 
          : 'bg-yellow-50 border-yellow-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
            isAtLimit ? 'text-red-500' : isCritical ? 'text-orange-500' : 'text-yellow-500'
          }`} />
          <div>
            <p className={`font-medium ${
              isAtLimit ? 'text-red-700' : isCritical ? 'text-orange-700' : 'text-yellow-700'
            }`}>
              {isAtLimit 
                ? 'Monthly call limit reached!' 
                : isCritical 
                  ? 'Almost at your monthly limit' 
                  : 'Approaching your monthly limit'}
            </p>
            <p className={`text-sm mt-1 ${
              isAtLimit ? 'text-red-600' : isCritical ? 'text-orange-600' : 'text-yellow-600'
            }`}>
              You&apos;ve used {usage.callsUsed} of {usage.callsLimit} calls this month ({usage.usagePercentage}%).
              {isAtLimit 
                ? ' Upgrade now to continue processing calls.' 
                : ' Consider upgrading to avoid interruption.'}
            </p>
            <Link
              href="/pricing"
              className={`inline-flex items-center gap-1 text-sm font-medium mt-2 ${
                isAtLimit ? 'text-red-700 hover:text-red-800' : isCritical ? 'text-orange-700 hover:text-orange-800' : 'text-yellow-700 hover:text-yellow-800'
              }`}
            >
              Upgrade Plan
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        {!isAtLimit && (
          <button
            onClick={() => setDismissed(true)}
            className={`p-1 rounded hover:bg-white/50 ${
              isCritical ? 'text-orange-400' : 'text-yellow-400'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
