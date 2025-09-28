'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
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
} from 'lucide-react';

export default function TutorAnnouncementsPage() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    byType: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'info',
    priority: 'medium',
    targetAudience: 'all',
    courseType: '',
    publishDate: new Date().toISOString().slice(0, 16),
    expiryDate: '',
    sendNotification: false
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getMyAnnouncements();
      if (response.success) {
        setAnnouncements(response.announcements);

        // Calculate stats
        const totalAnnouncements = response.announcements.length;
        const publishedAnnouncements = response.announcements.filter(a => a.status === 'published').length;
        const draftAnnouncements = response.announcements.filter(a => a.status === 'draft').length;

        const byType = response.announcements.reduce((acc, announcement) => {
          acc[announcement.type] = (acc[announcement.type] || 0) + 1;
          return acc;
        }, {});

        setStats({
          total: totalAnnouncements,
          published: publishedAnnouncements,
          draft: draftAnnouncements,
          byType
        });
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

  const handleCreateAnnouncement = async () => {
    try {
      setSubmitting(true);
      const response = await apiClient.createAnnouncement(formData);
      if (response.success) {
        setShowCreateModal(false);
        resetForm();
        await fetchAnnouncements();
      } else {
        setError('Failed to create announcement');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      setError('Failed to create announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAnnouncement = async () => {
    try {
      setSubmitting(true);
      const response = await apiClient.updateAnnouncement(editingAnnouncement.id, formData);
      if (response.success) {
        setShowCreateModal(false);
        setEditingAnnouncement(null);
        resetForm();
        await fetchAnnouncements();
      } else {
        setError('Failed to update announcement');
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      setError('Failed to update announcement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      const response = await apiClient.deleteAnnouncement(id);
      if (response.success) {
        await fetchAnnouncements();
      } else {
        setError('Failed to delete announcement');
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      setError('Failed to delete announcement');
    }
  };

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      priority: announcement.priority,
      targetAudience: announcement.targetAudience,
      courseType: announcement.courseType || '',
      publishDate: announcement.publishDate ? new Date(announcement.publishDate).toISOString().slice(0, 16) : '',
      expiryDate: announcement.expiryDate ? new Date(announcement.expiryDate).toISOString().slice(0, 16) : '',
      sendNotification: false
    });
    setShowCreateModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'info',
      priority: 'medium',
      targetAudience: 'all',
      courseType: '',
      publishDate: new Date().toISOString().slice(0, 16),
      expiryDate: '',
      sendNotification: false
    });
    setEditingAnnouncement(null);
    setError('');
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const quickActions = [
    {
      title: "Create Announcement",
      description: "Share important updates",
      icon: Plus,
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      onClick: () => {
        resetForm();
        setShowCreateModal(true);
      }
    },
    {
      title: "Schedule Post",
      description: "Set future announcements",
      icon: Calendar,
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      onClick: () => {
        resetForm();
        setShowCreateModal(true);
      }
    },
    {
      title: "Course Updates",
      description: "Notify about course changes",
      icon: BookOpen,
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      onClick: () => {
        resetForm();
        setFormData(prev => ({ ...prev, type: 'materials' }));
        setShowCreateModal(true);
      }
    },
    {
      title: "Emergency Alert",
      description: "Send urgent notifications",
      icon: AlertTriangle,
      color: "bg-red-50 hover:bg-red-100 border-red-200",
      onClick: () => {
        resetForm();
        setFormData(prev => ({ ...prev, type: 'urgent', priority: 'high' }));
        setShowCreateModal(true);
      }
    }
  ];

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || announcement.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type) => {
    switch (type) {
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'materials': return 'bg-green-100 text-green-800';
      case 'schedule': return 'bg-orange-100 text-orange-800';
      case 'results': return 'bg-purple-100 text-purple-800';
      case 'success': return 'bg-yellow-100 text-yellow-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
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

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Announcements</p>
                <p className="text-white text-2xl font-bold mt-1">{stats.total}</p>
                <p className="text-slate-400 text-xs mt-1">All time</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600">
                <Megaphone className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Published</p>
                <p className="text-white text-2xl font-bold mt-1">{stats.published}</p>
                <p className="text-slate-400 text-xs mt-1">Active posts</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Draft</p>
                <p className="text-white text-2xl font-bold mt-1">{stats.draft}</p>
                <p className="text-slate-400 text-xs mt-1">Unpublished</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Most Used Type</p>
                <p className="text-white text-2xl font-bold mt-1">
                  {Object.keys(stats.byType).length > 0
                    ? Object.keys(stats.byType).reduce((a, b) => stats.byType[a] > stats.byType[b] ? a : b)
                    : 'N/A'
                  }
                </p>
                <p className="text-slate-400 text-xs mt-1">Category</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600">
                <Bell className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
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
              <CardTitle className="text-lg font-semibold text-gray-800">My Announcements</CardTitle>
              <Button
                onClick={() => {
                  resetForm();
                  setShowCreateModal(true);
                }}
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
                  <option value="info">Info</option>
                  <option value="urgent">Urgent</option>
                  <option value="event">Events</option>
                  <option value="materials">Materials</option>
                  <option value="schedule">Schedule</option>
                  <option value="results">Results</option>
                  <option value="success">Success Stories</option>
                </select>
              </div>

              {/* Announcements */}
              <div className="space-y-4">
                {filteredAnnouncements.length === 0 ? (
                  <div className="text-center py-8">
                    <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
                    <p className="text-gray-600">Create your first announcement to get started</p>
                  </div>
                ) : (
                  filteredAnnouncements.map((announcement) => (
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
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              announcement.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : announcement.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {announcement.status}
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
                              <span>{announcement.viewCount || 0} views</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(announcement.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                            onClick={() => handleEditAnnouncement(announcement)}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteAnnouncement(announcement.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create/Edit Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
            </h3>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleFormChange('type', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="info">Info</option>
                    <option value="urgent">Urgent</option>
                    <option value="event">Event</option>
                    <option value="materials">Materials</option>
                    <option value="schedule">Schedule Change</option>
                    <option value="results">Results</option>
                    <option value="success">Success Story</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleFormChange('priority', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Target Audience</label>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => handleFormChange('targetAudience', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="all">All Students</option>
                  <option value="pte">PTE Students</option>
                  <option value="naati">NAATI Students</option>
                  <option value="specific">Specific Course</option>
                </select>
              </div>
              {formData.targetAudience === 'specific' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Course Type</label>
                  <select
                    value={formData.courseType}
                    onChange={(e) => handleFormChange('courseType', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select Course</option>
                    <option value="PTE">PTE</option>
                    <option value="NAATI">NAATI</option>
                    <option value="ALL">All Courses</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Enter announcement title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleFormChange('content', e.target.value)}
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
                    value={formData.publishDate}
                    onChange={(e) => handleFormChange('publishDate', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date (Optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.expiryDate}
                    onChange={(e) => handleFormChange('expiryDate', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                variant="outline"
                className="flex-1"
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                onClick={editingAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement}
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1"
                disabled={submitting || !formData.title || !formData.content}
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {editingAnnouncement ? 'Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}