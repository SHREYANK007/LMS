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
  Video,
  MessageSquare,
  Globe,
  Sparkles,
  Crown,
  Zap,
  ChevronRight,
  RefreshCw
} from 'lucide-react'
import { mockSessions, getSessionsByType } from '@/data/mock/mockSessions'
import { theme } from '@/styles/theme'

export default function MasterclassPage() {
  const [activeTab, setActiveTab] = useState<'available' | 'upcoming' | 'completed'>('available')
  const [selectedCourse, setSelectedCourse] = useState<'all' | 'PTE' | 'NAATI' | 'BOTH'>('all')

  // Get masterclass sessions
  const masterclassSessions = getSessionsByType('masterclass')
  const myUpcomingSessions = masterclassSessions.filter(session =>
    session.status === 'scheduled' &&
    session.studentIds.includes('student1') &&
    new Date(session.date) > new Date()
  )
  const myCompletedSessions = masterclassSessions.filter(session =>
    session.status === 'completed' &&
    session.studentIds.includes('student1')
  )
  const availableSessions = masterclassSessions.filter(session =>
    session.status === 'scheduled' &&
    session.studentIds.length < session.maxStudents &&
    new Date(session.date) > new Date()
  )

  // Filter based on selected course
  const filteredAvailable = availableSessions.filter(session =>
    selectedCourse === 'all' || session.courseType === selectedCourse
  )

  const stats = {
    masterclassesAttended: myCompletedSessions.length,
    upcomingMasterclasses: myUpcomingSessions.length,
    totalHours: myCompletedSessions.length * 2, // 2 hours per masterclass
    expertTutors: 3
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Masterclass Sessions
              </h1>
              <p className="text-slate-500 text-lg mt-1">Learn from industry experts in comprehensive group sessions</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-xl font-semibold shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Expert Sessions
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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-purple-400">
                +{stats.masterclassesAttended}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.masterclassesAttended}</div>
            <p className="text-sm text-slate-300">Masterclasses Attended</p>
            <p className="text-xs text-slate-400 mt-2">Completed sessions</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-blue-400">
                +{stats.upcomingMasterclasses}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.upcomingMasterclasses}</div>
            <p className="text-sm text-slate-300">Upcoming Masterclasses</p>
            <p className="text-xs text-slate-400 mt-2">This week</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-emerald-400">
                +{stats.totalHours}h
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalHours}h</div>
            <p className="text-sm text-slate-300">Total Hours</p>
            <p className="text-xs text-slate-400 mt-2">Expert learning time</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-amber-400">
                {stats.expertTutors}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.expertTutors}</div>
            <p className="text-sm text-slate-300">Expert Tutors</p>
            <p className="text-xs text-slate-400 mt-2">Available mentors</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Quick Actions</h2>
            <p className="text-slate-500">Manage your masterclass sessions</p>
          </div>
          <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
            View All Masterclasses <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Search className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Browse Masterclasses</h3>
            <p className="text-slate-600 text-sm mb-4">Find expert sessions</p>
            <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
              Explore
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">My Masterclasses</h3>
            <p className="text-slate-600 text-sm mb-4">View registered sessions</p>
            <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
              Explore
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Premium Access</h3>
            <p className="text-slate-600 text-sm mb-4">Exclusive content</p>
            <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
              Explore
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Class Timetable */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Masterclass Timetable</h2>
            <p className="text-slate-500">Fixed weekly schedule set by admin</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">December 2024</span>
            <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Calendar Header */}
          <div className="grid grid-cols-8 bg-slate-50 border-b border-slate-200">
            <div className="p-4 text-center rounded-tl-2xl">
              <span className="text-sm font-semibold text-slate-600">Time</span>
            </div>
            <div className="p-4 text-center border-l border-slate-200">
              <span className="text-sm font-semibold text-slate-600">Monday</span>
            </div>
            <div className="p-4 text-center border-l border-slate-200">
              <span className="text-sm font-semibold text-slate-600">Tuesday</span>
            </div>
            <div className="p-4 text-center border-l border-slate-200">
              <span className="text-sm font-semibold text-slate-600">Wednesday</span>
            </div>
            <div className="p-4 text-center border-l border-slate-200">
              <span className="text-sm font-semibold text-slate-600">Thursday</span>
            </div>
            <div className="p-4 text-center border-l border-slate-200">
              <span className="text-sm font-semibold text-slate-600">Friday</span>
            </div>
            <div className="p-4 text-center border-l border-slate-200">
              <span className="text-sm font-semibold text-slate-600">Saturday</span>
            </div>
            <div className="p-4 text-center border-l border-slate-200 rounded-tr-2xl">
              <span className="text-sm font-semibold text-slate-600">Sunday</span>
            </div>
          </div>

          {/* Time Slots */}
          {/* 9:00 AM Row */}
          <div className="grid grid-cols-8 border-b border-slate-100">
            <div className="p-4 text-center bg-slate-50 border-r border-slate-200">
              <span className="text-sm font-medium text-slate-600">9:00 AM</span>
            </div>
            <div className="p-2 border-r border-slate-100"></div>
            <div className="p-2 border-r border-slate-100">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-3 text-white shadow-sm">
                <h4 className="text-xs font-semibold mb-1">PTE Speaking</h4>
                <p className="text-xs opacity-90">Dr. Wilson</p>
                <Button size="sm" className="bg-white/95 text-purple-700 hover:bg-white font-medium text-xs mt-2 w-full">
                  JOIN NOW
                </Button>
              </div>
            </div>
            <div className="p-2 border-r border-slate-100"></div>
            <div className="p-2 border-r border-slate-100">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-3 text-white shadow-sm">
                <h4 className="text-xs font-semibold mb-1">NAATI Ethics</h4>
                <p className="text-xs opacity-90">Prof. Brown</p>
                <Button size="sm" className="bg-white/95 text-blue-700 hover:bg-white font-medium text-xs mt-2 w-full">
                  JOIN NOW
                </Button>
              </div>
            </div>
            <div className="p-2 border-r border-slate-100"></div>
            <div className="p-2 border-r border-slate-100">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl p-3 text-white shadow-sm">
                <h4 className="text-xs font-semibold mb-1">Combined Prep</h4>
                <p className="text-xs opacity-90">Dr. Singh</p>
                <Button size="sm" className="bg-white/95 text-emerald-700 hover:bg-white font-medium text-xs mt-2 w-full">
                  JOIN NOW
                </Button>
              </div>
            </div>
            <div className="p-2"></div>
          </div>

          {/* 2:00 PM Row */}
          <div className="grid grid-cols-8 border-b border-slate-100">
            <div className="p-4 text-center bg-slate-50 border-r border-slate-200">
              <span className="text-sm font-medium text-slate-600">2:00 PM</span>
            </div>
            <div className="p-2 border-r border-slate-100">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-3 text-white shadow-sm">
                <h4 className="text-xs font-semibold mb-1">PTE Writing</h4>
                <p className="text-xs opacity-90">Ms. Taylor</p>
                <Button size="sm" className="bg-white/95 text-amber-700 hover:bg-white font-medium text-xs mt-2 w-full">
                  JOIN NOW
                </Button>
              </div>
            </div>
            <div className="p-2 border-r border-slate-100"></div>
            <div className="p-2 border-r border-slate-100">
              <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl p-3 text-white shadow-sm">
                <h4 className="text-xs font-semibold mb-1">NAATI Practice</h4>
                <p className="text-xs opacity-90">Dr. Chen</p>
                <Button size="sm" className="bg-white/95 text-rose-700 hover:bg-white font-medium text-xs mt-2 w-full">
                  JOIN NOW
                </Button>
              </div>
            </div>
            <div className="p-2 border-r border-slate-100"></div>
            <div className="p-2 border-r border-slate-100">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl p-3 text-white shadow-sm">
                <h4 className="text-xs font-semibold mb-1">PTE Reading</h4>
                <p className="text-xs opacity-90">Dr. Patel</p>
                <Button size="sm" className="bg-white/95 text-cyan-700 hover:bg-white font-medium text-xs mt-2 w-full">
                  JOIN NOW
                </Button>
              </div>
            </div>
            <div className="p-2 border-r border-slate-100"></div>
            <div className="p-2">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl p-3 text-white shadow-sm">
                <h4 className="text-xs font-semibold mb-1">Mock Test</h4>
                <p className="text-xs opacity-90">All Tutors</p>
                <Button size="sm" className="bg-white/95 text-violet-700 hover:bg-white font-medium text-xs mt-2 w-full">
                  JOIN NOW
                </Button>
              </div>
            </div>
          </div>

          {/* 6:00 PM Row */}
          <div className="grid grid-cols-8 border-b border-slate-100">
            <div className="p-4 text-center bg-slate-50 border-r border-slate-200">
              <span className="text-sm font-medium text-slate-600">6:00 PM</span>
            </div>
            <div className="p-2 border-r border-slate-100"></div>
            <div className="p-2 border-r border-slate-100">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl p-3 text-white shadow-sm">
                <h4 className="text-xs font-semibold mb-1">PTE Listening</h4>
                <p className="text-xs opacity-90">Dr. Kumar</p>
                <Button size="sm" className="bg-white/95 text-teal-700 hover:bg-white font-medium text-xs mt-2 w-full">
                  JOIN NOW
                </Button>
              </div>
            </div>
            <div className="p-2 border-r border-slate-100">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-3 text-white shadow-sm">
                <h4 className="text-xs font-semibold mb-1">NAATI Medical</h4>
                <p className="text-xs opacity-90">Dr. White</p>
                <Button size="sm" className="bg-white/95 text-orange-700 hover:bg-white font-medium text-xs mt-2 w-full">
                  JOIN NOW
                </Button>
              </div>
            </div>
            <div className="p-2 border-r border-slate-100"></div>
            <div className="p-2 border-r border-slate-100">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-3 text-white shadow-sm">
                <h4 className="text-xs font-semibold mb-1">PTE Strategy</h4>
                <p className="text-xs opacity-90">Ms. Lee</p>
                <Button size="sm" className="bg-white/95 text-indigo-700 hover:bg-white font-medium text-xs mt-2 w-full">
                  JOIN NOW
                </Button>
              </div>
            </div>
            <div className="p-2 border-r border-slate-100"></div>
            <div className="p-2"></div>
          </div>

          {/* 8:00 PM Row */}
          <div className="grid grid-cols-8">
            <div className="p-4 text-center bg-slate-50 border-r border-slate-200 rounded-bl-2xl">
              <span className="text-sm font-medium text-slate-600">8:00 PM</span>
            </div>
            <div className="p-2 border-r border-slate-100">
              <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl p-3 text-white shadow-sm">
                <h4 className="text-xs font-semibold mb-1">Evening Review</h4>
                <p className="text-xs opacity-90">All Subjects</p>
                <Button size="sm" className="bg-white/95 text-pink-700 hover:bg-white font-medium text-xs mt-2 w-full">
                  JOIN NOW
                </Button>
              </div>
            </div>
            <div className="p-2 border-r border-slate-100"></div>
            <div className="p-2 border-r border-slate-100">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-3 text-white shadow-sm">
                <h4 className="text-xs font-semibold mb-1">Q&A Session</h4>
                <p className="text-xs opacity-90">Open Floor</p>
                <Button size="sm" className="bg-white/95 text-green-700 hover:bg-white font-medium text-xs mt-2 w-full">
                  JOIN NOW
                </Button>
              </div>
            </div>
            <div className="p-2 border-r border-slate-100"></div>
            <div className="p-2 border-r border-slate-100">
              <div className="bg-gradient-to-r from-slate-500 to-gray-600 rounded-xl p-3 text-white shadow-sm">
                <h4 className="text-xs font-semibold mb-1">Study Group</h4>
                <p className="text-xs opacity-90">Peer Learning</p>
                <Button size="sm" className="bg-white/95 text-slate-700 hover:bg-white font-medium text-xs mt-2 w-full">
                  JOIN NOW
                </Button>
              </div>
            </div>
            <div className="p-2 border-r border-slate-100"></div>
            <div className="p-2 rounded-br-2xl"></div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl p-4 border border-slate-100">
          <h4 className="text-sm font-semibold text-slate-800 mb-3">Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded"></div>
              <span className="text-slate-600">PTE Speaking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded"></div>
              <span className="text-slate-600">NAATI Ethics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded"></div>
              <span className="text-slate-600">Combined Prep</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded"></div>
              <span className="text-slate-600">PTE Writing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}