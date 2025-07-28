'use client';

import React from 'react'; // Added explicit React import
import { 
  Check, 
  HelpCircle, 
  Sparkles, 
  Zap, 
  Shield, 
  Users, 
  Calendar, 
  Clock, 
  Lock, 
  PhoneCall, 
  Settings, 
  Database,
  ChevronRight,
  Star,
  Info
} from 'lucide-react';
import { useState } from 'react';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/40 to-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              <span>Simple, Transparent Pricing</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl mx-auto leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
              Choose the Perfect Plan for Your Business
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Start with a 14-day free trial. No credit card required. Cancel anytime.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center justify-center p-1 bg-white rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                !isAnnual 
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm' 
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isAnnual 
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm' 
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Annual <span className="text-green-600 ml-1">-20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative ${
                plan.popular ? 'md:-mt-4 md:mb-4' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 text-white text-center text-sm py-2 font-medium">
                  Recommended for most users
                </div>
              )}
              <div className="px-8 pt-8 pb-10">
                <div className="flex items-start justify-between mb-5">
                  <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                  {plan.icon}
                </div>
                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <sup className="text-gray-500 text-lg">$</sup>
                    <span className="text-4xl font-bold text-gray-900">
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-500 ml-1">/month</span>
                  </div>
                  {isAnnual && (
                    <div className="text-sm text-gray-500 mt-1">
                      Billed annually (${isAnnual ? plan.annualPrice * 12 : plan.monthlyPrice * 12}/year)
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-8 h-12">{plan.description}</p>
                <button
                  className={`w-full py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm hover:shadow hover:from-indigo-500 hover:to-indigo-400'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
              <div className="border-t border-gray-100 bg-gradient-to-b from-gray-50/50 to-white p-8">
                <h4 className="font-medium text-gray-900 mb-5 flex items-center">
                  <span>Plan includes:</span>
                  {index === 1 && (
                    <span className="ml-2 px-3 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-full">
                      Highest value
                    </span>
                  )}
                </h4>
                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-1 w-5 h-5 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {plan.popular && (
                <div className="absolute -left-12 top-5 rotate-45 bg-gradient-to-r from-yellow-400 to-yellow-300 text-xs text-yellow-900 font-bold py-1 w-48 text-center">
                  MOST POPULAR
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900">Feature Comparison</h2>
            <p className="text-gray-500 mt-2">Detailed breakdown of features included in each plan</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-6 font-medium text-gray-900">Feature</th>
                  {pricingPlans.map((plan) => (
                    <th key={plan.name} className="p-6 font-medium text-gray-900">
                      <div className="inline-flex items-center">
                        {plan.icon && <span className="mr-2">{plan.icon}</span>}
                        <span>{plan.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureCategories.map((category, i) => (
                  <React.Fragment key={`category-${i}`}>
                    <tr className="border-t border-gray-100 bg-gray-50">
                      <td colSpan={4} className="p-4 font-medium text-gray-900">
                        {category.name}
                      </td>
                    </tr>
                    {category.features.map((feature, index) => (
                      <tr 
                        key={`feature-${index}`} 
                        className="border-t border-gray-100 hover:bg-indigo-50/30 transition-colors duration-150"
                        onMouseEnter={() => setHoveredFeature(feature.name)}
                        onMouseLeave={() => setHoveredFeature(null)}
                      >
                        <td className="p-6 text-gray-700">
                          <div className="flex items-center gap-2">
                            <span>{feature.name}</span>
                            {feature.tooltip && (
                              <div className="relative group cursor-pointer">
                                <Info className="h-4 w-4 text-gray-400" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                  {feature.tooltip}
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-800"></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                        {pricingPlans.map((plan) => (
                          <td key={`${feature.name}-${plan.name}`} className="p-6 text-center">
                            <FeatureValue value={feature.tiers[plan.name.toLowerCase() as keyof typeof feature.tiers]} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-6">Still have questions?</p>
            <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow hover:from-indigo-500 hover:to-indigo-400 transition-all duration-200">
              Contact Sales
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Feature value display component
function FeatureValue({ value }: { value: string }) {
  if (value === '✓') {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center bg-green-50 rounded-full text-green-600">
        <Check className="h-4 w-4" />
      </span>
    );
  } else if (value === '❌') {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center bg-gray-100 rounded-full text-gray-400">
        <span className="block w-3 h-0.5 bg-current rounded-full"></span>
      </span>
    );
  } else if (value.startsWith('Limited:')) {
    return (
      <div className="flex flex-col items-center">
        <div className="inline-flex h-6 w-6 items-center justify-center bg-amber-50 rounded-full text-amber-600 mb-1">
          <Check className="h-4 w-4" />
        </div>
        <span className="text-xs text-gray-500">{value.replace('Limited:', '')}</span>
      </div>
    );
  } else {
    return <span className="text-gray-700">{value}</span>;
  }
}

const pricingPlans = [
  {
    name: 'Starter',
    monthlyPrice: 49,
    annualPrice: 39,
    description: 'Perfect for small teams just getting started with call analytics',
    buttonText: 'Start Free Trial',
    popular: false,
    icon: <Clock className="h-5 w-5 text-indigo-400" />,
    features: [
      'Up to 100 calls/month',
      'Basic call analytics',
      'Standard email support (48h)',
      '1 team member',
      '30-day data retention',
      'Essential reports'
    ]
  },
  {
    name: 'Professional',
    monthlyPrice: 99,
    annualPrice: 79,
    description: 'Ideal for growing businesses seeking deeper conversation insights',
    buttonText: 'Start Free Trial',
    popular: true,
    icon: <Zap className="h-5 w-5 text-indigo-600" />,
    features: [
      'Up to 1,000 calls/month',
      'Advanced AI-powered analytics',
      'Priority support (24h)',
      'Up to 5 team members',
      '90-day data retention',
      'Custom & scheduled reports',
      'API access (1,000 calls/day)'
    ]
  },
  {
    name: 'Enterprise',
    monthlyPrice: 199,
    annualPrice: 159,
    description: 'For organizations requiring complete analytics and customization',
    buttonText: 'Contact Sales',
    popular: false,
    icon: <Shield className="h-5 w-5 text-indigo-400" />,
    features: [
      'Unlimited calls',
      'Custom analytics & insights',
      'Dedicated support (24/7)',
      'Unlimited team members',
      'Unlimited data retention',
      'Advanced API access',
      'Custom integrations',
      'SSO & advanced security'
    ]
  }
];

const featureCategories = [
  {
    name: 'Analytics Capabilities',
    features: [
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
        name: 'Sentiment Detection',
        tooltip: 'Automatic detection of customer sentiment during calls',
        tiers: {
          starter: 'Limited:Basic',
          professional: '✓',
          enterprise: '✓'
        }
      },
      {
        name: 'Keyword Tracking',
        tiers: {
          starter: 'Up to 10',
          professional: 'Up to 50',
          enterprise: 'Unlimited'
        }
      },
      {
        name: 'Trend Analysis',
        tooltip: 'Identify patterns and trends across multiple calls',
        tiers: {
          starter: '❌',
          professional: '✓',
          enterprise: '✓'
        }
      }
    ]
  },
  {
    name: 'Team & Administration',
    features: [
      {
        name: 'Team Members',
        tiers: {
          starter: '1',
          professional: '5',
          enterprise: 'Unlimited'
        }
      },
      {
        name: 'Role-based Access',
        tooltip: 'Control access based on user roles',
        tiers: {
          starter: '❌',
          professional: 'Limited:Basic',
          enterprise: '✓'
        }
      },
      {
        name: 'Admin Controls',
        tiers: {
          starter: 'Limited:Basic',
          professional: '✓',
          enterprise: '✓'
        }
      }
    ]
  },
  {
    name: 'Data & Integrations',
    features: [
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
        tooltip: 'Technical and product support availability',
        tiers: {
          starter: 'Email (48h)',
          professional: 'Priority (24h)',
          enterprise: 'Dedicated (24/7)'
        }
      },
      {
        name: 'API Access',
        tooltip: 'Access to our REST API for custom integrations',
        tiers: {
          starter: '❌',
          professional: 'Limited:1k calls/day',
          enterprise: 'Unlimited'
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
        tooltip: 'Integration with your existing tools and systems',
        tiers: {
          starter: '❌',
          professional: '❌',
          enterprise: '✓'
        }
      }
    ]
  }
];

const faqs = [
  {
    question: 'Can I change plans later?',
    answer: 'Yes, you can upgrade, downgrade, or cancel your plan at any time. If you upgrade, the new pricing will be applied immediately. If you downgrade, the new pricing will be applied at the end of your current billing cycle.'
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes, we offer a 14-day free trial for all our plans. No credit card is required to start your trial, and you can cancel anytime during the trial period with no charge.'
  },
  {
    question: 'How do you count a "call" in the pricing?',
    answer: 'A "call" is defined as any voice conversation up to 60 minutes in length that is analyzed by our system. Calls longer than 60 minutes count as multiple calls (one call per hour or fraction thereof).'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) as well as PayPal. For Enterprise customers, we also offer invoicing with net-30 terms.'
  }
];