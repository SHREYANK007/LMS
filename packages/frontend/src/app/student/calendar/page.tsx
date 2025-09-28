'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  Plus,
  Settings,
  RefreshCw as Sync,
  ExternalLink,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Bell,
  Users,
  Video,
  MapPin,
  Download,
  Share2,
  Edit3,
  Trash2,
  Eye,
  RefreshCw,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react'
import {
  mockCalendarEvents,
  getCalendarEventsByUser,
  getUpcomingEvents,
  mockIntegrationServices,
  integrationConfig
} from '@/data/mock/mockIntegrations'
import FeatureProtected from '@/components/student/FeatureProtected'

export default function StudentCalendarPage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'events' | 'integrations' | 'settings'>('calendar')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  const [selectedProvider, setSelectedProvider] = useState<'google' | 'outlook' | 'apple' | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  // Mock current student ID
  const currentStudentId = 'student1'

  // Get student calendar data
  const studentEvents = getCalendarEventsByUser(currentStudentId)
  const upcomingEvents = getUpcomingEvents(currentStudentId, 14)

  const handleSyncCalendar = async (provider: 'google' | 'outlook' | 'apple') => {
    setIsSyncing(true)
    setSelectedProvider(provider)
    try {
      const result = await mockIntegrationServices.calendar.syncCalendar(currentStudentId, provider)
      console.log('Calendar synced:', result)
      // Show success message
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      setIsSyncing(false)
      setSelectedProvider(null)
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'session':
        return <Video className="w-4 h-4" />
      case 'reminder':
        return <Bell className="w-4 h-4" />
      case 'deadline':
        return <Clock className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'session':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'reminder':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'deadline':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return '🔵'
      case 'outlook':
        return '🔶'
      case 'apple':
        return '⚪'
      default:
        return '📅'
    }
  }

  const integrationStatus = {
    google: integrationConfig.calendar.google.isEnabled,
    outlook: integrationConfig.calendar.outlook.isEnabled,
    apple: false // Not configured in mock data
  }

  return (
    <FeatureProtected featureKey="calendar" featureName="Calendar">
      <div className="h-screen overflow-y-auto scrollbar-premium bg-gray-25">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
              <p className="text-gray-600">Manage your schedule and sync with external calendars</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-bold text-gray-900">{studentEvents.length}</span>
              </div>
              <p className="text-xs font-medium text-gray-600">Total Events</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-5 h-5 text-green-600" />
                <span className="text-lg font-bold text-gray-900">{upcomingEvents.length}</span>
              </div>
              <p className="text-xs font-medium text-gray-600">Upcoming</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <Sync className="w-5 h-5 text-purple-600" />
                <span className="text-lg font-bold text-gray-900">{studentEvents.filter(e => e.isSync).length}</span>
              </div>
              <p className="text-xs font-medium text-gray-600">Synced</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                <span className="text-lg font-bold text-gray-900">3</span>
              </div>
              <p className="text-xs font-medium text-gray-600">Reminders</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'calendar', label: 'Calendar View', icon: Calendar },
            { id: 'events', label: 'Events', icon: Clock },
            { id: 'integrations', label: 'Integrations', icon: Sync },
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
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            {/* Calendar Controls */}
            <div className="card-premium">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <Button variant="outline" size="sm">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    {['month', 'week', 'day'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode as any)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          viewMode === mode
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="card-elevated">
              <div className="p-6">
                <div className="grid grid-cols-7 gap-4 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days - Simplified for demo */}
                <div className="grid grid-cols-7 gap-4">
                  {Array.from({ length: 35 }, (_, i) => {
                    const dayNumber = i - 6 // Start from previous month
                    const isCurrentMonth = dayNumber > 0 && dayNumber <= 31
                    const hasEvent = isCurrentMonth && [5, 12, 18, 25].includes(dayNumber)

                    return (
                      <div
                        key={i}
                        className={`aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                          isCurrentMonth
                            ? hasEvent
                              ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                            : 'bg-gray-50 border-gray-100 text-gray-400'
                        }`}
                      >
                        <span className={`text-sm font-medium ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                          {isCurrentMonth ? dayNumber : ''}
                        </span>
                        {hasEvent && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Today's Events */}
            <div className="card-elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Events</h3>

                <div className="space-y-3">
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600">
                          {event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                          {event.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                          {getEventTypeIcon(event.type)}
                          {event.type}
                        </span>
                        <span className="text-sm text-gray-500">
                          {getProviderIcon(event.calendarProvider)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* Event Controls */}
            <div className="card-premium">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search events..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                    <select className="border border-gray-300 rounded-lg text-sm px-3 py-2">
                      <option value="all">All Types</option>
                      <option value="session">Sessions</option>
                      <option value="reminder">Reminders</option>
                      <option value="deadline">Deadlines</option>
                    </select>
                  </div>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Event
                  </Button>
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {studentEvents.map((event) => (
                <div key={event.id} className="card-interactive">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          {getEventTypeIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            {event.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {event.startTime.toLocaleDateString()} at {event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              {event.calendarProvider}
                            </span>
                            {event.isSync && (
                              <span className="flex items-center gap-1 text-green-600">
                                <Check className="w-4 h-4" />
                                Synced
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${getEventTypeColor(event.type)}`}>
                          {getEventTypeIcon(event.type)}
                          {event.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                      <div className="flex items-center gap-2">
                        {event.sessionId && (
                          <span className="text-sm text-gray-500">
                            Session ID: {event.sessionId}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Share2 className="w-4 h-4" />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            {/* Integration Overview */}
            <div className="card-elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Calendar Integrations</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Google Calendar */}
                  <div className="card-premium p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <span className="text-xl">🔵</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Google Calendar</h4>
                          <p className="text-sm text-gray-600">Sync with Google</p>
                        </div>
                      </div>
                      {integrationStatus.google ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status</span>
                        <span className={`font-medium ${integrationStatus.google ? 'text-green-600' : 'text-gray-500'}`}>
                          {integrationStatus.google ? 'Connected' : 'Not Connected'}
                        </span>
                      </div>

                      <Button
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => handleSyncCalendar('google')}
                        disabled={isSyncing && selectedProvider === 'google'}
                      >
                        {isSyncing && selectedProvider === 'google' ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Syncing...
                          </>
                        ) : integrationStatus.google ? (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            Sync Now
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Connect
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Outlook Calendar */}
                  <div className="card-premium p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                          <span className="text-xl">🔶</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Outlook Calendar</h4>
                          <p className="text-sm text-gray-600">Sync with Microsoft</p>
                        </div>
                      </div>
                      {integrationStatus.outlook ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status</span>
                        <span className={`font-medium ${integrationStatus.outlook ? 'text-green-600' : 'text-gray-500'}`}>
                          {integrationStatus.outlook ? 'Connected' : 'Not Connected'}
                        </span>
                      </div>

                      <Button
                        size="sm"
                        className="w-full gap-2"
                        onClick={() => handleSyncCalendar('outlook')}
                        disabled={isSyncing && selectedProvider === 'outlook'}
                      >
                        {isSyncing && selectedProvider === 'outlook' ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Syncing...
                          </>
                        ) : integrationStatus.outlook ? (
                          <>
                            <RefreshCw className="w-4 h-4" />
                            Sync Now
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Connect
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Apple Calendar */}
                  <div className="card-premium p-6 opacity-75">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                          <span className="text-xl">⚪</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Apple Calendar</h4>
                          <p className="text-sm text-gray-600">iCloud integration</p>
                        </div>
                      </div>
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status</span>
                        <span className="font-medium text-gray-500">Coming Soon</span>
                      </div>

                      <Button size="sm" variant="outline" className="w-full" disabled>
                        <Zap className="w-4 h-4 mr-2" />
                        Coming Soon
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sync Settings */}
            <div className="card-elevated">
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Sync Settings</h4>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Auto-sync events</p>
                      <p className="text-sm text-gray-600">Automatically sync new events to connected calendars</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Sync session reminders</p>
                      <p className="text-sm text-gray-600">Create reminders 24 hours before sessions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Two-way sync</p>
                      <p className="text-sm text-gray-600">Sync changes made in external calendars back to ScoreSmart</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Notification Settings */}
            <div className="card-elevated">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Email notifications</p>
                        <p className="text-sm text-gray-600">Receive email alerts for upcoming events</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Push notifications</p>
                        <p className="text-sm text-gray-600">Get push notifications on your devices</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      <div>
                        <p className="font-medium text-gray-900">Reminder timing</p>
                        <p className="text-sm text-gray-600">How early to send reminders</p>
                      </div>
                    </div>
                    <select className="border border-gray-300 rounded-lg text-sm px-3 py-2">
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="1440">24 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Export & Backup */}
            <div className="card-elevated">
              <div className="p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Export & Backup</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="gap-2 h-12">
                    <Download className="w-4 h-4" />
                    Export Calendar
                  </Button>
                  <Button variant="outline" className="gap-2 h-12">
                    <RefreshCw className="w-4 h-4" />
                    Backup Events
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </FeatureProtected>
  )
}