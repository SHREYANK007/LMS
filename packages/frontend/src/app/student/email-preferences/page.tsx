'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Mail,
  Settings,
  Bell,
  Check,
  AlertCircle,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Send,
  Clock,
  Users,
  CreditCard,
  BookOpen,
  Star,
  Zap,
  Shield,
  Globe,
  Smartphone,
  MessageSquare,
  Calendar,
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react'
import {
  mockEmailTemplates,
  getEmailTemplate,
  mockIntegrationServices,
  integrationConfig
} from '@/data/mock/mockIntegrations'

export default function StudentEmailPreferencesPage() {
  const [activeTab, setActiveTab] = useState<'preferences' | 'templates' | 'history' | 'settings'>('preferences')
  const [emailPreferences, setEmailPreferences] = useState({
    welcome: true,
    sessionReminders: true,
    paymentConfirmations: true,
    courseUpdates: true,
    newsletters: false,
    promotions: false,
    systemNotifications: true,
    securityAlerts: true
  })
  const [notificationTiming, setNotificationTiming] = useState({
    sessionReminders: '24h',
    paymentReminders: '7d',
    courseDeadlines: '3d'
  })

  const handlePreferenceChange = (key: string, value: boolean) => {
    setEmailPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleTimingChange = (key: string, value: string) => {
    setNotificationTiming(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const sendTestEmail = async (templateType: string) => {
    try {
      const result = await mockIntegrationServices.email.sendEmail(
        'student@example.com',
        templateType as any,
        {
          studentName: 'John Doe',
          courseType: 'PTE',
          loginUrl: 'https://scoresmart.com/login'
        }
      )
      console.log('Test email sent:', result)
      // Show success message
    } catch (error) {
      console.error('Failed to send test email:', error)
    }
  }

  const preferenceCategories = [
    {
      id: 'essential',
      name: 'Essential Communications',
      description: 'Important updates that affect your account and learning',
      preferences: [
        {
          key: 'welcome',
          label: 'Welcome emails',
          description: 'Account setup and onboarding information',
          icon: Mail,
          required: true
        },
        {
          key: 'sessionReminders',
          label: 'Session reminders',
          description: 'Notifications about upcoming sessions',
          icon: Clock,
          required: false
        },
        {
          key: 'paymentConfirmations',
          label: 'Payment confirmations',
          description: 'Receipts and payment status updates',
          icon: CreditCard,
          required: true
        },
        {
          key: 'systemNotifications',
          label: 'System notifications',
          description: 'Service updates and maintenance notices',
          icon: Settings,
          required: true
        },
        {
          key: 'securityAlerts',
          label: 'Security alerts',
          description: 'Login attempts and security-related notifications',
          icon: Shield,
          required: true
        }
      ]
    },
    {
      id: 'educational',
      name: 'Educational Content',
      description: 'Learning resources and course-related updates',
      preferences: [
        {
          key: 'courseUpdates',
          label: 'Course updates',
          description: 'New materials and curriculum changes',
          icon: BookOpen,
          required: false
        },
        {
          key: 'newsletters',
          label: 'Educational newsletters',
          description: 'Tips, insights, and success stories',
          icon: MessageSquare,
          required: false
        }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing & Promotions',
      description: 'Special offers and promotional content',
      preferences: [
        {
          key: 'promotions',
          label: 'Promotional offers',
          description: 'Discounts and special deals',
          icon: Star,
          required: false
        }
      ]
    }
  ]

  return (
    <div className="h-screen overflow-y-auto scrollbar-premium bg-gray-25">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Preferences</h1>
              <p className="text-gray-600">Manage your email notifications and communication settings</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-bold text-gray-900">
                  {Object.values(emailPreferences).filter(Boolean).length}
                </span>
              </div>
              <p className="text-xs font-medium text-gray-600">Active</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <Bell className="w-5 h-5 text-green-600" />
                <span className="text-lg font-bold text-gray-900">24h</span>
              </div>
              <p className="text-xs font-medium text-gray-600">Reminder Time</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <Check className="w-5 h-5 text-purple-600" />
                <span className="text-lg font-bold text-gray-900">98%</span>
              </div>
              <p className="text-xs font-medium text-gray-600">Delivery Rate</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-5 h-5 text-red-600" />
                <span className="text-lg font-bold text-gray-900">0</span>
              </div>
              <p className="text-xs font-medium text-gray-600">Spam Reports</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'preferences', label: 'Preferences', icon: Settings },
            { id: 'templates', label: 'Templates', icon: Mail },
            { id: 'history', label: 'History', icon: Clock },
            { id: 'settings', label: 'Settings', icon: Globe }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            {preferenceCategories.map((category) => (
              <div key={category.id} className="card-elevated">
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </div>

                  <div className="space-y-4">
                    {category.preferences.map((pref) => (
                      <div key={pref.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <pref.icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{pref.label}</p>
                              {pref.required && (
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{pref.description}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={emailPreferences[pref.key as keyof typeof emailPreferences]}
                            onChange={(e) => handlePreferenceChange(pref.key, e.target.checked)}
                            disabled={pref.required}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Timing Preferences */}
            <div className="card-elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Timing</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Session reminders</p>
                        <p className="text-sm text-gray-600">How early to send session reminders</p>
                      </div>
                    </div>
                    <select
                      value={notificationTiming.sessionReminders}
                      onChange={(e) => handleTimingChange('sessionReminders', e.target.value)}
                      className="border border-gray-300 rounded-lg text-sm px-3 py-2"
                    >
                      <option value="1h">1 hour before</option>
                      <option value="2h">2 hours before</option>
                      <option value="24h">24 hours before</option>
                      <option value="48h">48 hours before</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Payment reminders</p>
                        <p className="text-sm text-gray-600">Renewal and payment due date reminders</p>
                      </div>
                    </div>
                    <select
                      value={notificationTiming.paymentReminders}
                      onChange={(e) => handleTimingChange('paymentReminders', e.target.value)}
                      className="border border-gray-300 rounded-lg text-sm px-3 py-2"
                    >
                      <option value="3d">3 days before</option>
                      <option value="7d">1 week before</option>
                      <option value="14d">2 weeks before</option>
                      <option value="30d">1 month before</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900">Course deadlines</p>
                        <p className="text-sm text-gray-600">Assignment and course deadline notifications</p>
                      </div>
                    </div>
                    <select
                      value={notificationTiming.courseDeadlines}
                      onChange={(e) => handleTimingChange('courseDeadlines', e.target.value)}
                      className="border border-gray-300 rounded-lg text-sm px-3 py-2"
                    >
                      <option value="1d">1 day before</option>
                      <option value="3d">3 days before</option>
                      <option value="7d">1 week before</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-6">
            {/* Email Templates */}
            <div className="card-elevated">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Email Templates</h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Refresh
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockEmailTemplates.map((template) => (
                    <div key={template.id} className="card-premium p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Mail className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{template.name}</h4>
                              {template.isActive ? (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                  Active
                                </span>
                              ) : (
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <p className="font-medium text-gray-700 text-sm mb-1">{template.subject}</p>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {template.textContent}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Type: {template.type}</span>
                              <span>•</span>
                              <span>Variables: {template.variables.length}</span>
                              <span>•</span>
                              <span>Updated: {template.updatedAt.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => sendTestEmail(template.type)}
                          >
                            <Send className="w-4 h-4" />
                            Test
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="w-4 h-4" />
                            Preview
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Template Variables */}
            <div className="card-elevated">
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Available Variables</h4>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    '&#123;&#123;studentName&#125;&#125;',
                    '&#123;&#123;courseType&#125;&#125;',
                    '&#123;&#123;sessionTitle&#125;&#125;',
                    '&#123;&#123;sessionDate&#125;&#125;',
                    '&#123;&#123;sessionTime&#125;&#125;',
                    '&#123;&#123;tutorName&#125;&#125;',
                    '&#123;&#123;amount&#125;&#125;',
                    '&#123;&#123;currency&#125;&#125;',
                    '&#123;&#123;transactionId&#125;&#125;',
                    '&#123;&#123;loginUrl&#125;&#125;',
                    '&#123;&#123;joinUrl&#125;&#125;',
                    '&#123;&#123;description&#125;&#125;'
                  ].map((variable) => (
                    <div key={variable} className="bg-gray-50 rounded-lg p-3 text-center">
                      <code className="text-sm text-gray-700 font-mono">{variable}</code>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Email History */}
            <div className="card-elevated">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Email History</h3>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search emails..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: '1',
                      subject: 'Welcome to ScoreSmart LMS - Your Learning Journey Begins!',
                      type: 'welcome',
                      status: 'delivered',
                      sentAt: new Date('2024-01-15T10:30:00'),
                      openedAt: new Date('2024-01-15T11:45:00')
                    },
                    {
                      id: '2',
                      subject: 'Upcoming Session: PTE Speaking Workshop in 24 hours',
                      type: 'reminder',
                      status: 'delivered',
                      sentAt: new Date('2024-01-17T09:00:00'),
                      openedAt: new Date('2024-01-17T09:15:00')
                    },
                    {
                      id: '3',
                      subject: 'Payment Confirmation - txn_1',
                      type: 'confirmation',
                      status: 'delivered',
                      sentAt: new Date('2024-01-15T10:30:15'),
                      openedAt: null
                    },
                    {
                      id: '4',
                      subject: 'Course Update: New PTE Materials Available',
                      type: 'notification',
                      status: 'pending',
                      sentAt: new Date('2024-01-18T14:00:00'),
                      openedAt: null
                    }
                  ].map((email) => (
                    <div key={email.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Mail className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{email.subject}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span>{email.type}</span>
                            <span>•</span>
                            <span>{email.sentAt.toLocaleString()}</span>
                            {email.openedAt && (
                              <>
                                <span>•</span>
                                <span className="text-green-600">Opened</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          email.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : email.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {email.status}
                        </span>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Email Provider Settings */}
            <div className="card-elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Email Provider Settings</h3>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Email Security</h4>
                      <p className="text-sm text-blue-700">
                        Your emails are sent via SendGrid with enterprise-grade security and deliverability.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Email Provider</p>
                      <p className="text-sm text-gray-600">SendGrid (Enterprise)</p>
                    </div>
                    <Check className="w-5 h-5 text-green-600" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">From Address</p>
                      <p className="text-sm text-gray-600">{integrationConfig.email.sendgrid.fromEmail}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Delivery Rate</p>
                      <p className="text-sm text-gray-600">98.5% (Last 30 days)</p>
                    </div>
                    <span className="text-green-600 font-medium">Excellent</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Unsubscribe & Data */}
            <div className="card-elevated">
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Data & Privacy</h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Email data retention</p>
                      <p className="text-sm text-gray-600">How long we keep your email interaction data</p>
                    </div>
                    <select className="border border-gray-300 rounded-lg text-sm px-3 py-2">
                      <option value="1y">1 year</option>
                      <option value="2y">2 years</option>
                      <option value="forever">Forever</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                    <div>
                      <p className="font-medium text-red-900">Unsubscribe from all emails</p>
                      <p className="text-sm text-red-700">You'll only receive critical security and account emails</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                      Unsubscribe All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Changes */}
        <div className="card-elevated bg-green-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Check className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="font-semibold text-green-900">Changes Saved</h4>
                  <p className="text-sm text-green-700">Your email preferences have been updated successfully.</p>
                </div>
              </div>
              <Button className="gap-2">
                <Settings className="w-4 h-4" />
                Save All Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}