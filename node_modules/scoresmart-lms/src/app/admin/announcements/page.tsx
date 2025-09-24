'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Megaphone,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  Calendar,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  Send,
  Archive
} from 'lucide-react'

export default function AdminAnnouncementsPage() {
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const stats = [
    {
      title: "Total Announcements",
      value: "45",
      description: "All announcements",
      icon: Megaphone,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Published",
      value: "32",
      description: "Currently active",
      icon: CheckCircle2,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Draft",
      value: "8",
      description: "Pending publication",
      icon: Edit,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Archived",
      value: "5",
      description: "Expired announcements",
      icon: Archive,
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  const announcements = [
    {
      id: 1,
      title: "New PTE Speaking Module Launch",
      content: "We're excited to announce the launch of our enhanced PTE Speaking module with AI-powered feedback.",
      targetAudience: "PTE Students",
      priority: "high",
      status: "published",
      publishDate: "2024-12-20",
      expiryDate: "2024-12-30",
      views: 156,
      author: "Admin Team"
    },
    {
      id: 2,
      title: "Holiday Schedule Update",
      content: "Please note our updated schedule for the holiday season. All classes will resume on January 3rd.",
      targetAudience: "All Students",
      priority: "medium",
      status: "published",
      publishDate: "2024-12-18",
      expiryDate: "2025-01-05",
      views: 203,
      author: "Management"
    },
    {
      id: 3,
      title: "NAATI CCL Mock Test Series",
      content: "Join our comprehensive NAATI CCL mock test series starting next week.",
      targetAudience: "NAATI Students",
      priority: "high",
      status: "draft",
      publishDate: null,
      expiryDate: "2024-12-31",
      views: 0,
      author: "Dr. Sarah Wilson"
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'archived': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'PTE Students': return 'bg-purple-100 text-purple-800'
      case 'NAATI Students': return 'bg-orange-100 text-orange-800'
      case 'All Students': return 'bg-indigo-100 text-indigo-800'
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
              <Megaphone className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Announcements
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                Manage notifications and updates for students
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 border-gray-300 text-gray-700 hover:bg-gray-50">
              <Archive className="w-4 h-4" />
              View Archived
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Create Announcement
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
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
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Announcements List */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Recent Announcements</h3>
            <Button variant="outline" size="sm">
              Export List
            </Button>
          </div>

          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Megaphone className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-800">{announcement.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(announcement.status)}`}>
                        {announcement.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAudienceColor(announcement.targetAudience)}`}>
                        {announcement.targetAudience}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{announcement.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Published: {announcement.publishDate || 'Not published'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>Expires: {announcement.expiryDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{announcement.views} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>By: {announcement.author}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {announcement.status === 'draft' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      <Send className="h-4 w-4 mr-1" />
                      Publish
                    </Button>
                  )}
                  {announcement.status === 'published' && (
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                      <Archive className="h-4 w-4 mr-1" />
                      Archive
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}