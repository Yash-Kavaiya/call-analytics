'use client';

import { Activity, Brain, Clock, FileText, Shield, Zap } from 'lucide-react';

// Feature arrays
const mainFeatures = [
  {
    title: 'Real-time Analytics',
    description: 'Get instant insights from your calls with real-time analysis and monitoring.',
    icon: Activity
  },
  {
    title: 'AI-Powered Insights',
    description: 'Advanced machine learning algorithms analyze call sentiment and content.',
    icon: Brain
  },
  {
    title: 'Smart Transcription',
    description: 'Accurate, automated transcription with speaker recognition and timestamps.',
    icon: FileText
  },
  {
    title: 'Performance Metrics',
    description: 'Track key metrics and KPIs to improve team performance and customer satisfaction.',
    icon: Zap
  },
  {
    title: 'Secure & Compliant',
    description: 'Enterprise-grade security with compliance for GDPR, HIPAA, and more.',
    icon: Shield
  },
  {
    title: 'Quick Implementation',
    description: 'Easy setup and integration with your existing phone system and CRM.',
    icon: Clock
  }
];

const detailedFeatures = [
  {
    title: 'Comprehensive Call Analysis',
    description: 'Our AI-powered platform analyzes every aspect of your customer conversations.',
    bullets: [
      'Sentiment analysis to understand customer emotions',
      'Key topic extraction and categorization',
      'Speech pattern and conversation flow analysis',
      'Custom metrics and KPI tracking',
      'Automated quality scoring'
    ]
  },
  {
    title: 'Team Performance Optimization',
    description: 'Help your team improve with data-driven insights and coaching opportunities.',
    bullets: [
      'Individual and team performance dashboards',
      'Automated coaching suggestions',
      'Best practices identification',
      'Performance trend analysis',
      'Customizable scoring criteria'
    ]
  },
  {
    title: 'Integration & Automation',
    description: 'Seamlessly connect with your existing tools and automate your workflow.',
    bullets: [
      'CRM integration (Salesforce, HubSpot, etc.)',
      'API access for custom integrations',
      'Automated reporting and alerts',
      'Workflow automation triggers',
      'Data export and backup options'
    ]
  }
];

function Check(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="pt-32 pb-16 text-center">
        <h1 className="text-5xl font-bold mb-6">
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Transform Your Customer Conversations
          </span>
        </h1>
        <p className="text-xl text-neutral-600 max-w-3xl mx-auto mb-8">
          AI-powered call analytics platform that helps you understand and improve customer interactions
        </p>
        <a
          href="/contact"
          className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
        >
          Get Started
        </a>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Powerful Features for Smart Call Analytics
            </span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Transform your customer conversations into actionable insights with our advanced AI-powered analytics platform
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature) => (
            <div key={feature.title} className="bg-white rounded-xl shadow-lg p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-neutral-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Detailed Features */}
        {detailedFeatures.map((section, index) => (
          <div key={section.title} className={`py-16 ${index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={index % 2 === 0 ? 'order-1' : 'order-1 lg:order-2'}>
                  <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
                  <p className="text-lg text-neutral-600 mb-6">{section.description}</p>
                  <ul className="space-y-4">
                    {section.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                        <span className="text-neutral-600">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={index % 2 === 0 ? 'order-2' : 'order-2 lg:order-1'}>
                  <div className="bg-neutral-100 rounded-xl p-8 aspect-video">
                    <div className="w-full h-full bg-neutral-200 rounded-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}