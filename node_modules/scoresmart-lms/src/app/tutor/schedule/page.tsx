'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Clock,
  Calendar,
  Users,
  Plus,
  Edit3,
  Trash2,
  Video,
  User,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
  Loader2
} from 'lucide-react'
import CreateSessionModal, { SessionFormData } from '@/components/CreateSessionModal'
import { apiClient } from '@/lib/api'

export default function TutorSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreatingSession, setIsCreatingSession] = useState(false)
  const [sessions, setSessions] = useState([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)

  // Load today's sessions on component mount
  useEffect(() => {
    loadTodaySessions()
  }, [])

  const loadTodaySessions = async () => {
    setIsLoadingSessions(true)
    try {
      const response = await apiClient.getTodaySessions()
      if (response.success && response.data) {
        setSessions(response.data)
      } else {
        console.error('Failed to load sessions:', response.error)
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setIsLoadingSessions(false)
    }
  }

  const handleCreateSession = async (sessionData: SessionFormData) => {
    setIsCreatingSession(true)
    try {
      const response = await apiClient.createSession(sessionData)
      if (response.success) {
        setIsCreateModalOpen(false)
        // Reload sessions to show the new one
        await loadTodaySessions()
        // You could add a toast notification here
        alert('Session created successfully!')
      } else {
        alert(`Failed to create session: ${response.error}`)
      }
    } catch (error) {
      console.error('Error creating session:', error)
      alert('Failed to create session. Please try again.')
    } finally {
      setIsCreatingSession(false)
    }
  }

  const stats = [
    {
      title: "Today's Sessions",
      value: "5",
      description: "Scheduled sessions",
      icon: Clock,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "This Week",
      value: "28",
      description: "Total sessions",
      icon: Calendar,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Active Students",
      value: "42",
      description: "Regular students",
      icon: Users,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Available Slots",
      value: "12",
      description: "Open this week",
      icon: CheckCircle2,
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  const quickActions = [
    {
      title: "Add Session",
      description: "Schedule a new session",
      icon: Plus,
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      onClick: () => setIsCreateModalOpen(true)
    },
    {
      title: "Set Availability",
      description: "Update your free hours",
      icon: Calendar,
      color: "bg-green-50 hover:bg-green-100 border-green-200"
    },
    {
      title: "Bulk Schedule",
      description: "Schedule multiple sessions",
      icon: Users,
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200"
    },
    {
      title: "Reschedule Requests",
      description: "3 pending requests",
      icon: Edit3,
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200"
    }
  ]


  const weeklySchedule = [
    { day: "Monday", date: "Dec 18", sessions: 6, available: 2 },
    { day: "Tuesday", date: "Dec 19", sessions: 4, available: 4 },
    { day: "Wednesday", date: "Dec 20", sessions: 5, available: 3 },
    { day: "Thursday", date: "Dec 21", sessions: 7, available: 1 },
    { day: "Friday", date: "Dec 22", sessions: 3, available: 5 },
    { day: "Saturday", date: "Dec 23", sessions: 2, available: 6 },
    { day: "Sunday", date: "Dec 24", sessions: 1, available: 2 }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              My Schedule
            </h1>
            <p className="text-gray-600 text-lg mt-1">
              Manage your teaching schedule and upcoming sessions
            </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="bg-white rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${action.color}`}
                  onClick={action.onClick || (() => {})}
                >
                  <div className="flex items-center space-x-3">
                    <action.icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-800">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Weekly Overview */}
          <Card className="lg:col-span-2 bg-white rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-xl font-semibold text-gray-800">Weekly Overview</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant={viewMode === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Week
                </Button>
                <Button
                  variant={viewMode === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                >
                  Day
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {weeklySchedule.map((day, index) => (
                  <div key={index} className="text-center p-3 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                    <h3 className="font-medium text-gray-800 text-sm">{day.day}</h3>
                    <p className="text-xs text-gray-600 mb-2">{day.date}</p>
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-blue-600">{day.sessions} sessions</div>
                      <div className="text-xs text-green-600">{day.available} available</div>
                    </div>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                          style={{ width: `${(day.sessions / (day.sessions + day.available)) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Sessions */}
        <Card className="bg-white rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-800">Today's Sessions</CardTitle>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Session
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingSessions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                <span className="ml-2 text-gray-600">Loading sessions...</span>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No sessions scheduled for today</p>
                <p className="text-sm text-gray-500">Click "Add Session" to create your first session</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session: any) => (
                <div key={session.id} className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        {session.sessionType === 'MASTERCLASS' ? (
                          <GraduationCap className="h-6 w-6 text-white" />
                        ) : session.sessionType === 'SMART_QUAD' ? (
                          <Video className="h-6 w-6 text-white" />
                        ) : (
                          <User className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-gray-800">
                            {new Date(session.startTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status?.toLowerCase() || 'scheduled')}`}>
                            {session.status || 'SCHEDULED'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{session.title}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-blue-600 font-medium">{session.courseType}</span>
                          <span className="text-xs text-gray-500">
                            {session.sessionType.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span className="text-xs text-gray-500">
                            {Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / (1000 * 60))} min
                          </span>
                          <div className="flex items-center space-x-1">
                            <Video className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-gray-500">Online</span>
                          </div>
                        </div>
                        {session.description && (
                          <p className="text-xs text-gray-500 mt-1">📝 {session.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      {session.meetLink && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => window.open(session.meetLink, '_blank')}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Session Modal */}
      <CreateSessionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateSession}
        isLoading={isCreatingSession}
      />
    </div>
  )
}