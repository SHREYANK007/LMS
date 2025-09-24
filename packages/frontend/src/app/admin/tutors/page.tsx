'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  GraduationCap,
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  Star,
  Calendar,
  Users,
  Eye,
  MoreVertical,
  Pause,
  Play
} from 'lucide-react'
import { mockUsers, getUsersByRole } from '@/data/mock/mockUsers'

export default function TutorsPage() {
  const [tutors, setTutors] = useState(getUsersByRole('tutor'))
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  // Filter tutors
  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === 'all' || tutor.courseType === selectedCourse
    const matchesStatus = selectedStatus === 'all' ||
                         (selectedStatus === 'active' && tutor.isActive) ||
                         (selectedStatus === 'inactive' && !tutor.isActive)

    return matchesSearch && matchesCourse && matchesStatus
  })

  const handleToggleStatus = (tutorId: string) => {
    setTutors(prev => prev.map(tutor =>
      tutor.id === tutorId ? { ...tutor, isActive: !tutor.isActive } : tutor
    ))
  }

  // Mock data for tutor statistics
  const getTutorStats = (tutorId: string) => {
    const baseStats = {
      totalStudents: Math.floor(Math.random() * 50) + 10,
      sessionsThisWeek: Math.floor(Math.random() * 20) + 5,
      averageRating: (Math.random() * 1.5 + 3.5).toFixed(1),
      totalSessions: Math.floor(Math.random() * 200) + 50
    }
    return baseStats
  }

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Tutors Management
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Manage tutor accounts, performance, and availability
              </p>
            </div>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-6 py-3">
            <Plus className="w-4 h-4" />
            Add Tutor
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tutors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Course Filter */}
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Courses</option>
              <option value="PTE">PTE Specialists</option>
              <option value="NAATI">NAATI Specialists</option>
              <option value="BOTH">Both Courses</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Suspended</option>
            </select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setSelectedCourse('all')
                setSelectedStatus('all')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Tutors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => {
            const stats = getTutorStats(tutor.id)

            return (
              <div key={tutor.id} className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                <div className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {tutor.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tutor.courseType === 'PTE' ? 'bg-purple-100 text-purple-800' :
                          tutor.courseType === 'NAATI' ? 'bg-orange-100 text-orange-800' :
                          'bg-indigo-100 text-indigo-800'
                        }`}>
                          {tutor.courseType} Specialist
                        </div>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${tutor.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{tutor.email}</span>
                    </div>
                    {tutor.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{tutor.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-lg font-bold text-blue-900">{stats.totalStudents}</p>
                      <p className="text-xs text-blue-600">Students</p>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                      <p className="text-lg font-bold text-purple-900">{stats.sessionsThisWeek}</p>
                      <p className="text-xs text-purple-600">This Week</p>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-600" />
                      </div>
                      <p className="text-lg font-bold text-yellow-900">{stats.averageRating}</p>
                      <p className="text-xs text-yellow-600">Rating</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <GraduationCap className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-lg font-bold text-green-900">{stats.totalSessions}</p>
                      <p className="text-xs text-green-600">Total Sessions</p>
                    </div>
                  </div>

                  {/* Performance Indicator */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Performance</span>
                      <span className="text-sm text-gray-500">
                        {parseFloat(stats.averageRating) >= 4.5 ? 'Excellent' :
                         parseFloat(stats.averageRating) >= 4.0 ? 'Good' :
                         parseFloat(stats.averageRating) >= 3.5 ? 'Average' : 'Below Average'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          parseFloat(stats.averageRating) >= 4.5 ? 'bg-green-500' :
                          parseFloat(stats.averageRating) >= 4.0 ? 'bg-blue-500' :
                          parseFloat(stats.averageRating) >= 3.5 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${(parseFloat(stats.averageRating) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(tutor.id)}
                      className={`${
                        tutor.isActive
                          ? 'text-red-600 hover:text-red-700 hover:bg-red-50'
                          : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                      }`}
                    >
                      {tutor.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Status */}
                  <div className="text-center pt-2 border-t">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${tutor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {tutor.isActive ? 'Active' : 'Suspended'}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Last login: {tutor.lastLogin?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredTutors.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 text-center">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tutors found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCourse !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your search filters'
                : 'Get started by adding your first tutor'
              }
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Tutor
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}