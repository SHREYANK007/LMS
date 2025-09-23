'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  Save,
  Users,
  Zap,
  Star,
  BookOpen,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  ChevronRight
} from 'lucide-react'
import { mockAvailability } from '@/data/mock/mockSessions'

export default function TutorAvailabilityPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [editingSlot, setEditingSlot] = useState<string | null>(null)

  // Mock current tutor ID
  const currentTutorId = 'tutor1'
  const currentTutorName = 'Dr. Sarah Wilson'

  // Get availability for current tutor
  const tutorAvailability = mockAvailability.filter(slot => slot.tutorId === currentTutorId)

  const daysOfWeek = [
    { id: 0, name: 'Sunday', short: 'Sun' },
    { id: 1, name: 'Monday', short: 'Mon' },
    { id: 2, name: 'Tuesday', short: 'Tue' },
    { id: 3, name: 'Wednesday', short: 'Wed' },
    { id: 4, name: 'Thursday', short: 'Thu' },
    { id: 5, name: 'Friday', short: 'Fri' },
    { id: 6, name: 'Saturday', short: 'Sat' }
  ]

  const sessionTypes = [
    { id: 'smart-quad', name: 'Smart Quad', icon: Zap, color: 'blue', maxStudents: 4, basePrice: 80 },
    { id: 'one-to-one', name: 'One-to-One', icon: Users, color: 'green', maxStudents: 1, basePrice: 150 },
    { id: 'masterclass', name: 'Masterclass', icon: Star, color: 'purple', maxStudents: 15, basePrice: 120 }
  ]

  const getAvailabilityForDay = (dayId: number) => {
    return tutorAvailability.filter(slot => slot.dayOfWeek === dayId)
  }

  const getSessionTypeInfo = (type: string) => {
    return sessionTypes.find(t => t.id === type) || sessionTypes[0]
  }

  // Statistics
  const stats = {
    totalSlots: tutorAvailability.length,
    activeSlots: tutorAvailability.filter(s => s.isActive).length,
    smartQuadSlots: tutorAvailability.filter(s => s.sessionType === 'smart-quad').length,
    oneToOneSlots: tutorAvailability.filter(s => s.sessionType === 'one-to-one').length,
    masterclassSlots: tutorAvailability.filter(s => s.sessionType === 'masterclass').length,
    weeklyHours: tutorAvailability.reduce((total, slot) => {
      const start = new Date(`2000-01-01 ${slot.startTime}`)
      const end = new Date(`2000-01-01 ${slot.endTime}`)
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    }, 0)
  }

  return (
    <div className="h-screen overflow-y-auto scrollbar-premium">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability Management</h1>
            <p className="text-gray-600">Set your teaching schedule and availability slots</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Time Slot
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">{stats.totalSlots}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Total Slots</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-lg font-bold text-gray-900">{stats.activeSlots}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Active Slots</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">{stats.smartQuadSlots}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Smart Quad</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="text-lg font-bold text-gray-900">{stats.oneToOneSlots}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">One-to-One</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-5 h-5 text-purple-600" />
              <span className="text-lg font-bold text-gray-900">{stats.masterclassSlots}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Masterclass</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              <span className="text-lg font-bold text-gray-900">{Math.round(stats.weeklyHours)}</span>
            </div>
            <p className="text-xs font-medium text-gray-600">Weekly Hours</p>
          </div>
        </div>

        {/* Session Type Legend */}
        <div className="card-premium mb-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sessionTypes.map((type) => (
                <div key={type.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 bg-${type.color}-100 rounded-xl flex items-center justify-center`}>
                    <type.icon className={`w-5 h-5 text-${type.color}-600`} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{type.name}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>Max {type.maxStudents} student{type.maxStudents > 1 ? 's' : ''}</span>
                      <span>${type.basePrice}/session</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Schedule */}
        <div className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Weekly Schedule
            </CardTitle>
            <CardDescription>Manage your availability for each day of the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {daysOfWeek.map((day) => {
                const daySlots = getAvailabilityForDay(day.id)
                const isExpanded = selectedDay === day.id

                return (
                  <div key={day.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                    {/* Day Header */}
                    <button
                      onClick={() => setSelectedDay(isExpanded ? null : day.id)}
                      className="w-full p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{day.name}</h3>
                          <p className="text-sm text-gray-500">
                            {daySlots.length} slot{daySlots.length !== 1 ? 's' : ''} •{' '}
                            {daySlots.filter(s => s.isActive).length} active
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {isExpanded ? 'Collapse' : 'Expand'}
                        </span>
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </button>

                    {/* Day Slots */}
                    {isExpanded && (
                      <div className="p-4 space-y-3 border-t border-gray-200">
                        {daySlots.length === 0 ? (
                          <div className="text-center py-8">
                            <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 mb-4">No availability slots for {day.name}</p>
                            <Button size="sm" className="gap-2">
                              <Plus className="w-4 h-4" />
                              Add Slot
                            </Button>
                          </div>
                        ) : (
                          daySlots.map((slot) => {
                            const typeInfo = getSessionTypeInfo(slot.sessionType)

                            return (
                              <div key={slot.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
                                <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 bg-${typeInfo.color}-100 rounded-xl flex items-center justify-center`}>
                                    <typeInfo.icon className={`w-5 h-5 text-${typeInfo.color}-600`} />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-3 mb-1">
                                      <span className="font-medium text-gray-900">
                                        {slot.startTime} - {slot.endTime}
                                      </span>
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                        typeInfo.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                        typeInfo.color === 'green' ? 'bg-green-100 text-green-700' :
                                        'bg-purple-100 text-purple-700'
                                      }`}>
                                        {typeInfo.name}
                                      </span>
                                      <span className={`text-xs px-2 py-1 rounded-full ${
                                        slot.courseType === 'PTE' ? 'bg-blue-100 text-blue-700' :
                                        slot.courseType === 'NAATI' ? 'bg-purple-100 text-purple-700' :
                                        'bg-indigo-100 text-indigo-700'
                                      }`}>
                                        {slot.courseType}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                      <span>Max {slot.maxStudents} students</span>
                                      <span>${slot.price}/session</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {/* Toggle active status */}}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                  >
                                    {slot.isActive ? (
                                      <ToggleRight className="w-5 h-5 text-green-600" />
                                    ) : (
                                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                                    )}
                                  </button>
                                  <Button variant="outline" size="sm" className="gap-2">
                                    <Edit className="w-4 h-4" />
                                    Edit
                                  </Button>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </div>

        {/* Quick Actions */}
        <div className="card-premium mt-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Plus className="w-5 h-5" />
                <span className="text-sm">Bulk Add Slots</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Copy Week</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Mark Holiday</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}