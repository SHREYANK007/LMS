'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/api'
import {
  MessageCircle,
  ArrowLeft,
  Calendar,
  User,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  RefreshCw,
  Edit3,
  Archive,
  Users,
  Settings
} from 'lucide-react'

export default function AdminSupportTicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id

  const [ticket, setTicket] = useState(null)
  const [tutors, setTutors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [submitError, setSubmitError] = useState(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedTutorId, setSelectedTutorId] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editData, setEditData] = useState({})

  useEffect(() => {
    fetchData()
  }, [ticketId])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [ticketResponse, tutorsResponse] = await Promise.all([
        api.getSupportTicket(ticketId),
        api.getAllUsers('TUTOR')
      ])

      if (ticketResponse.success) {
        setTicket(ticketResponse.ticket)
        setEditData({
          priority: ticketResponse.ticket.priority,
          category: ticketResponse.ticket.category,
          status: ticketResponse.ticket.status
        })
      } else {
        setError('Failed to load ticket details')
      }

      if (tutorsResponse.success) {
        setTutors(tutorsResponse.users || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError(error.message || 'Failed to load ticket details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReplySubmit = async (e) => {
    e.preventDefault()
    if (!replyMessage.trim()) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await api.addTicketReply(ticketId, {
        message: replyMessage.trim()
      })
      if (response.success) {
        setReplyMessage('')
        await fetchData() // Refresh to show new reply
      } else {
        setSubmitError('Failed to send reply')
      }
    } catch (error) {
      console.error('Error sending reply:', error)
      setSubmitError(error.message || 'Failed to send reply')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAssignTutor = async () => {
    if (!selectedTutorId) return

    setIsUpdating(true)
    try {
      const response = await api.updateSupportTicket(ticketId, {
        assignedTutorId: selectedTutorId
      })
      if (response.success) {
        setTicket(response.ticket)
        setShowAssignModal(false)
        setSelectedTutorId('')
      } else {
        setError('Failed to assign tutor')
      }
    } catch (error) {
      console.error('Error assigning tutor:', error)
      setError(error.message || 'Failed to assign tutor')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpdateTicket = async () => {
    setIsUpdating(true)
    try {
      const response = await api.updateSupportTicket(ticketId, editData)
      if (response.success) {
        setTicket(response.ticket)
        setShowEditModal(false)
      } else {
        setError('Failed to update ticket')
      }
    } catch (error) {
      console.error('Error updating ticket:', error)
      setError(error.message || 'Failed to update ticket')
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'waiting_for_response':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'closed':
        return <CheckCircle className="h-5 w-5 text-gray-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'waiting_for_response':
        return 'bg-blue-100 text-blue-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Ticket</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => router.push('/admin/support')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Support Tickets
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Ticket Not Found</h2>
            <p className="text-gray-700 mb-4">The requested support ticket could not be found.</p>
            <button
              onClick={() => router.push('/admin/support')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Support Tickets
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/support')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Support Tickets</span>
          </button>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getStatusIcon(ticket.status)}
                <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center space-x-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <Tag className="h-4 w-4" />
                <span>#{ticket.ticketNumber}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span className="capitalize">{ticket.category}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Created {formatDate(ticket.createdAt)}</span>
              </div>
            </div>

            {/* Student Information */}
            <div className="border-t pt-4 mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Student Information</h3>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">
                  {ticket.student ? `${ticket.student.name} (${ticket.student.email})` : 'Student information not available'}
                </span>
              </div>
            </div>

            {/* Assignment Information */}
            <div className="border-t pt-4 mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Assignment</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">
                    {ticket.assignedTutor ? `Assigned to: ${ticket.assignedTutor.name}` : 'Not assigned'}
                  </span>
                </div>
                {!ticket.assignedTutorId && (
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Users className="h-4 w-4" />
                    <span>Assign Tutor</span>
                  </button>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Conversation</span>
            </h2>
          </div>

          <div className="p-6">
            {ticket.replies && ticket.replies.length > 0 ? (
              <div className="space-y-6">
                {ticket.replies.map((reply, index) => (
                  <div key={reply.id} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                        reply.user.role === 'STUDENT' ? 'bg-blue-500' :
                        reply.user.role === 'TUTOR' ? 'bg-green-500' : 'bg-purple-500'
                      }`}>
                        <User className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{reply.user.name}</span>
                        <span className="text-sm text-gray-500">
                          {reply.user.role === 'STUDENT' ? 'Student' :
                           reply.user.role === 'TUTOR' ? 'Tutor' : 'Admin'}
                        </span>
                        {reply.isInternal && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Internal</span>
                        )}
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                      </div>
                      <div className={`rounded-lg p-4 ${
                        reply.isInternal ? 'bg-red-50 border border-red-200' :
                        reply.user.role === 'STUDENT' ? 'bg-blue-50' :
                        reply.user.role === 'TUTOR' ? 'bg-green-50' : 'bg-purple-50'
                      }`}>
                        <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No replies yet. Be the first to respond to this ticket!</p>
              </div>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {ticket.status !== 'closed' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add a Reply</h3>

            {submitError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700">{submitError}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleReplySubmit} className="space-y-4">
              <div>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your response..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.push('/admin/support')}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back to List
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !replyMessage.trim()}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting && <RefreshCw className="h-4 w-4 animate-spin" />}
                  <Send className="h-4 w-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Reply'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {ticket.status === 'closed' && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <CheckCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ticket Closed</h3>
            <p className="text-gray-600">This support ticket has been closed and no longer accepts replies.</p>
          </div>
        )}
      </div>

      {/* Assign Tutor Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assign Tutor</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Tutor
              </label>
              <select
                value={selectedTutorId}
                onChange={(e) => setSelectedTutorId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a tutor...</option>
                {tutors.map(tutor => (
                  <option key={tutor.id} value={tutor.id}>
                    {tutor.name} ({tutor.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAssignModal(false)
                  setSelectedTutorId('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTutor}
                disabled={isUpdating || !selectedTutorId}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating && <RefreshCw className="h-4 w-4 animate-spin" />}
                <span>{isUpdating ? 'Assigning...' : 'Assign'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Ticket Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Ticket</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  value={editData.priority}
                  onChange={(e) => setEditData({...editData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={editData.category}
                  onChange={(e) => setEditData({...editData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="technical">Technical</option>
                  <option value="academic">Academic</option>
                  <option value="billing">Billing</option>
                  <option value="general">General</option>
                  <option value="feedback">Feedback</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_for_response">Waiting for Response</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTicket}
                disabled={isUpdating}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating && <RefreshCw className="h-4 w-4 animate-spin" />}
                <span>{isUpdating ? 'Updating...' : 'Update'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}