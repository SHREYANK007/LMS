'use client'

import { useState, useEffect } from 'react'
import { X, UserPlus, Search, GraduationCap, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AssignTutorModal({ student, onClose, onAssignmentUpdated }) {
  const [availableTutors, setAvailableTutors] = useState([])
  const [assignedTutors, setAssignedTutors] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [student.id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      // Get all tutors and student assignments
      const [tutorsResponse, assignmentsResponse] = await Promise.all([
        fetch(`${apiUrl}/admin/tutors`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${apiUrl}/admin/students/${student.id}/assignments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ])

      if (tutorsResponse.ok && assignmentsResponse.ok) {
        const tutorsData = await tutorsResponse.json()
        const assignmentsData = await assignmentsResponse.json()

        const assigned = assignmentsData.tutors || []
        const assignedIds = new Set(assigned.map(t => t.id))

        setAssignedTutors(assigned)
        setAvailableTutors(
          (tutorsData.tutors || [])
            .filter(t => t.isActive && !assignedIds.has(t.id))
        )
        setError('')
      } else {
        setError('Failed to fetch data')
      }
    } catch (err) {
      setError('Failed to fetch data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignTutor = async (tutorId) => {
    try {
      setSubmitting(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const response = await fetch(`${apiUrl}/admin/assignments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tutorId,
          studentId: student.id
        })
      })

      if (response.ok) {
        await fetchData() // Refresh the data
        onAssignmentUpdated()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to assign tutor')
      }
    } catch (err) {
      setError('Failed to assign tutor')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUnassignTutor = async (tutorId) => {
    try {
      setSubmitting(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const response = await fetch(`${apiUrl}/admin/assignments/${tutorId}/${student.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        await fetchData() // Refresh the data
        onAssignmentUpdated()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to remove assignment')
      }
    } catch (err) {
      setError('Failed to remove assignment')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const filteredAvailableTutors = availableTutors.filter(tutor =>
    (tutor.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (tutor.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Manage Tutor Assignments</h2>
            <p className="text-gray-600 mt-1">
              Student: {student.name || student.email}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Currently Assigned Tutors */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Assigned Tutors ({assignedTutors.length})
              </h3>

              {assignedTutors.length === 0 ? (
                <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">
                  No tutors currently assigned to this student
                </p>
              ) : (
                <div className="space-y-2">
                  {assignedTutors.map((tutor) => (
                    <div key={tutor.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                          {(tutor.name || tutor.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tutor.name || 'No name'}</p>
                          <p className="text-sm text-gray-600">{tutor.email}</p>
                          {tutor.courseType && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded mt-1">
                              {tutor.courseType} Specialist
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnassignTutor(tutor.id)}
                        disabled={submitting}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Available Tutors to Assign */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Available Tutors</h3>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tutors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {filteredAvailableTutors.length === 0 ? (
                <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">
                  {searchTerm ? 'No tutors match your search' : 'All active tutors are already assigned to this student'}
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredAvailableTutors.map((tutor) => (
                    <div key={tutor.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                          {(tutor.name || tutor.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{tutor.name || 'No name'}</p>
                          <p className="text-sm text-gray-600">{tutor.email}</p>
                          {tutor.courseType && (
                            <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded mt-1">
                              {tutor.courseType} Specialist
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignTutor(tutor.id)}
                        disabled={submitting}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Assign
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end mt-6 pt-4 border-t">
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  )
}