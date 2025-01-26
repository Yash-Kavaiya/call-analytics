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
  Save
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

  return (
    <div className="p-8 pt-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-500">Manage your account and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notifications */}
          <SettingsCard
            title="Notification Preferences"
            icon={<Bell className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <ToggleItem
                label="Email Alerts"
                description="Receive important alerts via email"
                checked={notificationSettings.emailAlerts}
                onChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailAlerts: checked }))}
              />
              <ToggleItem
                label="Desktop Notifications"
                description="Show desktop notifications for important events"
                checked={notificationSettings.desktopNotifications}
                onChange={(checked) => setNotificationSettings(prev => ({ ...prev, desktopNotifications: checked }))}
              />
              <ToggleItem
                label="Call Summaries"
                description="Receive summaries after each call"
                checked={notificationSettings.callSummaries}
                onChange={(checked) => setNotificationSettings(prev => ({ ...prev, callSummaries: checked }))}
              />
              <ToggleItem
                label="Weekly Reports"
                description="Get weekly performance reports"
                checked={notificationSettings.weeklyReports}
                onChange={(checked) => setNotificationSettings(prev => ({ ...prev, weeklyReports: checked }))}
              />
            </div>
          </SettingsCard>

          {/* Integrations */}
          <SettingsCard
            title="Integrations"
            icon={<Sliders className="h-5 w-5" />}
          >
            <div className="space-y-4">
              {Object.entries(integrationStatus).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                  <div>
                    <h4 className="font-medium capitalize">{service}</h4>
                    <p className="text-sm text-neutral-500">
                      {status ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      status 
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {status ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </SettingsCard>

          {/* Security Settings */}
          <SettingsCard
            title="Security Settings"
            icon={<Shield className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-neutral-500">Add an extra layer of security</p>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">
                  Enable
                </button>
              </div>
              <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-lg">
                <div>
                  <h4 className="font-medium">API Keys</h4>
                  <p className="text-sm text-neutral-500">Manage your API keys</p>
                </div>
                <button className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50">
                  Manage
                </button>
              </div>
            </div>
          </SettingsCard>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Storage Usage */}
          <SettingsCard
            title="Storage Usage"
            icon={<Database className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-neutral-600">Used Space</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }} />
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  15GB of 20GB used
                </p>
              </div>
              <button className="w-full px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium hover:bg-neutral-50">
                Upgrade Storage
              </button>
            </div>
          </SettingsCard>

          {/* Language Settings */}
          <SettingsCard
            title="Language & Region"
            icon={<Globe className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <select className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                <option>English (US)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
              <select className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
              </select>
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ title, icon, children }: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-purple-600">{icon}</span>
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
}

function ToggleItem({ label, description, checked, onChange }: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
      <div>
        <h4 className="font-medium">{label}</h4>
        <p className="text-sm text-neutral-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-purple-600' : 'bg-neutral-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}