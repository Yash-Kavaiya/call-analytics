'use client';

import { useState } from 'react';
import { 
  Activity, 
  Brain, 
  Clock, 
  FileText, 
  MessageSquare, 
  Shield, 
  Zap, 
  Check,
  ChevronRight,
  ArrowRight,
  Play,
  Users,
  BarChart2,
  LucideIcon,
  Star
} from 'lucide-react';

export default function Features() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50/40 to-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium">
              <Star className="h-4 w-4" />
              <span>Intelligent Call Analytics</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight max-w-4xl mx-auto">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
              Transform Conversations into Strategic Insights
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Elevate your customer interactions with AI-powered analytics that reveal patterns, sentiment, and opportunities in every conversation.
          </p>
        </div>

        <div className="flex justify-center mt-12 mb-16">
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-medium shadow-sm hover:shadow-md hover:from-indigo-500 hover:to-indigo-400 transition-all duration-200 flex items-center gap-2">
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="px-6 py-3 border border-gray-200 hover:border-indigo-200 text-gray-700 hover:text-indigo-600 rounded-xl font-medium transition-colors duration-200 flex items-center gap-2">
              <Play className="h-4 w-4" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        {/* Feature Navigation */}
        <div className="flex justify-center mb-16 overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex gap-2 p-1 bg-white rounded-xl shadow-sm border border-gray-100">
            <FeatureTab 
              icon={Activity} 
              label="Analytics" 
              active={activeTab === 'analytics'} 
              onClick={() => setActiveTab('analytics')}
            />
            <FeatureTab 
              icon={Brain} 
              label="AI Insights" 
              active={activeTab === 'ai'} 
              onClick={() => setActiveTab('ai')}
            />
            <FeatureTab 
              icon={Users} 
              label="Teams" 
              active={activeTab === 'teams'} 
              onClick={() => setActiveTab('teams')}
            />
            <FeatureTab 
              icon={Shield} 
              label="Security" 
              active={activeTab === 'security'} 
              onClick={() => setActiveTab('security')}
            />
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {mainFeatures.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>

        {/* Section Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gradient-to-br from-indigo-50/40 to-gray-50 px-6 text-lg font-medium text-gray-500">
              Core Capabilities
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Features */}
      {detailedFeatures.map((section, index) => (
        <div key={section.title} className={`py-24 ${index % 2 === 0 ? 'bg-white' : 'bg-gradient-to-br from-indigo-50/40 to-gray-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className={index % 2 === 0 ? 'order-1' : 'order-1 lg:order-2'}>
                <h2 className="text-3xl font-bold mb-4 text-gray-900">{section.title}</h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">{section.description}</p>
                <ul className="space-y-6">
                  {section.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="text-gray-700 leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-10">
                  <button className="text-indigo-600 font-medium flex items-center gap-2 hover:text-indigo-800 transition-colors">
                    <span>Learn more about {section.linkText}</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className={index % 2 === 0 ? 'order-2' : 'order-2 lg:order-1'}>
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-2xl blur opacity-20"></div>
                  <div className="relative bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="h-8 bg-gray-50 border-b border-gray-100 flex items-center px-4">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="bg-gradient-to-br from-indigo-50 to-gray-50 rounded-lg aspect-video flex items-center justify-center">
                        <section.icon className="h-16 w-16 text-indigo-400 opacity-80" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Proven Results</h2>
            <p className="text-indigo-100 max-w-3xl mx-auto">
              Our customers have experienced significant improvements in call quality, customer satisfaction, and operational efficiency.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-indigo-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to transform your customer conversations?</h2>
            <p className="text-xl text-gray-600 mb-10">
              Join thousands of companies using our platform to unlock insights and drive better outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-200">
                Get Started Free
              </button>
              <button className="px-8 py-4 border border-gray-200 hover:border-indigo-200 text-gray-700 hover:text-indigo-600 rounded-xl font-medium transition-colors duration-200">
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureTab({ icon: Icon, label, active, onClick }) {
  return (
    <button 
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active 
          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
          : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function FeatureCard({ feature, index }) {
  return (
    <div className="group relative bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-indigo-400 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></div>
      <div className="p-8">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-white rounded-lg flex items-center justify-center mb-6 border border-indigo-100 group-hover:scale-110 transition-transform duration-300">
          <feature.icon className="h-6 w-6 text-indigo-600" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
        <div className="flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-800 transition-colors">
          <span>Learn more</span>
          <ArrowRight className="h-4 w-4 ml-2 transform transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
}

const mainFeatures = [
  {
    title: 'Real-time Analytics',
    description: 'Monitor conversations as they happen with instant insights, trend detection, and live dashboards that keep you informed in the moment.',
    icon: Activity
  },
  {
    title: 'AI-Powered Insights',
    description: 'Our advanced machine learning algorithms analyze conversation patterns, sentiment shifts, and customer intent to reveal hidden opportunities.',
    icon: Brain
  },
  {
    title: 'Smart Transcription',
    description: 'Highly accurate, automated transcription with speaker recognition, intent detection, and contextual time-stamping capabilities.',
    icon: FileText
  },
  {
    title: 'Performance Metrics',
    description: 'Track team and individual performance with customizable KPIs that measure what matters most to your organization's success.',
    icon: BarChart2
  },
  {
    title: 'Enterprise Security',
    description: 'Bank-grade encryption and compliance frameworks ensure your data remains protected and meets industry regulations including GDPR and HIPAA.',
    icon: Shield
  },
  {
    title: 'Seamless Integration',
    description: 'Connect with your existing tech stack within minutes through our extensive API library and pre-built integrations with popular platforms.',
    icon: Zap
  }
];

const detailedFeatures = [
  {
    title: 'Comprehensive Conversation Intelligence',
    description: 'Our AI-powered platform analyzes every aspect of customer conversations to unlock valuable insights that drive better outcomes.',
    icon: Brain,
    linkText: 'our AI capabilities',
    bullets: [
      'Sentiment analysis captures emotional context and intensity throughout the conversation',
      'Key topic extraction automatically categorizes discussions for better organization',
      'Speech pattern analysis identifies successful conversation flows and techniques',
      'Custom metrics track the specific indicators that matter most to your business',
      'Automated quality scoring provides consistent evaluation across all interactions'
    ]
  },
  {
    title: 'Team Performance Optimization',
    description: 'Transform your team's effectiveness with data-driven insights that identify coaching opportunities and celebrate successes.',
    icon: Users,
    linkText: 'team performance features',
    bullets: [
      'Personalized dashboards for individuals and teams highlight strengths and improvement areas',
      'AI-generated coaching suggestions based on successful conversation patterns',
      'Automated identification of best practices from top-performing team members',
      'Historical trend analysis to track improvement over time with visual progress indicators',
      'Customizable scoring frameworks that align with your organization's unique goals'
    ]
  },
  {
    title: 'Seamless Integration Ecosystem',
    description: 'Connect your conversation intelligence with your existing workflow through our extensive integration capabilities.',
    icon: Zap,
    linkText: 'integration options',
    bullets: [
      'Native connections with major CRM platforms including Salesforce, HubSpot, and Microsoft Dynamics',
      'Comprehensive API access for developing custom integrations with your tech stack',
      'Automated reporting with scheduled delivery to key stakeholders in your preferred format',
      'Workflow automation triggers that initiate actions based on conversation insights',
      'Flexible data export options with secure cloud backup and compliance documentation'
    ]
  }
];

const stats = [
  { value: '30%', label: 'Increase in Customer Satisfaction' },
  { value: '42%', label: 'Improvement in First Call Resolution' },
  { value: '3.5x', label: 'ROI Within First 6 Months' },
  { value: '68%', label: 'Reduction in Training Time' }
];