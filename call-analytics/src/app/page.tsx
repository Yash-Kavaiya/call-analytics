'use client';

import { Activity, Brain, Clock, FileText, Shield, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
      {/* Hero Section with background gradient */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 -left-64 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 -right-64 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-80 left-40 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Transform Your Customer Conversations
            </span>
          </h1>
          <p className="text-xl text-neutral-700 max-w-3xl mx-auto mb-10">
            AI-powered call analytics platform that helps you understand and improve customer interactions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-white text-purple-600 border border-purple-200 px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
            >
              View Demo
            </Link>
          </div>
          
          {/* Abstract representation of analytics dashboard */}
          <div className="max-w-4xl mx-auto mt-12 bg-white rounded-xl shadow-xl p-2 transition-all duration-300 transform hover:scale-105">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 sm:p-8">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg h-10 animate-pulse"></div>
                <div className="bg-white rounded-lg h-10 animate-pulse"></div>
                <div className="bg-white rounded-lg h-10 animate-pulse"></div>
              </div>
              <div className="h-64 bg-white/80 rounded-lg mb-4 flex items-center justify-center">
                <div className="w-full max-w-2xl mx-auto">
                  <div className="h-4 bg-purple-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-indigo-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-purple-200 rounded w-2/3 mb-3"></div>
                  <div className="h-40 w-full bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg h-12 animate-pulse"></div>
                <div className="bg-white rounded-lg h-12 animate-pulse"></div>
                <div className="bg-white rounded-lg h-12 animate-pulse"></div>
                <div className="bg-white rounded-lg h-12 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Powerful Features for Smart Call Analytics
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto">
            Transform your customer conversations into actionable insights with our advanced AI-powered analytics platform
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {mainFeatures.map((feature, index) => (
            <div 
              key={feature.title} 
              className="group bg-white rounded-xl shadow-md hover:shadow-xl p-6 transition-all duration-300 border border-neutral-100 hover:border-purple-200"
            >
              <div className="w-14 h-14 mb-6 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 p-0.5">
                <div className="w-full h-full bg-white rounded-md flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:to-indigo-600 transition-all duration-500">
                  <feature.icon className="h-6 w-6 text-purple-600 group-hover:text-white transition-colors duration-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-800 group-hover:text-purple-600 transition-colors">{feature.title}</h3>
              <p className="text-neutral-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Detailed Features */}
        {detailedFeatures.map((section, index) => (
          <div key={section.title} className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={index % 2 === 0 ? 'order-1' : 'order-1 lg:order-2'}>
                  <h2 className="text-3xl font-bold mb-5 text-neutral-800">{section.title}</h2>
                  <p className="text-lg text-neutral-600 mb-8">{section.description}</p>
                  <ul className="space-y-5">
                    {section.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </div>
                        <span className="text-neutral-700">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={index % 2 === 0 ? 'order-2' : 'order-2 lg:order-1'}>
                  <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl p-8 shadow-lg transform hover:scale-105 transition-all duration-300">
                    <div className="w-full h-64 bg-white/60 backdrop-blur-sm rounded-lg shadow-inner flex items-center justify-center">
                      <div className="w-3/4 h-4/5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4">
                        {index === 0 && (
                          <div className="space-y-3">
                            <div className="h-3 bg-purple-200 rounded w-3/4"></div>
                            <div className="h-3 bg-indigo-200 rounded w-2/3"></div>
                            <div className="h-3 bg-purple-200 rounded w-1/2"></div>
                            <div className="h-24 bg-gradient-to-r from-purple-100 to-indigo-100 rounded mt-4"></div>
                            <div className="grid grid-cols-3 gap-2 mt-4">
                              <div className="h-10 bg-white rounded"></div>
                              <div className="h-10 bg-white rounded"></div>
                              <div className="h-10 bg-white rounded"></div>
                            </div>
                          </div>
                        )}
                        {index === 1 && (
                          <div className="grid grid-cols-2 gap-3 h-full">
                            <div className="bg-white rounded p-2">
                              <div className="h-2 bg-purple-200 rounded w-1/2 mb-2"></div>
                              <div className="h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded"></div>
                            </div>
                            <div className="bg-white rounded p-2">
                              <div className="h-2 bg-indigo-200 rounded w-1/2 mb-2"></div>
                              <div className="h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded"></div>
                            </div>
                            <div className="bg-white rounded p-2">
                              <div className="h-2 bg-purple-200 rounded w-1/2 mb-2"></div>
                              <div className="h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded"></div>
                            </div>
                            <div className="bg-white rounded p-2">
                              <div className="h-2 bg-indigo-200 rounded w-1/2 mb-2"></div>
                              <div className="h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded"></div>
                            </div>
                          </div>
                        )}
                        {index === 2 && (
                          <div className="h-full flex flex-col justify-between">
                            <div className="h-20 bg-white rounded p-3">
                              <div className="h-2 bg-purple-200 rounded w-1/2 mb-2"></div>
                              <div className="h-8 bg-indigo-100 rounded"></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="h-12 bg-purple-400/20 rounded"></div>
                              <div className="h-12 bg-indigo-400/20 rounded"></div>
                              <div className="h-12 bg-purple-400/20 rounded"></div>
                            </div>
                            <div className="h-20 bg-white rounded p-3">
                              <div className="h-2 bg-indigo-200 rounded w-1/2 mb-2"></div>
                              <div className="h-8 bg-purple-100 rounded"></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-0.5 shadow-xl">
            <div className="bg-white rounded-lg px-8 py-12">
              <h2 className="text-3xl font-bold mb-6 text-neutral-800">Ready to transform your calls into insights?</h2>
              <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
                Join thousands of companies using our platform to improve customer interactions and drive growth
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Get Started Today
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add this to your globals.css file
// .animate-blob {
//   animation: blob 7s infinite;
// }
// .animation-delay-2000 {
//   animation-delay: 2s;
// }
// .animation-delay-4000 {
//   animation-delay: 4s;
// }
// @keyframes blob {
//   0% {
//     transform: translate(0px, 0px) scale(1);
//   }
//   33% {
//     transform: translate(30px, -50px) scale(1.1);
//   }
//   66% {
//     transform: translate(-20px, 20px) scale(0.9);
//   }
//   100% {
//     transform: translate(0px, 0px) scale(1);
//   }
// }