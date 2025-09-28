'use client'

import { useState } from 'react'
import { X, User, Mail, Phone, Calendar, UserCheck, Key, Loader2, GraduationCap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const COURSE_TYPES = [
  { value: 'PTE', label: 'PTE Academic' },
  { value: 'IELTS', label: 'IELTS' }
]

export default function AddTutorModal({ onClose, onTutorAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    courseType: '',
    phone: '',
    dateOfBirth: '',
    emergencyContact: '',
    generatePassword: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const downloadAccountDetails = async (userId, password) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const response = await fetch(`${apiUrl}/admin/users/${userId}/account-details`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') ||
                     `account_details_${Date.now()}.txt`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error('Failed to download account details file')
      }
    } catch (err) {
      console.error('Error downloading account details file:', err)
    }
  }

  const validateStep = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        if (!formData.name.trim()) return 'Name is required'
        if (!formData.email.trim()) return 'Email is required'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format'
        if (!formData.generatePassword && !formData.password.trim()) return 'Password is required'
        return null
      case 2:
        if (!formData.courseType) return 'Course specialization is required'
        return null
      default:
        return null
    }
  }

  const handleNext = () => {
    const error = validateStep(step)
    if (error) {
      setError(error)
      return
    }
    setStep(step + 1)
    setError('')
  }

  const handleBack = () => {
    setStep(step - 1)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate all steps
    for (let i = 1; i <= 2; i++) {
      const stepError = validateStep(i)
      if (stepError) {
        setError(stepError)
        setStep(i)
        return
      }
    }

    setError('')
    setLoading(true)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        courseType: formData.courseType,
        phone: formData.phone.trim() || null,
        dateOfBirth: formData.dateOfBirth || null,
        emergencyContact: formData.emergencyContact.trim() || null
      }

      // Only include password if not generating
      if (!formData.generatePassword && formData.password.trim()) {
        payload.password = formData.password.trim()
      }

      const response = await fetch(`${apiUrl}/admin/tutors`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        const password = data.credentials?.password || formData.password
        const userId = data.tutor?.id

        // Automatically download account details file if we have the password
        if (password && userId) {
          await downloadAccountDetails(userId, password)
        }

        onTutorAdded(data)
      } else {
        setError(data.error || 'Failed to create tutor')
      }
    } catch (err) {
      setError('Failed to create tutor')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <User className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        <p className="text-sm text-gray-500">Enter the tutor's basic details</p>
      </div>

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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="tutor@example.com"
        />
      </div>

      <div className="bg-gray-50 p-3 rounded-md">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.generatePassword}
            onChange={(e) => handleInputChange('generatePassword', e.target.checked)}
            className="mr-2"
          />
          <Key className="w-4 h-4 mr-1" />
          <span className="text-sm text-gray-700">Generate random password</span>
        </label>
      </div>

      {!formData.generatePassword && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Key className="w-4 h-4 inline mr-1" />
            Password *
          </label>
          <input
            type="password"
            required={!formData.generatePassword}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter password"
            minLength="6"
          />
        </div>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <GraduationCap className="w-6 h-6 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Teaching & Contact Details</h3>
        <p className="text-sm text-gray-500">Additional information for the tutor</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <GraduationCap className="w-4 h-4 inline mr-1" />
          Course Specialization *
        </label>
        <select
          value={formData.courseType}
          onChange={(e) => handleInputChange('courseType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        >
          <option value="">Select specialization</option>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Emergency contact name and phone"
        />
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Add New Tutor</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${step > 1 ? 'bg-indigo-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-600">Basic Info</span>
            <span className="text-xs text-gray-600">Teaching Details</span>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-800 rounded border border-red-200 flex items-center">
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
              onClick={step === 1 ? onClose : handleBack}
              disabled={loading}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>

            {step < 2 ? (
              <Button
                type="button"
                onClick={handleNext}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={loading}
                className="bg-green-500 hover:bg-green-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Tutor'
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}