'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  Plus,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  BookOpen,
  Target,
  Calendar,
  Eye,
  MousePointer,
  Clock,
  Award
} from 'lucide-react'

export default function AdminAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('month')
  const [selectedMetric, setSelectedMetric] = useState<string>('all')
  const [selectedCourse, setSelectedCourse] = useState<string>('all')

  const stats = [
    {
      title: "Total Students",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Revenue",
      value: "$156,420",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Course Completion",
      value: "87.3%",
      change: "-2.1%",
      trend: "down",
      icon: Award,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Avg Session Time",
      value: "45.2 min",
      change: "+5.7%",
      trend: "up",
      icon: Clock,
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  const courseAnalytics = [
    {
      course: "PTE Academic Preparation",
      students: 1247,
      revenue: 372100,
      completion: 89.2,
      rating: 4.7,
      trend: "up"
    },
    {
      course: "NAATI CCL Preparation",
      students: 856,
      revenue: 341400,
      completion: 85.6,
      rating: 4.6,
      trend: "up"
    },
    {
      course: "PTE Speaking Masterclass",
      students: 432,
      revenue: 64800,
      completion: 92.1,
      rating: 4.8,
      trend: "up"
    },
    {
      course: "NAATI Mock Tests",
      students: 312,
      revenue: 30900,
      completion: 78.4,
      rating: 4.4,
      trend: "down"
    }
  ]

  const recentActivity = [
    {
      type: "enrollment",
      description: "New student enrolled in PTE Academic Preparation",
      student: "Alice Johnson",
      time: "2 minutes ago",
      value: "$299"
    },
    {
      type: "completion",
      description: "Student completed NAATI CCL course",
      student: "Mark Davis",
      time: "15 minutes ago",
      value: "Certificate issued"
    },
    {
      type: "payment",
      description: "Payment received for 1-on-1 tutoring",
      student: "Emma Wilson",
      time: "1 hour ago",
      value: "$75"
    },
    {
      type: "review",
      description: "New 5-star review for PTE Speaking Masterclass",
      student: "James Brown",
      time: "2 hours ago",
      value: "5 stars"
    }
  ]

  const topPerformers = [
    { tutor: "Dr. Sarah Wilson", students: 89, rating: 4.9, revenue: 22350 },
    { tutor: "Prof. Michael Brown", students: 76, rating: 4.8, revenue: 19200 },
    { tutor: "Dr. Lisa Chen", students: 68, rating: 4.7, revenue: 17850 },
    { tutor: "Dr. James Miller", students: 54, rating: 4.6, revenue: 14250 }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <Users className="w-4 h-4 text-blue-500" />
      case 'completion': return <Award className="w-4 h-4 text-green-500" />
      case 'payment': return <DollarSign className="w-4 h-4 text-purple-500" />
      case 'review': return <Target className="w-4 h-4 text-orange-500" />
      default: return <Eye className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Track performance, revenue, and student insights
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Create Report
            </Button>
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
                  <div className="flex items-center mt-1">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400 mr-1" />
                    )}
                    <p className={`text-xs ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Courses</option>
              <option value="PTE">PTE Courses</option>
              <option value="NAATI">NAATI Courses</option>
              <option value="Masterclass">Masterclasses</option>
            </select>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Metrics</option>
              <option value="revenue">Revenue</option>
              <option value="enrollment">Enrollment</option>
              <option value="completion">Completion</option>
            </select>
            <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Course Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Course Performance</h3>
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              View Details
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Course</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Students</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Completion</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Rating</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Trend</th>
                </tr>
              </thead>
              <tbody>
                {courseAnalytics.map((course, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-gray-800">{course.course}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-800">{course.students.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-gray-800">{formatCurrency(course.revenue)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${course.completion}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{course.completion}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-800">{course.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {course.trend === 'up' ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity & Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Recent Activity</h3>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.student} • {activity.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">{activity.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Top Performing Tutors</h3>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {topPerformers.map((tutor, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                      {tutor.tutor.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{tutor.tutor}</p>
                      <p className="text-xs text-gray-500">{tutor.students} students</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{formatCurrency(tutor.revenue)}</p>
                    <div className="flex items-center space-x-1">
                      <Target className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs text-gray-600">{tutor.rating}</span>
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