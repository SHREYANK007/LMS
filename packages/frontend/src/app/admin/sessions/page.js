'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import CreateMasterclassModal from '@/components/admin/CreateMasterclassModal'
import api from '@/lib/api'
import {
  Calendar,
  Clock,
  Users,
  Video,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  Play,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  BookOpen,
  Star,
  TrendingUp,
  Zap,
  Loader2,
  Copy,
  ExternalLink,
  ChevronDown
} from 'lucide-react'

export default function AdminSessionsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedType, setSelectedType] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openDropdown, setOpenDropdown] = useState(null)
  const [showMasterclassModal, setShowMasterclassModal] = useState(false)

  useEffect(() => {
    fetchSessions()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.dropdown-container')) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [openDropdown])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const response = await fetch(`${apiUrl}/sessions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setSessions(data.sessions || [])
        setError('')
      } else {
        setError(data.error || 'Failed to fetch sessions')
      }
    } catch (err) {
      setError('Failed to fetch sessions')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMasterclass = async (masterclassData) => {
    try {
      const response = await api.createMasterclass(masterclassData)
      if (response.success) {
        alert('Masterclass created successfully!')
        await fetchSessions() // Refresh the sessions list
      }
    } catch (error) {
      console.error('Error creating masterclass:', error)
      throw error
    }
  }

  const handleDeleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this session?')) return

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const token = localStorage.getItem('token')

      const response = await fetch(`${apiUrl}/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId))
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to delete session')
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
      alert('Failed to delete session')
    }
  }

  // Filter sessions
  const filteredSessions = sessions.filter(session => {
    const matchesSearch = (session.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (session.tutor?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || session.sessionType?.toLowerCase() === selectedType.replace('-', '_')
    return matchesSearch && matchesType
  })

  const scheduledSessions = filteredSessions.filter(s => s.status === 'SCHEDULED')
  const completedSessions = filteredSessions.filter(s => s.status === 'COMPLETED')
  const ongoingSessions = filteredSessions.filter(s => s.status === 'ONGOING')
  const cancelledSessions = filteredSessions.filter(s => s.status === 'CANCELLED')

  // Statistics
  const stats = {
    totalSessions: sessions.length,
    scheduledSessions: scheduledSessions.length,
    completedSessions: completedSessions.length,
    ongoingSessions: ongoingSessions.length,
    cancelledSessions: cancelledSessions.length,
    totalStudents: 0, // Would need to calculate from participants
    completionRate: sessions.length > 0 ? Math.round((completedSessions.length / sessions.length) * 100) : 0
  }

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ONGOING':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSessionTypeColor = (type) => {
    switch (type?.toUpperCase()) {
      case 'ONE_TO_ONE':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'SMART_QUAD':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MASTERCLASS':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const DropdownMenu = ({ session, onClose }) => (
    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
      <div className="py-2">
        <button
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          onClick={() => {
            console.log('View session:', session.id)
            onClose()
          }}
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
        <button
          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
          onClick={() => {
            console.log('Edit session:', session.id)
            onClose()
          }}
        >
          <Edit className="w-4 h-4" />
          Edit Session
        </button>
        {session.meetLink && (
          <button
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            onClick={() => {
              navigator.clipboard.writeText(session.meetLink)
              alert('Meet link copied to clipboard!')
              onClose()
            }}
          >
            <Copy className="w-4 h-4" />
            Copy Meet Link
          </button>
        )}
        {session.calendarEventUrl && (
          <button
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            onClick={() => {
              window.open(session.calendarEventUrl, '_blank')
              onClose()
            }}
          >
            <ExternalLink className="w-4 h-4" />
            Open in Calendar
          </button>
        )}
        <div className="border-t border-gray-100 mt-1 pt-1">
          <button
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            onClick={() => {
              handleDeleteSession(session.id)
              onClose()
            }}
          >
            <Trash2 className="w-4 h-4" />
            Delete Session
          </button>
        </div>
      </div>
    </div>
  )

  const SessionCard = ({ session }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            session.sessionType === 'ONE_TO_ONE' ? 'bg-purple-100' :
            session.sessionType === 'SMART_QUAD' ? 'bg-orange-100' :
            'bg-indigo-100'
          }`}>
            {session.sessionType === 'ONE_TO_ONE' ? (
              <Users className={`w-6 h-6 text-purple-600`} />
            ) : session.sessionType === 'SMART_QUAD' ? (
              <Users className={`w-6 h-6 text-orange-600`} />
            ) : (
              <BookOpen className={`w-6 h-6 text-indigo-600`} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{session.title}</h3>
            <p className="text-gray-600 text-sm">{session.tutor?.name || 'Unknown Tutor'}</p>
          </div>
        </div>
        <div className="relative dropdown-container">
          <button
            onClick={() => setOpenDropdown(openDropdown === session.id ? null : session.id)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
          {openDropdown === session.id && (
            <DropdownMenu
              session={session}
              onClose={() => setOpenDropdown(null)}
            />
          )}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(session.startTime)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{formatDate(session.endTime)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{session.currentParticipants || 0} / {session.maxParticipants || 1} participants</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
            {session.status}
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getSessionTypeColor(session.sessionType)}`}>
            {session.sessionType?.replace('_', '-')}
          </div>
        </div>
        {session.meetLink && (
          <button
            onClick={() => window.open(session.meetLink, '_blank')}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium hover:bg-green-200 transition-colors flex items-center gap-1"
          >
            <Video className="w-3 h-3" />
            Join
          </button>
        )}
      </div>

      {session.description && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">{session.description}</p>
        </div>
      )}
    </div>
  )

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Sessions</p>
              <p className="text-3xl font-bold mt-1">{stats.totalSessions}</p>
              <p className="text-blue-100 text-xs mt-1">All time</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Scheduled</p>
              <p className="text-3xl font-bold mt-1">{stats.scheduledSessions}</p>
              <p className="text-amber-100 text-xs mt-1">Upcoming</p>
            </div>
            <Clock className="w-8 h-8 text-amber-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold mt-1">{stats.completedSessions}</p>
              <p className="text-green-100 text-xs mt-1">Finished</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Success Rate</p>
              <p className="text-3xl font-bold mt-1">{stats.completionRate}%</p>
              <p className="text-purple-100 text-xs mt-1">Completion</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Recent Sessions Cards */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Sessions</h3>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
            <p className="text-gray-500">Sessions will appear here when created</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.slice(0, 9).map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderSessionsList = (sessionsList, title) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">{title} ({sessionsList.length})</h3>
      </div>

      {sessionsList.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {title.toLowerCase()}</h3>
          <p className="text-gray-500">Sessions will appear here when available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessionsList.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Session Management
              </h1>
              <p className="text-gray-600 text-lg mt-1">
                View and manage all tutoring sessions
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Types</option>
              <option value="one-to-one">One-to-One</option>
              <option value="smart-quad">Smart Quad</option>
              <option value="masterclass">Masterclass</option>
            </select>
            <Button onClick={fetchSessions} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Refresh
            </Button>
            <Button
              onClick={() => setShowMasterclassModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Masterclass
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border-0">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview', icon: TrendingUp },
                { key: 'scheduled', label: 'Scheduled', icon: Clock },
                { key: 'completed', label: 'Completed', icon: CheckCircle2 },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'scheduled' && renderSessionsList(scheduledSessions, 'Scheduled Sessions')}
            {activeTab === 'completed' && renderSessionsList(completedSessions, 'Completed Sessions')}
          </div>
        </div>
      </div>

      {/* Create Masterclass Modal */}
      <CreateMasterclassModal
        isOpen={showMasterclassModal}
        onClose={() => setShowMasterclassModal(false)}
        onCreateMasterclass={handleCreateMasterclass}
      />
    </div>
  )
}