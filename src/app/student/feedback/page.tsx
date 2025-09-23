'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Paperclip,
  Send,
  Eye,
  MoreHorizontal,
  Star,
  ThumbsUp,
  MessageCircle,
  Zap,
  ChevronRight,
  RefreshCw,
  Mic,
  FileText,
  Image,
  X
} from 'lucide-react'
import { mockFeedback, getFeedbackByStudent } from '@/data/mock/mockCommunication'
import { mockTutorInfo } from '@/data/mock/mockReviews'

export default function StudentSupportPage() {
  const [activeTab, setActiveTab] = useState<'my-tickets' | 'submit'>('my-tickets')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'open' | 'in_progress' | 'resolved' | 'closed'>('all')
  const [newTicket, setNewTicket] = useState({
    tutorId: '',
    doubtType: '',
    subject: '',
    message: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    attachments: [] as File[],
    voiceNote: null as File | null
  })

  // PTE Doubt Types
  const pteDoubtTypes = [
    { id: 'speaking', name: 'Speaking', description: 'Pronunciation, fluency, oral fluency' },
    { id: 'writing', name: 'Writing', description: 'Essay writing, summarize written text' },
    { id: 'reading', name: 'Reading', description: 'Reading comprehension, fill in blanks' },
    { id: 'listening', name: 'Listening', description: 'Audio comprehension, note taking' },
    { id: 'vocabulary', name: 'Vocabulary', description: 'Word usage, academic vocabulary' },
    { id: 'grammar', name: 'Grammar', description: 'Sentence structure, tenses' },
    { id: 'mock-test', name: 'Mock Test', description: 'Practice test questions and scoring' },
    { id: 'strategy', name: 'Test Strategy', description: 'Time management, exam techniques' },
    { id: 'scoring', name: 'Scoring', description: 'Understanding PTE scoring system' },
    { id: 'technical', name: 'Technical Issues', description: 'Platform or technical problems' },
    { id: 'general', name: 'General Query', description: 'Other questions or concerns' }
  ]
  const [isRecording, setIsRecording] = useState(false)

  // Mock current student ID
  const currentStudentId = 'student1'

  // Get feedback for current student
  const studentTickets = getFeedbackByStudent(currentStudentId)

  // Filter by status
  const filteredTickets = selectedStatus === 'all'
    ? studentTickets
    : studentTickets.filter(ticket => ticket.status === selectedStatus)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-blue-600" />
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
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

  const stats = {
    total: studentTickets.length,
    open: studentTickets.filter(t => t.status === 'open').length,
    inProgress: studentTickets.filter(t => t.status === 'in_progress').length,
    resolved: studentTickets.filter(t => t.status === 'resolved').length
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
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
    if (isRecording) {
      // Stop recording logic would go here
      setIsRecording(false)
      console.log('Stopped recording')
    } else {
      // Start recording logic would go here
      setIsRecording(true)
      console.log('Started recording')
    }
  }

  const handleSubmitTicket = () => {
    if (!newTicket.tutorId || !newTicket.doubtType || !newTicket.subject.trim() || !newTicket.message.trim()) {
      alert('Please fill in all required fields (Tutor, Doubt Type, Subject, and Message)')
      return
    }

    // Create new ticket object
    const ticketData = {
      id: Date.now().toString(),
      studentId: currentStudentId,
      tutorId: newTicket.tutorId,
      doubtType: newTicket.doubtType,
      subject: newTicket.subject,
      message: newTicket.message,
      priority: newTicket.priority,
      status: 'open',
      createdAt: new Date(),
      attachments: newTicket.attachments.map(file => file.name),
      hasVoiceNote: newTicket.voiceNote !== null
    }

    console.log('Submitting ticket:', ticketData)

    // Reset form
    setNewTicket({
      tutorId: '',
      doubtType: '',
      subject: '',
      message: '',
      priority: 'medium',
      attachments: [],
      voiceNote: null
    })

    // Show success message and switch to tickets view
    alert('Support ticket submitted successfully! Your tutor will respond within 24 hours.')
    setActiveTab('my-tickets')
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
            <Button className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

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
            onClick={() => setActiveTab('submit')}
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
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
              <Button onClick={() => setActiveTab('submit')} className="bg-indigo-700 hover:bg-indigo-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                New Ticket
              </Button>
            </div>
          </div>

          {filteredTickets.length > 0 ? (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{ticket.subject}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1">{ticket.status.replace('_', ' ').toUpperCase()}</span>
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-3">{ticket.message}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>Created: {ticket.createdAt.toLocaleDateString()}</span>
                        <span>Priority: {ticket.priority}</span>
                        {ticket.assignedTo && <span>Assigned to: {ticket.assignedTo}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 text-center py-12">
              <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No tickets found</h3>
              <p className="text-slate-600 mb-6">
                {selectedStatus !== 'all'
                  ? `No tickets with status "${selectedStatus}"`
                  : 'You haven\'t submitted any support tickets yet'
                }
              </p>
              <Button onClick={() => setActiveTab('submit')} className="bg-indigo-700 hover:bg-indigo-700 text-white gap-2">
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

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Tutor *
                </label>
                <select
                  value={newTicket.tutorId}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, tutorId: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">Choose your tutor...</option>
                  {mockTutorInfo.map(tutor => (
                    <option key={tutor.id} value={tutor.id}>{tutor.name}</option>
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
                  onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value as any }))}
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
                      <div key={index} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-700">{file.name}</span>
                          <span className="text-xs text-slate-500">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <button
                          onClick={() => removeAttachment(index)}
                          className="text-red-500 hover:text-red-700"
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
                >
                  <Send className="w-4 h-4" />
                  Submit Ticket
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