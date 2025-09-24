'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Settings,
  Save,
  User,
  Bell,
  Shield,
  Database,
  Mail,
  Globe,
  Palette,
  Key,
  CreditCard,
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react'

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [unsavedChanges, setUnsavedChanges] = useState(false)

  const settingSections = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'profile', name: 'Admin Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'email', name: 'Email Settings', icon: Mail },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'integrations', name: 'Integrations', icon: Globe },
    { id: 'backup', name: 'Backup & Data', icon: Database }
  ]

  const stats = [
    {
      title: "System Status",
      value: "Operational",
      description: "All systems running",
      icon: CheckCircle2,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Last Backup",
      value: "2 hours ago",
      description: "Database backup",
      icon: Database,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Active Sessions",
      value: "847",
      description: "Current users",
      icon: User,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Security Score",
      value: "98%",
      description: "System security",
      icon: Shield,
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  const renderSettingContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Platform Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                  <input
                    type="text"
                    defaultValue="ScoreSmart LMS"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>UTC</option>
                    <option>Asia/Kolkata</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>USD ($)</option>
                    <option>INR (₹)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Administrator Profile</h3>
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  A
                </div>
                <div>
                  <Button variant="outline" className="mr-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Admin User"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    defaultValue="admin@scoresmart.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <input
                    type="text"
                    defaultValue="Super Administrator"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Change Password</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Enable 2FA</p>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Key className="w-4 h-4 mr-2" />
                      Setup 2FA
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { title: "New Student Registrations", desc: "Get notified when new students sign up" },
                  { title: "Payment Notifications", desc: "Receive alerts for successful and failed payments" },
                  { title: "Support Tickets", desc: "Get notified about new support requests" },
                  { title: "System Updates", desc: "Receive notifications about system maintenance" },
                  { title: "Security Alerts", desc: "Get alerts about potential security issues" }
                ].map((notification, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{notification.title}</p>
                      <p className="text-sm text-gray-600">{notification.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
            <p className="text-gray-500">This section is under development</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                System Settings
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Configure platform settings and preferences
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {unsavedChanges && (
              <div className="flex items-center text-orange-600 text-sm">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Unsaved changes
              </div>
            )}
            <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export Config
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-slate-400 text-xs mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Settings Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Settings</h3>
              <nav className="space-y-2">
                {settingSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{section.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
              {renderSettingContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}