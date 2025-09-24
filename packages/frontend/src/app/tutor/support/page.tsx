'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  Phone,
  Video,
  Mail,
  BookOpen,
  Target,
  Crown
} from 'lucide-react'

export default function TutorSupportPage() {
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedQuery, setSelectedQuery] = useState<any>(null)
  const [replyText, setReplyText] = useState('')

  const stats = [
    {
      title: "Open Queries",
      value: "12",
      description: "Awaiting response",
      change: "+3 new",
      icon: MessageSquare,
      iconBg: "from-blue-400 to-blue-600",
      changeBg: "text-orange-400"
    },
    {
      title: "Resolved Today",
      value: "8",
      description: "Successfully answered",
      change: "+5 today",
      icon: CheckCircle2,
      iconBg: "from-emerald-400 to-green-500",
      changeBg: "text-emerald-400"
    },
    {
      title: "Response Time",
      value: "2.3h",
      description: "Average response",
      change: "-0.5h better",
      icon: Clock,
      iconBg: "from-purple-400 to-pink-500",
      changeBg: "text-emerald-400"
    },
    {
      title: "Satisfaction",
      value: "4.9",
      description: "Student rating",
      change: "+0.1",
      icon: Star,
      iconBg: "from-yellow-400 to-orange-500",
      changeBg: "text-emerald-400"
    }
  ]

  const queries = [
    {
      id: 1,
      student: "Sarah Johnson",
      subject: "PTE Speaking Practice Doubt",
      message: "Hi Dr. Wilson, I'm struggling with the repeat sentence task in PTE speaking. Could you provide some specific strategies for improving my pronunciation and fluency?",
      timestamp: "2024-12-18T14:30:00Z",
      status: "open",
      priority: "medium",
      course: "PTE Speaking",
      hasAttachment: true,
      studentAvatar: "SJ",
      doubtType: "Speaking Practice"
    },
    {
      id: 2,
      student: "Mike Chen",
      subject: "Essay Structure - PTE Writing",
      message: "I keep getting low scores in PTE writing essays. Can you review my template and suggest improvements? I've attached my recent practice essay.",
      timestamp: "2024-12-18T12:15:00Z",
      status: "replied",
      priority: "high",
      course: "PTE Writing",
      hasAttachment: true,
      studentAvatar: "MC",
      doubtType: "Writing Structure"
    },
    {
      id: 3,
      student: "Emma Davis",
      subject: "NAATI CCL Dialogue Interpretation",
      message: "I'm having trouble with medical terminology in NAATI CCL dialogues. Do you have specific resources for healthcare-related vocabulary?",
      timestamp: "2024-12-18T10:45:00Z",
      status: "open",
      priority: "low",
      course: "NAATI CCL",
      hasAttachment: false,
      studentAvatar: "ED",
      doubtType: "Vocabulary"
    },
    {
      id: 4,
      student: "Alex Rodriguez",
      subject: "PTE Reading - Time Management",
      message: "I can't complete the reading section in time. What strategies do you recommend for managing time effectively during the exam?",
      timestamp: "2024-12-18T09:20:00Z",
      status: "resolved",
      priority: "medium",
      course: "PTE Reading",
      hasAttachment: false,
      studentAvatar: "AR",
      doubtType: "Time Management"
    },
    {
      id: 5,
      student: "Lisa Wong",
      subject: "Audio Recording Issue",
      message: "My voice note isn't clear in the practice sessions. Could you check the audio quality and provide feedback?",
      timestamp: "2024-12-18T08:00:00Z",
      status: "open",
      priority: "high",
      course: "PTE Speaking",
      hasAttachment: true,
      studentAvatar: "LW",
      doubtType: "Technical Support"
    }
  ]

  const filteredQueries = queries.filter(query => {
    const matchesSearch = query.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         query.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || query.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-orange-100 text-orange-800'
      case 'replied': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleReply = (queryId: number) => {
    // Handle reply logic
    console.log('Replying to query:', queryId, 'with message:', replyText)
    setReplyText('')
    setSelectedQuery(null)
  }

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Student Support
                </h1>
                <p className="text-slate-500 text-lg mt-1">Help your students succeed with timely responses</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-xl font-semibold shadow-lg">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Support Active
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-br ${stat.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-sm font-bold ${stat.changeBg}`}>
                    {stat.change}
                  </span>
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <p className="text-sm text-slate-300">{stat.title}</p>
                <p className="text-xs text-slate-400 mt-2">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search student queries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
              >
                <option value="all">All Queries</option>
                <option value="open">Open</option>
                <option value="replied">Replied</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Queries List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Queries List */}
          <div className="lg:col-span-2 space-y-6">
            {filteredQueries.map((query) => (
              <div
                key={query.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedQuery(query)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center text-white font-semibold">
                      {query.studentAvatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 text-lg">{query.student}</h3>
                      <p className="text-slate-500 text-sm">{query.course}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(query.status)}`}>
                      {query.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(query.priority)}`}>
                      {query.priority}
                    </span>
                  </div>
                </div>

                <h4 className="font-semibold text-slate-800 mb-2">{query.subject}</h4>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{query.message}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(query.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{query.doubtType}</span>
                    </div>
                    {query.hasAttachment && (
                      <div className="flex items-center gap-1">
                        <Paperclip className="w-4 h-4" />
                        <span>Attachment</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                      <Reply className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                    {query.status === 'open' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions & Response Templates */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white justify-start">
                  <Video className="w-4 h-4 mr-2" />
                  Schedule Video Call
                </Button>
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Voice Call Student
                </Button>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white justify-start">
                  <Archive className="w-4 h-4 mr-2" />
                  Archive Query
                </Button>
              </div>
            </div>

            {/* Response Templates */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Responses</h3>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <p className="text-sm font-medium text-slate-800">Schedule Practice Session</p>
                  <p className="text-xs text-slate-600">Let's schedule a one-on-one practice session to work on this specific area.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <p className="text-sm font-medium text-slate-800">Resource Recommendation</p>
                  <p className="text-xs text-slate-600">I've shared some additional resources that will help you with this topic.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                  <p className="text-sm font-medium text-slate-800">Acknowledgment</p>
                  <p className="text-xs text-slate-600">Thank you for your question. I'll review your work and provide detailed feedback.</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Resolved 3 queries</p>
                    <p className="text-xs text-slate-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Replied to Sarah's doubt</p>
                    <p className="text-xs text-slate-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Scheduled video call</p>
                    <p className="text-xs text-slate-500">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reply to {selectedQuery.student}</h3>
              <Button onClick={() => setSelectedQuery(null)} variant="outline" size="sm">
                Close
              </Button>
            </div>

            <div className="mb-4 p-4 bg-slate-50 rounded-lg">
              <h4 className="font-medium text-slate-800 mb-2">{selectedQuery.subject}</h4>
              <p className="text-slate-600 text-sm">{selectedQuery.message}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Response</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[120px]"
                  placeholder="Type your response to the student..."
                  rows={5}
                />
              </div>
              <div className="flex space-x-3">
                <Button onClick={() => setSelectedQuery(null)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={() => handleReply(selectedQuery.id)} className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}