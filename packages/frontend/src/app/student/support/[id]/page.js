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
  RefreshCw
} from 'lucide-react'

export default function SupportTicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id

  const [ticket, setTicket] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    fetchTicketDetails()
  }, [ticketId])

  const fetchTicketDetails = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.getSupportTicket(ticketId)
      if (response.success) {
        setTicket(response.ticket)
      } else {
        setError('Failed to load ticket details')
      }
    } catch (error) {
      console.error('Error fetching ticket:', error)
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
        await fetchTicketDetails() // Refresh to show new reply
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
              onClick={() => router.push('/student/support')}
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
              onClick={() => router.push('/student/support')}
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
            onClick={() => router.push('/student/support')}
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
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                {ticket.priority}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-4">
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
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                ticket.status === 'open' ? 'bg-red-100 text-red-800' :
                ticket.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                ticket.status === 'waiting_for_response' ? 'bg-blue-100 text-blue-800' :
                ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {ticket.status.replace('_', ' ')}
              </span>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>

            {ticket.assignedTutor && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium text-gray-900 mb-2">Assigned Tutor</h3>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{ticket.assignedTutor.name}</span>
                  <span className="text-gray-500">({ticket.assignedTutor.email})</span>
                </div>
              </div>
            )}
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
                {ticket.replies
                  .filter(reply => !reply.isInternal) // Hide internal replies from students
                  .map((reply, index) => (
                  <div key={reply.id} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{reply.user.name}</span>
                        <span className="text-sm text-gray-500">
                          {reply.user.role === 'STUDENT' ? 'Student' :
                           reply.user.role === 'TUTOR' ? 'Tutor' : 'Admin'}
                        </span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No replies yet. Be the first to start the conversation!</p>
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
                  placeholder="Type your message here..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end">
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
    </div>
  )
}