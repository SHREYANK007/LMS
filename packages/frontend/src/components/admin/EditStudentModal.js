'use client'

import { useState } from 'react'
import { X, User, Mail, Phone, Calendar, UserCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const COURSE_TYPES = [
  { value: 'PTE', label: 'PTE Academic' },
  { value: 'IELTS', label: 'IELTS' }
]

export default function EditStudentModal({ student, onClose, onStudentUpdated }) {
  const [formData, setFormData] = useState({
    name: student.name || '',
    email: student.email || '',
    courseType: student.courseType || '',
    phone: student.phone || '',
    dateOfBirth: student.dateOfBirth || '',
    emergencyContact: student.emergencyContact || '',
    isActive: student.isActive !== undefined ? student.isActive : true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }

    if (!formData.email.trim()) {
      setError('Email is required')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Invalid email format')
      return
    }

    setError('')
    setLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      console.log('Sending PATCH request to:', `${apiUrl}/admin/students/${student.id}`);
      console.log('Request data:', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        courseType: formData.courseType,
        phone: formData.phone.trim() || null,
        dateOfBirth: formData.dateOfBirth || null,
        emergencyContact: formData.emergencyContact.trim() || null,
        isActive: formData.isActive
      });

      const response = await fetch(`${apiUrl}/admin/students/${student.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          courseType: formData.courseType,
          phone: formData.phone.trim() || null,
          dateOfBirth: formData.dateOfBirth || null,
          emergencyContact: formData.emergencyContact.trim() || null,
          isActive: formData.isActive
        })
      })

      console.log('Response status:', response.status);
      const data = await response.json()
      console.log('Response data:', data);

      if (response.ok) {
        console.log('Update successful, calling onStudentUpdated with:', data.student);
        onStudentUpdated(data.student)
        onClose() // Close the modal after successful update
      } else {
        console.error('Update failed:', data.error);
        setError(data.error || 'Failed to update student')
      }
    } catch (err) {
      setError('Failed to update student')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Student</h2>
            <p className="text-sm text-gray-500 mt-1">Update student information</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="student@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Type
              </label>
              <select
                value={formData.courseType}
                onChange={(e) => handleInputChange('courseType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select course type</option>
                {COURSE_TYPES.map(course => (
                  <option key={course.value} value={course.value}>
                    {course.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact
              </label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Emergency contact name and phone"
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="mr-2"
                />
                <UserCheck className="w-4 h-4 mr-1" />
                <span className="text-sm text-gray-700">Active Student</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Inactive students cannot access the system
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-800 rounded border border-red-200 flex items-center">
                <div className="w-4 h-4 text-red-600 mr-2">⚠</div>
                {error}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between p-6 border-t bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Student'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}