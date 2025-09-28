'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CreateSessionModal from '@/components/CreateSessionModal';
import { apiClient } from '@/lib/api';

export default function TutorDashboard() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    todaySessions: 0,
    totalStudents: 0,
    weekSessions: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      // Fetch assigned students count
      const studentsResponse = await fetch(`${apiUrl}/tutor/students`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        setDashboardStats(prev => ({
          ...prev,
          totalStudents: (studentsData.students || []).length
        }));
      }

      // Fetch today's sessions
      const todayResponse = await fetch(`${apiUrl}/sessions/today`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (todayResponse.ok) {
        const todayData = await todayResponse.json();
        setDashboardStats(prev => ({
          ...prev,
          todaySessions: (todayData.sessions || []).length
        }));
      }

      // Fetch week's sessions
      const weekResponse = await fetch(`${apiUrl}/sessions?upcoming=true`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (weekResponse.ok) {
        const weekData = await weekResponse.json();

        // Filter for this week
        const now = new Date();
        const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

        const thisWeekSessions = (weekData.sessions || []).filter(s => {
          const sessionDate = new Date(s.startTime);
          return sessionDate >= weekStart && sessionDate < weekEnd;
        });

        setDashboardStats(prev => ({
          ...prev,
          weekSessions: thisWeekSessions.length
        }));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const handleCreateSession = async (sessionData) => {
    try {
      console.log('Creating session with data:', sessionData);

      // Validate required fields before sending
      if (!sessionData.title || !sessionData.startTime || !sessionData.endTime || !sessionData.sessionType) {
        throw new Error('Missing required fields: title, startTime, endTime, or sessionType');
      }

      // Use direct fetch as fallback like in the modal
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${apiUrl}/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });

      console.log('Session creation response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Session creation response data:', data);

        // Refresh stats after creating a session
        fetchDashboardStats();
        setShowCreateModal(false);
        alert('Session created successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Session creation API error:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating session:', error);
      alert(`Failed to create session: ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tutor Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.email}</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <span>+</span>
          Create Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Sessions</h3>
          <p className="text-3xl font-bold text-blue-600">{dashboardStats.todaySessions}</p>
          <p className="text-gray-500 text-sm">Scheduled sessions</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Today's Students</h3>
          <p className="text-3xl font-bold text-green-600">{dashboardStats.totalStudents}</p>
          <p className="text-gray-500 text-sm">Enrolled students</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">This Week</h3>
          <p className="text-3xl font-bold text-purple-600">{dashboardStats.weekSessions}</p>
          <p className="text-gray-500 text-sm">Total sessions</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <a href="/tutor/schedule" className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <span className="mr-3 text-2xl">📅</span>
            <div>
              <div className="font-medium text-gray-900">View Schedule</div>
              <div className="text-sm text-gray-600">Manage your sessions</div>
            </div>
          </a>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors text-left"
          >
            <span className="mr-3 text-2xl">➕</span>
            <div>
              <div className="font-medium text-gray-900">Create Session</div>
              <div className="text-sm text-gray-600">All session types</div>
            </div>
          </button>
          <a href="/tutor/materials" className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <span className="mr-3 text-2xl">📚</span>
            <div>
              <div className="font-medium text-gray-900">Materials</div>
              <div className="text-sm text-gray-600">Learning resources</div>
            </div>
          </a>
          <a href="/tutor/availability" className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <span className="mr-3 text-2xl">🕐</span>
            <div>
              <div className="font-medium text-gray-900">Availability</div>
              <div className="text-sm text-gray-600">Set your schedule</div>
            </div>
          </a>
        </div>
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <CreateSessionModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateSession}
        />
      )}
    </div>
  );
}