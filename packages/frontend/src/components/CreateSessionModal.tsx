'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, Users, Video, GraduationCap } from 'lucide-react'
import api from '@/lib/api'

interface CreateSessionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (sessionData: SessionFormData) => void
  isLoading?: boolean
}

export interface SessionFormData {
  title: string
  description: string
  startTime: string
  endTime: string
  sessionType: 'ONE_TO_ONE' | 'SMART_QUAD' | 'MASTERCLASS'
  courseType: 'PTE' | 'IELTS'
  maxParticipants?: number
}

export default function CreateSessionModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}: CreateSessionModalProps) {
  // Helper function to get current time + 1 hour in datetime-local format
  const getDefaultStartTime = () => {
    const now = new Date()
    now.setMinutes(0, 0, 0) // Round to nearest hour
    now.setHours(now.getHours() + 1) // Add 1 hour
    return now.toISOString().slice(0, 16)
  }

  const getDefaultEndTime = (startTime: string) => {
    if (!startTime) return ''
    const start = new Date(startTime)
    start.setHours(start.getHours() + 1) // Add 1 hour
    return start.toISOString().slice(0, 16)
  }

  // Initialize form data with defaults
  const defaultStartTime = getDefaultStartTime()
  const [formData, setFormData] = useState<SessionFormData>({
    title: '',
    description: '',
    startTime: defaultStartTime,
    endTime: getDefaultEndTime(defaultStartTime),
    sessionType: 'ONE_TO_ONE',
    courseType: 'PTE'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isCalendarConnected, setIsCalendarConnected] = useState(false)
  const [isCheckingCalendar, setIsCheckingCalendar] = useState(true)

  // Check Google Calendar connection status
  useEffect(() => {
    if (isOpen) {
      checkCalendarConnection()
    }
  }, [isOpen])

  const checkCalendarConnection = async () => {
    setIsCheckingCalendar(true)
    try {
      console.log('Checking calendar connection, api:', api)

      // Fallback to direct fetch if api is not available
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      if (!token) {
        console.error('No authentication token found')
        return
      }

      const response = await fetch(`${apiUrl}/auth/google/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Calendar API response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Calendar connection data:', data)
        setIsCalendarConnected(data.connected || false)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Calendar API error:', errorData)
      }
    } catch (error) {
      console.error('Failed to check calendar connection:', error)
    } finally {
      setIsCheckingCalendar(false)
    }
  }

  const handleConnectCalendar = async () => {
    try {
      console.log('Initiating calendar connection')

      // Use direct fetch as fallback
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${apiUrl}/auth/google/connect`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      console.log('Calendar connect API response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Calendar connect response data:', data)

        if (data.success && data.authUrl) {
          // Open the authorization URL in a new window
          window.open(data.authUrl, '_blank', 'width=500,height=600')
          alert('Please complete the Google Calendar authorization in the popup window and then try creating the session again.')
        } else {
          throw new Error('No authorization URL received')
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Calendar connect API error:', errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('Failed to initiate calendar connection:', error)
      alert(`Failed to connect Google Calendar: ${error.message}`)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Session title is required'
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required'
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required'
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime)
      const end = new Date(formData.endTime)

      if (start >= end) {
        newErrors.endTime = 'End time must be after start time'
      }

      if (start < new Date()) {
        newErrors.startTime = 'Start time cannot be in the past'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof SessionFormData, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }

      // Auto-update end time when start time changes
      if (field === 'startTime' && value) {
        const endTime = getDefaultEndTime(value)
        newData.endTime = endTime
      }

      return newData
    })

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'ONE_TO_ONE':
        return <Users className="h-4 w-4" />
      case 'SMART_QUAD':
        return <Video className="h-4 w-4" />
      case 'MASTERCLASS':
        return <GraduationCap className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getMaxParticipants = (type: string) => {
    switch (type) {
      case 'ONE_TO_ONE':
        return 1
      case 'SMART_QUAD':
        return 4
      case 'MASTERCLASS':
        return 15
      default:
        return 1
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Create New Session
          </DialogTitle>
          <DialogClose onClose={onClose} />
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-6">
          {/* Session Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Session Title *
            </label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., PTE Speaking Practice Session"
              className={errors.title ? 'border-red-300 focus:ring-red-500' : ''}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Session Type & Course Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Type *
              </label>
              <Select
                value={formData.sessionType}
                onValueChange={(value) => handleInputChange('sessionType', value as SessionFormData['sessionType'])}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    {getSessionTypeIcon(formData.sessionType)}
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONE_TO_ONE">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      One-to-One (1 student)
                    </div>
                  </SelectItem>
                  <SelectItem value="SMART_QUAD">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Smart Quad (4 students)
                    </div>
                  </SelectItem>
                  <SelectItem value="MASTERCLASS">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Masterclass (up to 15 students)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Type *
              </label>
              <Select
                value={formData.courseType}
                onValueChange={(value) => handleInputChange('courseType', value as SessionFormData['courseType'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PTE">PTE</SelectItem>
                  <SelectItem value="IELTS">IELTS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <Input
                id="startTime"
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className={errors.startTime ? 'border-red-300 focus:ring-red-500' : ''}
                min={new Date().toISOString().slice(0, 16)}
              />
              {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <Input
                id="endTime"
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className={errors.endTime ? 'border-red-300 focus:ring-red-500' : ''}
                min={formData.startTime || new Date().toISOString().slice(0, 16)}
              />
              {errors.endTime && <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>}
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Max Participants:</span>
              <span className="font-medium text-gray-900">
                {getMaxParticipants(formData.sessionType)} students
              </span>
            </div>

            {isCheckingCalendar ? (
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Calendar Connection:</span>
                <span className="text-gray-500">Checking...</span>
              </div>
            ) : isCalendarConnected ? (
              <>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Google Meet Link:</span>
                  <span className="text-green-600">✓ Will be generated automatically</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Calendar Event:</span>
                  <span className="text-green-600">✓ Will be added to Google Calendar</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Google Calendar:</span>
                  <span className="text-orange-600">Not connected</span>
                </div>
                <div className="mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleConnectCalendar}
                    className="w-full text-sm"
                  >
                    Connect Google Calendar for Meet Links
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Sessions can be created without Google Calendar, but won't have Meet links.
                </p>
              </>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Add session details, learning objectives, or special instructions..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Session
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}