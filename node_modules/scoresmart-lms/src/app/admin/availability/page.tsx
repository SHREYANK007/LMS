'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Edit,
  Eye,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react'

export default function AdminAvailabilityPage() {
  const [selectedWeek, setSelectedWeek] = useState(new Date())
  const [selectedTutor, setSelectedTutor] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')

  const stats = [
    {
      title: "Total Slots",
      value: "240",
      description: "Available this week",
      icon: Calendar,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Booked Slots",
      value: "156",
      description: "65% utilization",
      icon: CheckCircle2,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Available Slots",
      value: "84",
      description: "Ready for booking",
      icon: Clock,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Active Tutors",
      value: "12",
      description: "Setting availability",
      icon: Users,
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  const tutors = [
    { id: 1, name: "Dr. Sarah Wilson", specialization: "PTE", availability: "High", slots: 24 },
    { id: 2, name: "Prof. Michael Brown", specialization: "NAATI", availability: "Medium", slots: 18 },
    { id: 3, name: "Dr. Lisa Chen", specialization: "Both", availability: "High", slots: 22 },
    { id: 4, name: "Dr. James Miller", specialization: "PTE", availability: "Low", slots: 8 }
  ]

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'High': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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
                Tutor Availability
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Manage tutor schedules and availability slots
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <Eye className="w-4 h-4" />
              View Calendar
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Set Availability
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
                  <p className="text-slate-400 text-xs mt-1">{stat.description}</p>
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tutors..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedTutor}
              onChange={(e) => setSelectedTutor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Tutors</option>
              <option value="pte">PTE Specialists</option>
              <option value="naati">NAATI Specialists</option>
              <option value="both">Both Specializations</option>
            </select>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'week' | 'month')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="week">Week View</option>
              <option value="month">Month View</option>
            </select>
            <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Tutor Availability List */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Tutor Availability Overview</h3>
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Export Schedule
            </Button>
          </div>

          <div className="space-y-4">
            {tutors.map((tutor) => (
              <div key={tutor.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{tutor.name}</h4>
                    <p className="text-sm text-gray-600">{tutor.specialization} Specialist</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Available Slots</p>
                    <p className="font-bold text-gray-800">{tutor.slots}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(tutor.availability)}`}>
                    {tutor.availability}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}