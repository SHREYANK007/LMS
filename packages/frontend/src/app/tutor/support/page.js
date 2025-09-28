'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import {
  MessageSquare,
  Search,
  Filter,
  Clock,
  User,
  Reply,
  Eye,
  Archive,
  AlertTriangle,
  CheckCircle2,
  Star,
  Paperclip,
  Send,
  RefreshCw,
  Tag,
  Calendar,
  AlertCircle
} from 'lucide-react'

export default function TutorSupportPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [isSubmittingReply, setIsSubmittingReply] = useState(false)
  const [replyError, setReplyError] = useState(null)

  useEffect(() => {
    fetchSupportTickets()
    fetchSupportStats()
  }, [])

  const fetchSupportTickets = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.getSupportTickets()
      if (response.success) {
        setTickets(response.tickets || [])
      } else {
        setError('Failed to load support tickets')
      }
    } catch (error) {
      console.error('Error fetching support tickets:', error)
      setError(error.message || 'Failed to load support tickets')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSupportStats = async () => {
    try {
      const response = await api.getSupportTicketStats()
      if (response.success) {
        setStats(response.stats)
      }
    } catch (error) {
      console.error('Error fetching support stats:', error)
    }
  }

  const handleTicketClick = async (ticket) => {
    try {
      const response = await api.getSupportTicket(ticket.id)
      if (response.success) {
        setSelectedTicket(response.ticket)
        setReplyText('')
        setReplyError(null)
      }
    } catch (error) {
      console.error('Error fetching ticket details:', error)
      setError('Failed to load ticket details')
    }
  }

  const handleReplySubmit = async () => {
    if (!replyText.trim() || !selectedTicket) return

    setIsSubmittingReply(true)
    setReplyError(null)

    try {
      const response = await api.addTicketReply(selectedTicket.id, {
        message: replyText.trim()
      })
      if (response.success) {
        setReplyText('')
        // Refresh the ticket details to show the new reply
        const updatedTicketResponse = await api.getSupportTicket(selectedTicket.id)
        if (updatedTicketResponse.success) {
          setSelectedTicket(updatedTicketResponse.ticket)
        }
        // Refresh the tickets list
        await fetchSupportTickets()
      } else {
        setReplyError('Failed to send reply')
      }
    } catch (error) {
      console.error('Error sending reply:', error)
      setReplyError(error.message || 'Failed to send reply')
    } finally {
      setIsSubmittingReply(false)
    }
  }

  const handleUpdateTicketStatus = async (ticketId, status) => {
    try {
      const response = await api.updateSupportTicket(ticketId, { status })
      if (response.success) {
        await fetchSupportTickets()
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(response.ticket)
        }
      }
    } catch (error) {
      console.error('Error updating ticket status:', error)
      setError('Failed to update ticket status')
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = selectedFilter === 'all' || ticket.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'waiting_for_response': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'waiting_for_response':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'closed':
        return <CheckCircle2 className="h-4 w-4 text-gray-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
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
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Support Tickets</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
                <p className="text-gray-500 text-lg">Help students with their queries and issues</p>
              </div>
            </div>
            <button
              onClick={fetchSupportTickets}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Open</p>
                    <p className="text-2xl font-bold text-red-600">{stats.open || 0}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.inProgress || 0}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Resolved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.resolved || 0}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_for_response">Waiting for Response</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500">
              {searchTerm || selectedFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No support tickets assigned to you yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleTicketClick(ticket)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(ticket.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                        <p className="text-sm text-gray-500">
                          {ticket.student ? `${ticket.student.name} (${ticket.student.email})` : 'Student information not available'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">{ticket.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
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
                      <span>{formatDate(ticket.createdAt)}</span>
                    </div>
                    {ticket.replies && ticket.replies.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{ticket.replies.length} replies</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTicketClick(ticket)
                      }}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    {ticket.status !== 'closed' && ticket.status !== 'resolved' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleUpdateTicketStatus(ticket.id, 'resolved')
                        }}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Resolve</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(selectedTicket.status)}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedTicket.title}</h2>
                    <p className="text-gray-500">
                      {selectedTicket.student ? `${selectedTicket.student.name} (${selectedTicket.student.email})` : 'Student information not available'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Ticket Info */}
              <div className="mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ticket Number</p>
                    <p className="text-sm text-gray-900">#{selectedTicket.ticketNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Category</p>
                    <p className="text-sm text-gray-900 capitalize">{selectedTicket.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Priority</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Description</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Conversation */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation</h3>
                {selectedTicket.replies && selectedTicket.replies.length > 0 ? (
                  <div className="space-y-4">
                    {selectedTicket.replies
                      .filter(reply => !reply.isInternal) // Hide internal replies
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
                          <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-gray-700 whitespace-pre-wrap">{reply.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No replies yet</p>
                )}
              </div>

              {/* Reply Form */}
              {selectedTicket.status !== 'closed' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Reply</h3>
                  {replyError && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700">{replyError}</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        {selectedTicket.status !== 'resolved' && (
                          <button
                            onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'resolved')}
                            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Mark Resolved</span>
                          </button>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedTicket(null)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Close
                        </button>
                        <button
                          onClick={handleReplySubmit}
                          disabled={isSubmittingReply || !replyText.trim()}
                          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmittingReply && <RefreshCw className="h-4 w-4 animate-spin" />}
                          <Send className="h-4 w-4" />
                          <span>{isSubmittingReply ? 'Sending...' : 'Send Reply'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}