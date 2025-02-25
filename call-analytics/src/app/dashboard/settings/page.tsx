'use client';

import { useState } from 'react';
import {
  Bell,
  Key,
  Globe,
  Shield,
  Database,
  Sliders,
  CheckCircle,
  XCircle,
  Save,
  ChevronLeft,
  ChevronRight,
  Zap,
  Lock,
  FileText,
  Cloud,
  Clock,
  AlertCircle,
  Smartphone,
  Mail,
  BarChart2,
  RefreshCw,
  Settings,
  ArrowRight
} from 'lucide-react';

export default function SettingsPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    desktopNotifications: true,
    callSummaries: true,
    weeklyReports: false
  });

  const [integrationStatus, setIntegrationStatus] = useState({
    salesforce: true,
    hubspot: false,
    zendesk: true,
    slack: true
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const [activeSection, setActiveSection] = useState('notifications');
  
  // Function to handle notification toggle changes
  const handleNotificationChange = (key, value) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };
  
  // Function to handle integration status changes
  const handleIntegrationChange = (key) => {
    setIntegrationStatus(prev => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  return (
    <div className="p-8 pt-24 bg-gradient-to-br from-indigo-50/40 to-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">
            Settings
          </h1>
          <p className="text-gray-500 mt-1">Customize your experience and application preferences</p>
        </div>
        
        {hasChanges && (
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-sm hover:shadow-md hover:from-indigo-500 hover:to-indigo-400 transition-all duration-200 self-end">
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        )}
      </div>
      
      {/* Settings Navigation Tabs */}
      <div className="flex overflow-x-auto mb-6 pb-2 -mx-2 px-2">
        <button 
          onClick={() => setActiveSection('notifications')}
          className={`px-4 py-2 mr-2 rounded-xl whitespace-nowrap text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
            activeSection === 'notifications' 
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
              : 'bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200'
          }`}
        >
          <Bell className="h-4 w-4" />
          Notifications
        </button>
        <button 
          onClick={() => setActiveSection('integrations')}
          className={`px-4 py-2 mr-2 rounded-xl whitespace-nowrap text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
            activeSection === 'integrations' 
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
              : 'bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200'
          }`}
        >
          <Sliders className="h-4 w-4" />
          Integrations
        </button>
        <button 
          onClick={() => setActiveSection('security')}
          className={`px-4 py-2 mr-2 rounded-xl whitespace-nowrap text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
            activeSection === 'security' 
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
              : 'bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200'
          }`}
        >
          <Shield className="h-4 w-4" />
          Security
        </button>
        <button 
          onClick={() => setActiveSection('storage')}
          className={`px-4 py-2 mr-2 rounded-xl whitespace-nowrap text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
            activeSection === 'storage' 
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
              : 'bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200'
          }`}
        >
          <Database className="h-4 w-4" />
          Storage
        </button>
        <button 
          onClick={() => setActiveSection('language')}
          className={`px-4 py-2 mr-2 rounded-xl whitespace-nowrap text-sm font-medium flex items-center gap-2 transition-all duration-200 ${
            activeSection === 'language' 
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
              : 'bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200'
          }`}
        >
          <Globe className="h-4 w-4" />
          Language
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Main Settings Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Notifications */}
          <SettingsCard
            title="Notification Preferences"
            icon={<Bell className="h-5 w-5" />}
            subtitle="Manage how you receive updates and alerts"
            visible={activeSection === 'notifications' || activeSection === 'all'}
          >
            <div className="space-y-3 mt-2">
              <ToggleItem
                label="Email Alerts"
                description="Receive important alerts via email"
                icon={<Mail className="h-4 w-4" />}
                checked={notificationSettings.emailAlerts}
                onChange={(checked) => handleNotificationChange('emailAlerts', checked)}
              />
              <ToggleItem
                label="Desktop Notifications"
                description="Show desktop notifications for important events"
                icon={<Smartphone className="h-4 w-4" />}
                checked={notificationSettings.desktopNotifications}
                onChange={(checked) => handleNotificationChange('desktopNotifications', checked)}
              />
              <ToggleItem
                label="Call Summaries"
                description="Receive summaries after each call"
                icon={<FileText className="h-4 w-4" />}
                checked={notificationSettings.callSummaries}
                onChange={(checked) => handleNotificationChange('callSummaries', checked)}
              />
              <ToggleItem
                label="Weekly Reports"
                description="Get weekly performance reports"
                icon={<BarChart2 className="h-4 w-4" />}
                checked={notificationSettings.weeklyReports}
                onChange={(checked) => handleNotificationChange('weeklyReports', checked)}
              />
            </div>
          </SettingsCard>

          {/* Integrations */}
          <SettingsCard
            title="Connected Services"
            icon={<Sliders className="h-5 w-5" />}
            subtitle="Manage your integrated third-party applications"
            visible={activeSection === 'integrations' || activeSection === 'all'}
          >
            <div className="space-y-3 mt-2">
              {Object.entries(integrationStatus).map(([service, status]) => (
                <IntegrationItem 
                  key={service}
                  service={service}
                  status={status}
                  onChange={() => handleIntegrationChange(service)}
                />
              ))}
            </div>
          </SettingsCard>

          {/* Security Settings */}
          <SettingsCard
            title="Security Settings"
            icon={<Shield className="h-5 w-5" />}
            subtitle="Protect your account and manage access"
            visible={activeSection === 'security' || activeSection === 'all'}
          >
            <div className="space-y-3 mt-2">
              <SecurityItem
                title="Two-Factor Authentication"
                description="Add an extra layer of security to your account"
                icon={<Lock className="h-4 w-4" />}
                buttonText="Enable"
                buttonVariant="primary"
              />
              <SecurityItem
                title="API Keys"
                description="Manage your API keys and application access"
                icon={<Key className="h-4 w-4" />}
                buttonText="Manage"
                buttonVariant="secondary"
              />
              <SecurityItem
                title="Password Change"
                description="Update your account password periodically"
                icon={<RefreshCw className="h-4 w-4" />}
                buttonText="Change"
                buttonVariant="secondary"
              />
              <SecurityItem
                title="Security Log"
                description="Review recent account activity and login attempts"
                icon={<AlertCircle className="h-4 w-4" />}
                buttonText="View"
                buttonVariant="secondary"
              />
            </div>
          </SettingsCard>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Storage Usage */}
          <SettingsCard
            title="Storage Usage"
            icon={<Database className="h-5 w-5" />}
            subtitle="Manage your cloud storage allocation"
            visible={activeSection === 'storage' || activeSection === 'all'}
          >
            <div className="space-y-4 mt-4">
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-700">Used Space</span>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-2 rounded-full"
                    style={{ width: '75%' }} 
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>15GB used</span>
                  <span>20GB total</span>
                </div>
              </div>
              <button className="w-full px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl border border-indigo-100 transition-colors duration-200">
                <Zap className="h-4 w-4" />
                Upgrade Storage
              </button>
            </div>
          </SettingsCard>

          {/* Language Settings */}
          <SettingsCard
            title="Language & Region"
            icon={<Globe className="h-5 w-5" />}
            subtitle="Configure localization preferences"
            visible={activeSection === 'language' || activeSection === 'all'}
          >
            <div className="space-y-4 mt-4">
              <div className="relative">
                <Globe className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                  <option>English (US)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
                <ChevronRight className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 -rotate-90 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <Settings className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                </select>
                <ChevronRight className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 -rotate-90 text-gray-400 pointer-events-none" />
              </div>
              
              <div className="relative">
                <Clock className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                  <option>24-hour Time (14:30)</option>
                  <option>12-hour Time (2:30 PM)</option>
                </select>
                <ChevronRight className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 -rotate-90 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </SettingsCard>
          
          {/* Quick Help */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-400 rounded-xl p-0.5 shadow-sm">
            <div className="bg-white p-5 rounded-lg flex flex-col items-start">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-500 mb-4">
                Find answers in our documentation or contact support for assistance
              </p>
              <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                View Documentation 
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ title, icon, subtitle, children, visible = true }: {
  title: string;
  icon: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  visible?: boolean;
}) {
  if (!visible) return null;
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="p-2 bg-indigo-50 rounded-lg text-indigo-600">{icon}</span>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function ToggleItem({ label, description, icon, checked, onChange }: {
  label: string;
  description: string;
  icon?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-50/40 rounded-xl transition-colors duration-200 border border-gray-100">
      <div className="flex items-start gap-3">
        {icon && <span className="mt-0.5 text-gray-400">{icon}</span>}
        <div>
          <h4 className="font-medium text-gray-900">{label}</h4>
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
          checked 
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500' 
            : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

function IntegrationItem({ service, status, onChange }: {
  service: string;
  status: boolean;
  onChange: () => void;
}) {
  const getServiceIcon = (serviceName) => {
    // This would ideally use actual service logos
    switch(serviceName.toLowerCase()) {
      case 'salesforce':
        return <Cloud className="h-5 w-5 text-blue-600" />;
      case 'hubspot':
        return <Database className="h-5 w-5 text-orange-600" />;
      case 'zendesk':
        return <MessageSquare className="h-5 w-5 text-green-600" />;
      case 'slack':
        return <MessageCircle className="h-5 w-5 text-purple-600" />;
      default:
        return <Zap className="h-5 w-5 text-gray-600" />;
    }
  };
  
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-50/40 rounded-xl transition-colors duration-200 border border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center border border-gray-100 shadow-sm">
          {getServiceIcon(service)}
        </div>
        <div>
          <h4 className="font-medium text-gray-900 capitalize">{service}</h4>
          <p className="text-sm flex items-center gap-1">
            {status 
              ? <span className="text-green-600 flex items-center"><CheckCircle className="h-3 w-3 mr-1" /> Connected</span>
              : <span className="text-gray-500 flex items-center"><XCircle className="h-3 w-3 mr-1" /> Not connected</span>
            }
          </p>
        </div>
      </div>
      <button
        onClick={onChange}
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          status 
            ? 'border border-red-200 text-red-600 hover:bg-red-50'
            : 'border border-green-200 text-green-600 hover:bg-green-50'
        }`}
      >
        {status ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
}

function SecurityItem({ title, description, icon, buttonText, buttonVariant }: {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary';
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-50/40 rounded-xl transition-colors duration-200 border border-gray-100">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-gray-400">{icon}</span>
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        </div>
      </div>
      <button
        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          buttonVariant === 'primary'
            ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-sm hover:shadow hover:from-indigo-500 hover:to-indigo-400'
            : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200'
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}

// These components would be imported from a component library
const MessageSquare = ({ className }) => {
  return <div className={className}>📝</div>; // Simplified for the example
};

const MessageCircle = ({ className }) => {
  return <div className={className}>💬</div>; // Simplified for the example
};