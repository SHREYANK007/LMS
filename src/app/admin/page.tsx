'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Star,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Filter,
  MoreHorizontal,
  Download,
  Eye,
  CheckCircle2,
  Zap,
  Crown,
  Target,
  Award,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { mockUsers, getUsersByRole, getExpiringStudents } from '@/data/mock/mockUsers'

export default function AdminDashboard() {
  const students = getUsersByRole('student')
  const tutors = getUsersByRole('tutor')
  const activeStudents = students.filter(s => s.isActive)
  const expiringStudents = getExpiringStudents()

  const stats = [
    {
      title: "Total Students",
      value: students.length.toString(),
      change: "+12%",
      changeType: "increase",
      description: `${activeStudents.length} active students`,
      icon: Users,
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      href: "/admin/students"
    },
    {
      title: "Active Tutors",
      value: tutors.filter(t => t.isActive).length.toString(),
      change: "+8%",
      changeType: "increase",
      description: `${tutors.length} total tutors`,
      icon: BookOpen,
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 to-green-50",
      href: "/admin/tutors"
    },
    {
      title: "Monthly Revenue",
      value: "$42,850",
      change: "+18%",
      changeType: "increase",
      description: "vs last month",
      icon: DollarSign,
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50",
      href: "/admin/payments"
    },
    {
      title: "Course Completion",
      value: "68.5%",
      change: "-2%",
      changeType: "decrease",
      description: "Average completion rate",
      icon: TrendingUp,
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50",
      href: "/admin/analytics"
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: "student_enrolled",
      user: "Emily Johnson",
      action: "enrolled in PTE Course",
      time: "2 hours ago",
      avatar: "EJ",
      color: "blue"
    },
    {
      id: 2,
      type: "payment_received",
      user: "David Lee",
      action: "completed payment for NAATI course",
      time: "4 hours ago",
      avatar: "DL",
      color: "green"
    },
    {
      id: 3,
      type: "session_completed",
      user: "Maria Garcia",
      action: "completed Smart Quad session",
      time: "6 hours ago",
      avatar: "MG",
      color: "purple"
    },
    {
      id: 4,
      type: "tutor_joined",
      user: "Dr. Lisa Chen",
      action: "joined as NAATI specialist",
      time: "1 day ago",
      avatar: "LC",
      color: "yellow"
    }
  ]

  const courseStats = {
    PTE: students.filter(s => s.courseType === 'PTE' || s.courseType === 'BOTH').length,
    NAATI: students.filter(s => s.courseType === 'NAATI' || s.courseType === 'BOTH').length
  }

  const upcomingSessions = [
    { id: 1, type: "Smart Quad", time: "10:00 AM", students: 4, tutor: "Dr. Sarah Wilson", color: "blue" },
    { id: 2, type: "One-to-One", time: "11:30 AM", students: 1, tutor: "Prof. Michael Brown", color: "green" },
    { id: 3, type: "Masterclass", time: "2:00 PM", students: 12, tutor: "Dr. Lisa Chen", color: "purple" },
    { id: 4, type: "Smart Quad", time: "4:00 PM", students: 3, tutor: "Dr. Sarah Wilson", color: "blue" }
  ]

  const quickActions = [
    { title: "Add Student", icon: Users, href: "/admin/students?action=add", gradient: "from-blue-500 to-indigo-600" },
    { title: "Add Tutor", icon: BookOpen, href: "/admin/tutors?action=add", gradient: "from-green-500 to-emerald-600" },
    { title: "Schedule", icon: Calendar, href: "/admin/sessions", gradient: "from-purple-500 to-violet-600" },
    { title: "Materials", icon: BookOpen, href: "/admin/materials", gradient: "from-indigo-500 to-blue-600" },
    { title: "Payments", icon: DollarSign, href: "/admin/payments", gradient: "from-yellow-500 to-orange-600" },
    { title: "Settings", icon: Star, href: "/admin/settings", gradient: "from-pink-500 to-rose-600" }
  ]

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Welcome back, Admin!
              </h1>
              <p className="text-slate-500 text-lg mt-1">Here's what's happening with your learning platform today.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-6 py-3">
              <Plus className="w-4 h-4" />
              Quick Add
            </Button>
          </div>
        </div>
        {/* Critical Alerts */}
        {expiringStudents.length > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center shadow-sm">
                  <AlertTriangle className="w-7 h-7 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-orange-900 mb-2">
                    Urgent: Students Expiring Soon
                  </h3>
                  <p className="text-orange-700 mb-6 text-lg">
                    {expiringStudents.length} students have courses expiring within 10 days.
                    Immediate action required to ensure continuity.
                  </p>
                  <div className="flex items-center gap-4">
                    <Link href="/admin/students?filter=expiring">
                      <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3">
                        View Expiring Students
                      </Button>
                    </Link>
                    <Button variant="outline" className="border-orange-300 text-orange-700 px-6 py-3">
                      Send Renewal Reminders
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Link key={stat.title} href={stat.href} className="block group">
              <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-sm font-bold ${
                    stat.changeType === 'increase' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <p className="text-sm text-slate-300">{stat.title}</p>
                <p className="text-xs text-slate-400 mt-2">{stat.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Analytics */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">Course Distribution</h3>
                <p className="text-gray-600">Student enrollment by course type</p>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">PTE Preparation</span>
                  <span className="text-lg font-bold text-gray-900">{courseStats.PTE}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"
                    style={{ width: `${(courseStats.PTE / students.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">NAATI Certification</span>
                  <span className="text-lg font-bold text-gray-900">{courseStats.NAATI}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-violet-600"
                    style={{ width: `${(courseStats.NAATI / students.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <Link href="/admin/analytics">
                  <Button variant="outline" className="w-full gap-2">
                    <Eye className="w-4 h-4" />
                    View Detailed Analytics
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Today's Sessions</h3>
                  <p className="text-gray-600">Upcoming classes and appointments</p>
                </div>
                <Link href="/admin/sessions">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        session.color === 'blue' ? 'bg-blue-500' :
                        session.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {session.type}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.tutor} • {session.students} student{session.students !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-xs font-semibold text-gray-600">
                        {session.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Recent Activity</h3>
                  <p className="text-gray-600">Latest platform activities</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                      activity.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
                      activity.color === 'green' ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                      activity.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-violet-600' :
                      'bg-gradient-to-r from-yellow-500 to-orange-600'
                    }`}>
                      {activity.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-semibold">{activity.user}</span>{' '}
                        <span className="text-gray-600">{activity.action}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
              <p className="text-gray-600">Frequently used administrative tools</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href} className="group">
                  <div className="bg-gray-50 rounded-xl h-28 text-center hover:shadow-lg transition-all duration-200">
                    <div className="p-4 h-full flex flex-col items-center justify-center">
                      <div className={`w-12 h-12 mb-3 rounded-xl bg-gradient-to-r ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}