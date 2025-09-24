'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  Settings
} from 'lucide-react'
import { mockUsers, getUsersByRole } from '@/data/mock/mockUsers'

export default function StudentsPage() {
  const [students, setStudents] = useState(getUsersByRole('student'))
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === 'all' || student.courseType === selectedCourse
    const matchesStatus = selectedStatus === 'all' ||
                         (selectedStatus === 'active' && student.isActive) ||
                         (selectedStatus === 'inactive' && !student.isActive) ||
                         (selectedStatus === 'expiring' && student.expiryDate && new Date(student.expiryDate) <= new Date(Date.now() + 10 * 24 * 60 * 60 * 1000))

    return matchesSearch && matchesCourse && matchesStatus
  })

  const handleToggleFeature = (studentId: string, feature: keyof typeof students[0]['features']) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId && student.features) {
        return {
          ...student,
          features: {
            ...student.features,
            [feature]: !student.features[feature]
          }
        }
      }
      return student
    }))
  }

  const getExpiryStatus = (expiryDate?: Date) => {
    if (!expiryDate) return { status: 'none', text: 'No expiry set', color: 'text-gray-500' }

    const now = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) {
      return { status: 'expired', text: 'Expired', color: 'text-red-600' }
    } else if (daysUntilExpiry <= 10) {
      return { status: 'expiring', text: `${daysUntilExpiry} days left`, color: 'text-orange-600' }
    } else {
      return { status: 'active', text: `${daysUntilExpiry} days left`, color: 'text-green-600' }
    }
  }

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Students Management
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Manage student accounts, courses, and features
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-6 py-3"
          >
            <Plus className="w-4 h-4" />
            Add Student
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
                placeholder="Search students..."
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
              <option value="PTE">PTE Only</option>
              <option value="NAATI">NAATI Only</option>
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
              <option value="inactive">Inactive</option>
              <option value="expiring">Expiring Soon</option>
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

        {/* Students List */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Students ({filteredStudents.length})
              </h3>
              <p className="text-gray-600 mt-1">
                Manage student accounts, course assignments, and feature access
              </p>
            </div>
          </div>
          <div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Student</th>
                    <th className="text-left p-4 font-medium text-gray-900">Course</th>
                    <th className="text-left p-4 font-medium text-gray-900">Expiry</th>
                    <th className="text-left p-4 font-medium text-gray-900">Features</th>
                    <th className="text-left p-4 font-medium text-gray-900">Status</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredStudents.map((student) => {
                    const expiryStatus = getExpiryStatus(student.expiryDate)

                    return (
                      <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{student.name}</p>
                              <p className="text-sm text-gray-500">{student.email}</p>
                              {student.phone && (
                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {student.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className={`status-badge ${
                            student.courseType === 'PTE' ? 'course-pte' :
                            student.courseType === 'NAATI' ? 'course-naati' :
                            'bg-indigo-100 text-indigo-800'
                          }`}>
                            {student.courseType}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className={`text-sm ${expiryStatus.color}`}>
                              {expiryStatus.text}
                            </span>
                          </div>
                          {student.expiryDate && (
                            <p className="text-xs text-gray-500">
                              {student.expiryDate.toLocaleDateString()}
                            </p>
                          )}
                        </td>

                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {student.features && Object.entries(student.features).map(([feature, enabled]) => (
                              <button
                                key={feature}
                                onClick={() => handleToggleFeature(student.id, feature as any)}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                  enabled
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                                title={`Toggle ${feature}`}
                              >
                                {feature}
                                {enabled ? <CheckCircle className="w-3 h-3 inline ml-1" /> : <X className="w-3 h-3 inline ml-1" />}
                              </button>
                            ))}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className={`status-badge ${student.isActive ? 'status-active' : 'status-inactive'}`}>
                            {student.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedStudent(student)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}