'use client'

import { useState } from 'react'
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
  Phone
} from 'lucide-react'

export default function TutorSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week')

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
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200"
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

  const upcomingSessions = [
    {
      id: 1,
      time: "09:00 AM",
      duration: "45 min",
      student: "Sarah Johnson",
      type: "One-to-One",
      subject: "PTE Speaking",
      status: "confirmed",
      mode: "online",
      notes: "Focus on pronunciation"
    },
    {
      id: 2,
      time: "10:30 AM",
      duration: "60 min",
      student: "Mike Chen",
      type: "One-to-One",
      subject: "PTE Writing",
      status: "confirmed",
      mode: "online",
      notes: "Essay structure practice"
    },
    {
      id: 3,
      time: "02:00 PM",
      duration: "90 min",
      student: "Group Session (8 students)",
      type: "Masterclass",
      subject: "PTE Reading Strategies",
      status: "confirmed",
      mode: "online",
      notes: "Interactive workshop"
    },
    {
      id: 4,
      time: "04:00 PM",
      duration: "45 min",
      student: "Emma Davis",
      type: "One-to-One",
      subject: "PTE Listening",
      status: "pending",
      mode: "in-person",
      notes: "Note-taking techniques"
    },
    {
      id: 5,
      time: "05:30 PM",
      duration: "45 min",
      student: "Alex Rodriguez",
      type: "One-to-One",
      subject: "PTE Speaking",
      status: "confirmed",
      mode: "online",
      notes: "Mock test review"
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
                <div key={index} className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${action.color}`}>
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
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Session
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        {session.type === 'Masterclass' ? (
                          <Users className="h-6 w-6 text-white" />
                        ) : (
                          <User className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-gray-800">{session.time}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                            {session.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{session.student}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-blue-600 font-medium">{session.subject}</span>
                          <span className="text-xs text-gray-500">{session.duration}</span>
                          <div className="flex items-center space-x-1">
                            {session.mode === 'online' ? (
                              <Video className="h-3 w-3 text-green-500" />
                            ) : (
                              <MapPin className="h-3 w-3 text-orange-500" />
                            )}
                            <span className="text-xs text-gray-500">{session.mode}</span>
                          </div>
                        </div>
                        {session.notes && (
                          <p className="text-xs text-gray-500 mt-1">📝 {session.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      {session.mode === 'online' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      )}
                      {session.mode === 'in-person' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}