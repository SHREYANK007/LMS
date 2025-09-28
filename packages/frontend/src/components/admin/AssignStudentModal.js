'use client'

import { useState, useEffect } from 'react'
import { X, UserPlus, Search, Users, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AssignStudentModal({ tutor, onClose, onAssignmentUpdated }) {
  const [availableStudents, setAvailableStudents] = useState([])
  const [assignedStudents, setAssignedStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [tutor.id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      // Get all students and tutor assignments
      const [studentsResponse, assignmentsResponse] = await Promise.all([
        fetch(`${apiUrl}/admin/students`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${apiUrl}/admin/tutors/${tutor.id}/assignments`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ])

      if (studentsResponse.ok && assignmentsResponse.ok) {
        const studentsData = await studentsResponse.json()
        const assignmentsData = await assignmentsResponse.json()

        const assigned = assignmentsData.students || []
        const assignedIds = new Set(assigned.map(s => s.id))

        setAssignedStudents(assigned)
        setAvailableStudents(
          (studentsData.students || [])
            .filter(s => s.isActive && !assignedIds.has(s.id))
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

  const handleAssignStudent = async (studentId) => {
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
          tutorId: tutor.id,
          studentId
        })
      })

      if (response.ok) {
        await fetchData() // Refresh the data
        onAssignmentUpdated()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to assign student')
      }
    } catch (err) {
      setError('Failed to assign student')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUnassignStudent = async (studentId) => {
    try {
      setSubmitting(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const response = await fetch(`${apiUrl}/admin/assignments/${tutor.id}/${studentId}`, {
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

  const filteredAvailableStudents = availableStudents.filter(student =>
    (student.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (student.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold">Manage Student Assignments</h2>
            <p className="text-gray-600 mt-1">
              Tutor: {tutor.name || tutor.email}
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
            {/* Currently Assigned Students */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Assigned Students ({assignedStudents.length})
              </h3>

              {assignedStudents.length === 0 ? (
                <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">
                  No students currently assigned to this tutor
                </p>
              ) : (
                <div className="space-y-2">
                  {assignedStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                          {(student.name || student.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name || 'No name'}</p>
                          <p className="text-sm text-gray-600">{student.email}</p>
                          {student.courseType && (
                            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded mt-1">
                              {student.courseType}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnassignStudent(student.id)}
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

            {/* Available Students to Assign */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Available Students</h3>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {filteredAvailableStudents.length === 0 ? (
                <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">
                  {searchTerm ? 'No students match your search' : 'All active students are already assigned to this tutor'}
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredAvailableStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-medium">
                          {(student.name || student.email).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name || 'No name'}</p>
                          <p className="text-sm text-gray-600">{student.email}</p>
                          {student.courseType && (
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded mt-1">
                              {student.courseType}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssignStudent(student.id)}
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