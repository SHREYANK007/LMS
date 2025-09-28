'use client'

import { useState, useEffect } from 'react'
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
  Play,
  Loader2,
  AlertTriangle
} from 'lucide-react'
import AddTutorModal from '@/components/admin/AddTutorModal'
import EditTutorModal from '@/components/admin/EditTutorModal'
import DeleteTutorModal from '@/components/admin/DeleteTutorModal'
import AssignStudentModal from '@/components/admin/AssignStudentModal'

export default function TutorsPage() {
  const [tutors, setTutors] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedTutor, setSelectedTutor] = useState(null)

  useEffect(() => {
    fetchTutors()
  }, [])

  const fetchTutors = async (query = '') => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const queryString = query ? `?query=${encodeURIComponent(query)}` : ''
      const response = await fetch(`${apiUrl}/admin/tutors${queryString}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setTutors(data.tutors || [])
        setError('')
      } else {
        setError(data.error || 'Failed to fetch tutors')
      }
    } catch (err) {
      setError('Failed to fetch tutors')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    // Debounce search
    clearTimeout(window.searchTimeout)
    window.searchTimeout = setTimeout(() => {
      fetchTutors(value)
    }, 300)
  }

  const handleAddTutor = (data) => {
    setTutors(prev => [data.tutor, ...prev])
    setShowAddModal(false)

    // No need to show alert anymore - account details file has been downloaded automatically
  }

  const handleEditClick = (tutor) => {
    setSelectedTutor(tutor)
    setShowEditModal(true)
  }

  const handleEditTutor = (updatedTutor) => {
    setTutors(prev => prev.map(t => t.id === updatedTutor.id ? { ...updatedTutor, stats: t.stats } : t))
    setShowEditModal(false)
    setSelectedTutor(null)
  }

  const handleDeleteClick = (tutor) => {
    setSelectedTutor(tutor)
    setShowDeleteModal(true)
  }

  const handleAssignClick = (tutor) => {
    setSelectedTutor(tutor)
    setShowAssignModal(true)
  }

  const handleAssignmentUpdated = () => {
    // Refresh tutor data to show updated student counts
    fetchTutors()
  }

  const handleDeleteConfirm = async () => {
    if (!selectedTutor) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const response = await fetch(`${apiUrl}/admin/tutors/${selectedTutor.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        // Remove from local state
        setTutors(prev => prev.filter(t => t.id !== selectedTutor.id))
        setShowDeleteModal(false)
        setSelectedTutor(null)
      } else {
        alert(data.error || 'Failed to delete tutor')
      }
    } catch (error) {
      console.error('Failed to delete tutor:', error)
      alert('Failed to delete tutor')
    }
  }

  const handleToggleStatus = async (tutorId) => {
    const tutor = tutors.find(t => t.id === tutorId)
    if (!tutor) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const response = await fetch(`${apiUrl}/admin/tutors/${tutorId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isActive: !tutor.isActive
        })
      })

      if (response.ok) {
        const data = await response.json()
        setTutors(prev => prev.map(t =>
          t.id === tutorId ? { ...data.tutor, stats: t.stats } : t
        ))
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to update tutor status')
      }
    } catch (error) {
      console.error('Failed to toggle tutor status:', error)
      alert('Failed to update tutor status')
    }
  }

  // Filter tutors
  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = (tutor.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (tutor.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === 'all' || tutor.courseType === selectedCourse
    const matchesStatus = selectedStatus === 'all' ||
                         (selectedStatus === 'active' && tutor.isActive) ||
                         (selectedStatus === 'inactive' && !tutor.isActive)

    return matchesSearch && matchesCourse && matchesStatus
  })

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-5 mb-8">
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

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tutors..."
                value={searchTerm}
                onChange={handleSearch}
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
              <option value="IELTS">IELTS Specialists</option>
              <option value="TOEFL">TOEFL Specialists</option>
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
            </select>

            {/* Add Tutor Button */}
            <div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md flex items-center justify-center gap-2 w-full h-10 transition-colors duration-200 shadow-sm border border-indigo-600 hover:shadow-md"
                type="button"
              >
                <Plus className="w-4 h-4" />
                Add Tutor
              </button>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setSelectedCourse('all')
                setSelectedStatus('all')
              }}
              className="w-full h-10"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          /* Tutors Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map((tutor) => {
              const stats = tutor.stats || {
                totalStudents: 0,
                sessionsThisWeek: 0,
                averageRating: '0.0',
                totalSessions: 0
              }

              return (
                <div key={tutor.id} className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                  <div className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          {(tutor.name || tutor.email || 'T').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{tutor.name || 'No name'}</h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tutor.courseType === 'PTE' ? 'bg-purple-100 text-purple-800' :
                            tutor.courseType === 'IELTS' ? 'bg-orange-100 text-orange-800' :
                            tutor.courseType === 'TOEFL' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {tutor.courseType ? `${tutor.courseType} Specialist` : 'General Tutor'}
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(tutor)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAssignClick(tutor)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Users className="w-4 h-4" />
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteClick(tutor)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Status */}
                    <div className="text-center pt-2 border-t">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${tutor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {tutor.isActive ? 'Active' : 'Inactive'}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Last login: {tutor.lastLogin ? new Date(tutor.lastLogin).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredTutors.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-xl border-0 hover:shadow-2xl transition-all duration-300 text-center">
            <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tutors found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || selectedCourse !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your search filters'
                : 'Get started by adding your first tutor'
              }
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Tutor
            </Button>
          </div>
        )}
      </div>

      {/* Add Tutor Modal */}
      {showAddModal && (
        <AddTutorModal
          onClose={() => setShowAddModal(false)}
          onTutorAdded={handleAddTutor}
        />
      )}

      {/* Edit Tutor Modal */}
      {showEditModal && selectedTutor && (
        <EditTutorModal
          tutor={selectedTutor}
          onClose={() => {
            setShowEditModal(false)
            setSelectedTutor(null)
          }}
          onTutorUpdated={handleEditTutor}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTutor && (
        <DeleteTutorModal
          tutor={selectedTutor}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedTutor(null)
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Assign Students Modal */}
      {showAssignModal && selectedTutor && (
        <AssignStudentModal
          tutor={selectedTutor}
          onClose={() => {
            setShowAssignModal(false)
            setSelectedTutor(null)
          }}
          onAssignmentUpdated={handleAssignmentUpdated}
        />
      )}
    </div>
  )
}