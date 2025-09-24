'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Users,
  Calendar,
  Clock,
  Star,
  BookOpen,
  Play,
  Filter,
  Search,
  Plus,
  Target,
  TrendingUp,
  Award,
  CheckCircle2,
  ArrowRight,
  Info,
  User,
  Video,
  MessageSquare,
  Zap,
  ChevronRight,
  RefreshCw
} from 'lucide-react'
import { mockSessions, getSessionsByType } from '@/data/mock/mockSessions'
import { theme } from '@/styles/theme'

export default function OneToOnePage() {
  const [activeTab, setActiveTab] = useState<'available' | 'upcoming' | 'completed'>('available')
  const [selectedCourse, setSelectedCourse] = useState<'all' | 'PTE' | 'NAATI'>('all')

  // Get one-to-one sessions
  const oneToOneSessions = getSessionsByType('one-to-one')
  const myUpcomingSessions = oneToOneSessions.filter(session =>
    session.status === 'scheduled' &&
    session.studentIds.includes('student1') &&
    new Date(session.date) > new Date()
  )
  const myCompletedSessions = oneToOneSessions.filter(session =>
    session.status === 'completed' &&
    session.studentIds.includes('student1')
  )
  const availableSessions = oneToOneSessions.filter(session =>
    session.status === 'scheduled' &&
    !session.studentIds.includes('student1') &&
    session.studentIds.length < session.maxStudents &&
    new Date(session.date) > new Date()
  )

  // Filter based on selected course
  const filteredAvailable = availableSessions.filter(session =>
    selectedCourse === 'all' || session.courseType === selectedCourse
  )

  const stats = {
    sessionsCompleted: myCompletedSessions.length,
    upcomingSessions: myUpcomingSessions.length,
    totalHours: myCompletedSessions.length * 1, // 1 hour per session
    averageRating: 4.8
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  One-to-One Sessions
                </h1>
                <p className="text-slate-500 text-lg mt-1">Get personalized attention with private tutoring sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-xl font-semibold shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Private Tutoring
              </span>
              <Button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh Sessions
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-bold text-emerald-400">
                  +{stats.sessionsCompleted}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.sessionsCompleted}</div>
              <p className="text-sm text-slate-300">Sessions Completed</p>
              <p className="text-xs text-slate-400 mt-2">Personal record</p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-bold text-blue-400">
                  +{stats.upcomingSessions}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.upcomingSessions}</div>
              <p className="text-sm text-slate-300">Upcoming Sessions</p>
              <p className="text-xs text-slate-400 mt-2">This week</p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-bold text-purple-400">
                  +{stats.totalHours}h
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.totalHours}h</div>
              <p className="text-sm text-slate-300">Total Hours</p>
              <p className="text-xs text-slate-400 mt-2">One-to-one time</p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-bold text-amber-400">
                  ★{stats.averageRating}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stats.averageRating}</div>
              <p className="text-sm text-slate-300">Average Rating</p>
              <p className="text-xs text-slate-400 mt-2">Excellent feedback</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Quick Actions</h2>
              <p className="text-slate-500">Manage your one-to-one sessions</p>
            </div>
            <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
              View All Sessions <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Search className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Browse Sessions</h3>
              <p className="text-slate-600 text-sm mb-4">Find available tutors</p>
              <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
                Explore
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">My Sessions</h3>
              <p className="text-slate-600 text-sm mb-4">View upcoming sessions</p>
              <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
                Explore
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
                <Plus className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Request Session</h3>
              <p className="text-slate-600 text-sm mb-4">Custom tutoring request</p>
              <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
                Explore
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { id: 'available', label: 'Available Sessions', icon: Search },
              { id: 'upcoming', label: 'My Upcoming', icon: Calendar },
              { id: 'completed', label: 'Completed', icon: CheckCircle2 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Course Filter for Available Sessions */}
          {activeTab === 'available' && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">Filter by course:</span>
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'All Courses' },
                  { id: 'PTE', label: 'PTE Only' },
                  { id: 'NAATI', label: 'NAATI Only' }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedCourse(filter.id as any)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                      selectedCourse === filter.id
                        ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'available' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Available One-to-One Sessions</h2>
              <Button className="bg-indigo-700 hover:bg-indigo-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                Request Custom Session
              </Button>
            </div>

            <div className="grid gap-6">
              {filteredAvailable.map((session) => (
                <div key={session.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          session.courseType === 'PTE' ? 'bg-blue-500' : 'bg-purple-500'
                        }`}>
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{session.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{session.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {session.date.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {session.startTime} - {session.endTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {session.courseType}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {session.tags.map((tag, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">${session.price}</p>
                        <p className="text-sm text-gray-500">60 minutes</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {session.tutorAvatar}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{session.tutorName}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-gray-600">4.9</span>
                        </div>
                      </div>
                      <Button className="gap-2">
                        Book Session
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredAvailable.length === 0 && (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No available sessions</h3>
                <p className="text-gray-500 mb-4">No one-to-one sessions match your current filters</p>
                <Button>Request Custom Session</Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">My Upcoming Sessions</h2>

            <div className="grid gap-4">
              {myUpcomingSessions.map((session) => (
                <div key={session.id} className="card-premium">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{session.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{session.date.toLocaleDateString()}</span>
                            <span>{session.startTime} - {session.endTime}</span>
                            <span>{session.tutorName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Message Tutor
                        </Button>
                        <Button className="gap-2">
                          <Video className="w-4 h-4" />
                          Join Session
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {myUpcomingSessions.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming sessions</h3>
                <p className="text-gray-500 mb-4">Book a one-to-one session to get started</p>
                <Button onClick={() => setActiveTab('available')}>
                  Browse Available Sessions
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'completed' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Completed Sessions</h2>

            <div className="grid gap-4">
              {myCompletedSessions.map((session) => (
                <div key={session.id} className="card-premium">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{session.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{session.date.toLocaleDateString()}</span>
                            <span>{session.tutorName}</span>
                            <span className="text-green-600">Completed</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {session.recordingUrl && (
                          <Button variant="outline" size="sm" className="gap-2">
                            <Play className="w-4 h-4" />
                            Recording
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="gap-2">
                          <Star className="w-4 h-4" />
                          Rate Session
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {myCompletedSessions.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No completed sessions yet</h3>
                <p className="text-gray-500 mb-4">Your completed one-to-one sessions will appear here</p>
                <Button onClick={() => setActiveTab('available')}>
                  Book Your First Session
                </Button>
              </div>
            )}
          </div>
        )}
    </div>
  )
}