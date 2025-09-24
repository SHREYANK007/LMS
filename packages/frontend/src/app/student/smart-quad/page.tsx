'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Zap,
  Users,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Filter,
  Search,
  Play,
  Plus,
  ChevronRight,
  Target,
  Award,
  BookOpen,
  Video,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Trophy,
  RefreshCw
} from 'lucide-react'
import { mockSessions, mockSmartQuadGroups, getSessionsByType, getSmartQuadGroupsByStatus } from '@/data/mock/mockSessions'

// Helper function to convert day numbers to day names
const getDayName = (dayNumber: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[dayNumber] || 'TBD'
}

export default function SmartQuadPage() {
  const [activeTab, setActiveTab] = useState<'available' | 'my-groups' | 'upcoming'>('available')
  const [selectedCourse, setSelectedCourse] = useState<'all' | 'PTE' | 'NAATI'>('all')

  // Get data
  const smartQuadSessions = getSessionsByType('smart-quad')
  const myGroups = getSmartQuadGroupsByStatus('active').filter(group =>
    group.studentIds.includes('student1')
  )
  const availableGroups = getSmartQuadGroupsByStatus('forming')
  const upcomingSessions = smartQuadSessions.filter(session =>
    session.status === 'scheduled' &&
    session.studentIds.includes('student1') &&
    new Date(session.date) > new Date()
  )

  const stats = [
    {
      title: "Active Groups",
      value: "3",
      change: "+1",
      description: "This week",
      icon: Users,
      iconBg: "from-emerald-400 to-green-500",
      changeBg: "text-emerald-400"
    },
    {
      title: "Sessions Attended",
      value: "24",
      change: "+6",
      description: "This month",
      icon: Calendar,
      iconBg: "from-blue-400 to-cyan-500",
      changeBg: "text-blue-400"
    },
    {
      title: "Group Score",
      value: "85%",
      change: "+8%",
      description: "Average performance",
      icon: Trophy,
      iconBg: "from-purple-400 to-pink-500",
      changeBg: "text-purple-400"
    },
    {
      title: "Learning Streak",
      value: "7",
      change: "Days",
      description: "Keep it up!",
      icon: Zap,
      iconBg: "from-amber-400 to-orange-500",
      changeBg: "text-amber-400"
    }
  ]

  const benefits = [
    {
      title: "Collaborative Learning",
      description: "Learn together with 3 peers",
      icon: Users,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "Expert Guidance",
      description: "Led by certified tutors",
      icon: Award,
      gradient: "from-emerald-500 to-green-600"
    },
    {
      title: "Interactive Sessions",
      description: "Engage in discussions",
      icon: MessageSquare,
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Track Progress",
      description: "Monitor your improvement",
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-600"
    }
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Smart Quad Sessions
                </h1>
                <p className="text-slate-500 text-lg mt-1">Collaborative learning in groups of 4 students</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button className="bg-indigo-700 hover:bg-indigo-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                Join New Group
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-sm font-bold ${stat.changeBg}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <p className="text-sm text-slate-300">{stat.title}</p>
                <p className="text-xs text-slate-400 mt-2">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Why Choose Smart Quad?</h2>
              <p className="text-slate-500">Experience the power of collaborative learning</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
                <div className={`w-14 h-14 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{benefit.title}</h3>
                <p className="text-slate-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'available', label: 'Available Groups', count: availableGroups.length },
            { id: 'my-groups', label: 'My Groups', count: myGroups.length },
            { id: 'upcoming', label: 'Upcoming Sessions', count: upcomingSessions.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'available' && (
          <div className="space-y-6">
            {/* Filter */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">Find Your Study Group</h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search sessions..."
                      className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                  <select
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value as any)}
                  >
                    <option value="all">All Courses</option>
                    <option value="PTE">PTE</option>
                    <option value="NAATI">NAATI</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Available Groups */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {availableGroups.map((group) => (
                <div key={group.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-800">{group.name}</h3>
                          <p className="text-sm text-slate-600 mt-1">Focus: {group.focus}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        group.studentIds.length < 4
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      }`}>
                        {group.studentIds.length}/4 Members
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>Next: {group.sessionDays?.length > 0 ? getDayName(group.sessionDays[0]) : 'TBD'}, {group.startTime || 'TBD'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="w-4 h-4" />
                        <span>{group.startTime} - {group.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Target className="w-4 h-4" />
                        <span>Course: {group.courseType}</span>
                      </div>
                    </div>

                    {/* Members */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-700 mb-2">Current Members:</p>
                      <div className="flex -space-x-2">
                        {group.studentIds.map((studentId, idx) => (
                          <div
                            key={idx}
                            className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                          >
                            S{idx + 1}
                          </div>
                        ))}
                        {Array.from({ length: 4 - group.studentIds.length }).map((_, idx) => (
                          <div
                            key={`empty-${idx}`}
                            className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-400 text-xs border-2 border-white"
                          >
                            ?
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-indigo-700 hover:bg-indigo-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Join This Group
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'my-groups' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myGroups.map((group) => (
                <div key={group.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-800">{group.name}</h3>
                          <p className="text-sm text-slate-600 mt-1">{group.focus}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-500 mb-1">Sessions Completed</p>
                        <p className="text-xl font-bold text-slate-800">8</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-xs text-slate-500 mb-1">Group Score</p>
                        <p className="text-xl font-bold text-slate-800">87%</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button className="flex-1 bg-indigo-700 hover:bg-indigo-700 text-white">
                        <Video className="w-4 h-4 mr-2" />
                        Join Session
                      </Button>
                      <Button variant="outline" className="border-slate-200">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{session.sessionTitle}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-slate-600">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {new Date(session.date).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-slate-600">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {session.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-xs font-semibold">
                      In 2 hours
                    </span>
                    <Button className="bg-indigo-700 hover:bg-indigo-700 text-white">
                      <Play className="w-4 h-4 mr-2" />
                      Join Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Learning Tips */}
        <div className="mt-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Smart Quad Learning Tips</h3>
              <p className="text-white/80">Make the most of your group sessions</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Be Active</h4>
                <p className="text-sm text-white/90">Participate in discussions and share your thoughts</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Stay Consistent</h4>
                <p className="text-sm text-white/90">Attend sessions regularly for best results</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Take Notes</h4>
                <p className="text-sm text-white/90">Document key learnings from each session</p>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}