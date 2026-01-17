import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Users,
  Database,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  Home, ChevronRight, ChevronLeft, Search, BarChart3, FileText
} from 'lucide-react';
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    systemName: 'saafsafai Municipal Platform',
    systemDescription: 'Digital democracy platform for municipal governance',
    timezone: 'America/New_York',
    language: 'English',
    maintenanceMode: false,
    twoFactorAuth: true,
    sessionTimeout: '30',
    passwordExpiry: '90',
    maxLoginAttempts: '3',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    criticalAlerts: true,
    reportReminders: true,
    autoApproveRegistrations: false,
    requireEmailVerification: true,
    allowPublicRegistration: true,
    maxUsersPerDistrict: '500',
    votingEnabled: true,
    earlyVoting: true,
    proxyVoting: false,
    voteVerification: true,
    resultPublication: 'immediate',
    smtpServer: 'smtp.saafsafai.gov',
    smtpPort: '587',
    smtpUsername: 'admin@saafsafai.gov',
    smtpPassword: '',
    emailFromName: 'saafsafai Administration',
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: '30',
    backupLocation: 'cloud'
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/admin/settings');
  const [saveStatus, setSaveStatus] = useState(null);

  const sidebarMenu = [
    { key: 'dashboard', label: 'Dashboard', icon: Home, route: '/admin/dashboard' },
    { key: 'analytics', label: 'Analytics', icon: BarChart3, route: '/admin/analytics' },
    { key: 'users', label: 'Users', icon: Users, route: '/admin/users' },
    { key: 'documents', label: 'Documents', icon: FileText, route: '/admin/documents' },
    { key: 'notifications', label: 'Notifications', icon: Bell, route: '/admin/notifications' },
    { key: 'settings', label: 'Settings', icon: Settings, route: '/admin/settings' },
  ];

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'users', name: 'User Management', icon: Users },
    { id: 'voting', name: 'Voting System', icon: BarChart3 },
    { id: 'email', name: 'Email Config', icon: Mail },
    { id: 'backup', name: 'Backup & Data', icon: Database }
  ];

  const handleInputChange = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  // --- Render Functions for Each Tab ---

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">System Name</label>
          <input
            type="text"
            value={settings.systemName}
            onChange={(e) => handleInputChange('systemName', e.target.value)}
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Timezone</label>
          <select
            value={settings.timezone}
            onChange={(e) => handleInputChange('timezone', e.target.value)}
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2">System Description</label>
        <textarea
          value={settings.systemDescription}
          onChange={(e) => handleInputChange('systemDescription', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Maintenance Mode</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">Temporarily disable public access for system updates</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-6">
        <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-4 flex items-center">
          <Lock className="h-5 w-5 mr-2" />
          Authentication Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-500">Two-Factor Authentication</label>
              <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.sessionTimeout}
            onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Password Expiry (days)</label>
          <input
            type="number"
            value={settings.passwordExpiry}
            onChange={(e) => handleInputChange('passwordExpiry', e.target.value)}
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Max Login Attempts</label>
          <input
            type="number"
            value={settings.maxLoginAttempts}
            onChange={(e) => handleInputChange('maxLoginAttempts', e.target.value)}
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={settings.currentPassword}
                onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={settings.newPassword}
              onChange={(e) => handleInputChange('newPassword', e.target.value)}
              className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Confirm Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={settings.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email', icon: Mail },
          { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS', icon: Smartphone },
          { key: 'pushNotifications', label: 'Push Notifications', desc: 'Browser push notifications', icon: Bell },
          { key: 'criticalAlerts', label: 'Critical Alerts', desc: 'Immediate alerts for critical issues', icon: AlertTriangle }
        ].map(({ key, label, desc, icon: Icon }) => (
          <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-gray-200">{label}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={(e) => handleInputChange(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: 'autoApproveRegistrations', label: 'Auto-approve Registrations', desc: 'Automatically approve new user registrations' },
          { key: 'requireEmailVerification', label: 'Email Verification Required', desc: 'Users must verify email before activation' },
          { key: 'allowPublicRegistration', label: 'Allow Public Registration', desc: 'Enable public user registration' }
        ].map(({ key, label, desc }) => (
          <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800 dark:text-gray-200">{label}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={(e) => handleInputChange(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2">Maximum Users Per District</label>
        <input
          type="number"
          value={settings.maxUsersPerDistrict}
          onChange={(e) => handleInputChange('maxUsersPerDistrict', e.target.value)}
          className="w-full md:w-1/3 px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderVotingSettings = () => (
    <div className="space-y-6">
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-lg p-6">
        <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-4">Voting System Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { key: 'votingEnabled', label: 'Enable Voting System', desc: 'Allow citizens to cast votes' },
            { key: 'earlyVoting', label: 'Early Voting', desc: 'Enable early voting periods' },
            { key: 'proxyVoting', label: 'Proxy Voting', desc: 'Allow voting by proxy' },
            { key: 'voteVerification', label: 'Vote Verification', desc: 'Enable voter verification system' }
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-500">{label}</h4>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[key]}
                  onChange={(e) => handleInputChange(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2">Result Publication</label>
        <select
          value={settings.resultPublication}
          onChange={(e) => handleInputChange('resultPublication', e.target.value)}
          className="w-full md:w-1/2 px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        >
          <option value="immediate">Immediate</option>
          <option value="delayed">Delayed (24 hours)</option>
          <option value="manual">Manual approval required</option>
        </select>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">SMTP Server</label>
          <input
            type="text"
            value={settings.smtpServer}
            onChange={(e) => handleInputChange('smtpServer', e.target.value)}
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">SMTP Port</label>
          <input
            type="text"
            value={settings.smtpPort}
            onChange={(e) => handleInputChange('smtpPort', e.target.value)}
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Username</label>
          <input
            type="email"
            value={settings.smtpUsername}
            onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Password</label>
          <input
            type="password"
            value={settings.smtpPassword}
            onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2">From Name</label>
        <input
          type="text"
          value={settings.emailFromName}
          onChange={(e) => handleInputChange('emailFromName', e.target.value)}
          className="w-full md:w-1/2 px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-blue-800 dark:text-blue-300">Automatic Backup</h3>
            <p className="text-sm text-blue-700 dark:text-blue-400">Enable scheduled system backups</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoBackup}
              onChange={(e) => handleInputChange('autoBackup', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Backup Frequency</label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => handleInputChange('backupFrequency', e.target.value)}
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Retention Period (days)</label>
          <input
            type="number"
            value={settings.retentionPeriod}
            onChange={(e) => handleInputChange('retentionPeriod', e.target.value)}
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Backup Location</label>
          <select
            value={settings.backupLocation}
            onChange={(e) => handleInputChange('backupLocation', e.target.value)}
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="cloud">Cloud Storage</option>
            <option value="local">Local Storage</option>
            <option value="both">Both</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'users': return renderUserManagement();
      case 'voting': return renderVotingSettings();
      case 'email': return renderEmailSettings();
      case 'backup': return renderBackupSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-emerald-100">
      {/* Sidebar - untouched */}
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setIsSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg hover:bg-green-100 text-emerald-600 lg:hidden"
        style={{ display: isSidebarOpen ? 'none' : 'block' }}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
      <aside className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out border-r border-green-100 flex flex-col shadow-xl bg-white
          ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-16 -translate-x-full lg:translate-x-0'}`}>
        <div className="relative flex items-center justify-between p-4 border-b border-green-100">
          <div className={`flex items-center transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            {isSidebarOpen && (
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                saafsafai
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2 rounded-lg hover:bg-green-100 transition-all duration-200 ${!isSidebarOpen ? 'mx-auto' : ''}`} >
            {isSidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-green-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-green-600" />
            )}
          </button>
        </div>
        {isSidebarOpen && (
          <div className="p-4 border-b border-green-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-green-50 rounded-lg text-sm border-0 focus:ring-2 focus:ring-emerald-300 text-green-900 placeholder-green-500"
              />
            </div>
          </div>
        )}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarMenu.map((item) => {
            const isActive = item.route === activeRoute;
            const Icon = item.icon;
            return (
              <div key={item.key} className="relative group">
                <button
                  type="button"
                  className={`
                    w-full flex items-center py-3 px-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden
                    ${isSidebarOpen ? '' : 'justify-center'}
                    ${isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 scale-105'
                      : 'text-green-800 hover:bg-green-100 hover:text-green-900 hover:shadow-md'
                    }
                  `}
                  onClick={() => { setActiveRoute(item.route); navigate(item.route); }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {isActive && <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 opacity-10 rounded-xl" />}
                  <div className="relative z-10 flex items-center">
                    <Icon className={`w-5 h-5 transition-all duration-200 ${isSidebarOpen ? 'mr-3' : ''} ${isActive ? 'text-white' : 'text-green-600'}`} />
                    {isSidebarOpen && <span className="relative z-10">{item.label}</span>}
                  </div>
                </button>
              </div>
            );
          })}
        </nav>
      </aside>
      {/* Main settings UI */}
      <div className="px-4 md:px-8 pt-10 pb-16 lg:ml-64 max-w-7xl mx-auto">
        <div className="rounded-2xl shadow-xl border border-emerald-100 mb-8 p-6 bg-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-200 to-emerald-100 p-3 rounded-xl">
                <Settings className="h-7 w-7 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-emerald-800">System Settings</h1>
                <p className="text-green-600">Configure and manage your saafsafai platform</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {saveStatus === 'saving' && (
                <span className="flex items-center text-emerald-600"><RefreshCw className="h-4 w-4 animate-spin mr-2" /> Saving...</span>
              )}
              {saveStatus === 'success' && (
                <span className="flex items-center text-green-600"><CheckCircle className="h-4 w-4 mr-2" /> Settings Saved</span>
              )}
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving'}
                className="bg-emerald-700 hover:bg-emerald-900 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50 transition"
              >
                <Save className="h-4 w-4" /> Save Changes
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tabs Nav */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl shadow-lg border border-emerald-100 bg-white p-4">
              <nav className="space-y-2">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition text-base 
                        ${activeTab === tab.id
                          ? 'bg-emerald-100 text-emerald-700 font-semibold'
                          : 'text-green-800 hover:bg-green-50 hover:text-emerald-700'
                        }`
                      }
                    >
                      <Icon className="h-5 w-5" /> {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>
          {/* Tab Content */}
          <main className="lg:col-span-3">
            <div className="rounded-2xl shadow-lg border border-emerald-100 bg-white p-8">
              <h2 className="text-xl font-semibold text-emerald-800 mb-4">
                {tabs.find(tab => tab.id === activeTab)?.name}
              </h2>
              <div>{renderContent()}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
