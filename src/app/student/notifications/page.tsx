'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Bell,
  Settings,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Search,
  Clock,
  AlertCircle,
  Calendar,
  CreditCard,
  BookOpen,
  Trophy,
  MessageSquare,
  Cog,
  ExternalLink,
  X,
  Zap,
  Shield,
  Globe,
  Smartphone,
  Mail,
  Volume2,
  VolumeX
} from 'lucide-react'
import {
  mockNotifications,
  mockNotificationPreferences,
  mockSystemAlerts,
  getNotificationsByUser,
  getUnreadNotifications,
  getNotificationsByCategory,
  getNotificationsByPriority,
  getActiveSystemAlerts,
  getNotificationStats,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  notificationTypeConfig,
  priorityConfig,
  mockNotificationService,
  type Notification,
  type NotificationPreferences
} from '@/data/mock/mockNotifications'

export default function StudentNotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'alerts' | 'settings'>('all')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'academic' | 'financial' | 'system' | 'social'>('all')
  const [selectedPriority, setSelectedPriority] = useState<'all' | 'low' | 'medium' | 'high' | 'urgent'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)

  // Mock current student ID
  const currentStudentId = 'student1'

  // Initialize notifications and preferences
  useEffect(() => {
    const userNotifications = getNotificationsByUser(currentStudentId)
    setNotifications(userNotifications)

    const userPreferences = mockNotificationPreferences.find(p => p.userId === currentStudentId)
    setPreferences(userPreferences || null)

    // Subscribe to real-time notifications
    const unsubscribe = mockNotificationService.subscribe(currentStudentId, (newNotification) => {
      setNotifications(prev => [newNotification, ...prev])
    })

    return unsubscribe
  }, [currentStudentId])

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesTab = activeTab === 'all' ||
                     (activeTab === 'unread' && !notification.isRead)

    const matchesCategory = selectedCategory === 'all' || notification.category === selectedCategory
    const matchesPriority = selectedPriority === 'all' || notification.priority === selectedPriority
    const matchesSearch = !searchTerm ||
                         notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesTab && matchesCategory && matchesPriority && matchesSearch
  })

  const stats = getNotificationStats(currentStudentId)
  const systemAlerts = getActiveSystemAlerts()

  const handleMarkAsRead = async (notificationId: string) => {
    await mockNotificationService.markAsRead(notificationId)
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n)
    )
  }

  const handleMarkAllAsRead = async () => {
    await mockNotificationService.markAllAsRead(currentStudentId)
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true, readAt: new Date() }))
    )
  }

  const handleDeleteNotification = async (notificationId: string) => {
    await mockNotificationService.deleteNotification(notificationId)
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
  }

  const handlePreferenceChange = (category: string, channel: string, value: boolean) => {
    if (!preferences) return

    const updatedPreferences = {
      ...preferences,
      [channel]: {
        ...preferences[channel as keyof NotificationPreferences],
        [category]: value
      }
    }
    setPreferences(updatedPreferences)
    mockNotificationService.updatePreferences(currentStudentId, updatedPreferences)
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'session_reminder':
        return <Clock className="w-5 h-5" />
      case 'payment_due':
        return <CreditCard className="w-5 h-5" />
      case 'course_update':
        return <BookOpen className="w-5 h-5" />
      case 'achievement':
        return <Trophy className="w-5 h-5" />
      case 'message':
        return <MessageSquare className="w-5 h-5" />
      case 'system_update':
        return <Cog className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getNotificationColor = (type: string) => {
    const config = notificationTypeConfig[type as keyof typeof notificationTypeConfig]
    return config ? config.color : 'gray'
  }

  const getPriorityBadge = (priority: string) => {
    const config = priorityConfig[priority as keyof typeof priorityConfig]
    return config ? config : priorityConfig.low
  }

  return (
    <div className="h-screen overflow-y-auto scrollbar-premium bg-gray-25">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">Stay updated with your learning progress and important updates</p>
            </div>
          </div>

          {/* System Alerts */}
          {systemAlerts.length > 0 && (
            <div className="space-y-3 mb-6">
              {systemAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`card-premium p-4 border-l-4 ${
                    alert.severity === 'error' ? 'border-red-500 bg-red-50' :
                    alert.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    alert.severity === 'success' ? 'border-green-500 bg-green-50' :
                    'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertCircle className={`w-5 h-5 mt-0.5 ${
                        alert.severity === 'error' ? 'text-red-600' :
                        alert.severity === 'warning' ? 'text-yellow-600' :
                        alert.severity === 'success' ? 'text-green-600' :
                        'text-blue-600'
                      }`} />
                      <div>
                        <h4 className={`font-semibold ${
                          alert.severity === 'error' ? 'text-red-900' :
                          alert.severity === 'warning' ? 'text-yellow-900' :
                          alert.severity === 'success' ? 'text-green-900' :
                          'text-blue-900'
                        }`}>
                          {alert.title}
                        </h4>
                        <p className={`text-sm mt-1 ${
                          alert.severity === 'error' ? 'text-red-700' :
                          alert.severity === 'warning' ? 'text-yellow-700' :
                          alert.severity === 'success' ? 'text-green-700' :
                          'text-blue-700'
                        }`}>
                          {alert.message}
                        </p>
                        {alert.endTime && (
                          <p className="text-xs text-gray-500 mt-2">
                            Until {alert.endTime.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {alert.actionUrl && (
                      <Button size="sm" variant="outline" className="gap-2">
                        <ExternalLink className="w-4 h-4" />
                        {alert.actionLabel || 'Learn More'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <Bell className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-bold text-gray-900">{stats.total}</span>
              </div>
              <p className="text-xs font-medium text-gray-600">Total</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-lg font-bold text-gray-900">{stats.unread}</span>
              </div>
              <p className="text-xs font-medium text-gray-600">Unread</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span className="text-lg font-bold text-gray-900">{stats.today}</span>
              </div>
              <p className="text-xs font-medium text-gray-600">Today</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                <span className="text-lg font-bold text-gray-900">{stats.highPriority}</span>
              </div>
              <p className="text-xs font-medium text-gray-600">High Priority</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'all', label: 'All Notifications', icon: Bell },
            { id: 'unread', label: `Unread (${stats.unread})`, icon: AlertCircle },
            { id: 'alerts', label: 'System Alerts', icon: Shield },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {(activeTab === 'all' || activeTab === 'unread') && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="card-premium">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 input-premium"
                    />
                  </div>

                  <div className="flex gap-2">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as any)}
                      className="border border-gray-300 rounded-lg text-sm px-3 py-2"
                    >
                      <option value="all">All Categories</option>
                      <option value="academic">Academic</option>
                      <option value="financial">Financial</option>
                      <option value="system">System</option>
                      <option value="social">Social</option>
                    </select>

                    <select
                      value={selectedPriority}
                      onChange={(e) => setSelectedPriority(e.target.value as any)}
                      className="border border-gray-300 rounded-lg text-sm px-3 py-2"
                    >
                      <option value="all">All Priorities</option>
                      <option value="urgent">Urgent</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>

                    {stats.unread > 0 && (
                      <Button onClick={handleMarkAllAsRead} className="gap-2">
                        <CheckCheck className="w-4 h-4" />
                        Mark All Read
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`card-interactive ${
                    !notification.isRead ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          getNotificationColor(notification.type) === 'blue' ? 'bg-blue-100' :
                          getNotificationColor(notification.type) === 'green' ? 'bg-green-100' :
                          getNotificationColor(notification.type) === 'yellow' ? 'bg-yellow-100' :
                          getNotificationColor(notification.type) === 'purple' ? 'bg-purple-100' :
                          getNotificationColor(notification.type) === 'indigo' ? 'bg-indigo-100' :
                          'bg-gray-100'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start gap-2 mb-2">
                            <h3 className={`font-semibold ${
                              !notification.isRead ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            )}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{notification.createdAt.toLocaleString()}</span>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium border ${
                              getPriorityBadge(notification.priority).color
                            }`}>
                              {getPriorityBadge(notification.priority).icon}
                              {getPriorityBadge(notification.priority).label}
                            </span>
                            <span className="capitalize">{notification.category}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {notification.actionUrl && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <ExternalLink className="w-4 h-4" />
                            {notification.actionLabel || 'View'}
                          </Button>
                        )}
                        {!notification.isRead && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Mark Read
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="gap-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredNotifications.length === 0 && (
              <div className="card-elevated text-center py-12">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications found</h3>
                <p className="text-gray-600">
                  {activeTab === 'unread'
                    ? "You're all caught up! No unread notifications."
                    : "No notifications match your current filters."
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="space-y-6">
            {/* System Alerts */}
            <div className="card-elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">System Alerts</h3>

                <div className="space-y-4">
                  {systemAlerts.map((alert) => (
                    <div key={alert.id} className="card-premium p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          alert.severity === 'error' ? 'bg-red-100' :
                          alert.severity === 'warning' ? 'bg-yellow-100' :
                          alert.severity === 'success' ? 'bg-green-100' :
                          'bg-blue-100'
                        }`}>
                          <AlertCircle className={`w-5 h-5 ${
                            alert.severity === 'error' ? 'text-red-600' :
                            alert.severity === 'warning' ? 'text-yellow-600' :
                            alert.severity === 'success' ? 'text-green-600' :
                            'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{alert.title}</h4>
                          <p className="text-gray-600 text-sm mb-2">{alert.message}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Type: {alert.type}</span>
                            <span>•</span>
                            <span>Started: {alert.startTime.toLocaleString()}</span>
                            {alert.endTime && (
                              <>
                                <span>•</span>
                                <span>Until: {alert.endTime.toLocaleString()}</span>
                              </>
                            )}
                          </div>
                          {alert.affectedServices.length > 0 && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">Affected services:</span>
                              {alert.affectedServices.map((service) => (
                                <span key={service} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                  {service.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {systemAlerts.length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No active system alerts</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && preferences && (
          <div className="space-y-6">
            {/* Notification Preferences */}
            <div className="card-elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>

                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Email Notifications</h4>
                    </div>
                    <div className="space-y-3 ml-8">
                      {Object.entries(preferences.emailNotifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={value}
                              onChange={(e) => handlePreferenceChange(key, 'emailNotifications', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Smartphone className="w-5 h-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Push Notifications</h4>
                    </div>
                    <div className="space-y-3 ml-8">
                      {Object.entries(preferences.pushNotifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={value}
                              onChange={(e) => handlePreferenceChange(key, 'pushNotifications', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* In-App Notifications */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Bell className="w-5 h-5 text-purple-600" />
                      <h4 className="font-semibold text-gray-900">In-App Notifications</h4>
                    </div>
                    <div className="space-y-3 ml-8">
                      {Object.entries(preferences.inAppNotifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm text-gray-700 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={value}
                              onChange={(e) => handlePreferenceChange(key, 'inAppNotifications', e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="card-elevated">
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Advanced Settings</h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Notification frequency</p>
                        <p className="text-sm text-gray-600">How often to group notifications</p>
                      </div>
                    </div>
                    <select className="border border-gray-300 rounded-lg text-sm px-3 py-2">
                      <option value="immediate">Immediate</option>
                      <option value="hourly">Hourly digest</option>
                      <option value="daily">Daily digest</option>
                      <option value="weekly">Weekly digest</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      {preferences.quietHours.enabled ? (
                        <VolumeX className="w-5 h-5 text-gray-600" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-green-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">Quiet hours</p>
                        <p className="text-sm text-gray-600">
                          {preferences.quietHours.enabled
                            ? `${preferences.quietHours.startTime} - ${preferences.quietHours.endTime}`
                            : 'Disabled'
                          }
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={preferences.quietHours.enabled}
                        onChange={(e) => {
                          const updated = {
                            ...preferences,
                            quietHours: {
                              ...preferences.quietHours,
                              enabled: e.target.checked
                            }
                          }
                          setPreferences(updated)
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}