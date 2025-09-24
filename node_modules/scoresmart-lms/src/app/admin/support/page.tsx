'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
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
  ArrowRight
} from 'lucide-react'

export default function AdminSupportPage() {
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const stats = [
    {
      title: "Open Tickets",
      value: "23",
      description: "Pending resolution",
      icon: AlertCircle,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Resolved Today",
      value: "18",
      description: "Tickets closed",
      icon: CheckCircle2,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Avg Response Time",
      value: "2.3h",
      description: "First response",
      icon: Clock,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Satisfaction Rate",
      value: "94%",
      description: "Customer rating",
      icon: HeadphonesIcon,
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  const tickets = [
    {
      id: "SUP-001",
      subject: "Unable to access PTE practice tests",
      description: "Student is experiencing issues logging into the practice test portal. Error message appears when clicking on any test.",
      studentName: "Alice Johnson",
      studentEmail: "alice.johnson@email.com",
      category: "Technical",
      priority: "high",
      status: "open",
      assignedTo: "Tech Support Team",
      createdDate: "2024-12-20",
      lastUpdated: "2024-12-20",
      responseCount: 3,
      attachments: 2
    },
    {
      id: "SUP-002",
      subject: "Refund request for cancelled session",
      description: "Student requesting refund for a 1-on-1 session that was cancelled by the tutor last minute due to emergency.",
      studentName: "Mark Davis",
      studentEmail: "mark.davis@email.com",
      category: "Billing",
      priority: "medium",
      status: "in_progress",
      assignedTo: "Finance Team",
      createdDate: "2024-12-19",
      lastUpdated: "2024-12-20",
      responseCount: 5,
      attachments: 1
    },
    {
      id: "SUP-003",
      subject: "NAATI course enrollment issue",
      description: "Having trouble enrolling in the NAATI CCL preparation course. Payment goes through but course doesn't appear in student dashboard.",
      studentName: "Emma Wilson",
      studentEmail: "emma.wilson@email.com",
      category: "Enrollment",
      priority: "high",
      status: "escalated",
      assignedTo: "Senior Support",
      createdDate: "2024-12-19",
      lastUpdated: "2024-12-20",
      responseCount: 7,
      attachments: 0
    },
    {
      id: "SUP-004",
      subject: "Request for additional study materials",
      description: "Student asking for extra practice materials for PTE speaking section. Current materials completed and looking for more advanced content.",
      studentName: "James Brown",
      studentEmail: "james.brown@email.com",
      category: "Academic",
      priority: "low",
      status: "resolved",
      assignedTo: "Academic Team",
      createdDate: "2024-12-18",
      lastUpdated: "2024-12-19",
      responseCount: 2,
      attachments: 0
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'escalated': return 'bg-red-100 text-red-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Technical': return 'bg-purple-100 text-purple-800'
      case 'Billing': return 'bg-green-100 text-green-800'
      case 'Enrollment': return 'bg-orange-100 text-orange-800'
      case 'Academic': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen">
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
            <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <MessageSquare className="w-4 h-4" />
              Live Chat
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Create Ticket
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-white text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-slate-400 text-xs mt-1">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

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
              <option value="Technical">Technical</option>
              <option value="Billing">Billing</option>
              <option value="Enrollment">Enrollment</option>
              <option value="Academic">Academic</option>
            </select>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
            </select>
            <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Support Tickets List */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Support Tickets</h3>
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Export Tickets
            </Button>
          </div>

          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <HeadphonesIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-800">{ticket.subject}</h4>
                        <span className="text-sm text-gray-500">#{ticket.id}</span>
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

                      <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <User className="h-3 w-3" />
                            <span>{ticket.studentName}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="h-3 w-3" />
                            <span>{ticket.studentEmail}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3 w-3" />
                            <span>Created: {ticket.createdDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-3 w-3" />
                            <span>Updated: {ticket.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    {ticket.status === 'open' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <ArrowRight className="h-4 w-4 mr-1" />
                        Assign
                      </Button>
                    )}
                    {ticket.status === 'in_progress' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{ticket.responseCount} responses</span>
                    </div>
                    {ticket.attachments > 0 && (
                      <div className="flex items-center space-x-1">
                        <Paperclip className="h-3 w-3" />
                        <span>{ticket.attachments} attachments</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    Assigned to: {ticket.assignedTo}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}