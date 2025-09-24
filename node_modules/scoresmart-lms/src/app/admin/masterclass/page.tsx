'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  Calendar,
  Clock,
  Star,
  Video,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Crown
} from 'lucide-react'

export default function AdminMasterclassPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const stats = [
    {
      title: "Total Masterclasses",
      value: "28",
      description: "All scheduled sessions",
      icon: Crown,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Active Sessions",
      value: "12",
      description: "Currently running",
      icon: Video,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Total Students",
      value: "340",
      description: "Enrolled participants",
      icon: Users,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Average Rating",
      value: "4.8",
      description: "Student satisfaction",
      icon: Star,
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  const masterclasses = [
    {
      id: 1,
      title: "PTE Speaking Masterclass",
      tutor: "Dr. Sarah Wilson",
      date: "2024-12-20",
      time: "2:00 PM",
      duration: "90 min",
      students: 25,
      maxStudents: 30,
      type: "PTE",
      status: "scheduled",
      mode: "online"
    },
    {
      id: 2,
      title: "NAATI CCL Advanced Strategies",
      tutor: "Prof. Michael Brown",
      date: "2024-12-21",
      time: "10:00 AM",
      duration: "120 min",
      students: 18,
      maxStudents: 20,
      type: "NAATI",
      status: "scheduled",
      mode: "online"
    },
    {
      id: 3,
      title: "PTE Writing Workshop",
      tutor: "Dr. Lisa Chen",
      date: "2024-12-19",
      time: "4:00 PM",
      duration: "90 min",
      students: 22,
      maxStudents: 25,
      type: "PTE",
      status: "completed",
      mode: "hybrid"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'ongoing': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PTE': return 'bg-purple-100 text-purple-800'
      case 'NAATI': return 'bg-orange-100 text-orange-800'
      case 'Both': return 'bg-indigo-100 text-indigo-800'
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
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Masterclass Management
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Manage group sessions and expert workshops
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
              Create Masterclass
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
                placeholder="Search masterclasses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="PTE">PTE Only</option>
              <option value="NAATI">NAATI Only</option>
              <option value="Both">Both Courses</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Masterclass List */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Upcoming Masterclasses</h3>
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Export List
            </Button>
          </div>

          <div className="space-y-4">
            {masterclasses.map((masterclass) => (
              <div key={masterclass.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="font-semibold text-gray-800">{masterclass.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(masterclass.status)}`}>
                        {masterclass.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(masterclass.type)}`}>
                        {masterclass.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Tutor: {masterclass.tutor}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{masterclass.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{masterclass.time} ({masterclass.duration})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{masterclass.students}/{masterclass.maxStudents} students</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {masterclass.mode === 'online' ? (
                          <Video className="h-3 w-3 text-green-500" />
                        ) : (
                          <MapPin className="h-3 w-3 text-orange-500" />
                        )}
                        <span>{masterclass.mode}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {masterclass.status === 'scheduled' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      <Video className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}