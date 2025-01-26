'use client';

import { Check, HelpCircle } from 'lucide-react';
import { useState } from 'react';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Simple, Transparent Pricing
            </span>
          </h1>
          <p className="text-xl text-neutral-600 mb-8">
            Choose the perfect plan for your business
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isAnnual ? 'text-neutral-900 font-medium' : 'text-neutral-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-neutral-900 font-medium' : 'text-neutral-500'}`}>
              Annual <span className="text-green-600">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                plan.popular ? 'ring-2 ring-purple-600' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-purple-600 text-white text-center text-sm py-1">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-neutral-500">/month</span>
                </div>
                <p className="text-neutral-600 mb-6">{plan.description}</p>
                <a
                  href="#contact"
                  className={`block text-center py-2 px-4 rounded-lg transition-colors ${
                    plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {plan.buttonText}
                </a>
              </div>
              <div className="border-t border-neutral-100 p-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 border-b border-neutral-100">
            <h2 className="text-2xl font-semibold">Feature Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="text-left p-4 font-medium">Feature</th>
                  {pricingPlans.map((plan) => (
                    <th key={plan.name} className="p-4 font-medium">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((feature, index) => (
                  <tr key={index} className="border-t border-neutral-100">
                    <td className="p-4 text-neutral-600">
                      <div className="flex items-center gap-2">
                        {feature.name}
                        {feature.tooltip && (
                          <HelpCircle className="h-4 w-4 text-neutral-400" />
                        )}
                      </div>
                    </td>
                    {pricingPlans.map((plan) => (
                      <td key={plan.name} className="p-4 text-center">
                        {feature.tiers[plan.name.toLowerCase()]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const pricingPlans = [
  {
    name: 'Starter',
    monthlyPrice: 49,
    annualPrice: 39,
    description: 'Perfect for small teams and startups',
    buttonText: 'Start Free Trial',
    popular: false,
    features: [
      'Up to 100 calls/month',
      'Basic analytics',
      'Email support',
      '1 team member',
      '30-day data retention'
    ]
  },
  {
    name: 'Professional',
    monthlyPrice: 99,
    annualPrice: 79,
    description: 'Ideal for growing businesses',
    buttonText: 'Start Free Trial',
    popular: true,
    features: [
      'Up to 1,000 calls/month',
      'Advanced analytics',
      'Priority support',
      'Up to 5 team members',
      '90-day data retention',
      'Custom reports'
    ]
  },
  {
    name: 'Enterprise',
    monthlyPrice: 199,
    annualPrice: 159,
    description: 'For large organizations',
    buttonText: 'Contact Sales',
    popular: false,
    features: [
      'Unlimited calls',
      'Custom analytics',
      '24/7 support',
      'Unlimited team members',
      'Unlimited data retention',
      'API access',
      'Custom integrations'
    ]
  }
];

const featureComparison = [
  {
    name: 'Call Analysis',
    tooltip: 'AI-powered analysis of call content and sentiment',
    tiers: {
      starter: 'Basic',
      professional: 'Advanced',
      enterprise: 'Custom'
    }
  },
  {
    name: 'Team Members',
    tiers: {
      starter: '1',
      professional: '5',
      enterprise: 'Unlimited'
    }
  },
  {
    name: 'Data Retention',
    tiers: {
      starter: '30 days',
      professional: '90 days',
      enterprise: 'Unlimited'
    }
  },
  {
    name: 'Support',
    tiers: {
      starter: 'Email',
      professional: 'Priority',
      enterprise: '24/7'
    }
  },
  {
    name: 'API Access',
    tooltip: 'Access to our REST API',
    tiers: {
      starter: '❌',
      professional: '✓',
      enterprise: '✓'
    }
  },
  {
    name: 'Custom Reports',
    tiers: {
      starter: '❌',
      professional: '✓',
      enterprise: '✓'
    }
  },
  {
    name: 'Custom Integrations',
    tooltip: 'Integration with your existing tools',
    tiers: {
      starter: '❌',
      professional: '❌',
      enterprise: '✓'
    }
  }
];
