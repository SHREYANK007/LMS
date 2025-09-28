'use client'

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  MessageSquare,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Send,
  Eye,
  MoreHorizontal,
  MessageCircle,
  ChevronRight,
  RefreshCw,
  Mic,
  FileText,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import api from '@/lib/api'

type TicketStatus = 'open' | 'in_progress' | 'waiting_for_response' | 'resolved' | 'closed'
type FilterStatus = 'all' | TicketStatus
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

interface TutorSummary {
  id: string
  name?: string | null
  email?: string | null
}

interface SupportTicket {
  id: string
  title: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  category: 'technical' | 'academic' | 'billing' | 'general' | 'feedback'
  ticketNumber: string
  createdAt: string
  updatedAt: string
  tags?: string[] | null
  assignedTutor?: TutorSummary | null
}

interface NewTicketState {
  tutorId: string
  doubtType: string
  subject: string
  message: string
  priority: 'low' | 'medium' | 'high'
  attachments: File[]
  voiceNote: File | null
}

interface NotificationState {
  type: 'success' | 'error'
  message: string
}

interface DoubtType {
  id: string
  name: string
  description: string
  category: 'technical' | 'academic' | 'billing' | 'general' | 'feedback'
}

const initialNewTicketState: NewTicketState = {
  tutorId: '',
  doubtType: '',
  subject: '',
  message: '',
  priority: 'medium',
  attachments: [],
  voiceNote: null
}

const pteDoubtTypes: DoubtType[] = [
  { id: 'speaking', name: 'Speaking', description: 'Pronunciation, fluency, oral fluency', category: 'academic' },
  { id: 'writing', name: 'Writing', description: 'Essay writing, summarize written text', category: 'academic' },
  { id: 'reading', name: 'Reading', description: 'Reading comprehension, fill in blanks', category: 'academic' },
  { id: 'listening', name: 'Listening', description: 'Audio comprehension, note taking', category: 'academic' },
  { id: 'vocabulary', name: 'Vocabulary', description: 'Word usage, academic vocabulary', category: 'academic' },
  { id: 'grammar', name: 'Grammar', description: 'Sentence structure, tenses', category: 'academic' },
  { id: 'mock-test', name: 'Mock Test', description: 'Practice test questions and scoring', category: 'academic' },
  { id: 'strategy', name: 'Test Strategy', description: 'Time management, exam techniques', category: 'academic' },
  { id: 'scoring', name: 'Scoring', description: 'Understanding PTE scoring system', category: 'academic' },
  { id: 'technical', name: 'Technical Issues', description: 'Platform or technical problems', category: 'technical' },
  { id: 'billing', name: 'Billing & Payments', description: 'Invoices, payments, or refund queries', category: 'billing' },
  { id: 'feedback', name: 'Feedback & Suggestions', description: 'Share ideas to improve the program', category: 'feedback' },
  { id: 'general', name: 'General Query', description: 'Other questions or concerns', category: 'general' }
]

const formatDate = (value: string | Date) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return date.toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

const formatStatusLabel = (status: TicketStatus) =>
  status
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export default function StudentSupportPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [activeTab, setActiveTab] = useState<'my-tickets' | 'submit'>('my-tickets')
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>('all')
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [notification, setNotification] = useState<NotificationState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [assignedTutors, setAssignedTutors] = useState<TutorSummary[]>([])
  const [newTicket, setNewTicket] = useState<NewTicketState>(initialNewTicketState)

  const loadAssignedTutors = useCallback(async () => {
    try {
      const response = await api.fetchUserProfile()
      if (response.success && Array.isArray(response.user?.assignedTutors)) {
        setAssignedTutors(response.user.assignedTutors as TutorSummary[])
      }
    } catch (profileError) {
      console.error('Error fetching assigned tutors:', profileError)
    }
  }, [])

  const fetchTickets = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await api.getSupportTickets({ limit: 100, sortBy: 'createdAt', sortOrder: 'DESC' })
      if (response.success) {
        const apiTickets = (response.tickets || []) as SupportTicket[]
        const sortedTickets = [...apiTickets].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setTickets(sortedTickets)
      } else {
        setError(response.error || 'Failed to load support tickets')
      }
    } catch (fetchError) {
      const message = fetchError instanceof Error ? fetchError.message : 'Failed to load support tickets'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!user || user.role !== 'STUDENT') {
      return
    }

    if (Array.isArray((user as any).assignedTutors)) {
      setAssignedTutors((user as any).assignedTutors)
    } else {
      loadAssignedTutors()
    }

    fetchTickets()
  }, [authLoading, user, loadAssignedTutors, fetchTickets])

  useEffect(() => {
    if (assignedTutors.length > 0 && !newTicket.tutorId) {
      setNewTicket(prev => ({ ...prev, tutorId: assignedTutors[0].id }))
    }
  }, [assignedTutors, newTicket.tutorId])

  useEffect(() => {
    if (activeTab === 'submit') {
      setFormError(null)
    }
  }, [activeTab])

  const filteredTickets = useMemo(() => {
    if (selectedStatus === 'all') {
      return tickets
    }
    return tickets.filter(ticket => ticket.status === selectedStatus)
  }, [tickets, selectedStatus])
  const activeTickets = useMemo(
    () => tickets.filter(ticket => ticket.status !== 'resolved' && ticket.status !== 'closed'),
    [tickets]
  )

  const resolvedTickets = useMemo(
    () => tickets.filter(ticket => ticket.status === 'resolved' || ticket.status === 'closed'),
    [tickets]
  )

  const stats = useMemo(() => {
    const total = tickets.length
    const open = tickets.filter(t => t.status === 'open' || t.status === 'waiting_for_response').length
    const inProgress = tickets.filter(t => t.status === 'in_progress').length
    const resolved = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length

    return {
      total,
      open,
      inProgress,
      resolved
    }
  }, [tickets])

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-blue-600" />
      case 'waiting_for_response':
        return <Clock className="w-4 h-4 text-purple-600" />
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'closed':
        return <CheckCircle2 className="w-4 h-4 text-gray-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-blue-600" />
    }
  }

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'waiting_for_response':
        return 'bg-purple-100 text-purple-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  const renderTicketCard = (ticket: SupportTicket) => (
    <div key={ticket.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-slate-900">{ticket.title}</h3>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
              {getStatusIcon(ticket.status)}
              <span className="ml-1">{formatStatusLabel(ticket.status)}</span>
            </span>
          </div>
          <p className="text-slate-600 text-sm mb-3">{ticket.description}</p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span>Created: {formatDate(ticket.createdAt)}</span>
            <span>Priority: {ticket.priority}</span>
            <span>
              Assigned to{' '}
              {ticket.assignedTutor?.name || ticket.assignedTutor?.email || 'Pending assignment'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => handleViewTicket(ticket.id)}
          >
            <Eye className="w-4 h-4" />
            View
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) {
      return
    }
    setNewTicket(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }))
  }

  const removeAttachment = (index: number) => {
    setNewTicket(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const handleVoiceRecord = () => {
    setIsRecording(prev => !prev)
  }

  const handleSubmitTicket = async () => {
    if (isSubmitting) {
      return
    }

    setFormError(null)

    if (!assignedTutors.length) {
      setFormError('We could not find an assigned tutor. Please contact support for assistance.')
      return
    }

    if (!newTicket.tutorId) {
      setFormError('Please select the tutor you would like to reach out to.')
      return
    }

    if (!newTicket.doubtType) {
      setFormError('Please choose a doubt type so we can route your ticket correctly.')
      return
    }

    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      setFormError('Subject and message are required.')
      return
    }

    const selectedDoubtType = pteDoubtTypes.find(type => type.id === newTicket.doubtType)
    const category = selectedDoubtType?.category ?? 'general'
    const tags = selectedDoubtType ? [selectedDoubtType.id] : []
    const selectedTutorId = newTicket.tutorId

    setIsSubmitting(true)

    try {
      const response = await api.createSupportTicket({
        title: newTicket.subject.trim(),
        description: newTicket.message.trim(),
        category,
        priority: newTicket.priority,
        tags,
        assignedTutorId: selectedTutorId
      })

      if (response.success) {
        const ticketNumber = response.ticket?.ticketNumber
        setNotification({
          type: 'success',
          message: ticketNumber
            ? `Support ticket #${ticketNumber} submitted successfully.`
            : 'Support ticket submitted successfully.'
        })
        setActiveTab('my-tickets')
        setSelectedStatus('all')
        setIsRecording(false)
        setNewTicket({
          ...initialNewTicketState,
          tutorId: selectedTutorId
        })
        await fetchTickets()
      } else {
        setFormError(response.error || 'Failed to submit support ticket')
      }
    } catch (submissionError) {
      const message = submissionError instanceof Error
        ? submissionError.message
        : 'Failed to submit support ticket'
      setFormError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewTicket = (ticketId: string) => {
    router.push(`/student/support/${ticketId}`)
  }

  const handleRefresh = () => {
    fetchTickets()
  }

  const hasAssignedTutors = assignedTutors.length > 0

  if (!authLoading && !user) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Support Center</h2>
          <p className="text-slate-600">We couldn't load your account details. Please sign in again to access support.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Support Center
              </h1>
              <p className="text-slate-500 text-lg mt-1">Get help from your tutors and resolve your doubts</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-xl font-semibold shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              {stats.open} Open
            </span>
            <Button
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm gap-2"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Refreshing' : 'Refresh'}
            </Button>
          </div>
        </div>

        {notification && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {notification.message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-blue-400">
                +{stats.total}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
            <p className="text-sm text-slate-300">Total Tickets</p>
            <p className="text-xs text-slate-400 mt-2">All support requests</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-amber-400">
                {stats.open}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.open}</div>
            <p className="text-sm text-slate-300">Open Tickets</p>
            <p className="text-xs text-slate-400 mt-2">Awaiting response</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-yellow-400">
                {stats.inProgress}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.inProgress}</div>
            <p className="text-sm text-slate-300">In Progress</p>
            <p className="text-xs text-slate-400 mt-2">Being worked on</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-emerald-400">
                {stats.resolved}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.resolved}</div>
            <p className="text-sm text-slate-300">Resolved</p>
            <p className="text-xs text-slate-400 mt-2">Successfully closed</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Quick Actions</h2>
            <p className="text-slate-500">Manage your support tickets and get help</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div
            onClick={() => setActiveTab('my-tickets')}
            className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border group cursor-pointer ${
              activeTab === 'my-tickets' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100'
            }`}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">My Tickets</h3>
            <p className="text-slate-600 text-sm mb-4">View your support requests</p>
            <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
              View {stats.total} tickets
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div
            onClick={() => {
              setNotification(null)
              setActiveTab('submit')
            }}
            className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border group cursor-pointer ${
              activeTab === 'submit' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100'
            }`}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Plus className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Submit Ticket</h3>
            <p className="text-slate-600 text-sm mb-4">Get help from your tutor</p>
            <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
              Create New Request
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Popular Doubt Types */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Popular PTE Doubt Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {pteDoubtTypes.slice(0, 8).map((doubtType) => (
              <div
                key={doubtType.id}
                onClick={() => {
                  setNewTicket(prev => ({ ...prev, doubtType: doubtType.id }))
                  setNotification(null)
                  setActiveTab('submit')
                }}
                className="bg-white rounded-xl p-3 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <h4 className="text-sm font-semibold text-slate-800 mb-1 group-hover:text-indigo-600">{doubtType.name}</h4>
                <p className="text-xs text-slate-500">{doubtType.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'my-tickets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">My Support Tickets</h2>
              <p className="text-slate-500">Track your support requests and responses</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as FilterStatus)}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="waiting_for_response">Waiting for Response</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <Button
                onClick={() => {
                  setNotification(null)
                  setActiveTab('submit')
                }}
                className="bg-indigo-700 hover:bg-indigo-700 text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                New Ticket
              </Button>
            </div>
          </div>

          {isLoading && tickets.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 text-center py-12">
              <RefreshCw className="w-10 h-10 text-slate-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Loading your tickets</h3>
              <p className="text-slate-600">Fetching the latest updates from your support history.</p>
            </div>
          ) : selectedStatus === 'all' ? (
            tickets.length > 0 ? (
              <div className="space-y-8">
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-slate-800">Active Tickets</h3>
                    <span className="text-sm text-slate-500">{activeTickets.length} ongoing</span>
                  </div>
                  {activeTickets.length > 0 ? (
                    <div className="space-y-4">
                      {activeTickets.map(renderTicketCard)}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 text-center py-10">
                      <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <h4 className="text-lg font-semibold text-slate-900 mb-1">No active tickets</h4>
                      <p className="text-slate-600 text-sm">All caught up! Reach out if you need help.</p>
                    </div>
                  )}
                </section>

                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-slate-800">Resolved Tickets</h3>
                    <span className="text-sm text-slate-500">{resolvedTickets.length} completed</span>
                  </div>
                  {resolvedTickets.length > 0 ? (
                    <div className="space-y-4">
                      {resolvedTickets.map(renderTicketCard)}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 text-center py-10">
                      <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                      <h4 className="text-lg font-semibold text-slate-900 mb-1">No resolved tickets yet</h4>
                      <p className="text-slate-600 text-sm">Resolved tickets will appear here for your records.</p>
                    </div>
                  )}
                </section>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 text-center py-12">
                <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No tickets found</h3>
                <p className="text-slate-600 mb-6">You haven't submitted any support tickets yet</p>
                <Button
                  onClick={() => {
                    setNotification(null)
                    setActiveTab('submit')
                  }}
                  className="bg-indigo-700 hover:bg-indigo-700 text-white gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Ticket
                </Button>
              </div>
            )
          ) : filteredTickets.length > 0 ? (
            <div className="space-y-4">
              {filteredTickets.map(renderTicketCard)}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 text-center py-12">
              <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No tickets found</h3>
              <p className="text-slate-600 mb-6">
                {selectedStatus !== 'all'
                  ? `No tickets with status "${formatStatusLabel(selectedStatus as TicketStatus)}"`
                  : "You haven't submitted any support tickets yet"}
              </p>
              <Button
                onClick={() => {
                  setNotification(null)
                  setActiveTab('submit')
                }}
                className="bg-indigo-700 hover:bg-indigo-700 text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Your First Ticket
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'submit' && (
        <div className="max-w-2xl">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Submit Support Ticket</h2>

            {!hasAssignedTutors && (
              <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
                You currently do not have an assigned tutor. Please contact the admin team so we can route your ticket correctly.
              </div>
            )}

            {formError && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
                {formError}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Tutor *
                </label>
                <select
                  value={newTicket.tutorId}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, tutorId: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  disabled={!hasAssignedTutors}
                >
                  <option value="">Choose your tutor...</option>
                  {assignedTutors.map(tutor => (
                    <option key={tutor.id} value={tutor.id}>
                      {tutor.name || tutor.email || 'Tutor'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Doubt Type *
                </label>
                <select
                  value={newTicket.doubtType}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, doubtType: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">Select doubt type...</option>
                  {pteDoubtTypes.map(doubtType => (
                    <option key={doubtType.id} value={doubtType.id}>
                      {doubtType.name} - {doubtType.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Brief description of your question or issue"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as NewTicketState['priority'] }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="low">Low - General question</option>
                  <option value="medium">Medium - Need help soon</option>
                  <option value="high">High - Urgent assistance needed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Message *
                </label>
                <textarea
                  rows={5}
                  value={newTicket.message}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Describe your question or issue in detail. The more information you provide, the better we can help you."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Attachments (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Paperclip className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-slate-600">Click to upload files or drag and drop</p>
                    <p className="text-xs text-slate-500 mt-1">Images, PDFs, Documents (Max 10MB)</p>
                  </label>
                </div>

                {newTicket.attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {newTicket.attachments.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-700">{file.name}</span>
                          <span className="text-xs text-slate-500">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700"
                          type="button"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Voice Note */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Voice Note (Optional)
                </label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    onClick={handleVoiceRecord}
                    className={`flex items-center gap-2 ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                    {isRecording ? 'Stop Recording' : 'Record Voice Note'}
                  </Button>
                  {isRecording && (
                    <div className="flex items-center gap-2 text-red-600">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                      <span className="text-sm">Recording...</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">Record a voice message to explain your question (Max 2 minutes)</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Support Guidelines</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Be specific about your question or issue</li>
                      <li>• Include relevant details like course materials or session dates</li>
                      <li>• Attach screenshots or documents if helpful</li>
                      <li>• Your tutor will respond within 24 hours</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={handleSubmitTicket}
                  className="bg-indigo-700 hover:bg-indigo-700 text-white gap-2"
                  disabled={isSubmitting || !hasAssignedTutors}
                >
                  {isSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('my-tickets')}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
