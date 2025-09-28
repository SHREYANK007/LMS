'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import CancelSessionModal from '@/components/admin/CancelSessionModal'
import {
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  UserCheck,
  MessageSquare,
  Filter,
  Video,
  ExternalLink
} from 'lucide-react'

export default function SessionRequestsPage() {
  const [requests, setRequests] = useState([])
  const [tutors, setTutors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [assignData, setAssignData] = useState({
    tutorId: '',
    adminNotes: '',
    scheduledDateTime: ''
  })
  const [filter, setFilter] = useState('ALL')
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [sessionToCancel, setSessionToCancel] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [requestsResponse, tutorsResponse] = await Promise.all([
        api.getSessionRequests(),
        api.getAllUsers('TUTOR')
      ])

      if (requestsResponse.success) {
        setRequests(requestsResponse.requests || [])
      }
      if (tutorsResponse.success) {
        setTutors(tutorsResponse.users || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignTutor = async () => {
    if (!selectedRequest || !assignData.tutorId) return

    try {
      const response = await api.assignTutorToRequest(
        selectedRequest.id,
        assignData.tutorId,
        assignData.adminNotes,
        assignData.scheduledDateTime
      )
      if (response.success) {
        if (response.calendarEvent?.meetLink) {
          alert(`Calendar event created successfully!\nGoogle Meet link: ${response.calendarEvent.meetLink}`)
        }
        fetchData()
        closeAssignModal()
      }
    } catch (error) {
      console.error('Error assigning tutor:', error)
    }
  }

  const handleUpdateStatus = async (requestId, status, rejectionReason = '') => {
    try {
      const response = await api.updateRequestStatus(requestId, status, rejectionReason)
      if (response.success) {
        fetchData()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleCancelSession = async (requestId, reason) => {
    try {
      const response = await api.adminCancelSessionRequest(requestId, reason)
      if (response.success) {
        alert('Session cancelled successfully. Calendar events have been updated.')
        fetchData()
      }
    } catch (error) {
      console.error('Error cancelling session:', error)
      alert('Failed to cancel session. Please try again.')
    }
  }

  const openCancelModal = (request) => {
    setSessionToCancel(request)
    setIsCancelModalOpen(true)
  }

  const closeCancelModal = () => {
    setSessionToCancel(null)
    setIsCancelModalOpen(false)
  }

  const openAssignModal = (request) => {
    setSelectedRequest(request)
    // Default to preferred date and time
    const defaultDateTime = request.preferredDate && request.preferredTime
      ? `${request.preferredDate}T${request.preferredTime}`
      : ''
    setAssignData({
      tutorId: request.tutorId || '',
      adminNotes: request.adminNotes || '',
      scheduledDateTime: defaultDateTime
    })
    setIsAssignModalOpen(true)
  }

  const closeAssignModal = () => {
    setSelectedRequest(null)
    setAssignData({ tutorId: '', adminNotes: '', scheduledDateTime: '' })
    setIsAssignModalOpen(false)
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
        return 'bg-red-100 text-red-800 line-through'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredRequests = requests.filter(req => {
    if (filter === 'ALL') return true
    return req.status === filter
  })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Session Requests
            </h1>
            <p className="text-slate-500 text-lg mt-1">Manage student session requests</p>
          </div>
        </div>

        <button
          onClick={fetchData}
          className="p-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 mb-6 p-4">
        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-slate-400" />
          <div className="flex gap-2">
            {['ALL', 'PENDING', 'ASSIGNED', 'APPROVED', 'REJECTED', 'CANCELLED'].map((status) => (
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
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Session Requests</h3>
          <p className="text-slate-600">No session requests match the selected filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">{request.subject}</h3>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(request.status)}`}>
                      {request.status}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-sm mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">Student:</span>
                    {request.student?.name || request.student?.email}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {new Date(request.preferredDate).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4 text-slate-400" />
                    {request.preferredTime} ({request.duration} mins)
                  </div>

                  {request.tutor && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <UserCheck className="h-4 w-4 text-slate-400" />
                      <span className="font-medium">Tutor:</span>
                      {request.tutor.name || request.tutor.email}
                    </div>
                  )}

                  {request.description && (
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-slate-600 text-xs">{request.description}</p>
                    </div>
                  )}

                  {request.meetLink && (
                    <div className="pt-2 border-t border-slate-100">
                      <a
                        href={request.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        <Video className="h-4 w-4" />
                        Join Google Meet
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {request.status === 'CANCELLED' && (
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-xs text-red-600 font-medium">
                        ❌ Session Cancelled
                      </p>
                      {request.adminNotes && request.adminNotes.includes('Cancelled by admin') && (
                        <p className="text-xs text-gray-600 mt-1">{request.adminNotes}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {request.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => openAssignModal(request)}
                        className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Assign Tutor
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt('Rejection reason:')
                          if (reason) handleUpdateStatus(request.id, 'REJECTED', reason)
                        }}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 text-sm rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {request.status === 'ASSIGNED' && (
                    <>
                      <button
                        onClick={() => openAssignModal(request)}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Reassign
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(request.id, 'APPROVED')}
                        className="px-3 py-2 text-green-600 hover:bg-green-50 border border-green-200 text-sm rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openCancelModal(request)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 text-sm rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {request.status === 'APPROVED' && (
                    <button
                      onClick={() => openCancelModal(request)}
                      className="w-full px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 text-sm rounded-lg transition-colors"
                    >
                      Cancel Session
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Tutor Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full m-4">
            <h2 className="text-xl font-semibold mb-4">Assign Tutor</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Tutor
                </label>
                <select
                  value={assignData.tutorId}
                  onChange={(e) => setAssignData(prev => ({ ...prev, tutorId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a tutor</option>
                  {tutors.map((tutor) => (
                    <option key={tutor.id} value={tutor.id}>
                      {tutor.name || tutor.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={assignData.scheduledDateTime}
                  onChange={(e) => setAssignData(prev => ({ ...prev, scheduledDateTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use student's preferred time
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={assignData.adminNotes}
                  onChange={(e) => setAssignData(prev => ({ ...prev, adminNotes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Optional notes for the student..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeAssignModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignTutor}
                  disabled={!assignData.tutorId}
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Session Modal */}
      <CancelSessionModal
        isOpen={isCancelModalOpen}
        onClose={closeCancelModal}
        onConfirm={handleCancelSession}
        session={sessionToCancel}
      />
    </div>
  )
}