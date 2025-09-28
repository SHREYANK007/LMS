'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  Search,
  Edit,
  Trash2,
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  X,
  AlertTriangle,
  Loader2,
  Plus
} from 'lucide-react'
import DeleteStudentModal from '@/components/admin/DeleteStudentModal'
import AddStudentModal from '@/components/admin/AddStudentModal'
import EditStudentModal from '@/components/admin/EditStudentModal'
import AssignTutorModal from '@/components/admin/AssignTutorModal'

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [courseFilter, setCourseFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [updatingFeatures, setUpdatingFeatures] = useState({})
  const [features, setFeatures] = useState([])

  useEffect(() => {
    fetchStudents()
    fetchFeatures()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, courseFilter, statusFilter])

  const fetchFeatures = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const response = await fetch(`${apiUrl}/admin/students/features`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setFeatures(data.features || [])
      }
    } catch (error) {
      console.error('Failed to fetch features:', error)
    }
  }

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const params = new URLSearchParams()
      if (searchTerm) params.append('query', searchTerm)
      if (courseFilter) params.append('courseType', courseFilter)
      if (statusFilter) params.append('status', statusFilter)

      const queryString = params.toString()
      const response = await fetch(`${apiUrl}/admin/students${queryString ? `?${queryString}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setStudents(data.students || [])
        setError('')
      } else {
        setError(data.error || 'Failed to fetch students')
      }
    } catch (err) {
      setError('Failed to fetch students')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    clearTimeout(window.filterTimeout)
    window.filterTimeout = setTimeout(() => {
      fetchStudents()
    }, 300)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCourseFilter = (e) => {
    setCourseFilter(e.target.value)
  }

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setCourseFilter('')
    setStatusFilter('')
  }

  const handleToggleFeature = async (studentId, featureKey, currentEnabled) => {
    const updatingKey = `${studentId}-${featureKey}`
    setUpdatingFeatures(prev => ({ ...prev, [updatingKey]: true }))

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const response = await fetch(`${apiUrl}/admin/students/${studentId}/features`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          featureKey,
          enabled: !currentEnabled
        })
      })

      if (response.ok) {
        // Update local state optimistically
        setStudents(prev => prev.map(student => {
          if (student.id === studentId) {
            return {
              ...student,
              features: {
                ...student.features,
                [featureKey]: {
                  ...student.features[featureKey],
                  enabled: !currentEnabled
                }
              }
            }
          }
          return student
        }))
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update feature')
      }
    } catch (error) {
      console.error('Failed to toggle feature:', error)
      alert('Failed to update feature')
    } finally {
      setUpdatingFeatures(prev => {
        const newState = { ...prev }
        delete newState[updatingKey]
        return newState
      })
    }
  }

  const handleAddStudent = (data) => {
    setStudents(prev => [data.student, ...prev])
    setShowAddModal(false)

    // No need to show alert anymore - account details file has been downloaded automatically
  }

  const handleEditClick = (student) => {
    setSelectedStudent(student)
    setShowEditModal(true)
  }

  const handleEditStudent = (updatedStudent) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s))
    setShowEditModal(false)
    setSelectedStudent(null)
  }

  const handleDeleteClick = (student) => {
    setSelectedStudent(student)
    setShowDeleteModal(true)
  }

  const handleAssignClick = (student) => {
    setSelectedStudent(student)
    setShowAssignModal(true)
  }

  const handleAssignmentUpdated = () => {
    // Refresh student data to show updated tutor assignments
    fetchStudents()
  }

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const response = await fetch(`${apiUrl}/admin/students/${selectedStudent.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        // Remove from local state
        setStudents(prev => prev.filter(s => s.id !== selectedStudent.id))
        setShowDeleteModal(false)
        setSelectedStudent(null)
      } else {
        alert(data.error || 'Failed to delete student')
      }
    } catch (error) {
      console.error('Failed to delete student:', error)
      alert('Failed to delete student')
    }
  }

  // Filter students locally as well for immediate response
  const filteredStudents = students

  const getFeatureKeys = () => {
    if (features.length > 0) {
      return features
    }
    // Fallback to common features if not loaded yet
    return [
      { key: 'one_to_one', label: 'One-to-One' },
      { key: 'smart_quad', label: 'Smart Quad' },
      { key: 'masterclass', label: 'Masterclass' },
      { key: 'materials', label: 'Materials' },
      { key: 'progress_tracking', label: 'Progress' },
      { key: 'calendar', label: 'Calendar' }
    ]
  }

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Students Management
            </h1>
            <p className="text-gray-600 text-lg mt-1">
              Manage student accounts and feature access
            </p>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Course Filter */}
            <div>
              <select
                value={courseFilter}
                onChange={handleCourseFilter}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Courses</option>
                <option value="PTE">PTE</option>
                <option value="IELTS">IELTS</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Add Student Button */}
            <div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md flex items-center justify-center gap-2 w-full h-10 transition-colors duration-200 shadow-sm border border-indigo-600 hover:shadow-md"
                type="button"
              >
                <Plus className="w-4 h-4" />
                Add Student
              </button>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || courseFilter || statusFilter) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded border border-gray-200 hover:border-gray-300"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Students List */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Students ({filteredStudents.length})
            </h3>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No students found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Student</th>
                    <th className="text-left p-4 font-medium text-gray-900">Contact</th>
                    <th className="text-left p-4 font-medium text-gray-900">Course</th>
                    <th className="text-left p-4 font-medium text-gray-900">Tutors</th>
                    <th className="text-left p-4 font-medium text-gray-900">Features</th>
                    <th className="text-left p-4 font-medium text-gray-900">Status</th>
                    <th className="text-left p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold">
                            {(student.name || student.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.name || 'No name'}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          {student.email && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {student.email}
                            </p>
                          )}
                          {student.phone && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {student.phone}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        {student.courseType ? (
                          <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                            student.courseType === 'PTE' ? 'bg-blue-100 text-blue-800' :
                            student.courseType === 'IELTS' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {student.courseType}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Not set</span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {student.tutors?.length > 0 ? (
                            <>
                              <div className="flex flex-wrap gap-1">
                                {student.tutors.slice(0, 2).map((tutor) => (
                                  <div key={tutor.id} className="flex items-center gap-1 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded">
                                    <div className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs">
                                      {(tutor.name || tutor.email).charAt(0).toUpperCase()}
                                    </div>
                                    {tutor.name || tutor.email.split('@')[0]}
                                  </div>
                                ))}
                                {student.tutors.length > 2 && (
                                  <span className="text-xs text-gray-500">
                                    +{student.tutors.length - 2} more
                                  </span>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleAssignClick(student)}
                                className="text-blue-600 hover:text-blue-700 p-1"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAssignClick(student)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs"
                            >
                              Assign Tutor
                            </Button>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {getFeatureKeys().map((feature) => {
                            const featureData = student.features?.[feature.key]
                            const isEnabled = featureData?.enabled ?? false
                            const isUpdating = updatingFeatures[`${student.id}-${feature.key}`]

                            return (
                              <button
                                key={feature.key}
                                onClick={() => handleToggleFeature(student.id, feature.key, isEnabled)}
                                disabled={isUpdating}
                                className={`px-2 py-1 rounded text-xs font-medium transition-all flex items-center gap-1 ${
                                  isUpdating ? 'opacity-50 cursor-not-allowed' :
                                  isEnabled
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                                title={`Toggle ${feature.label}`}
                              >
                                {isUpdating ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : isEnabled ? (
                                  <CheckCircle className="w-3 h-3" />
                                ) : (
                                  <X className="w-3 h-3" />
                                )}
                                {feature.label}
                              </button>
                            )
                          })}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {student.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(student)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClick(student)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <AddStudentModal
          onClose={() => setShowAddModal(false)}
          onStudentAdded={handleAddStudent}
        />
      )}

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <EditStudentModal
          student={selectedStudent}
          onClose={() => {
            setShowEditModal(false)
            setSelectedStudent(null)
          }}
          onStudentUpdated={handleEditStudent}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedStudent && (
        <DeleteStudentModal
          student={selectedStudent}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedStudent(null)
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Assign Tutors Modal */}
      {showAssignModal && selectedStudent && (
        <AssignTutorModal
          student={selectedStudent}
          onClose={() => {
            setShowAssignModal(false)
            setSelectedStudent(null)
          }}
          onAssignmentUpdated={handleAssignmentUpdated}
        />
      )}
    </div>
  )
}