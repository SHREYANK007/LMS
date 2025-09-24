'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Bell,
  Info,
  AlertTriangle,
  Tag,
  Calendar,
  Filter,
  Search,
  Star,
  Clock,
  Globe,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  RefreshCw
} from 'lucide-react'
import { mockAnnouncements, getAnnouncementsByRole, getAnnouncementsByCourse } from '@/data/mock/mockCommunication'

export default function StudentAnnouncementsPage() {
  const [selectedType, setSelectedType] = useState<'all' | 'info' | 'urgent' | 'offer'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock current student course
  const studentCourse = 'PTE' as 'PTE' | 'NAATI' | 'BOTH'

  // Get announcements for student
  const studentAnnouncements = getAnnouncementsByRole('student')
  const courseAnnouncements = getAnnouncementsByCourse(studentCourse)

  // Combine and filter announcements
  const allAnnouncements = [...new Set([...studentAnnouncements, ...courseAnnouncements])]
    .filter(announcement => {
      const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === 'all' || announcement.type === selectedType
      return matchesSearch && matchesType
    })
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case 'offer':
        return <Tag className="w-5 h-5 text-green-600" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'from-red-50 to-orange-50 border-red-200'
      case 'offer':
        return 'from-green-50 to-emerald-50 border-green-200'
      case 'info':
      default:
        return 'from-blue-50 to-indigo-50 border-blue-200'
    }
  }

  const stats = {
    total: allAnnouncements.length,
    urgent: allAnnouncements.filter(a => a.type === 'urgent').length,
    offers: allAnnouncements.filter(a => a.type === 'offer').length,
    recent: allAnnouncements.filter(a => {
      const daysDiff = Math.floor((new Date().getTime() - a.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      return daysDiff <= 7
    }).length
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Announcements
              </h1>
              <p className="text-slate-500 text-lg mt-1">Stay updated with the latest news and updates</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-xl font-semibold shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Latest Updates
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
                <Bell className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-blue-400">
                +{stats.total}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
            <p className="text-sm text-slate-300">Total Announcements</p>
            <p className="text-xs text-slate-400 mt-2">All active</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-red-400">
                {stats.urgent}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.urgent}</div>
            <p className="text-sm text-slate-300">Urgent</p>
            <p className="text-xs text-slate-400 mt-2">Needs attention</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-emerald-400">
                {stats.offers}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.offers}</div>
            <p className="text-sm text-slate-300">Special Offers</p>
            <p className="text-xs text-slate-400 mt-2">Limited time</p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-purple-400">
                +{stats.recent}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.recent}</div>
            <p className="text-sm text-slate-300">This Week</p>
            <p className="text-xs text-slate-400 mt-2">New updates</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Quick Actions</h2>
            <p className="text-slate-500">Filter and manage your announcements</p>
          </div>
          <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
            View All Categories <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Urgent Messages</h3>
            <p className="text-slate-600 text-sm mb-4">Important notifications</p>
            <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
              View {stats.urgent} urgent
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Tag className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Special Offers</h3>
            <p className="text-slate-600 text-sm mb-4">Limited time deals</p>
            <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
              View {stats.offers} offers
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group cursor-pointer">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Recent Updates</h3>
            <p className="text-slate-600 text-sm mb-4">This week's news</p>
            <button className="inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:text-indigo-700 transition-colors">
              View {stats.recent} updates
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Browse Announcements</h2>
            <p className="text-slate-500">Search and filter through all announcements</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="urgent">Urgent</option>
              <option value="info">Information</option>
              <option value="offer">Special Offers</option>
            </select>

            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedType('all')
              }}
              className="bg-indigo-700 hover:bg-indigo-700 text-white"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Course Filter Chips */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm font-medium text-slate-700">Showing announcements for:</span>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
              <BookOpen className="w-4 h-4 mr-1" />
              {studentCourse} Course
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800 border border-slate-200">
              <Globe className="w-4 h-4 mr-1" />
              General
            </span>
          </div>
        </div>

        {/* Announcements List */}
        <div className="space-y-6">
          {allAnnouncements.map((announcement) => (
            <div key={announcement.id} className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 bg-gradient-to-r ${getTypeColor(announcement.type)}`}>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    {getTypeIcon(announcement.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                          {announcement.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {announcement.createdAt.toLocaleDateString()}
                          </div>
                          {announcement.expiresAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Expires {announcement.expiresAt.toLocaleDateString()}
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            {announcement.isGlobal ? (
                              <>
                                <Globe className="w-4 h-4" />
                                Global
                              </>
                            ) : (
                              <>
                                <BookOpen className="w-4 h-4" />
                                {announcement.courseType || 'Course Specific'}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          announcement.type === 'urgent' ? 'bg-red-100 text-red-800' :
                          announcement.type === 'offer' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-700 leading-relaxed mb-4">
                      {announcement.content}
                    </p>

                    {announcement.type === 'offer' && (
                      <div className="flex items-center gap-3 pt-4 border-t border-green-200">
                        <Button className="bg-green-600 hover:bg-green-700 text-white gap-2">
                          <Star className="w-4 h-4" />
                          Claim Offer
                        </Button>
                        <Button variant="outline" className="border-green-300 text-green-700 gap-2">
                          <ExternalLink className="w-4 h-4" />
                          Learn More
                        </Button>
                      </div>
                    )}

                    {announcement.type === 'urgent' && (
                      <div className="flex items-center gap-3 pt-4 border-t border-red-200">
                        <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Acknowledge
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {allAnnouncements.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 text-center py-12">
            <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No announcements found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || selectedType !== 'all'
                ? 'Try adjusting your search filters'
                : 'No new announcements at the moment'
              }
            </p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedType('all')
              }}
              className="bg-indigo-700 hover:bg-indigo-700 text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}