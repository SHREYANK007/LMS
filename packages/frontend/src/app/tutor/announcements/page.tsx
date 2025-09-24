'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  Eye,
  Edit3,
  Trash2,
  Bell,
  Clock,
  Send,
  BookOpen,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'

export default function TutorAnnouncementsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')

  const stats = [
    {
      title: "Total Announcements",
      value: "24",
      description: "Published this month",
      icon: Megaphone,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Students Reached",
      value: "156",
      description: "Active recipients",
      icon: Users,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Read Rate",
      value: "89%",
      description: "Average engagement",
      icon: Eye,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Pending",
      value: "3",
      description: "Scheduled posts",
      icon: Clock,
      color: "from-orange-500 to-orange-600"
    }
  ]

  const quickActions = [
    {
      title: "Create Announcement",
      description: "Share important updates",
      icon: Plus,
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      onClick: () => setShowCreateModal(true)
    },
    {
      title: "Schedule Post",
      description: "Set future announcements",
      icon: Calendar,
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      onClick: () => setShowCreateModal(true)
    },
    {
      title: "Course Updates",
      description: "Notify about course changes",
      icon: BookOpen,
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      onClick: () => setShowCreateModal(true)
    },
    {
      title: "Emergency Alert",
      description: "Send urgent notifications",
      icon: AlertTriangle,
      color: "bg-red-50 hover:bg-red-100 border-red-200",
      onClick: () => setShowCreateModal(true)
    }
  ]

  const announcements = [
    {
      id: 1,
      title: "PTE Speaking Workshop - Special Session",
      content: "Join us for an intensive PTE Speaking workshop this Saturday at 2 PM. We'll cover pronunciation techniques and real exam scenarios.",
      type: "event",
      priority: "high",
      targetAudience: "PTE Students",
      publishedAt: "2024-12-18T10:00:00Z",
      readCount: 45,
      totalRecipients: 52,
      status: "published"
    },
    {
      id: 2,
      title: "New Study Materials Available",
      content: "Fresh PTE Reading practice tests and NAATI CCL dialogue samples have been uploaded to the materials section.",
      type: "materials",
      priority: "medium",
      targetAudience: "All Students",
      publishedAt: "2024-12-17T14:30:00Z",
      readCount: 38,
      totalRecipients: 76,
      status: "published"
    },
    {
      id: 3,
      title: "Holiday Schedule Changes",
      content: "Please note that classes will be rescheduled during the holiday period. Individual sessions will be moved to accommodate the break.",
      type: "schedule",
      priority: "high",
      targetAudience: "All Students",
      publishedAt: "2024-12-16T09:15:00Z",
      readCount: 62,
      totalRecipients: 76,
      status: "published"
    },
    {
      id: 4,
      title: "Mock Test Results Available",
      content: "Your recent mock test results are now available in your dashboard. Review your performance and book follow-up sessions if needed.",
      type: "results",
      priority: "medium",
      targetAudience: "PTE Students",
      publishedAt: "2024-12-15T16:45:00Z",
      readCount: 29,
      totalRecipients: 34,
      status: "published"
    },
    {
      id: 5,
      title: "NAATI CCL Success Story",
      content: "Congratulations to Maria who achieved her NAATI CCL certification! Read about her journey and tips for other students.",
      type: "success",
      priority: "low",
      targetAudience: "NAATI Students",
      publishedAt: "2024-12-14T11:20:00Z",
      readCount: 18,
      totalRecipients: 23,
      status: "published"
    }
  ]

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || announcement.type === selectedType
    return matchesSearch && matchesType
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return 'bg-blue-100 text-blue-800'
      case 'materials': return 'bg-green-100 text-green-800'
      case 'schedule': return 'bg-orange-100 text-orange-800'
      case 'results': return 'bg-purple-100 text-purple-800'
      case 'success': return 'bg-yellow-100 text-yellow-800'
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

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
            <Megaphone className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Announcements
            </h1>
            <p className="text-gray-600 text-lg mt-1">
              Create and manage announcements for your students
            </p>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Quick Actions */}
          <Card className="bg-white rounded-xl shadow-lg border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  onClick={action.onClick}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${action.color}`}
                >
                  <div className="flex items-center space-x-3">
                    <action.icon className="h-4 w-4 text-gray-600" />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800">{action.title}</h3>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Announcements List */}
          <Card className="lg:col-span-3 bg-white rounded-xl shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-lg font-semibold text-gray-800">Recent Announcements</CardTitle>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
              >
                <Plus className="h-3 w-3 mr-1" />
                New Post
              </Button>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search announcements..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="event">Events</option>
                  <option value="materials">Materials</option>
                  <option value="schedule">Schedule</option>
                  <option value="results">Results</option>
                  <option value="success">Success Stories</option>
                </select>
              </div>

              {/* Announcements */}
              <div className="space-y-4">
                {filteredAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-800 text-sm">{announcement.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(announcement.type)}`}>
                            {announcement.type}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{announcement.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{announcement.targetAudience}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{announcement.readCount}/{announcement.totalRecipients} read</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatDate(announcement.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                          style={{ width: `${(announcement.readCount / announcement.totalRecipients) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Read Rate</span>
                        <span>{Math.round((announcement.readCount / announcement.totalRecipients) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Create New Announcement</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="event">Event</option>
                    <option value="materials">Materials</option>
                    <option value="schedule">Schedule Change</option>
                    <option value="results">Results</option>
                    <option value="success">Success Story</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Audience</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="all">All Students</option>
                  <option value="pte">PTE Students</option>
                  <option value="naati">NAATI Students</option>
                  <option value="specific">Specific Course</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter announcement title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 min-h-[120px]"
                  placeholder="Write your announcement content..."
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Publish Date</label>
                  <input
                    type="datetime-local"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Send email notification</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button onClick={() => setShowCreateModal(false)} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1">
                <Send className="h-4 w-4 mr-2" />
                Publish
              </Button>
              <Button className="bg-gray-600 hover:bg-gray-700 text-white">
                Save Draft
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}