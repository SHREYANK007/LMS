'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import {
  Calendar,
  Clock,
  User,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  BookOpen
} from 'lucide-react'

export default function TutorSessionsPage() {
  const [requests, setRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setIsLoading(true)
    try {
      const response = await api.getTutorSessionRequests()
      if (response.success) {
        setRequests(response.requests || [])
      }
    } catch (error) {
      console.error('Error fetching session requests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'ASSIGNED':
        return 'bg-blue-100 text-blue-800'
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800'
      case 'COMPLETED':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4" />
      case 'ASSIGNED':
        return <User className="h-4 w-4" />
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />
      case 'CANCELLED':
        return <AlertCircle className="h-4 w-4" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const filteredRequests = requests.filter(req => {
    if (filter === 'ALL') return true
    return req.status === filter
  })

  const upcomingRequests = requests.filter(req => {
    if (req.scheduledDateTime) {
      return new Date(req.scheduledDateTime) >= new Date() && req.status === 'ASSIGNED'
    }
    return false
  })

  const todayRequests = upcomingRequests.filter(req => {
    const today = new Date()
    const sessionDate = new Date(req.scheduledDateTime)
    return sessionDate.toDateString() === today.toDateString()
  })

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              One-to-One Sessions
            </h1>
            <p className="text-slate-500 text-lg mt-1">Manage your assigned tutoring sessions</p>
          </div>
        </div>

        <button
          onClick={fetchRequests}
          className="p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-blue-900">Today's Sessions</h3>
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-700">{todayRequests.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-green-900">Upcoming</h3>
            <Clock className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-700">{upcomingRequests.length}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-purple-900">Total Assigned</h3>
            <User className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-700">{requests.length}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-6 p-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <div className="flex gap-2">
            {['ALL', 'ASSIGNED', 'APPROVED', 'COMPLETED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 text-center py-20">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Session Requests</h3>
          <p className="text-slate-600">No one-to-one sessions have been assigned to you yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredRequests.map((request) => {
            const isScheduled = request.scheduledDateTime;
            const scheduledDate = isScheduled ? new Date(request.scheduledDateTime) : null;
            const preferredDate = new Date(request.preferredDate);

            return (
            <div key={request.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:border-blue-200">
              <div className="flex flex-col lg:flex-row justify-between">
                <div className="flex-1 mb-4 lg:mb-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{request.subject}</h3>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                          One-to-One Session
                        </span>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {request.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{request.description}</p>
                  )}

                  {/* Session Details */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2 text-lg">📅</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {isScheduled
                            ? scheduledDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                            : preferredDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                          }
                        </p>
                        <p className="text-xs text-gray-500">
                          {isScheduled ? 'Scheduled' : 'Preferred'} Date
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2 text-lg">⏰</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {isScheduled
                            ? scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
                            : request.preferredTime
                          }
                        </p>
                        <p className="text-xs text-gray-500">{request.duration} mins duration</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2 text-lg">👨‍🎓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{request.student?.name || request.student?.email}</p>
                        <p className="text-xs text-gray-500">Student</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-2 text-lg">🎯</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">1-on-1</p>
                        <p className="text-xs text-gray-500">Session Type</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  {request.adminNotes && (
                    <div className="mb-4">
                      <div className="bg-blue-50 p-3 rounded-md">
                        <p className="text-xs font-medium text-blue-800 mb-1">Admin Notes:</p>
                        <p className="text-blue-700 text-xs">{request.adminNotes}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 lg:ml-6 lg:min-w-[200px]">
                  {request.meetLink && (
                    <a
                      href={request.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-green-500 text-white text-center font-medium rounded-lg hover:bg-green-600 transition-colors"
                    >
                      📹 Join Google Meet
                    </a>
                  )}

                  {request.calendarEventLink && (
                    <a
                      href={request.calendarEventLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 text-center text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      📅 View in Calendar
                    </a>
                  )}

                  <div className="text-center text-xs text-gray-500">
                    {request.status === 'ASSIGNED' && request.meetLink && (
                      <span className="text-green-600 font-medium">✅ Ready to start!</span>
                    )}
                    {request.status === 'APPROVED' && (
                      <span className="text-blue-600 font-medium">🎓 Session approved</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  )
}