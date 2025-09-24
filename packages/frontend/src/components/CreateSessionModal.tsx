'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, Users, Video, GraduationCap } from 'lucide-react'

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
  courseType: 'PTE' | 'IELTS' | 'TOEFL' | 'GENERAL_ENGLISH' | 'BUSINESS_ENGLISH' | 'ACADEMIC_WRITING'
  maxParticipants?: number
}

export default function CreateSessionModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}: CreateSessionModalProps) {
  const [formData, setFormData] = useState<SessionFormData>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    sessionType: 'ONE_TO_ONE',
    courseType: 'PTE'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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
    setFormData(prev => ({ ...prev, [field]: value }))
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
                  <SelectItem value="TOEFL">TOEFL</SelectItem>
                  <SelectItem value="GENERAL_ENGLISH">General English</SelectItem>
                  <SelectItem value="BUSINESS_ENGLISH">Business English</SelectItem>
                  <SelectItem value="ACADEMIC_WRITING">Academic Writing</SelectItem>
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
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Google Meet Link:</span>
              <span className="text-green-600">✓ Will be generated automatically</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-2">
              <span className="text-gray-600">Calendar Event:</span>
              <span className="text-green-600">✓ Will be added to Google Calendar</span>
            </div>
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