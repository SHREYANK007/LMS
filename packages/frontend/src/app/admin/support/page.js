'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import {
  HeadphonesIcon,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Paperclip,
  ArrowRight,
  RefreshCw,
  Tag,
  Users
} from 'lucide-react'

export default function AdminSupportPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState([])
  const [tutors, setTutors] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedTutorId, setSelectedTutorId] = useState('')
  const [isAssigning, setIsAssigning] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch all data in parallel
      const [ticketsResponse, statsResponse, tutorsResponse] = await Promise.all([
        api.getSupportTickets(),
        api.getSupportTicketStats(),
        api.getAllUsers('TUTOR')
      ])

      if (ticketsResponse.success) {
        setTickets(ticketsResponse.tickets || [])
      }

      if (statsResponse.success) {
        setStats(statsResponse.stats)
      }

      if (tutorsResponse.success) {
        setTutors(tutorsResponse.users || [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError(error.message || 'Failed to load support data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTicketClick = (ticket) => {
    router.push(`/admin/support/${ticket.id}`)
  }

  const handleAssignTicket = async () => {
    if (!selectedTicket || !selectedTutorId) return

    setIsAssigning(true)
    try {
      const response = await api.updateSupportTicket(selectedTicket.id, {
        assignedTutorId: selectedTutorId
      })
      if (response.success) {
        await fetchData() // Refresh data
        setShowAssignModal(false)
        setSelectedTicket(null)
        setSelectedTutorId('')
      }
    } catch (error) {
      console.error('Error assigning ticket:', error)
      setError('Failed to assign ticket')
    } finally {
      setIsAssigning(false)
    }
  }

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      const response = await api.updateSupportTicket(ticketId, { status: newStatus })
      if (response.success) {
        await fetchData() // Refresh data
      }
    } catch (error) {
      console.error('Error updating status:', error)
      setError('Failed to update ticket status')
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketNumber?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || ticket.category === selectedCategory
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus
  })

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

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

  const getCategoryColor = (category) => {
    switch (category) {
      case 'technical': return 'bg-purple-100 text-purple-800'
      case 'billing': return 'bg-green-100 text-green-800'
      case 'academic': return 'bg-indigo-100 text-indigo-800'
      case 'general': return 'bg-blue-100 text-blue-800'
      case 'feedback': return 'bg-pink-100 text-pink-800'
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
            <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Support Data</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={fetchData}
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
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
              <HeadphonesIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Support Center
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Manage student support tickets and inquiries
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="flex items-center space-x-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Total Tickets</p>
                  <p className="text-white text-2xl font-bold mt-1">{stats.total || 0}</p>
                  <p className="text-slate-400 text-xs mt-1">All support tickets</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                  <HeadphonesIcon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Open Tickets</p>
                  <p className="text-white text-2xl font-bold mt-1">{stats.open || 0}</p>
                  <p className="text-slate-400 text-xs mt-1">Pending resolution</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">In Progress</p>
                  <p className="text-white text-2xl font-bold mt-1">{stats.inProgress || 0}</p>
                  <p className="text-slate-400 text-xs mt-1">Being worked on</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">Resolved</p>
                  <p className="text-white text-2xl font-bold mt-1">{stats.resolved || 0}</p>
                  <p className="text-slate-400 text-xs mt-1">Successfully resolved</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="academic">Academic</option>
              <option value="general">General</option>
              <option value="feedback">Feedback</option>
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="waiting_for_response">Waiting for Response</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <button className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md transition-colors">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Support Tickets List */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Support Tickets ({filteredTickets.length})</h3>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <HeadphonesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedCategory !== 'all' || selectedPriority !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No support tickets have been created yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                        <HeadphonesIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-800">{ticket.title}</h4>
                          <span className="text-sm text-gray-500">#{ticket.ticketNumber}</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(ticket.category)}`}>
                            {ticket.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ticket.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <User className="h-3 w-3" />
                              <span>{ticket.student ? ticket.student.name : 'Unknown Student'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-3 w-3" />
                              <span>{ticket.student ? ticket.student.email : 'No email'}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-3 w-3" />
                              <span>Created: {formatDate(ticket.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-3 w-3" />
                              <span>Updated: {formatDate(ticket.updatedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleTicketClick(ticket)}
                          className="flex items-center space-x-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1 rounded text-sm transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                      </div>
                      {!ticket.assignedTutorId && ticket.status === 'open' && (
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket)
                            setShowAssignModal(true)
                          }}
                          className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          <ArrowRight className="h-4 w-4" />
                          <span>Assign</span>
                        </button>
                      )}
                      {ticket.status === 'in_progress' && (
                        <button
                          onClick={() => handleStatusUpdate(ticket.id, 'resolved')}
                          className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Resolve</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{ticket.replies ? ticket.replies.length : 0} replies</span>
                      </div>
                      {ticket.tags && ticket.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Tag className="h-3 w-3" />
                          <span>{ticket.tags.length} tags</span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {ticket.assignedTutor ? (
                        <span>Assigned to: {ticket.assignedTutor.name}</span>
                      ) : (
                        <span>Unassigned</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Assign Ticket #{selectedTicket.ticketNumber}
            </h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Subject: {selectedTicket.title}</p>
              <p className="text-sm text-gray-600">
                Student: {selectedTicket.student ? selectedTicket.student.name : 'Unknown'}
              </p>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Tutor
              </label>
              <select
                value={selectedTutorId}
                onChange={(e) => setSelectedTutorId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a tutor...</option>
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
                  setSelectedTicket(null)
                  setSelectedTutorId('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignTicket}
                disabled={isAssigning || !selectedTutorId}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAssigning && <RefreshCw className="h-4 w-4 animate-spin" />}
                <span>{isAssigning ? 'Assigning...' : 'Assign Ticket'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}