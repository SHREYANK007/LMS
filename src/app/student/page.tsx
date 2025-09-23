'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  Calendar,
  Star,
  Zap,
  Users,
  Play,
  ArrowRight,
  Plus,
  CheckCircle2,
  Target,
  Crown,
  Sparkles,
  ChevronRight,
  RefreshCw,
  User
} from 'lucide-react'
import Link from 'next/link'
import { mockUsers, getUsersByRole } from '@/data/mock/mockUsers'

export default function StudentDashboard() {
  // Mock current student - using student1 from our data
  const currentStudent = mockUsers.find(user => user.id === 'student1')
  const studentCourse = currentStudent?.courseType || 'PTE'

  const stats = [
    {
      title: "Sessions Completed",
      value: "42",
      change: "+8",
      changeType: "increase",
      description: "This month",
      icon: CheckCircle2,
      iconBg: "from-emerald-400 to-green-500",
      changeBg: "text-emerald-400"
    },
    {
      title: "Learning Hours",
      value: "87h",
      change: "+12h",
      changeType: "increase",
      description: "Total study time",
      icon: Clock,
      iconBg: "from-blue-400 to-cyan-500",
      changeBg: "text-blue-400"
    },
    {
      title: "Course Progress",
      value: "73%",
      change: "+5%",
      changeType: "increase",
      description: "Overall completion",
      icon: TrendingUp,
      iconBg: "from-purple-400 to-pink-500",
      changeBg: "text-purple-400"
    },
    {
      title: "Achievements",
      value: "12",
      change: "+3",
      changeType: "increase",
      description: "Badges earned",
      icon: Award,
      iconBg: "from-amber-400 to-orange-500",
      changeBg: "text-amber-400"
    }
  ]

  const quickActions = [
    {
      title: "Smart Quad",
      description: "Join group sessions",
      icon: Zap,
      gradient: "from-blue-500 to-indigo-600",
      href: "/student/smart-quad"
    },
    {
      title: "One-to-One",
      description: "Private tutoring",
      icon: Users,
      gradient: "from-emerald-500 to-green-600",
      href: "/student/one-to-one"
    },
    {
      title: "Masterclass",
      description: "Expert sessions",
      icon: Crown,
      gradient: "from-purple-500 to-pink-600",
      href: "/student/masterclass"
    },
    {
      title: "Materials",
      description: "Study resources",
      icon: BookOpen,
      gradient: "from-orange-500 to-red-600",
      href: "/student/materials"
    }
  ]

  const upcomingSessions = [
    {
      id: 1,
      title: "PTE Speaking Workshop",
      tutor: "Dr. Sarah Wilson",
      time: "Today • 2:00 PM",
      type: "Smart Quad",
      students: 3,
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      id: 2,
      title: "Writing Assessment Practice",
      tutor: "Prof. Michael Brown",
      time: "Tomorrow • 10:00 AM",
      type: "One-to-One",
      students: 1,
      gradient: "from-emerald-500 to-green-600"
    }
  ]

  const recentAchievements = [
    {
      id: 1,
      title: "Study Streak",
      description: "7 days in a row",
      icon: Sparkles,
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      id: 2,
      title: "Quick Learner",
      description: "Completed 5 sessions",
      icon: Target,
      gradient: "from-purple-400 to-pink-500"
    }
  ]

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Welcome back, {currentStudent?.name?.split(' ')[0]}!
                </h1>
                <p className="text-slate-500 text-lg mt-1">Ready to continue your {studentCourse} journey today?</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-xl font-semibold shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                {studentCourse} Course
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
              <p className="text-slate-500">Jump into your learning sessions</p>
            </div>
            <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
              View All Schedule <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer h-full">
                  <div className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                    <action.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{action.title}</h3>
                  <p className="text-slate-600 text-sm mb-4">{action.description}</p>
                  <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
                    Explore
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Sessions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Upcoming Sessions</h3>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-1" />
                Book Session
              </Button>
            </div>

            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800">{session.title}</h4>
                      <p className="text-sm text-slate-600">{session.tutor}</p>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 bg-gradient-to-r ${session.gradient} text-white text-xs font-medium rounded-full`}>
                      {session.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span>{session.time}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      <Play className="w-4 h-4 mr-1" />
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Progress */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800">Course Progress</h3>
              <span className="text-sm text-slate-500">Updated today</span>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
                <h4 className="font-semibold mb-2">{studentCourse} Preparation</h4>
                <div className="text-3xl font-bold mb-2">73%</div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                  <div className="bg-white rounded-full h-2 transition-all duration-500" style={{ width: '73%' }}></div>
                </div>
                <p className="text-sm text-white/90">22 of 30 modules completed</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-slate-700 text-sm">Recent Achievements</h4>
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className={`w-10 h-10 bg-gradient-to-br ${achievement.gradient} rounded-lg flex items-center justify-center`}>
                      <achievement.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{achievement.title}</p>
                      <p className="text-xs text-slate-600">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}