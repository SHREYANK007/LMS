'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  Users,
  Video,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Play,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  BookOpen,
  Star,
  TrendingUp,
  Zap
} from 'lucide-react'
import { mockSessions, mockBookings, getUpcomingSessions } from '@/data/mock/mockSessions'

export default function AdminSessionsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'scheduled' | 'completed' | 'calendar'>('overview')
  const [selectedType, setSelectedType] = useState<'all' | 'smart-quad' | 'one-to-one' | 'masterclass'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter sessions
  const filteredSessions = mockSessions.filter(session => {
    const matchesSearch = session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.tutorName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || session.type === selectedType
    return matchesSearch && matchesType
  })

  const scheduledSessions = filteredSessions.filter(s => s.status === 'scheduled')
  const completedSessions = filteredSessions.filter(s => s.status === 'completed')
  const ongoingSessions = filteredSessions.filter(s => s.status === 'ongoing')

  // Statistics
  const stats = {
    totalSessions: mockSessions.length,
    scheduledToday: scheduledSessions.filter(s =>
      new Date(s.date).toDateString() === new Date().toDateString()
    ).length,
    completedThisWeek: completedSessions.filter(s => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return s.date >= weekAgo
    }).length,
    activeStudents: new Set(mockSessions.flatMap(s => s.studentIds)).size,
    smartQuadSessions: mockSessions.filter(s => s.type === 'smart-quad').length,
    oneToOneSessions: mockSessions.filter(s => s.type === 'one-to-one').length,
    masterclassSessions: mockSessions.filter(s => s.type === 'masterclass').length,
    totalRevenue: mockSessions.reduce((sum, s) => sum + (s.price * s.studentIds.length), 0)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-4 h-4 text-blue-600" />
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'ongoing':
        return <Play className="w-4 h-4 text-purple-600" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'smart-quad':
        return <Zap className="w-4 h-4 text-blue-600" />
      case 'one-to-one':
        return <Users className="w-4 h-4 text-green-600" />
      case 'masterclass':
        return <Star className="w-4 h-4 text-purple-600" />
      default:
        return <BookOpen className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Session Management
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Manage all learning sessions across the platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export Sessions
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Schedule Session
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">{stats.totalSessions}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Total Sessions</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-green-600" />
              <span className="text-lg font-bold text-gray-900">{stats.scheduledToday}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Today's Sessions</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-lg font-bold text-gray-900">{stats.completedThisWeek}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Completed This Week</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-lg font-bold text-gray-900">{stats.activeStudents}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Active Students</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">{stats.smartQuadSessions}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Smart Quad</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-lg font-bold text-gray-900">{stats.oneToOneSessions}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">One-to-One</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-purple-600" />
              <span className="text-lg font-bold text-gray-900">{stats.masterclassSessions}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Masterclass</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
              <span className="text-lg font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Total Revenue</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'scheduled', label: 'Scheduled', icon: Calendar },
            { id: 'completed', label: 'Completed', icon: CheckCircle2 },
            { id: 'calendar', label: 'Calendar View', icon: Calendar }
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

        {/* Filters */}
        <div className="card-premium mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 input-premium"
                />
              </div>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as any)}
                className="input-premium"
              >
                <option value="all">All Session Types</option>
                <option value="smart-quad">Smart Quad</option>
                <option value="one-to-one">One-to-One</option>
                <option value="masterclass">Masterclass</option>
              </select>

              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50" onClick={() => {
                setSearchTerm('')
                setSelectedType('all')
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Today's Sessions */}
            <div className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Today's Sessions
                </CardTitle>
                <CardDescription>Sessions scheduled for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduledSessions.filter(s =>
                    new Date(s.date).toDateString() === new Date().toDateString()
                  ).slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(session.type)}
                        <div>
                          <p className="font-medium text-gray-900">{session.title}</p>
                          <p className="text-sm text-gray-500">
                            {session.startTime} - {session.endTime} • {session.tutorName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{session.studentIds.length} students</span>
                        <Button size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>

            {/* Recent Completions */}
            <div className="card-elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Recently Completed
                </CardTitle>
                <CardDescription>Sessions completed in the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedSessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(session.type)}
                        <div>
                          <p className="font-medium text-gray-900">{session.title}</p>
                          <p className="text-sm text-gray-500">
                            {session.date.toLocaleDateString()} • {session.tutorName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.recordingUrl && (
                          <Button variant="outline" size="sm" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                            <Video className="w-4 h-4" />
                            Recording
                          </Button>
                        )}
                        <Button size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </div>
        )}

        {(activeTab === 'scheduled' || activeTab === 'completed') && (
          <div className="space-y-4">
            {filteredSessions
              .filter(s => activeTab === 'scheduled' ? s.status === 'scheduled' : s.status === 'completed')
              .map((session) => (
                <div key={session.id} className="card-interactive">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          session.courseType === 'PTE' ? 'bg-blue-100' :
                          session.courseType === 'NAATI' ? 'bg-purple-100' : 'bg-indigo-100'
                        }`}>
                          {getTypeIcon(session.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{session.title}</h3>
                          <p className="text-gray-600 text-sm mb-3">{session.description}</p>
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {session.date.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {session.startTime} - {session.endTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {session.studentIds.length}/{session.maxStudents} students
                            </div>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(session.status)}
                              {session.status}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">${session.price}</p>
                        <p className="text-sm text-gray-500">per student</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {session.tutorAvatar}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{session.tutorName}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{session.courseType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        {session.status === 'completed' && session.recordingUrl && (
                          <Button variant="outline" size="sm" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
                            <Video className="w-4 h-4" />
                            Recording
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="card-elevated">
            <CardContent className="p-8">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Calendar View</h3>
                <p className="text-gray-600 mb-6">
                  Full calendar integration will be implemented in Phase 8 with Google Calendar sync
                </p>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Schedule New Session
                </Button>
              </div>
            </CardContent>
          </div>
        )}
      </div>
    </div>
  )
}