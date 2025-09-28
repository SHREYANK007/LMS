'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
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
  RefreshCw,
  User
} from 'lucide-react';

export default function StudentAnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAnnouncements({
        limit: 50,
        offset: 0
      });

      if (response.success) {
        setAnnouncements(response.announcements);
      } else {
        setError('Failed to fetch announcements');
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchAnnouncements();
    } finally {
      setRefreshing(false);
    }
  };

  const handleAcknowledge = async (announcementId) => {
    try {
      await apiClient.acknowledgeAnnouncement(announcementId);
      // Update the announcement in the local state to reflect acknowledgment
      setAnnouncements(prev =>
        prev.map(announcement =>
          announcement.id === announcementId
            ? { ...announcement, views: [{ acknowledged: true, viewedAt: new Date() }] }
            : announcement
        )
      );
    } catch (error) {
      console.error('Error acknowledging announcement:', error);
    }
  };

  // Filter announcements
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || announcement.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'offer':
        return <Tag className="w-5 h-5 text-green-600" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'materials':
        return <BookOpen className="w-5 h-5 text-purple-600" />;
      case 'schedule':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'results':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'success':
        return <Sparkles className="w-5 h-5 text-yellow-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'urgent':
        return 'from-red-50 to-orange-50 border-red-200';
      case 'offer':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'event':
        return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'materials':
        return 'from-purple-50 to-violet-50 border-purple-200';
      case 'schedule':
        return 'from-orange-50 to-amber-50 border-orange-200';
      case 'results':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'success':
        return 'from-yellow-50 to-amber-50 border-yellow-200';
      case 'info':
      default:
        return 'from-blue-50 to-indigo-50 border-blue-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const stats = {
    total: announcements.length,
    urgent: announcements.filter(a => a.type === 'urgent').length,
    offers: announcements.filter(a => a.type === 'offer').length,
    recent: announcements.filter(a => {
      const daysDiff = Math.floor((new Date().getTime() - new Date(a.createdAt).getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 7;
    }).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
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
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

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
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-bold text-purple-400">
                {stats.recent}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.recent}</div>
            <p className="text-sm text-slate-300">This Week</p>
            <p className="text-xs text-slate-400 mt-2">Recent updates</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search announcements, content, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700 placeholder-slate-400"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 min-w-[150px]"
            >
              <option value="all">All Types</option>
              <option value="info">Information</option>
              <option value="urgent">Urgent</option>
              <option value="event">Events</option>
              <option value="materials">Materials</option>
              <option value="schedule">Schedule</option>
              <option value="results">Results</option>
              <option value="success">Success Stories</option>
              <option value="offer">Special Offers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-6">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedType !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Check back later for updates from your tutors'
              }
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => {
            const isAcknowledged = announcement.views && announcement.views.length > 0 && announcement.views[0].acknowledged;

            return (
              <div
                key={announcement.id}
                className={`relative bg-gradient-to-r ${getTypeColor(announcement.type)} border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                {!isAcknowledged && (
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                      {getTypeIcon(announcement.type)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-800 leading-tight">
                            {announcement.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(announcement.priority)}`}>
                            {announcement.priority}
                          </span>
                        </div>

                        <p className="text-slate-600 text-base leading-relaxed mb-4">
                          {announcement.content}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{announcement.author?.name || announcement.author?.email || 'System'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(announcement.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <span>{announcement.targetAudience}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(announcement.type).replace('from-', 'bg-').replace(' to-', '').replace(' border-', ' text-').replace('-50', '-700').replace('-200', '-700')}`}>
                          {getTypeIcon(announcement.type)}
                          {announcement.type}
                        </span>
                      </div>

                      {!isAcknowledged && (
                        <Button
                          onClick={() => handleAcknowledge(announcement.id)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Mark as Read
                        </Button>
                      )}

                      {isAcknowledged && (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4" />
                          Acknowledged
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}