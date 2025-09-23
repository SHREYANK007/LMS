'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  MessageSquare,
  FileText,
  Star,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  User,
  RefreshCw,
  Crown,
  Plus
} from 'lucide-react'
import Link from 'next/link'

export default function TutorDashboard() {

  // Mock tutor data
  const tutorSpecialization = 'BOTH' // Can be 'PTE', 'NAATI', or 'BOTH'
  const tutorName = 'Dr. Sarah Wilson'

  const stats = [
    {
      title: "Upcoming Bookings",
      value: "8",
      description: "Sessions this week",
      change: "+3 new",
      icon: Calendar,
      iconBg: "from-blue-400 to-blue-600",
      changeBg: "text-emerald-400"
    },
    {
      title: "Total Bookings",
      value: "156",
      description: "All time sessions",
      change: "+12 this week",
      icon: Users,
      iconBg: "from-emerald-400 to-green-500",
      changeBg: "text-emerald-400"
    },
    {
      title: "Sessions This Month",
      value: "42",
      description: "Completed sessions",
      change: "+15 from last month",
      icon: CheckCircle2,
      iconBg: "from-orange-400 to-orange-500",
      changeBg: "text-emerald-400"
    },
    {
      title: "Rating",
      value: "4.9",
      description: "Student satisfaction",
      change: "+0.2",
      icon: Star,
      iconBg: "from-purple-400 to-pink-500",
      changeBg: "text-emerald-400"
    }
  ]

  const quickActions = [
    {
      title: "Upload Materials",
      description: "Add new learning resources",
      icon: FileText,
      gradient: "from-blue-400 to-blue-600",
      href: "/tutor/materials"
    },
    {
      title: "Create Announcement",
      description: "Notify students with updates",
      icon: MessageSquare,
      gradient: "from-emerald-400 to-green-500",
      href: "/tutor/announcements"
    },
    {
      title: "Update Schedule",
      description: "Manage your availability",
      icon: Calendar,
      gradient: "from-purple-400 to-pink-500",
      href: "/tutor/schedule"
    },
    {
      title: "Student Support",
      description: "View and respond to queries",
      icon: MessageSquare,
      gradient: "from-indigo-400 to-purple-500",
      href: "/tutor/support"
    }
  ]


  const getSpecializationColor = () => {
    if (tutorSpecialization === 'PTE') return 'from-blue-400 to-blue-500'
    if (tutorSpecialization === 'NAATI') return 'from-green-400 to-green-500'
    return 'from-purple-400 to-pink-500'
  }

  const recentStudents = [
    { name: "Sarah Johnson", course: "PTE Speaking", progress: "85%", status: "active", type: "PTE" },
    { name: "Mike Chen", course: "PTE Writing", progress: "72%", status: "active", type: "PTE" },
    { name: "Emma Davis", course: "NAATI CCL", progress: "91%", status: "completed", type: "NAATI" },
    { name: "Alex Rodriguez", course: "PTE Listening", progress: "67%", status: "struggling", type: "PTE" }
  ]

  const upcomingSessions = [
    { time: "10:00 AM", student: "Sarah Johnson", type: "One-to-One", duration: "45 min", subject: "PTE" },
    { time: "2:00 PM", student: "Group Session", type: "Masterclass", duration: "90 min", subject: "PTE" },
    { time: "4:30 PM", student: "Mike Chen", type: "One-to-One", duration: "45 min", subject: "NAATI" }
  ]

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Welcome back, Tutor!
                </h1>
                <p className="text-slate-500 text-lg mt-1">Ready to inspire your students today?</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getSpecializationColor()} text-white rounded-xl font-semibold shadow-lg`}>
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                {tutorSpecialization === 'BOTH' ? 'PTE & NAATI' : tutorSpecialization} Specialist
              </span>
              <Button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm gap-2">
                <RefreshCw className="w-4 h-4" />
                Switch Portal
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

        {/* Quick Actions */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Quick Actions</h2>
              <p className="text-slate-500 mt-1">Manage your teaching efficiently</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="group relative bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${action.gradient} rounded-full -translate-y-10 translate-x-10 group-hover:scale-110 transition-transform duration-300`}></div>
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center shadow-lg mb-4 relative z-10`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 relative z-10">{action.title}</h3>
                  <p className="text-slate-500 text-sm relative z-10">{action.description}</p>
                  <ArrowUpRight className="absolute bottom-4 right-4 w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Students */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Recent Students</h3>
              <Button variant="outline" size="sm" className="text-slate-600 border-slate-200">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentStudents.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{student.name}</p>
                      <p className="text-slate-500 text-xs">{student.course}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 text-sm">{student.progress}</p>
                    <div className="flex items-center gap-1">
                      {student.status === 'active' && <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>}
                      {student.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      {student.status === 'struggling' && <AlertTriangle className="w-3 h-3 text-orange-400" />}
                      <span className="text-xs text-slate-500">{student.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Today's Schedule</h3>
              <Link href="/tutor/schedule">
                <Button variant="outline" size="sm" className="text-slate-600 border-slate-200">
                  Manage
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{session.time}</p>
                      <p className="text-slate-500 text-xs">{session.student}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600 text-sm">{session.type}</p>
                    <p className="text-blue-500 text-xs">{session.duration}</p>
                  </div>
                </div>
              ))}
              <Link href="/tutor/schedule">
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Session
                </Button>
              </Link>
            </div>
          </div>

          {/* Completed Sessions Today */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Sessions Completed Today</h3>
              <span className="text-sm text-slate-500">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="space-y-4">
              {[
                { student: "Sarah Johnson", subject: "PTE Speaking", time: "9:00 AM", type: "One-to-One", rating: 5 },
                { student: "Mike Chen", subject: "PTE Writing", time: "11:30 AM", type: "One-to-One", rating: 5 },
                { student: "Group Session", subject: "NAATI CCL", time: "2:00 PM", type: "Masterclass", rating: 4 }
              ].map((session, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h4 className="font-semibold text-slate-800 text-sm mb-2">{session.student}</h4>
                  <div className="flex items-center gap-4 text-xs mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <span className="text-slate-600">{session.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-green-500" />
                      <span className="text-slate-600">{session.subject}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{session.type}</span>
                    <div className="flex items-center gap-1">
                      {[...Array(session.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}